"""
Integration Test Suite for AI-Based Smart Agriculture Assistant
Tests all 7 modules, database queries, ML predictions, image classification, and API routes.
"""

import os
import json
from app import app, DB_PATH
import sqlite3

def run_tests():
    print("=" * 60)
    print("STARTING TEST SUITE: AI-Based Smart Agriculture Assistant")
    print("=" * 60)
    
    client = app.test_client()
    passed = 0
    total = 0

    # Test 1: Dashboard UI
    total += 1
    res = client.get('/')
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert b"Farmer Operational Intelligence Dashboard" in res.data
    print("[PASS] Test 1: Dashboard Route ('/') loaded successfully.")
    passed += 1

    # Test 2: Crop Recommendation UI
    total += 1
    res = client.get('/crop')
    assert res.status_code == 200
    assert b"Machine Learning Crop Recommendation Engine" in res.data
    print("[PASS] Test 2: Crop Recommendation UI ('/crop') loaded.")
    passed += 1

    # Test 3: Crop Recommendation API (Real ML Model Inference)
    total += 1
    payload = {
        'nitrogen': 85.0,
        'phosphorus': 48.0,
        'potassium': 42.0,
        'temperature': 25.5,
        'humidity': 82.0,
        'ph': 6.5,
        'rainfall': 220.0
    }
    res = client.post('/api/crop_recommendation', json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'recommended_crop' in data
    assert data['confidence'] > 50.0
    print(f"[PASS] Test 3: Crop ML API returned: {data['recommended_crop']} ({data['confidence']}%)")
    passed += 1

    # Test 4: Disease Detection UI
    total += 1
    res = client.get('/disease')
    assert res.status_code == 200
    assert b"Plant Leaf Disease Diagnostic Scanner" in res.data
    print("[PASS] Test 4: Disease Detection UI ('/disease') loaded.")
    passed += 1

    # Test 5: Disease Detection API (Deep Phenotypic Classification)
    total += 1
    res = client.post('/api/disease_detection', data={
        'sample_choice': 'tomato_early_blight.jpg',
        'crop_hint': 'Tomato'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'Tomato Early Blight' in data['detected_disease'] or 'Blight' in data['detected_disease']
    assert 'organic_treatment' in data
    print(f"[PASS] Test 5: Disease API detected: {data['detected_disease']} (Confidence: {data['confidence']}%, Severity: {data['severity']})")
    passed += 1

    # Test 6: Fertilizer Recommendation UI & API
    total += 1
    res = client.get('/fertilizer')
    assert res.status_code == 200
    
    fert_payload = {
        'crop': 'rice',
        'nitrogen': 45.0,
        'phosphorus': 22.0,
        'potassium': 25.0,
        'acreage': 2.0
    }
    res = client.post('/api/fertilizer_recommendation', json=fert_payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert len(data['data']['commercial_fertilizers']) == 3
    print(f"[PASS] Test 6: Fertilizer API calculated deficits: {data['data']['deficits']}")
    passed += 1

    # Test 7: Weather UI & API
    total += 1
    res = client.get('/weather?region=hyderabad')
    assert res.status_code == 200
    assert b"Agro-Meteorology &amp; Farm Weather Advisory" in res.data
    
    res = client.get('/api/weather?region=hyderabad')
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'temperature' in data
    assert len(data['forecast']) > 0
    print(f"[PASS] Test 7: Weather API returned: {data['region_name']}, Temp: {data['temperature']} C, Advisories: {len(data['advisories'])}")
    passed += 1

    # Test 8: Smart Irrigation UI & API
    total += 1
    res = client.get('/irrigation')
    assert res.status_code == 200
    
    irrig_payload = {
        'crop_name': 'Tomato',
        'soil_texture': 'loamy',
        'soil_moisture': 18.0,
        'stage': 'vegetative',
        'rain_forecast': 0.0
    }
    res = client.post('/api/smart_irrigation', json=irrig_payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'decision' in data['data']
    print(f"[PASS] Test 8: Smart Irrigation API: {data['data']['decision']}, Water: {data['data']['liters_per_acre']} L/acre")
    passed += 1

    # Test 9: AI Agriculture Chatbot UI & API
    total += 1
    res = client.get('/chatbot')
    assert res.status_code == 200
    
    chat_payload = {'message': 'How to control Fall Armyworm in corn?'}
    res = client.post('/api/chatbot', json=chat_payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'Fall Armyworm' in data['reply'] or 'Neem oil' in data['reply']
    print(f"[PASS] Test 9: Chatbot API replied accurately: {data['reply'][:65]}...")
    passed += 1

    # Test 10: SQLite Database Verification
    total += 1
    conn = sqlite3.connect(DB_PATH)
    rec_count = conn.execute("SELECT COUNT(*) FROM crop_recommendations").fetchone()[0]
    scan_count = conn.execute("SELECT COUNT(*) FROM disease_scans").fetchone()[0]
    conn.close()
    assert rec_count >= 1
    assert scan_count >= 1
    print(f"[PASS] Test 10: SQLite Database successfully persisted {rec_count} recommendations and {scan_count} disease scans.")
    passed += 1

    print("=" * 60)
    print(f"ALL TESTS PASSED: {passed}/{total} tests completed with 100% success!")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
