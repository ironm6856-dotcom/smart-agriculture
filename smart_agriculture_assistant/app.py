"""
Flask Web Application: AI-Based Smart Agriculture Assistant
Full-featured backend supporting all 7 functional modules, SQLite persistence,
Real Machine Learning & Deep Learning inference, and REST APIs.
"""

import os
import json
import sqlite3
import joblib
import numpy as np
from flask import Flask, render_template, request, jsonify, redirect, url_for
from werkzeug.utils import secure_filename

# Local modules
from models.disease_classifier import classify_plant_disease
from agri_engines import (
    calculate_fertilizer_recommendation,
    calculate_smart_irrigation,
    get_live_weather,
    query_agro_chatbot
)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'agri-smart-assistant-key-2026'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'database', 'agri_assistant.db')
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load trained ML Crop Recommendation Model
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'crop_recommendation_model.pkl')
try:
    crop_model = joblib.load(MODEL_PATH)
    print(f"[ML Server] Loaded Crop Recommendation Model -> {MODEL_PATH}")
except Exception as e:
    print(f"[ML Server Warning] Could not load crop model: {e}")
    crop_model = None

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ----------------- UI Pages -----------------

@app.route('/')
def dashboard():
    conn = get_db_connection()
    recent_crops = conn.execute("SELECT * FROM crop_recommendations ORDER BY id DESC LIMIT 4").fetchall()
    recent_diseases = conn.execute("SELECT * FROM disease_scans ORDER BY id DESC LIMIT 4").fetchall()
    stats = {
        'total_scans': conn.execute("SELECT COUNT(*) FROM disease_scans").fetchone()[0],
        'total_recommendations': conn.execute("SELECT COUNT(*) FROM crop_recommendations").fetchone()[0],
        'total_irrigation_plans': conn.execute("SELECT COUNT(*) FROM irrigation_logs").fetchone()[0],
        'registered_farmers': conn.execute("SELECT COUNT(*) FROM farmers").fetchone()[0]
    }
    conn.close()
    weather_data = get_live_weather('hyderabad')
    return render_template('index.html', recent_crops=recent_crops, recent_diseases=recent_diseases, stats=stats, weather=weather_data)

@app.route('/crop')
def crop_page():
    return render_template('crop_recommendation.html')

@app.route('/disease')
def disease_page():
    sample_leaves = [
        {'name': 'Tomato Healthy Leaf', 'file': 'tomato_healthy.jpg', 'crop': 'Tomato'},
        {'name': 'Tomato Early Blight', 'file': 'tomato_early_blight.jpg', 'crop': 'Tomato'},
        {'name': 'Potato Late Blight', 'file': 'potato_late_blight.jpg', 'crop': 'Potato'},
        {'name': 'Corn Common Rust', 'file': 'corn_common_rust.jpg', 'crop': 'Corn'}
    ]
    return render_template('disease_detection.html', sample_leaves=sample_leaves)

@app.route('/fertilizer')
def fertilizer_page():
    return render_template('fertilizer_recommendation.html')

@app.route('/weather')
def weather_page():
    region = request.args.get('region', 'hyderabad')
    weather_data = get_live_weather(region)
    return render_template('weather.html', weather=weather_data, current_region=region)

@app.route('/irrigation')
def irrigation_page():
    return render_template('smart_irrigation.html')

@app.route('/chatbot')
def chatbot_page():
    return render_template('chatbot.html')

# ----------------- REST API Endpoints -----------------

