/**
 * Medical Miracle - Multi-Agent Healthcare & Pharmacotherapy System
 * Senior AI Product Manager & Clinical AI Specialist Architecture
 * 
 * Strict Guidelines:
 * - Font: Cambria Math
 * - Theme: Blue and White
 * - Icons: React-Icons style SVGs
 * - Zero Emojis in any string or rendered element
 */

// Global Currencies and Conversion Rates
const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  INR: { symbol: '₹', rate: 84.5, label: 'INR (₹)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' },
  EUR: { symbol: '€', rate: 0.94, label: 'EUR (€)' }
};

let currentCurrency = 'USD';
let currentTab = 'home'; // 'home' or 'dashboard'
let currentFilter = 'all'; // 'all', 'otc', 'rx'
let currentAnalysisResult = null;

// React Icons SVG Definitions (Matching Feather, Heroicons, and Lucide React packages)
const REACT_ICONS = {
  activity: `<svg class="w-5 h-5 text-sky-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
  shield: `<svg class="w-5 h-5 text-sky-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  checkCircle: `<svg class="w-5 h-5 text-sky-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  dollarSign: `<svg class="w-4 h-4 text-sky-700 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  mapPin: `<svg class="w-4 h-4 text-sky-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  clock: `<svg class="w-4 h-4 text-slate-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  alertTriangle: `<svg class="w-5 h-5 text-amber-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  alertCircle: `<svg class="w-5 h-5 text-red-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  truck: `<svg class="w-4 h-4 text-sky-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
  fileText: `<svg class="w-4 h-4 text-sky-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  search: `<svg class="w-5 h-5 text-sky-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  database: `<svg class="w-4 h-4 text-sky-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
  trendingDown: `<svg class="w-4 h-4 text-sky-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>`,
  chevronDown: `<svg class="w-4 h-4 text-slate-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  info: `<svg class="w-4 h-4 text-sky-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
};

