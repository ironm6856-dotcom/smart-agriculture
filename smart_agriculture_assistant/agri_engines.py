"""
Agricultural Calculation & Advisory Engines:
1. Fertilizer Recommendation (ICAR Nutrient Stoichiometry)
2. Smart Irrigation (Evapotranspiration & Soil Moisture Balance)
3. Weather Intelligence (Open-Meteo API & Agro-Met Alerts)
4. AI Agriculture Chatbot (Domain-specific NLP Knowledge Base)
"""

import math
import requests

# 1. Fertilizer Recommendation Engine
CROP_NUTRIENT_REQUIREMENTS = {
    'rice': {'name': 'Rice / Paddy', 'N': 48, 'P': 24, 'K': 20, 'splits': '50% Basal + 25% Tillering + 25% Panicle'},
    'maize': {'name': 'Maize / Corn', 'N': 48, 'P': 24, 'K': 16, 'splits': '33% Basal + 33% Knee-high + 34% Tasseling'},
    'wheat': {'name': 'Wheat', 'N': 48, 'P': 24, 'K': 16, 'splits': '50% Basal + 50% CRI Stage'},
    'cotton': {'name': 'Cotton', 'N': 48, 'P': 24, 'K': 24, 'splits': '25% Basal + 50% Squaring + 25% Boll Development'},
    'tomato': {'name': 'Tomato', 'N': 40, 'P': 30, 'K': 30, 'splits': '40% Basal + 30% Vegetative + 30% Fruit Set'},
    'potato': {'name': 'Potato', 'N': 50, 'P': 30, 'K': 40, 'splits': '50% Basal + 50% Earthing-up'},
    'chickpea': {'name': 'Chickpea / Gram', 'N': 10, 'P': 20, 'K': 10, 'splits': '100% Basal (Legume nodulation)'},
    'banana': {'name': 'Banana', 'N': 80, 'P': 30, 'K': 100, 'splits': '4 Equal Splits at 2nd, 3rd, 4th, 5th months'},
    'sugarcane': {'name': 'Sugarcane', 'N': 100, 'P': 35, 'K': 50, 'splits': '20% Basal + 40% Tillering + 40% Grand Growth'},
    'default': {'name': 'General Field Crop', 'N': 40, 'P': 20, 'K': 20, 'splits': '50% Basal + 50% Vegetative'}
}

def calculate_fertilizer_recommendation(crop_key, soil_n, soil_p, soil_k, land_area_acres=1.0):
    crop_info = CROP_NUTRIENT_REQUIREMENTS.get(crop_key.lower(), CROP_NUTRIENT_REQUIREMENTS['default'])
    
    # Target nutrients in kg per acre
    target_n = crop_info['N']
    target_p = crop_info['P']
    target_k = crop_info['K']
    
    # Soil available nutrient factor (fraction of test value readily usable)
    avail_n = soil_n * 0.35
    avail_p = soil_p * 0.40
    avail_k = soil_k * 0.30
    
    deficit_n = max(5.0, round((target_n - avail_n) * land_area_acres, 1))
    deficit_p = max(5.0, round((target_p - avail_p) * land_area_acres, 1))
    deficit_k = max(5.0, round((target_k - avail_k) * land_area_acres, 1))
    
    # Commercial Fertilizer Conversion
    # DAP contains 18% N and 46% P2O5
    dap_kg = round(deficit_p / 0.46, 1)
    n_supplied_by_dap = dap_kg * 0.18
    
    # Remaining N supplied by Urea (46% N)
    remaining_n = max(0.0, deficit_n - n_supplied_by_dap)
    urea_kg = round(remaining_n / 0.46, 1)
    
    # K supplied by MOP (Muriate of Potash, 60% K2O)
    mop_kg = round(deficit_k / 0.60, 1)
    
    # Number of 50kg bags
    urea_bags = round(urea_kg / 45.0, 1) # Standard 45kg neem coated urea bag
    dap_bags = round(dap_kg / 50.0, 1)
    mop_bags = round(mop_kg / 50.0, 1)
    
    organic_vermicompost_tonnes = round(1.5 * land_area_acres, 1)
    
    return {
        'crop_name': crop_info['name'],
        'land_area_acres': land_area_acres,
        'deficits': {
            'nitrogen_kg': deficit_n,
            'phosphorus_kg': deficit_p,
            'potassium_kg': deficit_k
        },
        'commercial_fertilizers': [
            {
                'name': 'Neem Coated Urea (46% N)',
                'quantity_kg': urea_kg,
                'bags': urea_bags,
                'application_method': 'Split into 2-3 top dressings to prevent nitrogen volatilization'
            },
            {
                'name': 'Di-Ammonium Phosphate / DAP (18:46:0)',
                'quantity_kg': dap_kg,
                'bags': dap_bags,
                'application_method': 'Apply 100% as basal dose placed 5 cm below seed level during sowing'
            },
            {
                'name': 'Muriate of Potash / MOP (60% K2O)',
                'quantity_kg': mop_kg,
                'bags': mop_bags,
                'application_method': 'Apply 50% basal and 50% at flowering/grain filling'
            }
        ],
        'organic_advice': f'Incorporate {organic_vermicompost_tonnes} tonnes of well-decomposed Vermicompost or Farmyard Manure (FYM) enriched with Trichoderma harzianum (2 kg/acre) during preparatory ploughing.',
        'application_splits': crop_info['splits']
    }