@app.route('/api/crop_recommendation', methods=['POST'])
def api_crop_recommendation():
    try:
        data = request.get_json() if request.is_json else request.form
        n = float(data.get('nitrogen', 80))
        p = float(data.get('phosphorus', 45))
        k = float(data.get('potassium', 40))
        temp = float(data.get('temperature', 25.0))
        hum = float(data.get('humidity', 75.0))
        ph = float(data.get('ph', 6.5))
        rain = float(data.get('rainfall', 200.0))
        farmer_id = int(data.get('farmer_id', 1))

        if crop_model is None:
            return jsonify({'success': False, 'error': 'Model not loaded'}), 500

        features = np.array([[n, p, k, temp, hum, ph, rain]])
        probabilities = crop_model.predict_proba(features)[0]
        classes = crop_model.classes_

        top_indices = np.argsort(probabilities)[::-1]
        top_crop = classes[top_indices[0]].capitalize()
        confidence = float(probabilities[top_indices[0]]) * 100

        alt_crops = [f"{classes[i].capitalize()} ({round(float(probabilities[i])*100, 1)}%)" for i in top_indices[1:4]]
        alt_str = ", ".join(alt_crops)

        # Store in SQLite
        conn = get_db_connection()
        conn.execute("""
            INSERT INTO soil_tests (farmer_id, nitrogen, phosphorus, potassium, ph, rainfall, temperature, humidity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (farmer_id, n, p, k, ph, rain, temp, hum))
        conn.execute("""
            INSERT INTO crop_recommendations (farmer_id, recommended_crop, confidence, alternative_crops)
            VALUES (?, ?, ?, ?)
        """, (farmer_id, top_crop, round(confidence, 1), alt_str))
        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'recommended_crop': top_crop,
            'confidence': round(confidence, 1),
            'alternatives': alt_crops,
            'agronomic_parameters': {
                'nitrogen': n, 'phosphorus': p, 'potassium': k,
                'temperature': temp, 'humidity': hum, 'ph': ph, 'rainfall': rain
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/disease_detection', methods=['POST'])
def api_disease_detection():
    try:
        farmer_id = int(request.form.get('farmer_id', 1))
        crop_hint = request.form.get('crop_hint', None)
        sample_choice = request.form.get('sample_choice', None)

        if sample_choice:
            img_path = os.path.join(BASE_DIR, 'static', 'images', 'sample_leaves', sample_choice)
            display_url = url_for('static', filename=f'images/sample_leaves/{sample_choice}')
        elif 'leaf_image' in request.files and request.files['leaf_image'].filename != '':
            file = request.files['leaf_image']
            filename = secure_filename(file.filename)
            img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(img_path)
            display_url = url_for('static', filename=f'uploads/{filename}')
        else:
            return jsonify({'success': False, 'error': 'No image provided'}), 400

        res = classify_plant_disease(img_path, crop_hint=crop_hint)
        if not res.get('success'):
            return jsonify(res), 400

        res['image_url'] = display_url

        # Store in SQLite
        conn = get_db_connection()
        conn.execute("""
            INSERT INTO disease_scans (farmer_id, image_path, detected_disease, confidence, severity, treatment_summary)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (farmer_id, display_url, res['detected_disease'], res['confidence'], res['severity'], res['organic_treatment']))
        conn.commit()
        conn.close()

        return jsonify(res)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/fertilizer_recommendation', methods=['POST'])
def api_fertilizer_recommendation():
    try:
        data = request.get_json() if request.is_json else request.form
        crop = data.get('crop', 'rice')
        soil_n = float(data.get('nitrogen', 40))
        soil_p = float(data.get('phosphorus', 20))
        soil_k = float(data.get('potassium', 20))
        acreage = float(data.get('acreage', 1.0))

        result = calculate_fertilizer_recommendation(crop, soil_n, soil_p, soil_k, acreage)

        # Store in SQLite
        conn = get_db_connection()
        fert_summary = f"Urea: {result['commercial_fertilizers'][0]['quantity_kg']}kg, DAP: {result['commercial_fertilizers'][1]['quantity_kg']}kg, MOP: {result['commercial_fertilizers'][2]['quantity_kg']}kg"
        conn.execute("""
            INSERT INTO fertilizer_plans (crop_name, nitrogen_gap, phosphorus_gap, potassium_gap, recommended_fertilizers)
            VALUES (?, ?, ?, ?, ?)
        """, (result['crop_name'], result['deficits']['nitrogen_kg'], result['deficits']['phosphorus_kg'], result['deficits']['potassium_kg'], fert_summary))
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/smart_irrigation', methods=['POST'])
def api_smart_irrigation():
    try:
        data = request.get_json() if request.is_json else request.form
        crop_name = data.get('crop_name', 'Tomato')
        texture = data.get('soil_texture', 'loamy')
        moisture = float(data.get('soil_moisture', 22.0))
        stage = data.get('stage', 'vegetative')
        rain = float(data.get('rain_forecast', 0.0))

        result = calculate_smart_irrigation(crop_name, texture, moisture, stage, rain)

        # Store in SQLite
        conn = get_db_connection()
        conn.execute("""
            INSERT INTO irrigation_logs (crop_name, soil_moisture, soil_texture, decision, water_liters_acre)
            VALUES (?, ?, ?, ?, ?)
        """, (crop_name, moisture, result['soil_texture'], result['decision'], result['liters_per_acre']))
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/weather', methods=['GET'])
def api_weather():
    region = request.args.get('region', 'hyderabad')
    data = get_live_weather(region)
    return jsonify(data)

@app.route('/api/chatbot', methods=['POST'])
def api_chatbot():
    try:
        data = request.get_json() if request.is_json else request.form
        user_msg = data.get('message', '')
        if not user_msg:
            return jsonify({'reply': 'Please type your question.'})

        reply = query_agro_chatbot(user_msg)

        # Store in SQLite
        conn = get_db_connection()
        conn.execute("INSERT INTO chat_history (user_query, bot_response) VALUES (?, ?)", (user_msg, reply))
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'reply': reply})
    except Exception as e:
        return jsonify({'success': False, 'reply': 'An error occurred while answering.'})

if __name__ == '__main__':
    print("[Starting Application] AI-Based Smart Agriculture Assistant running on http://127.0.0.1:5000")
    app.run(host='127.0.0.1', port=5000, debug=False)
