// Real-Time GPS Tracking & Fleet Telemetry Module for RentalKu (Mobil, Motor, & Sepeda)
import L from 'leaflet';
import { store } from '../data/store.js';
import { initIcons } from '../utils/icons.js';
import { showDialogAlert } from '../utils/dialog.js';

let mapInstance = null;
let markersMap = {};
let geofenceCircle = null;
let telemetryInterval = null;
let selectedVehicleId = null;
let activeCategoryFilter = 'ALL'; // 'ALL', 'Mobil', 'Motor', 'Sepeda', 'RENTED'
let searchQuery = '';

export function renderGpsTracking(container) {
  const branch = store.getBranch();
  const allUnits = store.getUnits().filter(u => u.currentLocation);

  // If no unit is selected or previously selected unit not found, select first rented or first unit
  if (!selectedVehicleId || !allUnits.find(u => u.id === selectedVehicleId)) {
    const firstRented = allUnits.find(u => u.status === 'Disewa');
    selectedVehicleId = firstRented ? firstRented.id : (allUnits[0]?.id || null);
  }

  const carUnits = allUnits.filter(u => u.category === 'Mobil');
  const motorUnits = allUnits.filter(u => u.category === 'Motor');
  const bikeUnits = allUnits.filter(u => u.category === 'Sepeda');
  const rentedUnits = allUnits.filter(u => u.status === 'Disewa');

  container.innerHTML = `
    <div class="gps-tracking-view">
      <div class="flex-between mb-3" style="flex-wrap: wrap; gap: 12px;">
        <div>
          <h2><i data-lucide="compass" class="text-cyan"></i> GPS Tracking Armada Real-Time</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            Monitoring posisi, kecepatan, status gembok/mesin, dan geofencing perimeter untuk armada Mobil, Motor, & Sepeda.
          </p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <span class="badge badge-emerald live-indicator">
            <i data-lucide="activity" style="width: 12px;"></i> Telemetri Server Live
          </span>
          <button class="btn btn-secondary btn-sm" id="btnRecenterHub">
            <i data-lucide="map-pin"></i> Garasi Pusat
          </button>
        </div>
      </div>

      <div class="gps-wrapper">
        <!-- Sidebar Units List -->
        <div class="gps-sidebar">
          <div class="gps-header">
            <div class="flex-between">
              <span style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
                ARMADA TERPASANG GPS (${allUnits.length})
              </span>
              <span class="badge badge-cyan font-mono" style="font-size: 0.7rem;">
                ${rentedUnits.length} Aktif di Jalan
              </span>
            </div>

            <!-- Search box -->
            <div class="gps-search-box">
              <i data-lucide="search" class="gps-search-icon"></i>
              <input type="text" class="gps-search-input" id="gpsSearchInput" placeholder="Cari plat, seri, atau nama penyewa..." value="${searchQuery}">
            </div>

            <!-- Filter Tabs -->
            <div class="gps-filter-tabs" id="gpsFilterTabs">
              <button class="gps-filter-btn ${activeCategoryFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">
                Semua (${allUnits.length})
              </button>
              <button class="gps-filter-btn ${activeCategoryFilter === 'Mobil' ? 'active' : ''}" data-filter="Mobil">
                🚗 Mobil (${carUnits.length})
              </button>
              <button class="gps-filter-btn ${activeCategoryFilter === 'Motor' ? 'active' : ''}" data-filter="Motor">
                🛵 Motor (${motorUnits.length})
              </button>
              <button class="gps-filter-btn ${activeCategoryFilter === 'Sepeda' ? 'active' : ''}" data-filter="Sepeda">
                🚲 Sepeda (${bikeUnits.length})
              </button>
              <button class="gps-filter-btn ${activeCategoryFilter === 'RENTED' ? 'active' : ''}" data-filter="RENTED">
                🟢 Sedang Disewa (${rentedUnits.length})
              </button>
            </div>
          </div>

          <div class="gps-list" id="gpsUnitsList">
            ${renderVehicleCards(getFilteredUnits(allUnits))}
          </div>
        </div>

        <!-- Interactive Map Container -->
        <div class="gps-map-container">
          <div id="gpsMap"></div>

          <!-- Floating HUD Overlay for Selected Unit -->
          <div class="gps-hud-overlay" id="gpsHud">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>
    </div>
  `;

  initIcons();

  // Initialize Map
  setTimeout(() => {
    initLeafletMap(branch, allUnits);
  }, 100);

  // Bind sidebar event listeners
  bindSidebarEvents(container, allUnits);

  container.querySelector('#btnRecenterHub')?.addEventListener('click', () => {
    if (mapInstance && branch?.geofence) {
      mapInstance.flyTo([branch.geofence.lat, branch.geofence.lng], 12);
    }
  });
}