// Clinical Knowledge Base with Real Unsplash Medical Images (No emojis)
const CLINICAL_KNOWLEDGE_BASE = {
  headache: {
    category: 'Neurology and Craniofacial Pain',
    triageLevel: 'Mild to Moderate Non-Emergency Acuity',
    confidence: 97,
    diagnosis: 'Acute Tension Cephalalgia or Episodic Migraine',
    clinicalNotes: 'Non-opioid analgesic therapy indicated. Recommend dark room rest, aggressive hydration, and stress modulation.',
    medicines: [
      {
        id: 'med-paracetamol',
        name: 'Acetaminophen (Paracetamol)',
        brandName: 'Tylenol Extra Strength',
        genericName: 'Acetaminophen USP 500mg',
        activeIngredient: 'Acetaminophen 500 mg',
        type: 'OTC',
        typeLabel: 'Over-The-Counter (Non-Opioid Analgesic)',
        rxRequired: false,
        form: 'Oral Caplet',
        confidence: 98,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        indication: 'Tension headaches, muscular neck strain pain, and mild fever relief.',
        baseBrandPrice: 14.99,
        baseGenericPrice: 4.25,
        dosage: 'Take 1 to 2 caplets (500mg to 1000mg) orally with water.',
        frequency: 'Every 4 to 6 hours as needed (Maximum 3000mg in 24 hours)',
        timing: 'May be taken with or without food. Drink with a full glass of water.',
        howToUseSteps: [
          'Swallow whole with a full 250ml glass of fresh water.',
          'Do not exceed 6 caplets in any 24-hour cycle to avoid hepatic overload.',
          'Maintain a minimum 4-hour interval between consecutive doses.'
        ],
        warnings: [
          'Hepatic Safety Warning: Avoid alcohol consumption (more than 2 drinks daily).',
          'Check co-formulated cold/cough medications to prevent accidental double-dosing.',
          'Consult a licensed physician if head pain persists beyond 48 hours.'
        ],
        stores: [
          { name: 'CVS Caremark Pharmacy (24/7 Drive-Thru)', address: '742 Market Street', distance: '0.6 miles', inStock: true, stockQty: 48, priceMultiplier: 1.0 },
          { name: 'Walgreens Community Pharmacy', address: '1204 Pine Boulevard', distance: '1.2 miles', inStock: true, stockQty: 22, priceMultiplier: 1.05 },
          { name: 'Apollo Health Pharmacy', address: '305 Medical Center Way', distance: '1.8 miles', inStock: true, stockQty: 35, priceMultiplier: 0.96 }
        ],
        deliveryOptions: {
          instantDelivery: true,
          courier: 'Express Health Courier Dispatch',
          eta: '30 to 45 minutes',
          deliveryFee: 1.99
        }
      },
      {
        id: 'med-ibuprofen',
        name: 'Ibuprofen Liqui-Gels',
        brandName: 'Advil Liqui-Gels',
        genericName: 'Ibuprofen Solubilized 400mg',
        activeIngredient: 'Ibuprofen 400 mg (NSAID)',
        type: 'OTC',
        typeLabel: 'Over-The-Counter (NSAID)',
        rxRequired: false,
        form: 'Liquid Softgel Capsule',
        confidence: 94,
        image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80',
        indication: 'Inflammatory headaches, throbbing temporal headaches, and muscle soreness.',
        baseBrandPrice: 16.50,
        baseGenericPrice: 5.10,
        dosage: 'Take 1 softgel (400 mg) every 6 to 8 hours with meals.',
        frequency: 'Every 6 to 8 hours (Maximum 1200mg daily OTC)',
        timing: 'Must be ingested with food, milk, or a full meal to protect gastric mucosa.',
        howToUseSteps: [
          'Consume strictly after a meal or alongside milk.',
          'Do not recline or lie flat for 10 minutes following ingestion.',
          'Use the lowest therapeutic dosage for the shortest required duration.'
        ],
        warnings: [
          'Gastrointestinal bleeding precaution for patients over 60 years or history of ulcers.',
          'Contraindicated in severe renal impairment or uncontrolled arterial hypertension.',
          'Do not take concurrently with blood thinners without prior medical clearance.'
        ],
        stores: [
          { name: 'Walgreens Community Pharmacy', address: '1204 Pine Boulevard', distance: '1.2 miles', inStock: true, stockQty: 34, priceMultiplier: 1.0 },
          { name: 'CVS Caremark Pharmacy', address: '742 Market Street', distance: '0.6 miles', inStock: true, stockQty: 18, priceMultiplier: 1.02 },
          { name: 'Rite Aid Pharmacy', address: '88 Grand Avenue', distance: '2.1 miles', inStock: true, stockQty: 12, priceMultiplier: 0.98 }
        ],
        deliveryOptions: {
          instantDelivery: true,
          courier: 'Pharmacy Rapid Courier',
          eta: '35 to 50 minutes',
          deliveryFee: 2.49
        }
      },
      {
        id: 'med-sumatriptan',
        name: 'Sumatriptan Succinate',
        brandName: 'Imitrex',
        genericName: 'Sumatriptan 50mg Tablet',
        activeIngredient: 'Sumatriptan 50 mg (5-HT1B/1D Receptor Agonist)',
        type: 'Rx',
        typeLabel: 'Prescription Required (Telehealth Verification Available)',
        rxRequired: true,
        form: 'Oral Film-Coated Tablet',
        confidence: 91,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
        indication: 'Targeted abortive relief for acute moderate-to-severe migraine attacks with or without aura.',
        baseBrandPrice: 85.00,
        baseGenericPrice: 12.80,
        dosage: 'Take 1 tablet (50 mg) immediately at the earliest onset of migraine symptoms.',
        frequency: 'Second dose permissible after 2 hours if headache recurs (Max 200mg/24h).',
        timing: 'Can be taken with or without food immediately when aura or cephalalgia appears.',
        howToUseSteps: [
          'Swallow whole with water at earliest sign of acute attack.',
          'Do not crush, chew, or split the tablet.',
          'Utilize our integrated licensed Telehealth physician review to issue instant digital Rx.'
        ],
        warnings: [
          'Strictly contraindicated in coronary artery disease, stroke history, or peripheral vascular disease.',
          'Do not co-administer with ergotamine derivatives within 24 hours.',
          'Requires verified prescription validation prior to final pharmacy release.'
        ],
        stores: [
          { name: 'CVS Specialty Pharmacy', address: '742 Market Street', distance: '0.6 miles', inStock: true, stockQty: 14, priceMultiplier: 1.0 },
          { name: 'Apollo Specialist Care Center', address: '305 Medical Center Way', distance: '1.8 miles', inStock: true, stockQty: 9, priceMultiplier: 1.05 }
        ],
        deliveryOptions: {
          instantDelivery: false,
          courier: 'Verified Medical Courier (Digital ID Required)',
          eta: '2 to 3 Hours',
          deliveryFee: 4.99
        }
      }
    ]
  },
  gerd: {
    category: 'Gastroenterology and Upper GI Tract',
    triageLevel: 'Mild to Moderate Non-Emergency Acuity',
    confidence: 96,
    diagnosis: 'Gastroesophageal Reflux Disease (GERD) and Acid Dyspepsia',
    clinicalNotes: 'Suppression of gastric acid secretion indicated. Advise dietary modifications: avoid late dining, caffeine, carbonation, and recumbent positioning.',
    medicines: [
      {
        id: 'med-omeprazole',
        name: 'Omeprazole Delayed-Release',
        brandName: 'Prilosec OTC',
        genericName: 'Omeprazole Magnesium 20mg',
        activeIngredient: 'Omeprazole 20 mg (Proton Pump Inhibitor)',
        type: 'OTC',
        typeLabel: 'Over-The-Counter (14-Day Regimen)',
        rxRequired: false,
        form: 'Delayed-Release Capsule',
        confidence: 97,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        indication: 'Frequent heartburn recurring two or more days per week.',
        baseBrandPrice: 28.99,
        baseGenericPrice: 8.50,
        dosage: 'Take 1 capsule (20 mg) once daily every morning.',
        frequency: 'Once every 24 hours for a 14-day continuous course.',
        timing: 'Administer 30 to 60 minutes before breakfast on an empty stomach.',
        howToUseSteps: [
          'Swallow whole. Never chew, crush, or open capsule contents.',
          'Ingest first thing in the morning with a full glass of water.',
          'Complete the full 14-day cycle; repeat only after 4 months unless guided by physician.'
        ],
        warnings: [
          'Not intended for immediate relief of acute isolated heartburn episodes (takes 1 to 4 days for peak effect).',
          'Seek urgent evaluation if chest pain radiates to neck, shoulders, or arm.',
          'Prolonged unmonitored use may impair magnesium and micronutrient absorption.'
        ],
        stores: [
          { name: 'CVS Caremark Pharmacy', address: '742 Market Street', distance: '0.6 miles', inStock: true, stockQty: 40, priceMultiplier: 1.0 },
          { name: 'Walgreens Community Pharmacy', address: '1204 Pine Boulevard', distance: '1.2 miles', inStock: true, stockQty: 25, priceMultiplier: 0.98 },
          { name: 'Target CVS Pharmacy', address: '88 Commerce Boulevard', distance: '2.4 miles', inStock: true, stockQty: 18, priceMultiplier: 0.94 }
        ],
        deliveryOptions: {
          instantDelivery: true,
          courier: 'On-Demand Health Courier',
          eta: '30 to 40 minutes',
          deliveryFee: 1.49
        }
      },
      {
        id: 'med-famotidine',
        name: 'Famotidine Maximum Strength',
        brandName: 'Pepcid AC',
        genericName: 'Famotidine 20mg Film-Coated',
        activeIngredient: 'Famotidine 20 mg (H2-Receptor Antagonist)',
        type: 'OTC',
        typeLabel: 'Over-The-Counter (Rapid Action Relief)',
        rxRequired: false,
        form: 'Oral Film Tablet',
        confidence: 93,
        image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80',
        indication: 'Rapid symptom relief and prevention of meal-induced acid indigestion and pyrosis.',
        baseBrandPrice: 19.99,
        baseGenericPrice: 6.20,
        dosage: 'Take 1 tablet (20 mg) with water.',
        frequency: '1 tablet 15 to 60 minutes before meal, or at heartburn onset (Max 2 tablets/24h)',
        timing: 'Can be taken for acute symptom relief or 30 minutes prior to acidic or heavy meals.',
        howToUseSteps: [
          'Take with water whenever acid burn symptoms arise.',
          'To prevent acid reflux, take 30 minutes before consuming known trigger foods.',
          'Provides relief within 15 to 30 minutes and maintains suppression for up to 12 hours.'
        ],
        warnings: [
          'Do not use continuously for greater than 14 consecutive days without gastroenterology review.',
          'Dose adjustments indicated in moderate-to-severe renal insufficiency.'
        ],
        stores: [
          { name: 'Walgreens Community Pharmacy', address: '1204 Pine Boulevard', distance: '1.2 miles', inStock: true, stockQty: 30, priceMultiplier: 1.0 },
          { name: 'CVS Caremark Pharmacy', address: '742 Market Street', distance: '0.6 miles', inStock: true, stockQty: 20, priceMultiplier: 1.04 }
        ],
        deliveryOptions: {
          instantDelivery: true,
          courier: 'DoorDash Health Partner',
          eta: '25 to 35 minutes',
          deliveryFee: 1.99
        }
      }
    ]
  },
  allergies: {
    category: 'Immunology and Upper Respiratory Allergy',
    triageLevel: 'Mild Acuity Non-Emergency',
    confidence: 97,
    diagnosis: 'Allergic Rhinitis and Histamine Hypersensitivity',
    clinicalNotes: 'Second-generation non-sedating antihistamine and intranasal corticosteroid indicated.',
    medicines: [
      {
        id: 'med-cetirizine',
        name: 'Cetirizine Hydrochloride',
        brandName: 'Zyrtec 24-Hour',
        genericName: 'Cetirizine HCl 10mg',
        activeIngredient: 'Cetirizine HCl 10 mg',
        type: 'OTC',
        typeLabel: 'Over-The-Counter (Non-Drowsy Formula)',
        rxRequired: false,
        form: 'Oral Tablet',
        confidence: 96,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        indication: 'Sneezing, nasal pruritus, watery eyes, and allergic rhinorrhea.',
        baseBrandPrice: 22.49,
        baseGenericPrice: 5.80,
        dosage: 'Take one 10 mg tablet once daily.',
        frequency: 'Once every 24 hours.',
        timing: 'May be taken with or without food, preferably in the evening.',
        howToUseSteps: [
          'Take 1 tablet once per day with clean drinking water.',
          'Do not ingest more than one 10 mg tablet within a single 24-hour window.',
          'Assess personal tolerance before operating heavy machinery or vehicles.'
        ],
        warnings: [
          'Avoid concurrent alcohol ingestion to prevent excessive central nervous depression.',
          'Patients with renal or hepatic impairment should consult for adjusted posology.'
        ],
        stores: [
          { name: 'CVS Caremark Pharmacy', address: '742 Market Street', distance: '0.6 miles', inStock: true, stockQty: 55, priceMultiplier: 1.0 },
          { name: 'Walgreens Community Pharmacy', address: '1204 Pine Boulevard', distance: '1.2 miles', inStock: true, stockQty: 41, priceMultiplier: 0.98 }
        ],
        deliveryOptions: {
          instantDelivery: true,
          courier: 'Standard Medical Express',
          eta: '30 to 40 minutes',
          deliveryFee: 1.99
        }
      },
      {
        id: 'med-fluticasone',
        name: 'Fluticasone Propionate Nasal Spray',
        brandName: 'Flonase Allergy Relief',
        genericName: 'Fluticasone Propionate 50mcg/spray',
        activeIngredient: 'Fluticasone Propionate 50 mcg',
        type: 'OTC',
        typeLabel: 'Over-The-Counter (Intranasal Glucocorticoid)',
        rxRequired: false,
        form: 'Metered Dose Nasal Spray',
        confidence: 95,
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
        indication: 'Nasal congestion, seasonal pollinosis, and allergic ocular pressure.',
        baseBrandPrice: 26.50,
        baseGenericPrice: 9.40,
        dosage: '2 sprays per nostril once daily for week 1; taper to 1 spray daily for maintenance.',
        frequency: 'Once daily in the morning.',
        timing: 'Morning administration following gentle nasal clearance.',
        howToUseSteps: [
          'Shake container gently prior to each application.',
          'Gently blow nose to clear passages.',
          'Insert applicator tip, orient slightly outward toward ear, and depress pump while inhaling gently.'
        ],
        warnings: [
          'Do not direct spray toward the central nasal septum.',
          'Consult pediatrician before administering to children under 4 years of age.'
        ],
        stores: [
          { name: 'CVS Caremark Pharmacy', address: '742 Market Street', distance: '0.6 miles', inStock: true, stockQty: 24, priceMultiplier: 1.0 },
          { name: 'Apollo Health Pharmacy', address: '305 Medical Center Way', distance: '1.8 miles', inStock: true, stockQty: 19, priceMultiplier: 1.02 }
        ],
        deliveryOptions: {
          instantDelivery: true,
          courier: 'Direct Local Delivery',
          eta: '40 minutes',
          deliveryFee: 2.29
        }
      }
    ]
  },
  fever: {
    category: 'Infectious Disease and Respiratory Triage',
    triageLevel: 'Mild to Moderate Viral Acuity',
    confidence: 96,
    diagnosis: 'Acute Upper Respiratory Tract Viral Infection (Coryza / Common Cold)',
    clinicalNotes: 'Antipyretic therapy, hydration maintenance, and symptomatic decongestant indicated. Antibacterial agents not indicated for viral etiology.',
    medicines: [
      {
        id: 'med-paracetamol-fever',
        name: 'Acetaminophen 650mg Caplets',
        brandName: 'Tylenol Cold and Flu Relief',
        genericName: 'Acetaminophen 650mg Caplet',
        activeIngredient: 'Acetaminophen 650 mg',
        type: 'OTC',
        typeLabel: 'Over-The-Counter (Antipyretic and Analgesic)',
        rxRequired: false,
        form: 'Coated Caplet',
        confidence: 97,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        indication: 'Fever reduction, throat irritation, general myalgia, and malaise.',
        baseBrandPrice: 15.20,
        baseGenericPrice: 4.50,
        dosage: '1 caplet (650 mg) every 6 hours as needed.',
        frequency: 'Every 6 hours (Maximum 3000 mg in 24 hours)',
        timing: 'Consume with oral fluids; food intake is optional.',
        howToUseSteps: [
          'Ingest with warm water, tea, or clear broth.',
          'Log body temperature measurements before and two hours post administration.',
          'Maintain robust hydration with electrolyte fluids.'
        ],
        warnings: [
          'Do not combine with any parallel medications containing acetaminophen.',
          'If body temperature exceeds 39.2 degrees Celsius or persists over 72 hours, obtain physician consultation.'
        ],
        stores: [
          { name: 'CVS Caremark Pharmacy', address: '742 Market Street', distance: '0.6 miles', inStock: true, stockQty: 60, priceMultiplier: 1.0 },
          { name: 'Walgreens Community Pharmacy', address: '1204 Pine Boulevard', distance: '1.2 miles', inStock: true, stockQty: 50, priceMultiplier: 0.97 }
        ],
        deliveryOptions: {
          instantDelivery: true,
          courier: 'Same-Day Courier Express',
          eta: '25 to 35 minutes',
          deliveryFee: 1.99
        }
      },
      {
        id: 'med-dextromethorphan',
        name: 'Dextromethorphan with Guaifenesin',
        brandName: 'Robitussin DM Max',
        genericName: 'Dextromethorphan HBr 20mg / Guaifenesin 400mg per 20ml',
        activeIngredient: 'Dextromethorphan HBr (Antitussive) + Guaifenesin (Expectorant)',
        type: 'OTC',
        typeLabel: 'Over-The-Counter (Bronchial Mucus Expectorant)',
        rxRequired: false,
        form: 'Oral Liquid Solution with Calibrated Dose Cup',
        confidence: 92,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
        indication: 'Thins bronchial secretions and calms severe hacking non-productive cough.',
        baseBrandPrice: 17.80,
        baseGenericPrice: 6.90,
        dosage: '20 ml every 4 hours as needed utilizing the calibrated measuring cup.',
        frequency: 'Every 4 hours (Do not exceed 6 doses within 24 hours)',
        timing: 'Consume with abundant water to assist mucosal thinning.',
        howToUseSteps: [
          'Measure strictly with the calibrated dose cup provided.',
          'Drink at least 8 glasses of clean water daily while taking expectorants.',
          'Agitate bottle well prior to dispensing.'
        ],
        warnings: [
          'Contraindicated if presently taking monoamine oxidase inhibitors (MAOIs).',
          'Not intended for chronic persistent bronchial asthma cough without pulmonologist direction.'
        ],
        stores: [
          { name: 'Walgreens Community Pharmacy', address: '1204 Pine Boulevard', distance: '1.2 miles', inStock: true, stockQty: 28, priceMultiplier: 1.0 },
          { name: 'CVS Caremark Pharmacy', address: '742 Market Street', distance: '0.6 miles', inStock: true, stockQty: 32, priceMultiplier: 1.02 }
        ],
        deliveryOptions: {
          instantDelivery: true,
          courier: 'Local Pharmacy Courier',
          eta: '35 minutes',
          deliveryFee: 2.19
        }
      }
    ]
  }
};

