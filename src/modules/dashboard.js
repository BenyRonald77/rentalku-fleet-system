// Dashboard Module for RentalKu Back-Office
import { store } from '../data/store.js';
import { formatRupiah, formatDateTime } from '../utils/formatters.js';
import { initIcons } from '../utils/icons.js';

export function renderDashboard(container, { onOpenNewBooking, onNavigate }) {
  const units = store.getUnits();
  const bookings = store.getBookings();
  const lockers = store.getVaultLockers();
  const services = store.getServices();

  const availableUnits = units.filter(u => u.status === 'Tersedia').length;
  const activeBookings = bookings.filter(b => b.bookingStatus === 'Berlangsung');
  const occupiedLockers = lockers.filter(l => l.status === 'Occupied').length;
  
  // Calculate total revenue from current bookings
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.rentalTotal || 0), 0);

  // Utilization per category
  const carUnits = units.filter(u => u.category === 'Mobil');
  const carRented = carUnits.filter(u => u.status === 'Disewa').length;
  const carUtilPercent = carUnits.length ? Math.round((carRented / carUnits.length) * 100) : 0;

  const bikeUnits = units.filter(u => u.category === 'Motor');
  const bikeRented = bikeUnits.filter(u => u.status === 'Disewa').length;
  const bikeUtilPercent = bikeUnits.length ? Math.round((bikeRented / bikeUnits.length) * 100) : 0;

  const cycleUnits = units.filter(u => u.category === 'Sepeda');
  const cycleRented = cycleUnits.filter(u => u.status === 'Disewa').length;
  const cycleUtilPercent = cycleUnits.length ? Math.round((cycleRented / cycleUnits.length) * 100) : 0;

  container.innerHTML = `
    <div class="dashboard-view">
      <!-- Quick Action Buttons Bar -->
      <div class="quick-actions-bar">
        <span class="quick-actions-title">Aksi Cepat Operasional:</span>
        <button class="btn btn-primary btn-sm" id="btnDashNewBooking">
          <i data-lucide="plus"></i> Buat Booking Baru
        </button>
        <button class="btn btn-secondary btn-sm" id="btnDashGps">
          <i data-lucide="compass"></i> Pantau GPS Live Armada
        </button>
        <button class="btn btn-secondary btn-sm" id="btnDashHandover">
          <i data-lucide="file-check-2"></i> Inspeksi Serah Terima
        </button>
        <button class="btn btn-secondary btn-sm" id="btnDashVault">
          <i data-lucide="lock"></i> Brankas Jaminan KTP/SIM (${occupiedLockers} Ditahan)
        </button>
      </div>

      <!-- KPI Summary Cards -->
      <div class="kpi-grid">
        <div class="kpi-card emerald">
          <div class="kpi-info">
            <h4>Unit Siap Disewa</h4>
            <div class="kpi-value">${availableUnits} <span style="font-size: 1rem; color: var(--text-muted); font-weight: 500;">/ ${units.length} Unit</span></div>
            <div class="kpi-subtext"><i data-lucide="check-circle-2" style="width: 14px;"></i> Siap pakai di garasi utama</div>
          </div>
          <div class="kpi-icon emerald">
            <i data-lucide="car"></i>
          </div>
        </div>

        <div class="kpi-card cyan">
          <div class="kpi-info">
            <h4>Sewa Berlangsung</h4>
            <div class="kpi-value">${activeBookings.length}</div>
            <div class="kpi-subtext"><i data-lucide="activity" style="width: 14px;"></i> Semua sistem lepas kunci</div>
          </div>
          <div class="kpi-icon cyan">
            <i data-lucide="key"></i>
          </div>
        </div>

        <div class="kpi-card emerald">
          <div class="kpi-info">
            <h4>Pendapatan Sewa</h4>
            <div class="kpi-value">${formatRupiah(totalRevenue)}</div>
            <div class="kpi-subtext"><i data-lucide="dollar-sign" style="width: 14px;"></i> Akumulasi booking aktif</div>
          </div>
          <div class="kpi-icon emerald">
            <i data-lucide="credit-card"></i>
          </div>
        </div>

        <div class="kpi-card amber">
          <div class="kpi-info">
            <h4>Jaminan Dokumen Fisik</h4>
            <div class="kpi-value">${occupiedLockers} <span style="font-size: 1rem; color: var(--text-muted); font-weight: 500;">Loker</span></div>
            <div class="kpi-subtext"><i data-lucide="lock" style="width: 14px;"></i> KTP & SIM asli tersimpan aman</div>
          </div>
          <div class="kpi-icon amber">
            <i data-lucide="shield-check"></i>
          </div>
        </div>
      </div>

      <!-- Fleet Utilization Grid & Telemetry Status -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 28px;">
        <!-- Left: Utilization Progress Bars -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title"><i data-lucide="sliders-horizontal"></i> Utilisasi Armada Real-Time</h3>
              <p class="card-subtitle">Tingkat pemakaian unit fisik per kategori kendaraan</p>
            </div>
            <button class="btn btn-secondary btn-sm" id="btnViewCalendar">
              <i data-lucide="calendar"></i> Lihat Jadwal Kalender
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 18px;">
            <!-- Mobil -->
            <div>
              <div class="flex-between mb-1">
                <span style="font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="car" style="width: 16px; color: var(--accent-cyan);"></i> Mobil (Tarif Harian)
                </span>
                <span class="font-mono" style="font-size: 0.85rem; font-weight: 700;">${carRented} / ${carUnits.length} Unit (${carUtilPercent}%)</span>
              </div>
              <div style="height: 8px; background: var(--bg-surface-elevated); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${carUtilPercent}%; background: linear-gradient(90deg, #0284c7, #06b6d4); border-radius: 4px;"></div>
              </div>
            </div>

            <!-- Motor -->
            <div>
              <div class="flex-between mb-1">
                <span style="font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="bike" style="width: 16px; color: var(--accent-emerald);"></i> Motor (Tarif Harian)
                </span>
                <span class="font-mono" style="font-size: 0.85rem; font-weight: 700;">${bikeRented} / ${bikeUnits.length} Unit (${bikeUtilPercent}%)</span>
              </div>
              <div style="height: 8px; background: var(--bg-surface-elevated); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${bikeUtilPercent}%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 4px;"></div>
              </div>
            </div>

            <!-- Sepeda -->
            <div>
              <div class="flex-between mb-1">
                <span style="font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="activity" style="width: 16px; color: var(--accent-indigo);"></i> Sepeda (Tarif Per Jam)
                </span>
                <span class="font-mono" style="font-size: 0.85rem; font-weight: 700;">${cycleRented} / ${cycleUnits.length} Unit (${cycleUtilPercent}%)</span>
              </div>
              <div style="height: 8px; background: var(--bg-surface-elevated); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${cycleUtilPercent}%; background: linear-gradient(90deg, #6366f1, #818cf8); border-radius: 4px;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Single Branch Info Card -->
        <div class="card" style="background: linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 21, 35, 0.7) 100%);">
          <div class="card-header">
            <div>
              <h3 class="card-title text-emerald"><i data-lucide="map-pin"></i> Garasi Pusat (1 Cabang)</h3>
              <p class="card-subtitle">Operasional Lepas Kunci Terpadu</p>
            </div>
          </div>
          <div style="font-size: 0.83rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 10px;">
            <p><strong style="color: #fff;">RentalKu Central Hub</strong><br>Jl. Bypass Ngurah Rai No. 88, Sanur, Denpasar</p>
            <p><i data-lucide="clock" style="width: 14px; vertical-align: middle;"></i> 07:00 - 22:00 WITA</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
              <span class="badge badge-emerald">Loker Jaminan Aktif</span>
              <span class="badge badge-cyan">GPS Server Ready</span>
              <span class="badge badge-indigo">Inspection Bay</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Rentals Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i data-lucide="file-check-2"></i> Daftar Sewa Sedang Berlangsung</h3>
            <p class="card-subtitle">Unit di tangan penyewa & jaminan dokumen tersimpan di loker</p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btnViewAllBookings">
            Lihat Semua Reservasi <i data-lucide="arrow-right"></i>
          </button>
        </div>

        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Kode Booking</th>
                <th>Penyewa</th>
                <th>Kendaraan & Unit Plat</th>
                <th>Durasi / Skema</th>
                <th>Jaminan Fisik</th>
                <th>Status Pembayaran</th>
                <th>Aksi Cepat</th>
              </tr>
            </thead>
            <tbody>
              ${activeBookings.map(b => `
                <tr>
                  <td>
                    <span class="font-mono font-bold" style="color: var(--accent-cyan);">${b.bookingCode}</span>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">${formatDateTime(b.createdAt)}</div>
                  </td>
                  <td>
                    <strong style="color: var(--text-primary);">${b.customerName}</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${b.customerPhone}</div>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="badge ${b.category === 'Mobil' ? 'badge-cyan' : b.category === 'Motor' ? 'badge-emerald' : 'badge-indigo'}">
                        ${b.category}
                      </span>
                      <span class="font-mono font-bold" style="color: #fff;">${b.unitPlate || '-'}</span>
                    </div>
                    <div style="font-size: 0.74rem; color: var(--text-secondary);">${b.unitModel}</div>
                  </td>
                  <td>
                    <span style="font-weight: 600; color: #fff;">
                      ${b.pricingType === 'jam' ? `${b.durationHours} Jam (Tarif Jam)` : `${b.durationDays} Hari (Tarif Harian)`}
                    </span>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Hingga ${formatDateTime(b.endTime)}</div>
                  </td>
                  <td>
                    <span class="badge badge-amber font-mono">
                      <i data-lucide="lock" style="width: 12px;"></i> ${b.physicalDocsLocker || 'Loker A-01'}
                    </span>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">${(b.physicalDocs || []).join(', ')}</div>
                  </td>
                  <td>
                    <span class="badge badge-emerald">Lunas (${b.paymentMethod})</span>
                    <div class="font-mono" style="font-size: 0.74rem; color: #34d399; margin-top: 2px;">${formatRupiah(b.grandTotal)}</div>
                  </td>
                  <td>
                    <button class="btn btn-outline-emerald btn-sm btn-quick-return" data-booking-id="${b.id}">
                      <i data-lucide="rotate-ccw"></i> Proses Return
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Bind Events
  document.getElementById('btnDashNewBooking')?.addEventListener('click', onOpenNewBooking);
  document.getElementById('btnDashGps')?.addEventListener('click', () => onNavigate('gps'));
  document.getElementById('btnDashHandover')?.addEventListener('click', () => onNavigate('handover'));
  document.getElementById('btnDashVault')?.addEventListener('click', () => onNavigate('payments', 'vault'));
  document.getElementById('btnViewCalendar')?.addEventListener('click', () => onNavigate('calendar'));
  document.getElementById('btnViewAllBookings')?.addEventListener('click', () => onNavigate('reservations'));

  container.querySelectorAll('.btn-quick-return').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookingId = btn.dataset.bookingId;
      onNavigate('handover', bookingId);
    });
  });

  initIcons();
}