function getFilteredUnits(units) {
  return units.filter(u => {
    // Category filter
    let matchCat = true;
    if (activeCategoryFilter === 'Mobil') matchCat = u.category === 'Mobil';
    else if (activeCategoryFilter === 'Motor') matchCat = u.category === 'Motor';
    else if (activeCategoryFilter === 'Sepeda') matchCat = u.category === 'Sepeda';
    else if (activeCategoryFilter === 'RENTED') matchCat = u.status === 'Disewa';

    // Search query filter
    let matchSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const activeBooking = store.getActiveBookingForUnit(u.id);
      const custName = activeBooking ? activeBooking.customerName.toLowerCase() : '';
      const bookCode = activeBooking ? activeBooking.bookingCode.toLowerCase() : '';

      matchSearch = u.plateNumber.toLowerCase().includes(q) ||
                    u.modelName.toLowerCase().includes(q) ||
                    u.gpsId.toLowerCase().includes(q) ||
                    custName.includes(q) ||
                    bookCode.includes(q);
    }

    return matchCat && matchSearch;
  });
}

function renderVehicleCards(units) {
  if (units.length === 0) {
    return `
      <div style="padding: 30px 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        <i data-lucide="compass" style="width: 32px; height: 32px; margin-bottom: 8px; opacity: 0.5;"></i>
        <p>Tidak ada armada GPS yang sesuai filter pencarian.</p>
      </div>
    `;
  }

  return units.map(u => {
    const loc = u.currentLocation;
    const isBicycle = u.category === 'Sepeda';
    const isMotor = u.category === 'Motor';
    const isRented = u.status === 'Disewa';
    const isSelected = selectedVehicleId === u.id;
    const activeBooking = store.getActiveBookingForUnit(u.id);

    // Status Badge determination
    let statusBadgeHtml = '';
    if (isBicycle) {
      const isLocked = loc.engineStatus.includes('Terkunci');
      const isGowes = loc.speedKmh > 0 || loc.engineStatus.includes('Gowes') || loc.engineStatus.includes('Motor Listrik');
      if (isLocked) {
        statusBadgeHtml = `<span class="badge badge-rose"><i data-lucide="lock" style="width: 10px;"></i> Smart Lock Terkunci</span>`;
      } else if (isGowes) {
        statusBadgeHtml = `<span class="badge badge-emerald"><i data-lucide="activity" style="width: 10px;"></i> ${loc.engineStatus.includes('E-Bike') ? 'Motor Assist' : 'Gowes Aktif'}</span>`;
      } else {
        statusBadgeHtml = `<span class="badge badge-slate"><i data-lucide="pause-circle" style="width: 10px;"></i> Standby Parkir</span>`;
      }
    } else {
      const isEngineOn = loc.engineStatus === 'ON';
      statusBadgeHtml = `<span class="badge ${isEngineOn ? 'badge-emerald' : 'badge-slate'}"><i data-lucide="power" style="width: 10px;"></i> Mesin ${loc.engineStatus}</span>`;
    }

    // Category badge styling
    const catBadgeClass = isBicycle ? 'badge-indigo' : isMotor ? 'badge-emerald' : 'badge-cyan';
    const catIcon = isBicycle ? 'bike' : isMotor ? 'navigation-2' : 'car';

    return `
      <div class="gps-vehicle-card ${isSelected ? 'active' : ''}" data-unit-id="${u.id}">
        <div class="gps-vehicle-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge ${catBadgeClass}" style="padding: 2px 6px; font-size: 0.68rem;">
              <i data-lucide="${catIcon}" style="width: 10px;"></i> ${u.category}
            </span>
            <span class="gps-plate">${u.plateNumber}</span>
          </div>
          ${statusBadgeHtml}
        </div>

        <div style="font-size: 0.8rem; color: #fff; font-weight: 600; margin-bottom: 2px;">
          ${u.modelName}
        </div>

        ${isRented && activeBooking ? `
          <div class="gps-renter-banner">
            <i data-lucide="user-check" style="width: 12px;"></i>
            <span>Disewa: <strong>${activeBooking.customerName}</strong> (${activeBooking.bookingCode})</span>
          </div>
        ` : ''}

        <div class="gps-telemetry-row">
          <div>
            <div>Kecepatan</div>
            <div class="telemetry-val text-cyan">${loc.speedKmh} km/h</div>
          </div>
          <div>
            <div>${isBicycle ? (u.modelName.includes('E-Bike') ? 'Baterai' : 'Mekanis') : 'BBM / Baterai'}</div>
            <div class="telemetry-val text-amber">${isBicycle && !u.modelName.includes('E-Bike') ? '100% Prima' : `${u.fuelLevelPercent}%`}</div>
          </div>
          <div>
            <div>Odo</div>
            <div class="telemetry-val">${isBicycle ? `${u.odometerKm} KM` : `${(u.odometerKm / 1000).toFixed(1)}k KM`}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 0.7rem;">
          <span class="text-muted"><i data-lucide="compass" style="width: 10px;"></i> ${u.gpsId}</span>
          <span class="${loc.isOutOfBounds ? 'text-rose font-bold' : 'text-emerald'}">
            ${loc.isOutOfBounds ? '⚠️ Diluar Geofence' : '✓ Area Aman'}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

function bindSidebarEvents(container, allUnits) {
  // Category Filter Pills
  container.querySelectorAll('.gps-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.gps-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategoryFilter = btn.dataset.filter;
      refreshCardsList(container, allUnits);
    });
  });

  // Search input
  container.querySelector('#gpsSearchInput')?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    refreshCardsList(container, allUnits);
  });

  // Card click selection
  container.querySelectorAll('.gps-vehicle-card').forEach(card => {
    card.addEventListener('click', () => {
      const uId = card.dataset.unitId;
      selectVehicle(uId);
    });
  });
}

function refreshCardsList(container, allUnits) {
  const listEl = container.querySelector('#gpsUnitsList');
  if (!listEl) return;
  const filtered = getFilteredUnits(allUnits);
  listEl.innerHTML = renderVehicleCards(filtered);
  initIcons();

  listEl.querySelectorAll('.gps-vehicle-card').forEach(card => {
    card.addEventListener('click', () => {
      const uId = card.dataset.unitId;
      selectVehicle(uId);
    });
  });
}

function initLeafletMap(branch, units) {
  const mapEl = document.getElementById('gpsMap');
  if (!mapEl) return;

  // Clean previous instance if exists
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
    markersMap = {};
  }

  // Centered on Bali Central Hub (Sanur)
  const centerLat = branch?.geofence?.lat || -8.6852;
  const centerLng = branch?.geofence?.lng || 115.2476;

  mapInstance = L.map('gpsMap', {
    center: [centerLat, centerLng],
    zoom: 12,
    zoomControl: true
  });

  // OpenStreetMap Tiles with CSS Dark Filter (Watermark-free, 100% Reliable)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(mapInstance);

  // Draw Geofence Radius
  if (branch?.geofence) {
    geofenceCircle = L.circle([branch.geofence.lat, branch.geofence.lng], {
      color: '#06b6d4',
      fillColor: '#06b6d4',
      fillOpacity: 0.05,
      weight: 1.5,
      dashArray: '5, 8',
      radius: branch.geofence.radiusMeters
    }).addTo(mapInstance);
  }

  // Add Central Hub Marker
  const hubIcon = L.divIcon({
    className: 'hub-marker',
    html: `
      <div style="background: #10b981; color: #fff; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(16, 185, 129, 0.6); border: 2px solid #fff;">
        <span style="font-weight: 800; font-size: 13px;">HQ</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  L.marker([centerLat, centerLng], { icon: hubIcon })
    .bindPopup(`<b>RentalKu Central Hub</b><br>${branch.address}`)
    .addTo(mapInstance);

  // Add Vehicle Markers for all categories (Mobil, Motor, Sepeda)
  units.forEach(u => {
    const loc = u.currentLocation;
    const isCar = u.category === 'Mobil';
    const isMotor = u.category === 'Motor';
    const isBicycle = u.category === 'Sepeda';
    const isMoving = loc.speedKmh > 0;

    let markerClass = 'custom-car-marker';
    let pulseClass = 'pulse-car';
    let shortCode = u.plateNumber.split(' ')[1] || u.plateNumber.split('-')[1] || u.plateNumber.slice(0, 4);

    if (isBicycle) {
      markerClass = 'custom-bicycle-marker';
      pulseClass = 'pulse-bicycle';
      shortCode = u.plateNumber.replace('BYC-', '');
    } else if (isMotor) {
      markerClass = 'custom-bike-marker';
      pulseClass = 'pulse-bike';
    }

    const customIcon = L.divIcon({
      className: 'vehicle-marker-wrapper',
      html: `
        <div class="${markerClass}" id="marker-${u.id}">
          ${isMoving ? `<div class="marker-pulse ${pulseClass}"></div>` : ''}
          <span style="font-size: 10px; font-weight: 800; font-family: 'JetBrains Mono';">${shortCode}</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(mapInstance);
    marker.on('click', () => {
      selectVehicle(u.id);
    });

    markersMap[u.id] = marker;
  });

  // Select first active/rented unit by default
  const defaultUnit = units.find(u => u.id === selectedVehicleId) || units[0];
  if (defaultUnit) {
    selectVehicle(defaultUnit.id);
  }

  // Start Real-Time Telemetry Simulation Interval
  startTelemetrySimulation();
}

function selectVehicle(unitId) {
  selectedVehicleId = unitId;
  const unit = store.getUnitById(unitId);
  if (!unit || !unit.currentLocation) return;

  // Highlight card in sidebar
  document.querySelectorAll('.gps-vehicle-card').forEach(c => {
    c.classList.toggle('active', c.dataset.unitId === unitId);
  });

  // Pan map smoothly to vehicle
  if (mapInstance && unit.currentLocation) {
    mapInstance.flyTo([unit.currentLocation.lat, unit.currentLocation.lng], 14, {
      duration: 1.2
    });
  }

  // Render HUD
  renderHud(unit);
}

function renderHud(unit) {
  const hud = document.getElementById('gpsHud');
  if (!hud) return;

  const loc = unit.currentLocation;
  const isBicycle = unit.category === 'Sepeda';
  const isMotor = unit.category === 'Motor';
  const isEBike = isBicycle && unit.modelName.includes('E-Bike');
  const activeBooking = store.getActiveBookingForUnit(unit.id);
  const isLocked = isBicycle && loc.engineStatus.includes('Terkunci');
  const isEngineOn = loc.engineStatus === 'ON';

  hud.innerHTML = `
    <div class="hud-title">
      <span>TELEMETRI ${unit.category.toUpperCase()}</span>
      <span class="font-mono font-bold text-cyan">${unit.plateNumber}</span>
    </div>

    <div style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 8px;">
      ${unit.modelName}
    </div>

    ${activeBooking ? `
      <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 6px; padding: 9px 12px; margin-bottom: 12px; font-size: 0.78rem;">
        <div class="flex-between mb-1">
          <span class="text-muted">Penyewa Aktif:</span>
          <strong style="color: #34d399;"><i data-lucide="user-check" style="width: 12px; vertical-align: middle;"></i> ${activeBooking.customerName}</strong>
        </div>
        <div class="flex-between mb-1">
          <span class="text-muted">No. Telepon:</span>
          <span class="font-mono text-cyan">${activeBooking.customerPhone || '-'}</span>
        </div>
        <div class="flex-between">
          <span class="text-muted">Kode Booking:</span>
          <span class="font-mono font-bold">${activeBooking.bookingCode}</span>
        </div>
      </div>
    ` : ''}

    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.78rem;">
      <div class="flex-between">
        <span class="text-muted">${isBicycle ? 'Status Gembok IoT' : 'Kontak Mesin'}</span>
        <span class="badge ${isBicycle ? (isLocked ? 'badge-rose' : 'badge-emerald') : (isEngineOn ? 'badge-emerald' : 'badge-rose')} font-bold">
          ${isBicycle ? (isLocked ? '🔒 GEMBOK TERKUNCI' : isEBike ? '⚡ MOTOR ASSIST ON' : '🚴 GOWES AKTIF') : (isEngineOn ? 'ENGINE RUNNING' : 'ENGINE CUT-OFF')}
        </span>
      </div>

      <div class="flex-between">
        <span class="text-muted">Kecepatan Saat Ini</span>
        <span class="font-mono font-bold text-cyan" style="font-size: 1.15rem;">${loc.speedKmh} km/h</span>
      </div>

      <div class="flex-between">
        <span class="text-muted">${isEBike ? 'Baterai E-Bike' : isBicycle ? 'Kondisi Komponen' : 'BBM / Energi'}</span>
        <span class="font-mono text-amber">${isBicycle && !isEBike ? '100% Prima (Shimano)' : `${unit.fuelLevelPercent}%`}</span>
      </div>

      <div class="flex-between">
        <span class="text-muted">Koordinat GPS</span>
        <span class="font-mono" style="font-size: 0.72rem;">${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</span>
      </div>

      <div class="flex-between">
        <span class="text-muted">Perimeter Geofence</span>
        <span class="${loc.isOutOfBounds ? 'badge badge-rose' : 'badge badge-emerald'}">
          ${loc.isOutOfBounds ? '⚠️ DILUAR ZONA' : '✓ ZONA AMAN (SANUR)'}
        </span>
      </div>
    </div>

    <div class="hud-actions">
      ${isBicycle ? `
        <button class="btn ${isLocked ? 'btn-primary' : 'btn-danger'} btn-sm" id="btnToggleSmartLock" style="width: 100%;">
          <i data-lucide="${isLocked ? 'unlock' : 'lock'}"></i>
          ${isLocked ? 'Buka Kunci Gembok Elektrik' : 'Remote Smart Lock (Kunci Gembok)'}
        </button>
        <button class="btn btn-secondary btn-sm" id="btnBuzzerBike" style="width: 100%;">
          <i data-lucide="bell-ring"></i> Bunyikan Alarm Buzzer Sepeda
        </button>
      ` : `
        <button class="btn ${isEngineOn ? 'btn-danger' : 'btn-primary'} btn-sm" id="btnToggleEngine" style="width: 100%;">
          <i data-lucide="power"></i> ${isEngineOn ? 'Remote Engine Kill (Matikan Mesin)' : 'Nyalakan Mesin Kembali'}
        </button>
      `}
    </div>
  `;

  initIcons();

  // Engine Kill action for Mobil/Motor
  hud.querySelector('#btnToggleEngine')?.addEventListener('click', () => {
    const res = store.toggleEngineKill(unit.id);
    const updated = store.getUnitById(unit.id);
    renderHud(updated);
    updateSidebarTelemetry(updated);

    showDialogAlert({
      title: res.isEngineOn ? 'Mesin Dinyalakan' : 'Remote Engine Kill Aktif',
      message: `Perintah telemetri terkirim ke unit ${updated.modelName} (${updated.plateNumber}). Status mesin saat ini: ${updated.currentLocation.engineStatus}.`,
      type: res.isEngineOn ? 'success' : 'warning'
    });
  });

  // Smart Lock action for Sepeda
  hud.querySelector('#btnToggleSmartLock')?.addEventListener('click', () => {
    const res = store.toggleEngineKill(unit.id);
    const updated = store.getUnitById(unit.id);
    renderHud(updated);
    updateSidebarTelemetry(updated);

    showDialogAlert({
      title: res.isLocked ? 'Gembok Roda Digital Dikunci' : 'Gembok Roda Dibuka',
      message: `IoT Smart Lock pada ${updated.modelName} (${updated.plateNumber}) berhasil di-${res.isLocked ? 'kunci demi keamanan' : 'buka untuk berkendara'}.`,
      type: res.isLocked ? 'warning' : 'success'
    });
  });

  // Buzzer action for Sepeda
  hud.querySelector('#btnBuzzerBike')?.addEventListener('click', () => {
    showDialogAlert({
      title: 'Buzzer Sepeda Berbunyi',
      message: `Sinyal buzzer audio 85dB dikirim ke modul GPS tracker pada ${unit.modelName} (${unit.plateNumber}) untuk mempermudah pencarian lokasi fisik sepeda di area parkir.`,
      type: 'info'
    });
  });
}

function updateSidebarTelemetry(unit) {
  const card = document.querySelector(`.gps-vehicle-card[data-unit-id="${unit.id}"]`);
  if (!card) return;

  const loc = unit.currentLocation;
  const isBicycle = unit.category === 'Sepeda';

  const speedEl = card.querySelector('.telemetry-val.text-cyan');
  if (speedEl) speedEl.textContent = `${loc.speedKmh} km/h`;

  const badge = card.querySelector('.gps-vehicle-title .badge:last-child');
  if (badge) {
    if (isBicycle) {
      const isLocked = loc.engineStatus.includes('Terkunci');
      const isGowes = loc.speedKmh > 0 || loc.engineStatus.includes('Gowes') || loc.engineStatus.includes('Motor Listrik');
      if (isLocked) {
        badge.className = 'badge badge-rose';
        badge.innerHTML = '<i data-lucide="lock" style="width: 10px;"></i> Smart Lock Terkunci';
      } else if (isGowes) {
        badge.className = 'badge badge-emerald';
        badge.innerHTML = `<i data-lucide="activity" style="width: 10px;"></i> ${loc.engineStatus.includes('E-Bike') ? 'Motor Assist' : 'Gowes Aktif'}`;
      } else {
        badge.className = 'badge badge-slate';
        badge.innerHTML = '<i data-lucide="pause-circle" style="width: 10px;"></i> Standby Parkir';
      }
    } else {
      badge.className = `badge ${loc.engineStatus === 'ON' ? 'badge-emerald' : 'badge-slate'}`;
      badge.innerHTML = `<i data-lucide="power" style="width: 10px;"></i> Mesin ${loc.engineStatus}`;
    }
    initIcons();
  }
}

function startTelemetrySimulation() {
  if (telemetryInterval) clearInterval(telemetryInterval);

  telemetryInterval = setInterval(() => {
    const units = store.getUnits().filter(u => {
      if (!u.currentLocation) return false;
      const status = u.currentLocation.engineStatus || '';
      return status === 'ON' || status.includes('Gowes') || status.includes('Motor Listrik') || u.currentLocation.speedKmh > 0;
    });

    units.forEach(u => {
      const isBicycle = u.category === 'Sepeda';
      const isMotor = u.category === 'Motor';

      // Realistic speed and delta movement based on category
      let deltaLat = 0;
      let deltaLng = 0;
      let newSpeed = 0;

      if (isBicycle) {
        deltaLat = (Math.random() - 0.49) * 0.0003;
        deltaLng = (Math.random() - 0.49) * 0.0003;
        newSpeed = Math.floor(14 + Math.random() * 8);
      } else if (isMotor) {
        deltaLat = (Math.random() - 0.48) * 0.0007;
        deltaLng = (Math.random() - 0.48) * 0.0007;
        newSpeed = Math.floor(32 + Math.random() * 18);
      } else {
        deltaLat = (Math.random() - 0.48) * 0.0008;
        deltaLng = (Math.random() - 0.48) * 0.0008;
        newSpeed = Math.floor(38 + Math.random() * 24);
      }

      const newLat = u.currentLocation.lat + deltaLat;
      const newLng = u.currentLocation.lng + deltaLng;

      store.updateGpsTelemetry(u.id, {
        lat: newLat,
        lng: newLng,
        speedKmh: newSpeed,
        odometerKm: u.odometerKm + (isBicycle ? 0.01 : 0.05)
      });

      // Update Leaflet marker position smoothly
      if (markersMap[u.id]) {
        markersMap[u.id].setLatLng([newLat, newLng]);
      }

      // If this unit is selected, update HUD live
      if (selectedVehicleId === u.id) {
        const updated = store.getUnitById(u.id);
        renderHud(updated);
      }

      updateSidebarTelemetry(store.getUnitById(u.id));
    });
  }, 3500);
}