// Red Flag Emergency Indicators (Zero emojis)
const RED_FLAG_CRITICAL_KEYWORDS = [
  'chest pain', 'heart attack', 'left arm pain', 'difficulty breathing', 
  'shortness of breath', 'cannot breathe', 'stroke', 'face drooping', 
  'slurred speech', 'coughing blood', 'unconscious', 'severe hemorrhage', 
  'anaphylaxis', 'loss of vision', 'worst headache of life', 'seizure', 'suicide'
];

// Multi-Agent Pipeline Specs
const MULTI_AGENT_PIPELINE = [
  {
    id: 'agent-triage',
    name: 'Clinical Triage Agent',
    badge: 'Stage 1: Safety & Acuity',
    role: 'Scans for acute contraindications, evaluates emergency red-flag triggers, and assigns triage urgency levels.',
    reactIcon: REACT_ICONS.shield
  },
  {
    id: 'agent-rx',
    name: 'Pharmacotherapy Engine',
    badge: 'Stage 2: Drug Formulation',
    role: 'Matches clinical presentations to FDA-approved drug classes, comparing active salts, bioequivalencies, and generic options.',
    reactIcon: REACT_ICONS.database
  },
  {
    id: 'agent-guidance',
    name: 'Posology & Usage Agent',
    badge: 'Stage 3: Dosage & Safety Protocol',
    role: 'Generates weight-calibrated posology, administration schedules, food timing rules, and contraindication warnings.',
    reactIcon: REACT_ICONS.fileText
  },
  {
    id: 'agent-pricing',
    name: 'Real-Time Price Arbitrage Agent',
    badge: 'Stage 4: Cost Optimization',
    role: 'Queries real-time pharmacy network APIs, compares brand vs generic pricing, and unlocks maximum patient savings.',
    reactIcon: REACT_ICONS.dollarSign
  },
  {
    id: 'agent-logistics',
    name: 'Geo-Inventory Logistics Agent',
    badge: 'Stage 5: Verification & Fulfillment',
    role: 'Confirms shelf stock at neighboring pharmacies and coordinates on-demand 45-minute courier dispatch.',
    reactIcon: REACT_ICONS.truck
  }
];

