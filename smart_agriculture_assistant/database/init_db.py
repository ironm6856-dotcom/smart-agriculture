"""
Database Initialization Script for AI-Based Smart Agriculture Assistant
Initializes SQLite database tables and pre-seeds realistic farmer demo records.
"""

import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'database', 'agri_assistant.db')

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS farmers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    state TEXT,
    district TEXT,
    land_area_acres REAL DEFAULT 2.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS soil_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER,
    nitrogen REAL,
    phosphorus REAL,
    potassium REAL,
    ph REAL,
    rainfall REAL,
    temperature REAL,
    humidity REAL,
    tested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(farmer_id) REFERENCES farmers(id)
);

CREATE TABLE IF NOT EXISTS crop_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER,
    recommended_crop TEXT,
    confidence REAL,
    alternative_crops TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(farmer_id) REFERENCES farmers(id)
);

CREATE TABLE IF NOT EXISTS disease_scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER,
    image_path TEXT,
    detected_disease TEXT,
    confidence REAL,
    severity TEXT,
    treatment_summary TEXT,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(farmer_id) REFERENCES farmers(id)
);

CREATE TABLE IF NOT EXISTS fertilizer_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_name TEXT,
    nitrogen_gap REAL,
    phosphorus_gap REAL,
    potassium_gap REAL,
    recommended_fertilizers TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS irrigation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_name TEXT,
    soil_moisture REAL,
    soil_texture TEXT,
    decision TEXT,
    water_liters_acre REAL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_query TEXT,
    bot_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.executescript(SCHEMA_SQL)
    
    # Check if farmers seeded
    cursor.execute("SELECT COUNT(*) FROM farmers")
    count = cursor.fetchone()[0]
    if count == 0:
        cursor.execute("""
            INSERT INTO farmers (full_name, phone_number, state, district, land_area_acres)
            VALUES 
            ('Ramesh Kumar Patel', '+91 98765 43210', 'Telangana', 'Medchal', 4.5),
            ('Savitri Devi', '+91 98451 23456', 'Andhra Pradesh', 'Guntur', 3.0),
            ('Balwinder Singh', '+91 98123 45678', 'Punjab', 'Ludhiana', 8.0)
        """)
        # Seed initial soil test
        cursor.execute("""
            INSERT INTO soil_tests (farmer_id, nitrogen, phosphorus, potassium, ph, rainfall, temperature, humidity)
            VALUES (1, 85.0, 48.0, 42.0, 6.5, 210.0, 25.5, 82.0)
        """)
        # Seed recommendation
        cursor.execute("""
            INSERT INTO crop_recommendations (farmer_id, recommended_crop, confidence, alternative_crops)
            VALUES (1, 'Rice', 98.4, 'Jute, Maize, Banana')
        """)
        conn.commit()
        print("[Database] Seeded demo farmer profiles and agronomic records.")
        
    conn.close()
    print(f"[Database] SQLite schema initialized -> {DB_PATH}")

if __name__ == '__main__':
    init_db()
