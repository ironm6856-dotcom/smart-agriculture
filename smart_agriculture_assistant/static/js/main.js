// AI-Based Smart Agriculture Assistant: Client Interactivity & Charts

document.addEventListener('DOMContentLoaded', () => {
  initDashboardCharts();
  initCropForm();
  initDiseaseScanner();
  initFertilizerForm();
  initIrrigationForm();
  initChatbot();
});

// 1. Dashboard Charts (Chart.js)
function initDashboardCharts() {
  const radarCtx = document.getElementById('soilRadarChart');
  if (radarCtx && window.Chart) {
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)', 'pH Level (x10)', 'Moisture (%)', 'Humus Index'],
        datasets: [{
          label: 'Current Field Average',
          data: [78, 46, 38, 65, 58, 72],
          backgroundColor: 'rgba(5, 150, 105, 0.25)',
          borderColor: '#059669',
          borderWidth: 2,
          pointBackgroundColor: '#064e3b'
        }, {
          label: 'Benchmark Ideal Range',
          data: [80, 50, 45, 68, 65, 80],
          backgroundColor: 'rgba(217, 119, 6, 0.15)',
          borderColor: '#d97706',
          borderWidth: 1.5,
          borderDash: [5, 5],
          pointBackgroundColor: '#d97706'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
  }

  const cropDistCtx = document.getElementById('cropDistChart');
  if (cropDistCtx && window.Chart) {
    new Chart(cropDistCtx, {
      type: 'doughnut',
      data: {
        labels: ['Rice / Paddy', 'Maize', 'Cotton', 'Pulses (Chickpea/Lentil)', 'Horticulture (Tomato/Banana)'],
        datasets: [{
          data: [35, 25, 18, 12, 10],
          backgroundColor: ['#059669', '#10b981', '#34d399', '#f59e0b', '#0284c7']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

// 2. Crop Recommendation Form
function initCropForm() {
  const form = document.getElementById('cropForm');
  const resultBox = document.getElementById('cropResultBox');
  if (!form || !resultBox) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = 'Analyzing Soil & Agro-Met Data...';
    btn.disabled = true;

    const payload = {
      nitrogen: form.nitrogen.value,
      phosphorus: form.phosphorus.value,
      potassium: form.potassium.value,
      temperature: form.temperature.value,
      humidity: form.humidity.value,
      ph: form.ph.value,
      rainfall: form.rainfall.value
    };

    try {
      const res = await fetch('/api/crop_recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        document.getElementById('recCropName').textContent = data.recommended_crop;
        document.getElementById('recConfidence').textContent = `${data.confidence}% Match`;
        document.getElementById('recAlternatives').textContent = data.alternatives.join(' • ');
        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert('Error: ' + (data.error || 'Prediction failed'));
      }
    } catch (err) {
      alert('Network error connecting to prediction model');
    } finally {
      btn.innerHTML = origText;
      btn.disabled = false;
    }
  });
}

// 3. Plant Disease Scanner
function initDiseaseScanner() {
  const form = document.getElementById('diseaseForm');
  const resultBox = document.getElementById('diseaseResultBox');
  const sampleCards = document.querySelectorAll('.sample-leaf-card');
  const sampleInput = document.getElementById('selectedSample');
  const previewImg = document.getElementById('leafPreview');
  const fileInput = document.getElementById('leafImageInput');

  sampleCards.forEach(card => {
    card.addEventListener('click', () => {
      sampleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const filename = card.getAttribute('data-file');
      if (sampleInput) sampleInput.value = filename;
      if (fileInput) fileInput.value = '';
      if (previewImg) {
        previewImg.src = card.querySelector('img').src;
        previewImg.style.display = 'block';
      }
    });
  });

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      sampleCards.forEach(c => c.classList.remove('selected'));
      if (sampleInput) sampleInput.value = '';
      if (fileInput.files && fileInput.files[0] && previewImg) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          previewImg.style.display = 'block';
        };
        reader.readAsDataURL(fileInput.files[0]);
      }
    });
  }

  if (form && resultBox) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;
      btn.innerHTML = 'Running Deep Phenotypic Scan...';
      btn.disabled = true;

      const formData = new FormData(form);

      try {
        const res = await fetch('/api/disease_detection', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (data.success) {
          document.getElementById('resDisease').textContent = data.detected_disease;
          document.getElementById('resConfidence').textContent = `${data.confidence}% Confidence`;
          document.getElementById('resPathogen').textContent = data.pathogen;
          document.getElementById('resSymptoms').textContent = data.symptoms;
          document.getElementById('resOrganic').textContent = data.organic_treatment;
          document.getElementById('resChemical').textContent = data.chemical_treatment;
          document.getElementById('resPrevention').textContent = data.prevention;

          const sevBadge = document.getElementById('resSeverity');
          sevBadge.textContent = data.severity;
          sevBadge.className = `badge badge-${data.severity_color}`;

          resultBox.style.display = 'block';
          resultBox.scrollIntoView({ behavior: 'smooth' });
        } else {
          alert('Diagnostic error: ' + (data.error || 'Failed to scan image'));
        }
      } catch (err) {
        alert('Network error connecting to diagnostic engine');
      } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
      }
    });
  }
}