// Format price with current active currency
function formatPrice(usd) {
  const curr = CURRENCIES[currentCurrency];
  const converted = usd * curr.rate;
  if (currentCurrency === 'INR') {
    return `${curr.symbol}${Math.round(converted)}`;
  }
  return `${curr.symbol}${converted.toFixed(2)}`;
}

// Dynamic symptom plan resolver
function resolveSymptomPlan(query) {
  const q = query.toLowerCase();

  for (const flag of RED_FLAG_CRITICAL_KEYWORDS) {
    if (q.includes(flag)) {
      return { isEmergency: true, flagTerm: flag };
    }
  }

  if (q.includes('headache') || q.includes('migraine') || q.includes('cephalalgia') || q.includes('head pain')) {
    return { ...CLINICAL_KNOWLEDGE_BASE.headache, isEmergency: false };
  } else if (q.includes('acid') || q.includes('gerd') || q.includes('heartburn') || q.includes('reflux') || q.includes('stomach') || q.includes('indigestion')) {
    return { ...CLINICAL_KNOWLEDGE_BASE.gerd, isEmergency: false };
  } else if (q.includes('allergy') || q.includes('sneez') || q.includes('itch') || q.includes('pollen') || q.includes('rhinitis')) {
    return { ...CLINICAL_KNOWLEDGE_BASE.allergies, isEmergency: false };
  } else if (q.includes('fever') || q.includes('cold') || q.includes('cough') || q.includes('throat') || q.includes('flu')) {
    return { ...CLINICAL_KNOWLEDGE_BASE.fever, isEmergency: false };
  }

  // Generic fallback cluster
  return {
    isEmergency: false,
    category: 'Ambulatory Care and General Symptomatic Relief',
    triageLevel: 'Mild Symptomatic Cluster',
    confidence: 90,
    diagnosis: `Symptom Analysis Cluster: "${query.slice(0, 45)}..."`,
    clinicalNotes: 'Multi-agent algorithmic matching for broad analgesic and metabolic homeostasis support.',
    medicines: [
      {
        id: 'med-broad-analgesic',
        name: 'Acetaminophen USP 500mg',
        brandName: 'Tylenol Rapid Release',
        genericName: 'Acetaminophen 500mg Gelcap',
        activeIngredient: 'Acetaminophen 500 mg',
        type: 'OTC',
        typeLabel: 'Over-The-Counter (Analgesic)',
        rxRequired: false,
        form: 'Rapid Release Gelcap',
        confidence: 94,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        indication: 'Symptomatic relief for localized pain, generalized body ache, or elevated temperature.',
        baseBrandPrice: 13.99,
        baseGenericPrice: 4.10,
        dosage: '1 to 2 gelcaps every 6 hours as needed.',
        frequency: 'Every 6 hours (Maximum 3000 mg within 24 hours)',
        timing: 'Can be taken with or without food accompanied by water.',
        howToUseSteps: [
          'Swallow whole with clean water.',
          'Do not combine with other acetaminophen formulations.',
          'Re-evaluate symptoms if no clinical improvement within 48 hours.'
        ],
        warnings: [
          'Observe strict maximum daily limits to preserve hepatic function.',
          'Seek medical guidance if symptoms intensify.'
        ],
        stores: [
          { name: 'CVS Caremark Pharmacy', address: '742 Market Street', distance: '0.6 miles', inStock: true, stockQty: 45, priceMultiplier: 1.0 },
          { name: 'Walgreens Community Pharmacy', address: '1204 Pine Boulevard', distance: '1.2 miles', inStock: true, stockQty: 28, priceMultiplier: 1.02 }
        ],
        deliveryOptions: {
          instantDelivery: true,
          courier: 'Express Health Courier Dispatch',
          eta: '30 to 45 minutes',
          deliveryFee: 1.99
        }
      }
    ]
  };
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupAppEvents();
  renderAgentArchitectureGrid();
  renderDashboardData();
});

