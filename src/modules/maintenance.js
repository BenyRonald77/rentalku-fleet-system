// Maintenance & Insurance Claims Module (Open Question #5)
import { store } from '../data/store.js';
import { formatRupiah, formatDate } from '../utils/formatters.js';
import { initIcons } from '../utils/icons.js';

export function renderMaintenance(container) {
  const services = store.getServices();
  const claims = store.getDamageClaims();
  const units = store.getUnits();

  container.innerHTML = `
    <div class="maintenance-view">
      <div class="flex-between mb-6">
        <div>
          <h2><i data-lucide="wrench"></i> Perawatan Armada & Klaim Asuransi</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            Jadwal servis berkala dan proteksi klaim asuransi terpadu untuk mencegah kerugian armada.
          </p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btnNewServiceModal">
            <i data-lucide="plus"></i> Jadwalkan Servis
          </button>
          <button class="btn btn-danger" id="btnNewClaimModal">
            <i data-lucide="alert-triangle"></i> Catat Insiden Kerusakan
          </button>
        </div>
      </div>

      <!-- Tabs Header -->
      <div class="tabs-header">
        <button class="tab-button active" data-maint-tab="services">
          <i data-lucide="wrench"></i> Jadwal Servis Berkala (${services.length})
        </button>
        <button class="tab-button" data-maint-tab="claims">
          <i data-lucide="shield-check"></i> Klaim Kerusakan & Asuransi (${claims.length})
        </button>
      </div>

      <!-- Tab 1: Services Schedule -->
      <div id="tabServicesPane" class="tab-pane">
        <div class="card">
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Unit Kendaraan (Plat)</th>
                  <th>Jenis Servis & Perawatan</th>
                  <th>Tanggal Terjadwal</th>
                  <th>Target Odometer</th>
                  <th>Odometer Saat Ini</th>
                  <th>Estimasi Biaya</th>
                  <th>Bengkel / Vendor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${services.map(s => `
                  <tr>
                    <td>
                      <span class="font-mono font-bold" style="color: #fff;">${s.plateNumber}</span>
                      <div style="font-size: 0.72rem; color: var(--text-secondary);">${s.modelName}</div>
                    </td>
                    <td>
                      <strong style="color: var(--text-primary);">${s.serviceType}</strong>
                    </td>
                    <td>${formatDate(s.scheduledDate)}</td>
                    <td><span class="font-mono font-bold">${s.targetKm.toLocaleString()} KM</span></td>
                    <td><span class="font-mono">${s.currentKm.toLocaleString()} KM</span></td>
                    <td><span class="font-mono text-emerald">${formatRupiah(s.costEstimate)}</span></td>
                    <td>${s.vendor}</td>
                    <td>
                      <span class="badge ${s.status === 'Selesai' ? 'badge-emerald' : 'badge-amber'}">
                        ${s.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab 2: Damage & Insurance Claims -->
      <div id="tabClaimsPane" class="tab-pane hidden">
        <div class="card">
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>ID Klaim</th>
                  <th>Unit Kendaraan (Plat)</th>
                  <th>Tanggal Insiden</th>
                  <th>Deskripsi Kerusakan</th>
                  <th>Estimasi Bengkel</th>
                  <th>Tanggungan Asuransi</th>
                  <th>Potongan Deposit Pelanggan</th>
                  <th>Status Klaim</th>
                </tr>
              </thead>
              <tbody>
                ${claims.map(c => `
                  <tr>
                    <td><span class="font-mono font-bold" style="color: var(--accent-rose);">${c.id}</span></td>
                    <td>
                      <span class="font-mono font-bold" style="color: #fff;">${c.plateNumber}</span>
                      <div style="font-size: 0.72rem; color: var(--text-muted);">${c.modelName}</div>
                    </td>
                    <td>${formatDate(c.incidentDate)}</td>
                    <td>
                      <div style="font-size: 0.8rem; color: var(--text-primary); max-width: 250px; white-space: normal;">
                        ${c.description}
                      </div>
                    </td>
                    <td><span class="font-mono font-bold">${formatRupiah(c.repairCost)}</span></td>
                    <td><span class="font-mono text-cyan font-bold">${formatRupiah(c.insuranceCoverage)}</span></td>
                    <td><span class="font-mono text-amber font-bold">${formatRupiah(c.customerDeduction)}</span></td>
                    <td>
                      <span class="badge ${c.claimApproved ? 'badge-emerald' : 'badge-amber'}">
                        ${c.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Jadwal Servis Baru -->
    <div id="modalNewService" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h3 style="font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="wrench"></i> Jadwalkan Servis Armada
          </h3>
          <button class="btn btn-secondary btn-sm" id="btnCloseSrvModal"><i data-lucide="x"></i></button>
        </div>
        <form id="formNewService">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Pilih Unit Kendaraan</label>
              <select class="form-control form-select" id="srvUnitSelect" required>
                ${units.map(u => `
                  <option value="${u.id}">${u.plateNumber} — ${u.modelName} (Odo: ${u.odometerKm} KM)</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Jenis Servis & Perawatan</label>
              <input type="text" class="form-control" id="srvType" required placeholder="Contoh: Ganti Oli Mesin & Transmisi">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Tanggal Terjadwal</label>
                <input type="date" class="form-control" id="srvDate" required>
              </div>
              <div class="form-group">
                <label class="form-label">Estimasi Biaya (Rp)</label>
                <input type="number" class="form-control font-mono" id="srvCost" value="350000" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Bengkel Rekanan / Vendor</label>
              <input type="text" class="form-control" id="srvVendor" value="Auto2000 Sanur / Yamaha Surya Motor" required>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btnCancelSrv">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Jadwal Servis</button>
          </div>
        </form>
      </div>
    </div>
  `;

  initIcons();

  // Tab switching
  const tabBtns = container.querySelectorAll('.tab-button');
  const tabServices = container.querySelector('#tabServicesPane');
  const tabClaims = container.querySelector('#tabClaimsPane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.maintTab;
      tabServices.classList.toggle('hidden', tab !== 'services');
      tabClaims.classList.toggle('hidden', tab !== 'claims');
    });
  });

  // Modal logic
  const srvModal = container.querySelector('#modalNewService');
  container.querySelector('#btnNewServiceModal')?.addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = container.querySelector('#srvDate');
    if (dateInput) dateInput.value = today;
    srvModal.classList.add('open');
  });

  container.querySelector('#btnCloseSrvModal')?.addEventListener('click', () => srvModal.classList.remove('open'));
  container.querySelector('#btnCancelSrv')?.addEventListener('click', () => srvModal.classList.remove('open'));

  container.querySelector('#formNewService')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const uId = container.querySelector('#srvUnitSelect').value;
    const unit = store.getUnitById(uId);

    store.createService({
      unitId: unit.id,
      plateNumber: unit.plateNumber,
      modelName: unit.modelName,
      serviceType: container.querySelector('#srvType').value.trim(),
      scheduledDate: container.querySelector('#srvDate').value,
      targetKm: unit.odometerKm + 3000,
      currentKm: unit.odometerKm,
      costEstimate: parseInt(container.querySelector('#srvCost').value) || 350000,
      vendor: container.querySelector('#srvVendor').value.trim()
    });

    srvModal.classList.remove('open');
    renderMaintenance(container);
  });
}