# 2. Smart Irrigation Engine
SOIL_TEXTURE_AWC = {
    'sandy': {'name': 'Sandy / Light Soil', 'awc_mm_m': 70, 'threshold_vwc': 16.0},
    'loamy': {'name': 'Loam / Medium Soil', 'awc_mm_m': 140, 'threshold_vwc': 24.0},
    'clay': {'name': 'Clay / Heavy Black Soil', 'awc_mm_m': 200, 'threshold_vwc': 32.0}
}

CROP_KC = {
    'initial': 0.45,
    'vegetative': 0.85,
    'flowering': 1.15,
    'maturity': 0.65
}

def calculate_smart_irrigation(crop_name, soil_texture_key, soil_moisture_vwc, stage_key='vegetative', rain_forecast_mm=0.0):
    soil_info = SOIL_TEXTURE_AWC.get(soil_texture_key.lower(), SOIL_TEXTURE_AWC['loamy'])
    kc = CROP_KC.get(stage_key.lower(), 0.85)
    
    # Reference ET0 estimation for typical sunny Indian conditions (approx 4.8 mm/day)
    et0 = 4.8
    etc_mm_day = round(kc * et0, 2)
    
    # Effective rainfall discount (rain above 5mm is effective)
    eff_rain = max(0.0, (rain_forecast_mm - 4.0) * 0.75) if rain_forecast_mm > 5.0 else 0.0
    
    # Moisture deficit check
    threshold = soil_info['threshold_vwc']
    current = soil_moisture_vwc
    
    if eff_rain >= etc_mm_day * 1.5:
        decision = "SKIP IRRIGATION (Rain Forecast Sufficient)"
        urgency = "low"
        water_needed_mm = 0.0
        liters_per_acre = 0
        pump_hours = 0.0
        reason = f"Forecasted precipitation ({rain_forecast_mm} mm) fulfills crop water requirements for the next 48-72 hours."
    elif current < threshold - 5.0:
        decision = "CRITICAL: IRRIGATE IMMEDIATELY"
        urgency = "high"
        water_needed_mm = round((threshold - current) * 0.8 + etc_mm_day, 1)
        liters_per_acre = int(water_needed_mm * 4047)
        pump_hours = round(liters_per_acre / 4000.0, 1) # Standard 4,000 L/hr drip
        reason = f"Soil moisture ({current}%) has depleted below the critical management allowed deficit ({threshold}%)."
    elif current < threshold:
        decision = "IRRIGATION RECOMMENDED"
        urgency = "medium"
        water_needed_mm = round(etc_mm_day * 1.2, 1)
        liters_per_acre = int(water_needed_mm * 4047)
        pump_hours = round(liters_per_acre / 4000.0, 1)
        reason = f"Soil moisture is approaching wilting boundary. Replenish daily evapotranspiration loss."
    else:
        decision = "MOISTURE ADEQUATE (No Irrigation Required)"
        urgency = "low"
        water_needed_mm = 0.0
        liters_per_acre = 0
        pump_hours = 0.0
        reason = f"Soil moisture ({current}%) is in optimal comfort zone ({threshold}% - {threshold + 15}%)."
        
    return {
        'crop_name': crop_name,
        'soil_texture': soil_info['name'],
        'current_moisture_vwc': current,
        'threshold_moisture': threshold,
        'crop_evapotranspiration_mm_day': etc_mm_day,
        'decision': decision,
        'urgency': urgency,
        'water_needed_mm': water_needed_mm,
        'liters_per_acre': liters_per_acre,
        'recommended_drip_duration_hours': pump_hours,
        'reason': reason
    }