function setupAppEvents() {
  // Navigation Tabs (Home Page vs Sample Dashboard)
  const homeTabBtn = document.getElementById('tab-nav-home');
  const dashboardTabBtn = document.getElementById('tab-nav-dashboard');
  const homeView = document.getElementById('view-home');
  const dashboardView = document.getElementById('view-dashboard');

  if (homeTabBtn && dashboardTabBtn && homeView && dashboardView) {
    homeTabBtn.addEventListener('click', () => {
      currentTab = 'home';
      homeTabBtn.className = 'px-5 py-2 text-sm font-bold text-sky-700 bg-white rounded-lg shadow-sm border border-slate-200 transition';
      dashboardTabBtn.className = 'px-5 py-2 text-sm font-medium text-slate-600 hover:text-sky-700 rounded-lg transition';
      homeView.classList.remove('hidden');
      dashboardView.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    dashboardTabBtn.addEventListener('click', () => {
      currentTab = 'dashboard';
      dashboardTabBtn.className = 'px-5 py-2 text-sm font-bold text-sky-700 bg-white rounded-lg shadow-sm border border-slate-200 transition';
      homeTabBtn.className = 'px-5 py-2 text-sm font-medium text-slate-600 hover:text-sky-700 rounded-lg transition';
      dashboardView.classList.remove('hidden');
      homeView.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Currency Selector
  const currencySelect = document.getElementById('currency-select');
  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      if (currentAnalysisResult) {
        renderMedicationCards();
      }
      renderDashboardData();
    });
  }

  // Symptom Analysis Form
  const form = document.getElementById('symptom-triage-form');
  if (form) {
    form.addEventListener('submit', handleSymptomSubmit);
  }

  // Symptom Preset Chips
  const presetChips = document.querySelectorAll('.symptom-chip');
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-symptom');
      const input = document.getElementById('symptoms-input');
      if (input) {
        input.value = text;
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Filter Buttons (All, OTC, Prescription)
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-sky-600', 'text-white');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-300');
      });
      btn.classList.add('bg-sky-600', 'text-white');
      btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-300');
      currentFilter = btn.getAttribute('data-filter');
      renderMedicationCards();
    });
  });
}

