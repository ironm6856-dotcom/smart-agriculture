# AI-Based Smart Agriculture Assistant

An intelligent decision-support web platform powered by Machine Learning, Deep Phenotypic Leaf Vision, Soil Stoichiometry, and Live Agro-Meteorology to empower smallholder farmers.

---

## Innovation Team (GCET Hyderabad)
- **Person 1:** Sharanya (Team Lead & DeepTech AI Systems Architect) - Emerging Tech / CSE, GCET Hyderabad
- **Person 2:** Karanya (Agronomy Research & Phenological GDD Specialist) - Emerging Tech / CSE, GCET Hyderabad
- **Person 3:** Abhinay (Embedded IoT & Hardware Lead) - Department of CSE, GCET Hyderabad
- **Person 4:** Vidhya (Edge-AI Computer Vision Lead) - CSE / AIML, GCET Hyderabad
- **Person 5:** Punith (Cloud Architecture & Voice Pipeline Lead) - CSE / Emerging Tech, GCET Hyderabad
- **Person 6:** Harshith (Field Telemetry & Actuation Lead) - Department of CSE, GCET Hyderabad

---

## Key Modules & Capabilities
1. **Crop Recommendation:** 100-tree Random Forest ML classifier trained on 2,200 agronomic benchmark samples (N, P, K, temperature, humidity, pH, rainfall $\rightarrow$ 22 crops) with 99.32% test accuracy.
2. **Plant Disease Detection:** Computer Vision leaf diagnostic scanner classifying blights, rusts, and healthy states with full organic and chemical remediation measures.
3. **Fertilizer Recommendation:** Agronomic nutrient deficit calculator ($\Delta N, \Delta P, \Delta K$) providing exact commercial bag requirements (Neem Coated Urea, DAP, MOP).
4. **Live Weather & Advisory:** Real-time atmospheric conditions and 5-day forecast via Open-Meteo REST service with operational spraying and fungal risk advisories.
5. **Smart Irrigation:** Soil moisture (% VWC) and crop evapotranspiration ($ET_c$) budgeting calculating liters/acre and drip pump runtime.
6. **AI Agriculture Chatbot:** Natural-language extension advisory answering queries regarding pest remedies, seasonal calendars, and PM-KISAN guidelines.
7. **Farmer Dashboard:** Modern green-themed UI with Chart.js soil radar profile, crop suitability doughnut chart, and SQLite persistence.

---

## Setup & Quick Start Instructions

### Prerequisites
- Python 3.10+ installed
- Pip package manager

### 1. Installation
Install all required dependencies:
```bash
cd smart_agriculture_assistant
pip install -r requirements.txt
```

### 2. Initialize Database & Train Models
```bash
python database\init_db.py
python train_models.py
python generate_sample_leaves.py
```

### 3. Run Test Suite
```bash
python test_app.py
```

### 4. Start the Application
Run via the Windows batch script:
```cmd
run.bat
```
Or start with Python:
```bash
python app.py
```
Open your browser and navigate to: **http://127.0.0.1:5000**

---

## Deliverables & Documentation
- **Word Document (.docx):** `docs/AI_Smart_Agriculture_Assistant_Project_Report.docx`
- **PDF Document (.pdf):** `docs/AI_Smart_Agriculture_Assistant_Project_Report.pdf`
- **Captured Screenshots:** `docs/screenshots/`