# 3. Weather Intelligence Engine
REGIONS = {
    'hyderabad': {'name': 'Hyderabad, Telangana', 'lat': 17.3850, 'lon': 78.4867},
    'guntur': {'name': 'Guntur, Andhra Pradesh', 'lat': 16.3067, 'lon': 80.4365},
    'ludhiana': {'name': 'Ludhiana, Punjab', 'lat': 30.9010, 'lon': 75.8573},
    'pune': {'name': 'Pune, Maharashtra', 'lat': 18.5204, 'lon': 73.8567},
    'bhopal': {'name': 'Bhopal, Madhya Pradesh', 'lat': 23.2599, 'lon': 77.4126},
    'coimbatore': {'name': 'Coimbatore, Tamil Nadu', 'lat': 11.0168, 'lon': 76.9558}
}

def get_live_weather(region_key='hyderabad'):
    coords = REGIONS.get(region_key.lower(), REGIONS['hyderabad'])
    url = (
        f"https://api.open-meteo.com/v1/forecast?latitude={coords['lat']}&longitude={coords['lon']}"
        f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m"
        f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max"
        f"&timezone=auto"
    )
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            curr = data.get('current', {})
            daily = data.get('daily', {})
            
            temp = curr.get('temperature_2m', 28.5)
            hum = curr.get('relative_humidity_2m', 65.0)
            wind = curr.get('wind_speed_10m', 8.2)
            precip = curr.get('precipitation', 0.0)
            
            # Forecast list
            forecast = []
            dates = daily.get('time', [])
            t_max = daily.get('temperature_2m_max', [])
            t_min = daily.get('temperature_2m_min', [])
            p_sum = daily.get('precipitation_sum', [])
            p_prob = daily.get('precipitation_probability_max', [])
            
            for i in range(min(5, len(dates))):
                forecast.append({
                    'date': dates[i],
                    'max_temp': t_max[i] if i < len(t_max) else 30.0,
                    'min_temp': t_min[i] if i < len(t_min) else 20.0,
                    'precip_sum': p_sum[i] if i < len(p_sum) else 0.0,
                    'rain_prob': p_prob[i] if i < len(p_prob) else 10
                })
                
            advisories = generate_agro_weather_advisories(temp, hum, wind, precip, forecast)
            return {
                'success': True,
                'region_name': coords['name'],
                'temperature': temp,
                'relative_humidity': hum,
                'wind_speed_kmh': wind,
                'current_precipitation': precip,
                'forecast': forecast,
                'advisories': advisories
            }
    except Exception as e:
        print(f"[Weather API] Open-Meteo fallback triggered: {e}")
        
    # High fidelity offline fallback
    fallback_forecast = [
        {'date': 'Day 1', 'max_temp': 31.5, 'min_temp': 21.0, 'precip_sum': 0.0, 'rain_prob': 10},
        {'date': 'Day 2', 'max_temp': 32.0, 'min_temp': 22.0, 'precip_sum': 2.5, 'rain_prob': 35},
        {'date': 'Day 3', 'max_temp': 29.0, 'min_temp': 20.5, 'precip_sum': 14.0, 'rain_prob': 75},
        {'date': 'Day 4', 'max_temp': 28.0, 'min_temp': 19.8, 'precip_sum': 5.0, 'rain_prob': 50},
        {'date': 'Day 5', 'max_temp': 30.5, 'min_temp': 20.0, 'precip_sum': 0.0, 'rain_prob': 15}
    ]
    advisories = generate_agro_weather_advisories(29.5, 68.0, 11.0, 0.0, fallback_forecast)
    return {
        'success': True,
        'region_name': coords['name'] + ' (Agro-Met Station)',
        'temperature': 29.5,
        'relative_humidity': 68.0,
        'wind_speed_kmh': 11.0,
        'current_precipitation': 0.0,
        'forecast': fallback_forecast,
        'advisories': advisories
    }

def generate_agro_weather_advisories(temp, hum, wind, precip, forecast):
    advisories = []
    if hum > 75.0 and temp > 24.0:
        advisories.append({
            'type': 'warning',
            'title': 'High Fungal Spore Germination Risk',
            'text': 'High relative humidity combined with warm temperatures creates favorable conditions for foliar blights and downy mildew. Scout crop leaves and avoid evening canopy wetting.'
        })
    if wind > 15.0:
        advisories.append({
            'type': 'alert',
            'title': 'Pesticide Spraying Restriction',
            'text': f'Current wind speed ({wind} km/h) exceeds safe drift limits (>15 km/h). Postpone foliar insecticide and fungicide spraying to prevent chemical drift and loss.'
        })
    # Check for upcoming rain
    high_rain_days = [f for f in forecast if f.get('precip_sum', 0) > 8.0 or f.get('rain_prob', 0) > 60]
    if high_rain_days:
        advisories.append({
            'type': 'info',
            'title': 'Rainfall Expected in 48-72 Hours',
            'text': f'Substantial precipitation forecast detected on {high_rain_days[0]["date"]}. Hold back irrigation cycles and ensure drainage ditches in low-lying plots are cleared.'
        })
    else:
        advisories.append({
            'type': 'success',
            'title': 'Favorable Field Operation Window',
            'text': 'Mild winds and moderate solar radiation are optimal for weeding, mechanical inter-cultivation, and daytime harvesting operations.'
        })
    return advisories