// 4. Fertilizer Recommendation Form
function initFertilizerForm() {
  const form = document.getElementById('fertForm');
  const resultBox = document.getElementById('fertResultBox');
  if (!form || !resultBox) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      crop: form.crop.value,
      nitrogen: form.nitrogen.value,
      phosphorus: form.phosphorus.value,
      potassium: form.potassium.value,
      acreage: form.acreage.value
    };

    try {
      const res = await fetch('/api/fertilizer_recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        const d = data.data;
        document.getElementById('fertCropTitle').textContent = `${d.crop_name} (${d.land_area_acres} Acres)`;
        document.getElementById('fertN').textContent = `${d.deficits.nitrogen_kg} kg`;
        document.getElementById('fertP').textContent = `${d.deficits.phosphorus_kg} kg`;
        document.getElementById('fertK').textContent = `${d.deficits.potassium_kg} kg`;

        const fertList = document.getElementById('fertCommercialList');
        fertList.innerHTML = '';
        d.commercial_fertilizers.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${item.name}:</strong> ${item.quantity_kg} kg (~${item.bags} bags)<br><span style="font-size: 0.85rem; color: #475569;">${item.application_method}</span>`;
          li.style.marginBottom = '10px';
          fertList.appendChild(li);
        });

        document.getElementById('fertOrganic').textContent = d.organic_advice;
        document.getElementById('fertSplits').textContent = d.application_splits;

        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      alert('Error calculating fertilizer requirements');
    }
  });
}

// 5. Smart Irrigation Form
function initIrrigationForm() {
  const form = document.getElementById('irrigForm');
  const resultBox = document.getElementById('irrigResultBox');
  if (!form || !resultBox) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      crop_name: form.crop_name.value,
      soil_texture: form.soil_texture.value,
      soil_moisture: form.soil_moisture.value,
      stage: form.stage.value,
      rain_forecast: form.rain_forecast.value
    };

    try {
      const res = await fetch('/api/smart_irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        const d = data.data;
        document.getElementById('irrigDecision').textContent = d.decision;
        document.getElementById('irrigReason').textContent = d.reason;
        document.getElementById('irrigWater').textContent = `${d.liters_per_acre.toLocaleString()} Liters / Acre (${d.water_needed_mm} mm)`;
        document.getElementById('irrigHours').textContent = `${d.recommended_drip_duration_hours} Hours`;
        document.getElementById('irrigETc').textContent = `${d.crop_evapotranspiration_mm_day} mm/day`;

        const decEl = document.getElementById('irrigDecision');
        decEl.className = 'badge';
        if (d.urgency === 'high') decEl.classList.add('badge-red');
        else if (d.urgency === 'medium') decEl.classList.add('badge-amber');
        else decEl.classList.add('badge-green');

        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      alert('Error computing irrigation schedule');
    }
  });
}

// 6. AI Agriculture Chatbot
function initChatbot() {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const messagesBox = document.getElementById('chatMessages');
  const quickBtns = document.querySelectorAll('.quick-query');

  if (!chatForm || !chatInput || !messagesBox) return;

  const appendMsg = (text, sender) => {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    messagesBox.appendChild(bubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  };

  const sendQuery = async (msg) => {
    if (!msg.trim()) return;
    appendMsg(msg, 'user');
    chatInput.value = '';

    const typing = document.createElement('div');
    typing.className = 'chat-bubble bot';
    typing.id = 'typingBubble';
    typing.textContent = 'Consulting agricultural knowledge base...';
    messagesBox.appendChild(typing);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      const typingEl = document.getElementById('typingBubble');
      if (typingEl) typingEl.remove();

      appendMsg(data.reply || 'Thank you for your question.', 'bot');
    } catch (err) {
      const typingEl = document.getElementById('typingBubble');
      if (typingEl) typingEl.remove();
      appendMsg('Sorry, could not connect to agriculture AI service.', 'bot');
    }
  };

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendQuery(chatInput.value);
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sendQuery(btn.textContent.trim());
    });
  });
}