// Render Agent Architecture in Hero
function renderAgentArchitectureGrid() {
  const container = document.getElementById('agent-architecture-grid');
  if (!container) return;

  container.innerHTML = MULTI_AGENT_PIPELINE.map((agent) => `
    <div class="white-clinical-card rounded-xl p-4 border border-sky-100 flex items-start space-x-3 transition hover:border-sky-400">
      <div class="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
        ${agent.reactIcon}
      </div>
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono font-bold text-sky-700">${agent.badge}</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold">Active</span>
        </div>
        <h4 class="font-bold text-slate-800 text-sm mt-0.5">${agent.name}</h4>
        <p class="text-xs text-slate-600 mt-1 leading-relaxed">${agent.role}</p>
      </div>
    </div>
  `).join('');
}

// Handle Form Submission
async function handleSymptomSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('symptoms-input');
  const userText = input ? input.value.trim() : '';

  if (!userText) return;

  const consoleSection = document.getElementById('agent-live-console');
  if (consoleSection) {
    consoleSection.classList.remove('hidden');
    consoleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Clear previous live steps
  const stepsBox = document.getElementById('agent-orchestration-steps');
  if (stepsBox) stepsBox.innerHTML = '';
  document.getElementById('clinical-results-container')?.classList.add('hidden');

  const plan = resolveSymptomPlan(userText);

  // Sequential execution simulation
  for (let i = 0; i < MULTI_AGENT_PIPELINE.length; i++) {
    await simulateAgentStep(MULTI_AGENT_PIPELINE[i], i, plan);
  }

  // Emergency Red Flag Interception
  if (plan.isEmergency) {
    showEmergencyModal(plan.flagTerm);
    return;
  }

  currentAnalysisResult = plan;
  renderClinicalResults(plan, userText);
}

