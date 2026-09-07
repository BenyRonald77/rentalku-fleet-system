// Fleet Management Module: Catalog & Physical Units (Expanded Multi-Variant Edition)
import { store } from '../data/store.js';
import { formatRupiah } from '../utils/formatters.js';
import { initIcons } from '../utils/icons.js';

export function renderFleet(container, { onOpenNewBooking }) {
  const catalog = store.getCatalog();
  const units = store.getUnits();
  let currentCatFilter = 'ALL';

  function renderView() {
    const filteredCatalog = currentCatFilter === 'ALL'
      ? catalog
      : catalog.filter(c => c.category === currentCatFilter);

    const carCount = catalog.filter(c => c.category === 'Mobil').length;
    const bikeCount = catalog.filter(c => c.category === 'Motor').length;
    const cycleCount = catalog.filter(c => c.category === 'Sepeda').length;

    container.innerHTML = `
      <div class="fleet-view">
        <div class="flex-between mb-6">
          <div>
            <h2><i data-lucide="car"></i> Manajemen Armada (${catalog.length} Model • ${units.length} Unit Fisik)</h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              Kelola aneka ragam Mobil, Motor, dan Sepeda serta nomor plat individual di garasi pusat.
            </p>
          </div>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-primary" id="btnAddNewUnitModal">
              <i data-lucide="plus"></i> Tambah Unit Fisik Baru
            </button>
          </div>
        </div>

        <!-- Tabs: Catalog vs Physical Units -->
        <div class="tabs-header">
          <button class="tab-button active" data-tab="catalog">
            <i data-lucide="layers"></i> Model Katalog (${catalog.length} Variasi)
          </button>
          <button class="tab-button" data-tab="units">
            <i data-lucide="car"></i> Unit Fisik / Plat Nomor (${units.length} Unit)
          </button>
        </div>

        <!-- Tab Content 1: Catalog -->
        <div id="tabCatalogContent" class="tab-pane">
          <!-- Filter Buttons by Category -->
          <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
            <button class="btn btn-sm ${currentCatFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'} fleet-filter-btn" data-cat="ALL">
              Semua (${catalog.length})
            </button>
            <button class="btn btn-sm ${currentCatFilter === 'Mobil' ? 'btn-primary' : 'btn-secondary'} fleet-filter-btn" data-cat="Mobil">
              <i data-lucide="car"></i> Mobil (${carCount} Model)
            </button>
            <button class="btn btn-sm ${currentCatFilter === 'Motor' ? 'btn-primary' : 'btn-secondary'} fleet-filter-btn" data-cat="Motor">
              <i data-lucide="bike"></i> Motor (${bikeCount} Model)
            </button>
            <button class="btn btn-sm ${currentCatFilter === 'Sepeda' ? 'btn-primary' : 'btn-secondary'} fleet-filter-btn" data-cat="Sepeda">
              <i data-lucide="activity"></i> Sepeda (${cycleCount} Model)
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;">
            ${filteredCatalog.map(cat => {
              const readyCount = units.filter(u => u.catalogId === cat.id && u.status === 'Tersedia').length;
              const totalCount = units.filter(u => u.catalogId === cat.id).length;

              return `
                <div class="fleet-card">
                  <div class="fleet-image-wrap">
                    <img src="${cat.image}" alt="${cat.name}" class="fleet-img" onerror="this.src='/images/car_avanza.jpg'">
                    <div class="fleet-rate-badge">
                      ${cat.pricingType === 'jam' ? `${formatRupiah(cat.hourlyRate)} / Jam` : `${formatRupiah(cat.dailyRate)} / Hari`}
                    </div>
                  </div>
                  <div class="fleet-details">
                    <div class="flex-between">
                      <span class="badge ${cat.category === 'Mobil' ? 'badge-cyan' : cat.category === 'Motor' ? 'badge-emerald' : 'badge-indigo'}">
                        ${cat.category} • ${cat.subCategory}
                      </span>
                      <span class="badge ${readyCount > 0 ? 'badge-emerald' : 'badge-amber'}">
                        ${readyCount} / ${totalCount} Unit Siap
                      </span>
                    </div>
                    <h3 class="fleet-title mt-2">${cat.name}</h3>
                    <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px; flex: 1;">${cat.description}</p>
                    
                    <div class="fleet-specs">
                      <span class="fleet-spec-pill"><i data-lucide="shield-check" style="width: 12px; vertical-align: middle;"></i> ${cat.licenseRequired}</span>
                      ${cat.features.slice(0, 3).map(f => `<span class="fleet-spec-pill">${f}</span>`).join('')}
                    </div>

                    <div class="flex-between pt-3" style="border-top: 1px solid var(--border-subtle); margin-top: auto;">
                      <div>
                        <span style="font-size: 0.7rem; color: var(--text-muted);">Deposit Default</span>
                        <div class="font-mono font-bold" style="color: var(--accent-amber); font-size: 0.85rem;">
                          ${formatRupiah(cat.depositDefault)}
                        </div>
                      </div>
                      <button class="btn btn-primary btn-sm btn-rent-this" data-cat-id="${cat.id}">
                        <i data-lucide="plus"></i> Sewa Model Ini
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Tab Content 2: Units List -->
        <div id="tabUnitsContent" class="tab-pane hidden">
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title"><i data-lucide="car"></i> Daftar Unit Fisik & Status Kesiapan</h3>
                <p class="card-subtitle">Total ${units.length} unit kendaraan terdaftar dengan plat nomor individual di garasi pusat</p>
              </div>
            </div>
            <div class="table-wrapper">
              <table class="table">
                <thead>
                  <tr>
                    <th>Plat Nomor / Kode</th>
                    <th>Model Kendaraan</th>
                    <th>Kategori</th>
                    <th>Tahun / Warna</th>
                    <th>Odometer (KM)</th>
                    <th>BBM / Kondisi</th>
                    <th>GPS Tracker</th>
                    <th>Status</th>
                    <th>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  ${units.map(u => {
                    let statusBadge = 'badge-emerald';
                    if (u.status === 'Disewa') statusBadge = 'badge-cyan';
                    if (u.status === 'Dalam Servis') statusBadge = 'badge-amber';
                    if (u.status === 'Nonaktif') statusBadge = 'badge-rose';

                    return `
                      <tr>
                        <td>
                          <span class="font-mono font-bold" style="color: #fff; font-size: 0.95rem;">${u.plateNumber}</span>
                          <div style="font-size: 0.7rem; color: var(--text-muted);">${u.engineNumber}</div>
                        </td>
                        <td>
                          <strong style="color: var(--text-primary);">${u.modelName}</strong>
                        </td>
                        <td>
                          <span class="badge ${u.category === 'Mobil' ? 'badge-cyan' : u.category === 'Motor' ? 'badge-emerald' : 'badge-indigo'}">
                            ${u.category}
                          </span>
                        </td>
                        <td>${u.year} • ${u.color}</td>
                        <td>
                          <span class="font-mono font-bold">${u.odometerKm.toLocaleString()} KM</span>
                        </td>
                        <td>
                          <div style="display: flex; align-items: center; gap: 6px;">
                            <i data-lucide="fuel" style="width: 14px; color: var(--accent-amber);"></i>
                            <span class="font-mono font-bold">${u.fuelLevelPercent}%</span>
                          </div>
                          <div style="font-size: 0.7rem; color: var(--text-secondary);">${u.condition}</div>
                        </td>
                        <td>
                          ${u.gpsId ? `
                            <span class="badge badge-cyan font-mono"><i data-lucide="compass" style="width: 12px;"></i> ${u.gpsId}</span>
                          ` : `
                            <span style="font-size: 0.72rem; color: var(--text-muted);">-</span>
                          `}
                        </td>
                        <td>
                          <span class="badge ${statusBadge}">${u.status}</span>
                        </td>
                        <td>
                          <button class="btn btn-secondary btn-sm btn-toggle-status" data-unit-id="${u.id}">
                            Ubah Status
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Tambah Unit Baru (Fixed Layout) -->
      <div id="modalNewUnit" class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-header">
            <h3 style="font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="car"></i> Registrasi Unit Fisik Baru
            </h3>
            <button class="btn btn-secondary btn-sm" id="btnCloseNewUnitModal"><i data-lucide="x"></i></button>
          </div>
          <form id="formNewUnit">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Model dari Katalog</label>
                <select class="form-control form-select" id="newUnitCatalog" required>
                  ${catalog.map(c => `<option value="${c.id}">${c.name} (${c.category})</option>`).join('')}
                </select>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Plat Nomor / Kode Fisik</label>
                  <input type="text" class="form-control font-mono font-bold" id="newUnitPlate" placeholder="Contoh: DK 4421 ZZ" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Nomor Rangka / Seri</label>
                  <input type="text" class="form-control" id="newUnitEngine" placeholder="Nomor Rangka Unit" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Tahun Pembuatan</label>
                  <input type="number" class="form-control" id="newUnitYear" value="2024" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Warna Kendaraan</label>
                  <input type="text" class="form-control" id="newUnitColor" placeholder="Contoh: Hitam Metalik" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Odometer Awal (KM)</label>
                  <input type="number" class="form-control font-mono" id="newUnitOdo" value="1500" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Level Bahan Bakar (%)</label>
                  <input type="number" class="form-control font-mono" id="newUnitFuel" value="100" min="10" max="100" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">ID GPS Tracker (Opsional)</label>
                <input type="text" class="form-control font-mono" id="newUnitGps" placeholder="Contoh: GPS-NEW-01">
              </div>
            </div>
            <div class="modal-footer" style="justify-content: flex-end;">
              <button type="button" class="btn btn-secondary" id="btnCancelNewUnit">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan Unit Armada</button>
            </div>
          </form>
        </div>
      </div>
    `;

    initIcons();

    // Tab switching
    const tabBtns = container.querySelectorAll('.tab-button');
    const tabCatalog = container.querySelector('#tabCatalogContent');
    const tabUnits = container.querySelector('#tabUnitsContent');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        if (tab === 'catalog') {
          tabCatalog.classList.remove('hidden');
          tabUnits.classList.add('hidden');
        } else {
          tabUnits.classList.remove('hidden');
          tabCatalog.classList.add('hidden');
        }
      });
    });

    // Category filter pills
    container.querySelectorAll('.fleet-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCatFilter = btn.dataset.cat;
        renderView();
      });
    });

    // Modal logic
    const modal = container.querySelector('#modalNewUnit');
    container.querySelector('#btnAddNewUnitModal')?.addEventListener('click', () => {
      modal.classList.add('open');
    });
    container.querySelector('#btnCloseNewUnitModal')?.addEventListener('click', () => {
      modal.classList.remove('open');
    });
    container.querySelector('#btnCancelNewUnit')?.addEventListener('click', () => {
      modal.classList.remove('open');
    });

    container.querySelector('#formNewUnit')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const catId = container.querySelector('#newUnitCatalog').value;
      const cat = catalog.find(c => c.id === catId);
      const newUnit = {
        id: `U-${String(units.length + 1).padStart(2, '0')}`,
        catalogId: catId,
        plateNumber: container.querySelector('#newUnitPlate').value.trim().toUpperCase(),
        engineNumber: container.querySelector('#newUnitEngine').value.trim(),
        modelName: cat ? cat.name : 'Kendaraan Baru',
        category: cat ? cat.category : 'Mobil',
        year: parseInt(container.querySelector('#newUnitYear').value) || 2024,
        color: container.querySelector('#newUnitColor').value.trim(),
        condition: 'Sangat Baik',
        status: 'Tersedia',
        odometerKm: parseInt(container.querySelector('#newUnitOdo').value) || 0,
        fuelLevelPercent: parseInt(container.querySelector('#newUnitFuel').value) || 100,
        gpsId: container.querySelector('#newUnitGps').value.trim() || 
          (cat && cat.category === 'Sepeda' ? `GPS-BYC-${units.length + 1}` : cat && cat.category === 'Motor' ? `GPS-MTR-${units.length + 1}` : `GPS-CAR-${units.length + 1}`),
        currentLocation: {
          lat: -8.6852,
          lng: 115.2476,
          speedKmh: 0,
          heading: 0,
          engineStatus: cat && cat.category === 'Sepeda' ? 'Standby / Parkir' : 'OFF',
          isOutOfBounds: false,
          lastUpdate: new Date().toISOString()
        }
      };

      const currentUnits = store.getUnits();
      currentUnits.push(newUnit);
      localStorage.setItem('rentalku_units', JSON.stringify(currentUnits));
      modal.classList.remove('open');
      renderFleet(container, { onOpenNewBooking });
    });

    // Rent model triggers booking modal
    container.querySelectorAll('.btn-rent-this').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.catId;
        onOpenNewBooking(catId);
      });
    });

    // Toggle status quick action
    container.querySelectorAll('.btn-toggle-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const uId = btn.dataset.unitId;
        const unit = store.getUnitById(uId);
        if (unit) {
          const nextStatus = unit.status === 'Tersedia' ? 'Dalam Servis' : 'Tersedia';
          store.updateUnit(uId, { status: nextStatus });
          renderFleet(container, { onOpenNewBooking });
        }
      });
    });
  }

  renderView();
}