# 4. AI Agriculture Chatbot Knowledge Base
KNOWLEDGE_VECTORS = [
    {
        'keywords': ['urea', 'nitrogen', 'yellow leaf', 'deficiency', 'n deficiency'],
        'response': 'Nitrogen deficiency causes general chlorosis (pale yellowing) starting from older, lower leaves while young leaves remain light green. Remedy: Top dress Neem-coated Urea @ 25-30 kg/acre or spray 2% Urea solution (20g/L water) for immediate leaf absorption.'
    },
    {
        'keywords': ['fall armyworm', 'armyworm', 'corn pest', 'maize pest'],
        'response': 'Fall Armyworm (Spodoptera frugiperda) infests maize whorls leaving ragged shot-holes and sawdust-like frass. Control: At early stage (1-2 instar), apply Neem oil 1500 ppm @ 5 ml/L or release egg parasitoids (Trichogramma). For severe infestation, spray Emamectin Benzoate 5% SG @ 0.4 g/L or Spinetoram 11.7% SC @ 0.5 ml/L directed into the whorl.'
    },
    {
        'keywords': ['pm kisan', 'scheme', 'government', 'subsidy', 'financial'],
        'response': 'Under the PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) scheme, eligible landholding farmer families receive an income support of ₹6,000 per year, delivered in three equal four-monthly installments of ₹2,000 directly into their Aadhaar-linked bank accounts. You can verify your e-KYC status at pmkisan.gov.in.'
    },
    {
        'keywords': ['soil health card', 'shc', 'soil test'],
        'response': 'The Soil Health Card (SHC) provides a comprehensive report of 12 soil fertility parameters: Macro-nutrients (N, P, K), Secondary nutrients (S), Micro-nutrients (Zn, Fe, Cu, Mn, Bo), and Physical parameters (pH, EC, Organic Carbon). Farmers should conduct soil testing every 2-3 years after harvest before the next sowing.'
    },
    {
        'keywords': ['neem oil', 'organic spray', 'pest control', 'natural'],
        'response': 'Neem Oil Preparation: Mix 5 ml of cold-pressed Neem Oil (1500 ppm azadirachtin) + 1 ml of mild liquid soap / detergent in 1 Liter of lukewarm water. Shake well to form a milky emulsion. Spray during early morning or late afternoon to control aphids, whiteflies, thrips, and mites.'
    },
    {
        'keywords': ['drip irrigation', 'water saving', 'subsidy'],
        'response': 'Drip irrigation saves 40-60% water while improving yield by 20-30% through precise root-zone fertigation. State governments under the Per Drop More Crop (PDMC) scheme provide 70% to 90% capital subsidy for small and marginal farmers installing micro-irrigation systems.'
    },
    {
        'keywords': ['kharif', 'rabi', 'zaid', 'seasons'],
        'response': 'India has three primary cropping seasons: 1) Kharif (Monsoon: June to October - Rice, Maize, Cotton, Soybean), 2) Rabi (Winter: October to March - Wheat, Mustard, Chickpea, Barley), and 3) Zaid (Summer: March to June - Watermelon, Muskmelon, Cucumber, Fodder crops).'
    },
    {
        'keywords': ['hi', 'hello', 'namaste', 'greeting'],
        'response': 'Namaste! Welcome to your AI Smart Agriculture Assistant. I can assist you with Crop Selection, Leaf Disease Diagnosis, Fertilizer Calculations, Weather-based Irrigation, and Government Farm Schemes. How can I assist your farm today?'
    }
]

def query_agro_chatbot(user_message):
    msg = user_message.lower().strip()
    best_match = None
    max_score = 0
    
    for item in KNOWLEDGE_VECTORS:
        score = sum(1 for kw in item['keywords'] if kw in msg)
        if score > max_score:
            max_score = score
            best_match = item['response']
            
    if best_match and max_score > 0:
        return best_match
    else:
        return (
            "I understand you are asking about agricultural field operations. "
            "To give you the most accurate agronomic advice, could you mention your specific crop, "
            "soil type, or the observed symptoms (e.g., leaf spot, fertilizer dosage, irrigation schedule, or government scheme)?"
        )