// Simulate Agent Execution Step (Zero emojis)
function simulateAgentStep(agent, idx, plan) {
  return new Promise(resolve => {
    const stepsBox = document.getElementById('agent-orchestration-steps');
    if (!stepsBox) {
      resolve();
      return;
    }

    const stepCard = document.createElement('div');
    stepCard.className = 'white-clinical-card p-4 rounded-xl border border-sky-200 mb-3 bg-white transition';
    stepCard.id = `step-card-${agent.id}`;

    stepCard.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0" id="step-icon-${agent.id}">
            ${REACT_ICONS.activity}
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-mono font-bold text-sky-700">${agent.badge}</span>
              <span class="text-sm font-semibold text-slate-800">• ${agent.name}</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5" id="step-log-${agent.id}">Executing clinical rules and evaluating safety constraints...</p>
          </div>
        </div>
        <div class="text-xs font-mono text-slate-400" id="step-time-${agent.id}">Processing...</div>
      </div>
    `;

    stepsBox.appendChild(stepCard);

    const logs = [
      `Validating 14 acute contraindication indicators. Red-flag triggers cleared. Urgency level determined: ${plan.triageLevel || 'Mild/Moderate'}.`,
      `Querying FDA National Drug Code database. Identifying first-line chemical compounds and generic equivalents.`,
      `Calculating weight-adjusted posology, interval safety boundaries, and food-drug interaction profiles.`,
      `Querying national pharmacy pricing APIs. Real-time generic arbitrage calculated: up to 76% patient savings.`,
      `Locating physical inventory within 3-mile radius. In-stock units confirmed across 3 local pharmacies + 45-min delivery route mapped.`
    ];

    setTimeout(() => {
      const icon = document.getElementById(`step-icon-${agent.id}`);
      const log = document.getElementById(`step-log-${agent.id}`);
      const time = document.getElementById(`step-time-${agent.id}`);

      if (icon) {
        icon.className = 'w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0';
        icon.innerHTML = REACT_ICONS.checkCircle;
      }
      if (log) {
        log.textContent = logs[idx] || agent.role;
        log.className = 'text-xs text-slate-700 mt-0.5 font-medium';
      }
      if (time) {
        time.textContent = `${(0.24 + Math.random() * 0.28).toFixed(2)}s • Verified`;
        time.className = 'text-xs font-mono text-sky-700 font-bold';
      }
      resolve();
    }, 550);
  });
}

// Render Results Section
function renderClinicalResults(plan) {
  const container = document.getElementById('clinical-results-container');
  if (!container) return;

  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Update Summary Header
  const catEl = document.getElementById('result-category-label');
  const diagEl = document.getElementById('result-diagnosis-title');
  const notesEl = document.getElementById('result-notes-desc');
  const confEl = document.getElementById('result-confidence-metric');

  if (catEl) catEl.textContent = plan.category;
  if (diagEl) diagEl.textContent = plan.diagnosis;
  if (notesEl) notesEl.textContent = plan.clinicalNotes;
  if (confEl) confEl.textContent = `${plan.confidence}% AI Consensus`;

  renderMedicationCards();
}

// Render Medication Cards with Images and Detailed Sections
function renderMedicationCards() {
  const container = document.getElementById('medication-cards-list');
  if (!container || !currentAnalysisResult) return;

  let list = currentAnalysisResult.medicines || [];

  if (currentFilter === 'otc') {
    list = list.filter(m => !m.rxRequired);
  } else if (currentFilter === 'rx') {
    list = list.filter(m => m.rxRequired);
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="white-clinical-card rounded-2xl p-8 text-center border border-slate-200">
        <div class="w-12 h-12 mx-auto rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
          ${REACT_ICONS.info}
        </div>
        <h4 class="text-base font-bold text-slate-800">No items match current filter criteria</h4>
        <p class="text-sm text-slate-500 mt-1">Select "All Recommendations" to review all evidence-based options.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((med) => {
    const brandPriceStr = formatPrice(med.baseBrandPrice);
    const genericPriceStr = formatPrice(med.baseGenericPrice);
    const savingsPercent = Math.round(((med.baseBrandPrice - med.baseGenericPrice) / med.baseBrandPrice) * 100);

    return `
      <div class="white-clinical-card rounded-2xl border border-sky-100 p-6 md:p-7 mb-6 transition hover:border-sky-300">
        
        <!-- Header row with Image, Title, and Price Card -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div class="flex items-start space-x-4">
            <!-- Medical Product Image -->
            <div class="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50 shadow-sm">
              <img src="${med.image}" alt="${med.name}" class="w-full h-full object-cover">
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span class="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                  med.rxRequired 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                    : 'bg-sky-100 text-sky-900 border border-sky-300'
                }">
                  ${med.typeLabel}
                </span>
                <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Form: ${med.form}
                </span>
                <span class="px-2.5 py-0.5 rounded text-xs font-mono font-semibold text-sky-800 bg-sky-50 border border-sky-200">
                  AI Confidence: ${med.confidence}%
                </span>
              </div>

              <h3 class="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                ${med.name}
                <span class="text-sm font-normal text-slate-500 ml-1.5">(Brand: ${med.brandName})</span>
              </h3>
              
              <p class="text-xs text-slate-600 mt-1">
                <strong class="text-slate-800">Active Compound:</strong> ${med.activeIngredient} &bull; 
                <strong class="text-slate-800">Clinical Indication:</strong> ${med.indication}
              </p>
            </div>
          </div>

          <!-- Price Arbitrage Box -->
          <div class="bg-sky-50/70 border border-sky-200 rounded-xl p-4 min-w-[220px] text-right shrink-0">
            <span class="text-[11px] font-mono uppercase tracking-wider text-sky-800 font-bold block">
              Real-Time Price Comparison
            </span>
            <div class="flex items-baseline justify-end gap-2 mt-1">
              <span class="text-2xl font-black text-sky-900">${genericPriceStr}</span>
              <span class="text-xs text-slate-400 line-through">${brandPriceStr}</span>
            </div>
            <div class="text-xs text-sky-700 font-semibold mt-0.5 flex items-center justify-end gap-1">
              ${REACT_ICONS.trendingDown}
              <span>Save ${savingsPercent}% with Generic Salt</span>
            </div>
          </div>
        </div>

        <!-- Two Column Content: Usage & Pharmacy Availability -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          <!-- Column 1: Posology & How to use (7 cols) -->
          <div class="lg:col-span-7 space-y-4">
            <h4 class="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
              ${REACT_ICONS.fileText}
              <span>Posology & Administration Protocol (How to Use)</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="text-slate-500 block mb-1 font-mono uppercase text-[10px]">Standard Dosage</span>
                <span class="text-slate-900 font-bold">${med.dosage}</span>
              </div>
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="text-slate-500 block mb-1 font-mono uppercase text-[10px]">Frequency & Upper Bound</span>
                <span class="text-slate-900 font-bold">${med.frequency}</span>
              </div>
            </div>

            <!-- Step by step guidance -->
            <div class="bg-sky-50/40 p-4 rounded-xl border border-sky-100 text-xs">
              <span class="font-bold text-sky-900 block mb-2 flex items-center gap-1.5">
                ${REACT_ICONS.checkCircle}
                <span>Step-by-Step Patient Directions</span>
              </span>
              <ul class="space-y-1.5 list-disc list-inside text-slate-700 leading-relaxed">
                ${med.howToUseSteps.map(step => `<li>${step}</li>`).join('')}
              </ul>
              <div class="mt-2.5 p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                ${REACT_ICONS.alertTriangle}
                <span><strong>Meal Association:</strong> ${med.timing}</span>
              </div>
            </div>

            <!-- Warnings Toggle -->
            <div>
              <button onclick="toggleWarnings('${med.id}')" class="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1.5 transition">
                ${REACT_ICONS.shield}
                <span>View Clinical Contraindications & Safety Warnings</span>
                ${REACT_ICONS.chevronDown}
              </button>
              <div id="warnings-${med.id}" class="hidden mt-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1.5">
                ${med.warnings.map(w => `<div class="flex items-start gap-2">${REACT_ICONS.alertCircle}<span>${w}</span></div>`).join('')}
              </div>
            </div>
          </div>

          <!-- Column 2: Where are they available? (5 cols) -->
          <div class="lg:col-span-5 bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
                  ${REACT_ICONS.mapPin}
                  <span>Verified Availability (Where to Buy)</span>
                </h4>
                <span class="text-[10px] font-mono text-slate-500">Live API Feed</span>
              </div>

              <!-- Physical Stores -->
              <div class="space-y-2 mb-3">
                ${med.stores.map(store => `
                  <div class="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between shadow-sm">
                    <div>
                      <div class="font-bold text-slate-800">${store.name}</div>
                      <div class="text-[11px] text-slate-500">${store.address} &bull; ${store.distance}</div>
                      <div class="text-[11px] font-semibold text-sky-700 mt-0.5">
                        ${store.inStock ? `In Stock (${store.stockQty} units available)` : 'Out of Stock'}
                      </div>
                    </div>
                    <div class="text-right shrink-0">
                      <span class="font-bold text-slate-900 text-sm">${formatPrice(med.baseGenericPrice * store.priceMultiplier)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Instant Courier Option -->
              <div class="p-3 rounded-lg bg-sky-100/60 border border-sky-200 text-xs flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  ${REACT_ICONS.truck}
                  <div>
                    <span class="font-bold text-sky-950">${med.deliveryOptions.courier}</span>
                    <p class="text-[11px] text-slate-600">Estimated Arrival: ${med.deliveryOptions.eta}</p>
                  </div>
                </div>
                <span class="font-bold text-sky-800">45-Min Express</span>
              </div>
            </div>

            <!-- Interactive Action CTAs -->
            <div class="grid grid-cols-2 gap-2 mt-2">
              <button onclick="handleReserveMedicine('${med.name}', '${med.stores[0].name}')" class="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1.5 transition">
                ${REACT_ICONS.mapPin}
                <span>Reserve Pickup</span>
              </button>
              <button onclick="handleOrderDelivery('${med.name}', '${genericPriceStr}')" class="px-3 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 flex items-center justify-center gap-1.5 shadow-sm transition">
                ${REACT_ICONS.truck}
                <span>Order Delivery</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    `;
  }).join('');
}

// Toggle Warnings Box
window.toggleWarnings = function(id) {
  const box = document.getElementById(`warnings-${id}`);
  if (box) {
    box.classList.toggle('hidden');
  }
};

// Emergency Triage Modal (Zero emojis)
function showEmergencyModal(term) {
  const modal = document.getElementById('emergency-modal');
  const termEl = document.getElementById('emergency-term-display');
  if (termEl) termEl.textContent = `"${term.toUpperCase()}"`;
  if (modal) modal.classList.remove('hidden');
}

window.closeEmergencyModal = function() {
  const modal = document.getElementById('emergency-modal');
  if (modal) modal.classList.add('hidden');
};

// Notification Toast (Zero emojis)
function showSystemToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-medium z-50 border border-sky-400 flex items-center gap-2';
  toast.innerHTML = `${REACT_ICONS.checkCircle}<span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

window.handleReserveMedicine = function(medName, store) {
  showSystemToast(`Inventory Reserved: 1 unit of ${medName} set aside at ${store}. Pickup verification voucher sent.`);
};

window.handleOrderDelivery = function(medName, price) {
  showSystemToast(`Delivery Dispatched: 1 unit of ${medName} (${price}) routed to nearest pharmacy for 45-minute courier delivery.`);
};

// Render Sample Dashboard Data
function renderDashboardData() {
  const triageLogsContainer = document.getElementById('dashboard-triage-logs');
  if (!triageLogsContainer) return;

  const mockLogs = [
    { id: 'TRG-8821', time: '4m ago', symptoms: 'Severe throbbing migraine with aura', acuity: 'Moderate', regimen: 'Acetaminophen 500mg + Rest', store: 'CVS Pharmacy (Market St)', status: 'Dispensed' },
    { id: 'TRG-8820', time: '11m ago', symptoms: 'Postprandial heartburn and acid reflux', acuity: 'Mild', regimen: 'Omeprazole 20mg Delayed-Release', store: 'Walgreens (Grand Ave)', status: 'In Transit' },
    { id: 'TRG-8819', time: '18m ago', symptoms: 'Seasonal allergic rhinitis and eye pruritus', acuity: 'Mild', regimen: 'Cetirizine HCl 10mg', store: 'Apollo Pharmacy', status: 'Delivered' },
    { id: 'TRG-8818', time: '32m ago', symptoms: 'Viral coryza, fever (38.5C), myalgia', acuity: 'Moderate', regimen: 'Paracetamol 650mg + Hydration', store: 'CVS Pharmacy', status: 'Delivered' },
    { id: 'TRG-8817', time: '45m ago', symptoms: 'Substernal pressure with arm numbness', acuity: 'Critical', regimen: '911 Emergency Escalation', store: 'University Hospital ER', status: 'Interrupted' }
  ];

  triageLogsContainer.innerHTML = mockLogs.map(log => `
    <tr class="border-b border-slate-100 hover:bg-sky-50/50 text-xs">
      <td class="py-3 px-4 font-mono font-bold text-sky-800">${log.id}</td>
      <td class="py-3 px-4 text-slate-500">${log.time}</td>
      <td class="py-3 px-4 text-slate-800 font-medium">${log.symptoms}</td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold ${
          log.acuity === 'Critical' ? 'bg-red-100 text-red-800 border border-red-300' :
          log.acuity === 'Moderate' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
          'bg-sky-100 text-sky-800 border border-sky-300'
        }">${log.acuity}</span>
      </td>
      <td class="py-3 px-4 text-slate-700">${log.regimen}</td>
      <td class="py-3 px-4 text-slate-600">${log.store}</td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${
          log.status === 'Dispensed' ? 'bg-sky-100 text-sky-800' :
          log.status === 'In Transit' ? 'bg-indigo-100 text-indigo-800' :
          log.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
          'bg-red-100 text-red-800'
        }">${log.status}</span>
      </td>
    </tr>
  `).join('');
}
