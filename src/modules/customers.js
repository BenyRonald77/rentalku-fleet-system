// Customers Master Data Module
import { store } from '../data/store.js';
import { initIcons } from '../utils/icons.js';

export function renderCustomers(container) {
  const customers = store.getCustomers();

  container.innerHTML = `
    <div class="customers-view">
      <div class="flex-between mb-6">
        <div>
          <h2><i data-lucide="users"></i> Data Master Penyewa (Customers)</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            Verifikasi identitas KTP dan SIM untuk kepatuhan hukum sistem sewa lepas kunci.
          </p>
        </div>
        <button class="btn btn-primary" id="btnAddNewCustomer">
          <i data-lucide="plus"></i> Registrasi Penyewa Baru
        </button>
      </div>

      <div class="card">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Nama Pelanggan</th>
                <th>Kontak & Email</th>
                <th>Verifikasi KTP (NIK)</th>
                <th>Lisensi Mengemudi (SIM)</th>
                <th>Total Sewa</th>
                <th>Alamat & Domisili</th>
                <th>Catatan Reputasi</th>
              </tr>
            </thead>
            <tbody>
              ${customers.map(c => `
                <tr>
                  <td>
                    <strong style="color: #fff; font-size: 0.95rem;">${c.name}</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">ID: ${c.id}</div>
                  </td>
                  <td>
                    <div style="color: var(--text-primary);">${c.phone}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${c.email}</div>
                  </td>
                  <td>
                    ${c.ktpVerified ? `
                      <span class="badge badge-emerald font-mono"><i data-lucide="check" style="width: 12px;"></i> KTP Valid</span>
                      <div class="font-mono" style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">${c.nik}</div>
                    ` : `
                      <span class="badge badge-amber">Belum Verifikasi</span>
                    `}
                  </td>
                  <td>
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                      ${c.simAVerified ? `<span class="badge badge-cyan font-mono">SIM A Valid</span>` : ''}
                      ${c.simCVerified ? `<span class="badge badge-emerald font-mono">SIM C Valid</span>` : ''}
                      ${!c.simAVerified && !c.simCVerified ? `<span class="badge badge-slate">Hanya Sepeda</span>` : ''}
                    </div>
                  </td>
                  <td>
                    <span class="font-mono font-bold" style="color: #fff;">${c.rentalCount}x Sewa</span>
                    <div style="font-size: 0.72rem; color: #fbbf24;">★ ${c.rating} / 5.0</div>
                  </td>
                  <td>
                    <div style="font-size: 0.8rem; max-width: 220px; white-space: normal;">${c.address}</div>
                  </td>
                  <td>
                    <div style="font-size: 0.76rem; color: var(--text-secondary); max-width: 200px; white-space: normal;">
                      ${c.notes}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Registrasi Penyewa Baru -->
    <div id="modalNewCust" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h3 style="font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="users"></i> Registrasi Penyewa Baru
          </h3>
          <button class="btn btn-secondary btn-sm" id="btnCloseCustModal"><i data-lucide="x"></i></button>
        </div>
        <form id="formNewCust">
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nama Lengkap Sesuai KTP</label>
                <input type="text" class="form-control" id="custName" required placeholder="Contoh: Rian Hidayat">
              </div>
              <div class="form-group">
                <label class="form-label">Nomor WhatsApp / HP</label>
                <input type="tel" class="form-control" id="custPhone" required placeholder="08123456789">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Alamat Email</label>
                <input type="email" class="form-control" id="custEmail" required placeholder="email@domain.com">
              </div>
              <div class="form-group">
                <label class="form-label">Nomor NIK KTP</label>
                <input type="text" class="form-control font-mono" id="custNik" required placeholder="16 Digit NIK KTP">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nomor SIM A (Mobil)</label>
                <input type="text" class="form-control font-mono" id="custSimA" placeholder="Nomor SIM A (Kosongkan jika tidak punya)">
              </div>
              <div class="form-group">
                <label class="form-label">Nomor SIM C (Motor)</label>
                <input type="text" class="form-control font-mono" id="custSimC" placeholder="Nomor SIM C (Kosongkan jika tidak punya)">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Alamat Lengkap Domisili</label>
              <textarea class="form-control" id="custAddress" rows="2" required placeholder="Alamat lengkap"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btnCancelCust">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Data Penyewa</button>
          </div>
        </form>
      </div>
    </div>
  `;

  initIcons();

  const modal = container.querySelector('#modalNewCust');
  container.querySelector('#btnAddNewCustomer')?.addEventListener('click', () => modal.classList.add('open'));
  container.querySelector('#btnCloseCustModal')?.addEventListener('click', () => modal.classList.remove('open'));
  container.querySelector('#btnCancelCust')?.addEventListener('click', () => modal.classList.remove('open'));

  container.querySelector('#formNewCust')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const simA = container.querySelector('#custSimA').value.trim();
    const simC = container.querySelector('#custSimC').value.trim();

    store.createCustomer({
      name: container.querySelector('#custName').value.trim(),
      phone: container.querySelector('#custPhone').value.trim(),
      email: container.querySelector('#custEmail').value.trim(),
      nik: container.querySelector('#custNik').value.trim(),
      ktpVerified: true,
      simA: simA || null,
      simAVerified: Boolean(simA),
      simC: simC || null,
      simCVerified: Boolean(simC),
      address: container.querySelector('#custAddress').value.trim(),
      notes: 'Penyewa baru diverifikasi oleh staf operasional'
    });

    modal.classList.remove('open');
    renderCustomers(container);
  });
}
