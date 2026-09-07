// Real-Time GPS Tracking & Fleet Telemetry Module (Open Question #4)
import L from 'leaflet';
import { store } from '../data/store.js';
import { initIcons } from '../utils/icons.js';

let mapInstance = null;
let markersMap = {};
let geofenceCircle = null;
let telemetryInterval = null;
let selectedVehicleId = null;

export function renderGpsTracking(container) {
  const branch = store.getBranch();
  const units = store.getUnits().filter(u => u.currentLocation); // cars and bikes with GPS

  container.innerHTML = `
    <div class="gps-tracking-view">
      <div class="flex-between mb-4">
        <div>
          <h2><i data-lucide="compass" class="text-cyan"></i> GPS Tracking Armada Real-Time</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            Monitoring posisi, kecepatan, kontak mesin, dan geofencing perimeter untuk armada Motor & Mobil.
          </p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
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
            <span style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
              ARMADA TERPASANG GPS (${units.length})
            </span>
          </div>

          <div class="gps-list" id="gpsUnitsList">
            ${units.map(u => {
              const loc = u.currentLocation;
              const isMoving = loc.speedKmh > 0;
              const isSelected = selectedVehicleId === u.id || (!selectedVehicleId && u.id === 'U-01');

              return `
                <div class="gps-vehicle-card ${isSelected ? 'active' : ''}" data-unit-id="${u.id}">
                  <div class="gps-vehicle-title">
                    <span class="gps-plate">${u.plateNumber}</span>
                    <span class="badge ${loc.engineStatus === 'ON' ? 'badge-emerald' : 'badge-slate'}">
                      <i data-lucide="power" style="width: 10px;"></i> Mesin ${loc.engineStatus}
                    </span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-secondary);">${u.modelName}</div>

                  <div class="gps-telemetry-row">
                    <div>
                      <div>Kecepatan</div>
                      <div class="telemetry-val text-cyan">${loc.speedKmh} km/h</div>
                    </div>
                    <div>
                      <div>BBM / Baterai</div>
                      <div class="telemetry-val text-amber">${u.fuelLevelPercent}%</div>
                    </div>
                    <div>
                      <div>Odo</div>
                      <div class="telemetry-val">${(u.odometerKm / 1000).toFixed(1)}k KM</div>
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
            }).join('')}
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
    initLeafletMap(branch, units);
  }, 100);

  // Bind unit selection
  container.querySelectorAll('.gps-vehicle-card').forEach(card => {
    card.addEventListener('click', () => {
      const uId = card.dataset.unitId;
      selectVehicle(uId);
    });
  });

  container.querySelector('#btnRecenterHub')?.addEventListener('click', () => {
    if (mapInstance && branch) {
      mapInstance.flyTo([branch.geofence.lat, branch.geofence.lng], 12);
    }
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

  // Centered on Bali Central Hub
  const centerLat = branch?.geofence?.lat || -8.6852;
  const centerLng = branch?.geofence?.lng || 115.2476;

  mapInstance = L.map('gpsMap', {
    center: [centerLat, centerLng],
    zoom: 12,
    zoomControl: true
  });

  // CartoDB Dark Matter Tiles for ultra-modern aesthetic
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(mapInstance);

  // Draw Geofence Radius
  if (branch?.geofence) {
    geofenceCircle = L.circle([branch.geofence.lat, branch.geofence.lng], {
      color: '#06b6d4',
      fillColor: '#06b6d4',
      fillOpacity: 0.06,
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
        <span style="font-weight: 800; font-size: 14px;">HQ</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  L.marker([centerLat, centerLng], { icon: hubIcon })
    .bindPopup(`<b>RentalKu Central Hub</b><br>${branch.address}`)
    .addTo(mapInstance);

  // Add Vehicle Markers
  units.forEach(u => {
    const loc = u.currentLocation;
    const isCar = u.category === 'Mobil';

    const customIcon = L.divIcon({
      className: 'vehicle-marker-wrapper',
      html: `
        <div class="${isCar ? 'custom-car-marker' : 'custom-bike-marker'}" id="marker-${u.id}">
          <div class="marker-pulse"></div>
          <span style="font-size: 11px; font-weight: 800; font-family: 'JetBrains Mono';">${u.plateNumber.split(' ')[1] || 'RK'}</span>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(mapInstance);
    marker.on('click', () => {
      selectVehicle(u.id);
    });

    markersMap[u.id] = marker;
  });

  // Select first unit by default
  const defaultUnit = units[0];
  if (defaultUnit) {
    selectVehicle(defaultUnit.id);
  }

  // Start Real-Time Simulation Interval (Every 3.5 seconds)
  startTelemetrySimulation();
}

function selectVehicle(unitId) {
  selectedVehicleId = unitId;
  const unit = store.getUnitById(unitId);
  if (!unit || !unit.currentLocation) return;

  // Highlight card
  document.querySelectorAll('.gps-vehicle-card').forEach(c => {
    c.classList.toggle('active', c.dataset.unitId === unitId);
  });

  // Pan map
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
  const isEngineOn = loc.engineStatus === 'ON';

  hud.innerHTML = `
    <div class="hud-title">
      <span>TELEMETRI KENDARAAN</span>
      <span class="font-mono font-bold text-cyan">${unit.plateNumber}</span>
    </div>

    <div style="font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 8px;">
      ${unit.modelName}
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.78rem;">
      <div class="flex-between">
        <span class="text-muted">Kontak Mesin</span>
        <span class="badge ${isEngineOn ? 'badge-emerald' : 'badge-rose'} font-bold">
          ${isEngineOn ? 'ENGINE RUNNING' : 'ENGINE CUT-OFF'}
        </span>
      </div>

      <div class="flex-between">
        <span class="text-muted">Kecepatan Saat Ini</span>
        <span class="font-mono font-bold text-cyan" style="font-size: 1.1rem;">${loc.speedKmh} km/h</span>
      </div>

      <div class="flex-between">
        <span class="text-muted">Koordinat GPS</span>
        <span class="font-mono" style="font-size: 0.72rem;">${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</span>
      </div>

      <div class="flex-between">
        <span class="text-muted">Status Geofence</span>
        <span class="${loc.isOutOfBounds ? 'badge badge-rose' : 'badge badge-emerald'}">
          ${loc.isOutOfBounds ? '⚠️ DILUAR ZONA' : '✓ ZONA AMAN'}
        </span>
      </div>
    </div>

    <div class="hud-actions">
      <button class="btn ${isEngineOn ? 'btn-danger' : 'btn-primary'} btn-sm" id="btnToggleEngine" style="width: 100%;">
        <i data-lucide="power"></i> ${isEngineOn ? 'Remote Engine Kill (Matikan Mesin)' : 'Nyalakan Mesin Kembali'}
      </button>
    </div>
  `;

  initIcons();

  hud.querySelector('#btnToggleEngine')?.addEventListener('click', () => {
    store.toggleEngineKill(unit.id);
    const updated = store.getUnitById(unit.id);
    renderHud(updated);
    updateSidebarTelemetry(updated);
  });
}

function updateSidebarTelemetry(unit) {
  const card = document.querySelector(`.gps-vehicle-card[data-unit-id="${unit.id}"]`);
  if (!card) return;

  const loc = unit.currentLocation;
  const speedEl = card.querySelector('.telemetry-val.text-cyan');
  if (speedEl) speedEl.textContent = `${loc.speedKmh} km/h`;

  const badge = card.querySelector('.badge');
  if (badge) {
    badge.className = `badge ${loc.engineStatus === 'ON' ? 'badge-emerald' : 'badge-slate'}`;
    badge.innerHTML = `<i data-lucide="power" style="width: 10px;"></i> Mesin ${loc.engineStatus}`;
    initIcons();
  }
}

function startTelemetrySimulation() {
  if (telemetryInterval) clearInterval(telemetryInterval);

  telemetryInterval = setInterval(() => {
    const units = store.getUnits().filter(u => u.currentLocation && u.currentLocation.engineStatus === 'ON');
    units.forEach(u => {
      // Small delta movement
      const deltaLat = (Math.random() - 0.48) * 0.0008;
      const deltaLng = (Math.random() - 0.48) * 0.0008;
      const newLat = u.currentLocation.lat + deltaLat;
      const newLng = u.currentLocation.lng + deltaLng;
      const newSpeed = Math.floor(28 + Math.random() * 25);

      store.updateGpsTelemetry(u.id, {
        lat: newLat,
        lng: newLng,
        speedKmh: newSpeed,
        odometerKm: u.odometerKm + 0.05
      });

      // Update Leaflet marker position smoothly
      if (markersMap[u.id]) {
        markersMap[u.id].setLatLng([newLat, newLng]);
      }

      // If this unit is selected, update HUD
      if (selectedVehicleId === u.id) {
        const updated = store.getUnitById(u.id);
        renderHud(updated);
      }

      updateSidebarTelemetry(store.getUnitById(u.id));
    });
  }, 3500);
}
