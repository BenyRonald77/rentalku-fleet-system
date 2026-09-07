// Reservations & Bookings Module
import { store } from '../data/store.js';
import { formatRupiah, formatDateTime, calculateDuration } from '../utils/formatters.js';
import { initIcons } from '../utils/icons.js';
import { showDialogAlert, showBookingSuccessDialog } from '../utils/dialog.js';
import confetti from 'canvas-confetti';

export function renderReservations(container, { onOpenNewBooking, onNavigate }) {
  const bookings = store.getBookings();

  container.innerHTML = `
    <div class="reservations-view">
      <div class="flex-between mb-6">
        <div>
          <h2><i data-lucide="calendar"></i> Manajemen Reservasi Sewa</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            Daftar pemesanan lepas kunci, status pembayaran, dan penugasan unit kendaraan.
          </p>
        </div>
        <button class="btn btn-primary" id="btnCreateNewBooking">
          <i data-lucide="plus"></i> Buat Reservasi Baru
        </button>
      </div>

      <!-- Filters & Search -->
      <div style="display: flex; gap: 14px; margin-bottom: 20px; flex-wrap: wrap;">
        <div style="position: relative; min-width: 280px; flex: 1;">
          <input type="text" id="bookingSearchInput" class="form-control" placeholder="Cari Kode Booking, Nama Penyewa, atau Plat..." style="padding-left: 36px;">
          <i data-lucide="search" style="position: absolute; left: 12px; top: 12px; width: 16px; color: var(--text-muted);"></i>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm filter-status-btn active" data-status="ALL">Semua (${bookings.length})</button>
          <button class="btn btn-secondary btn-sm filter-status-btn" data-status="Berlangsung">Berlangsung</button>
          <button class="btn btn-secondary btn-sm filter-status-btn" data-status="Terkonfirmasi">Terkonfirmasi</button>
          <button class="btn btn-secondary btn-sm filter-status-btn" data-status="Selesai">Selesai</button>
        </div>
      </div>

      <!-- Bookings Table -->
      <div class="card">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Kode Booking</th>
                <th>Penyewa</th>
                <th>Unit Kendaraan</th>
                <th>Waktu Sewa / Skema</th>
                <th>Total Biaya</th>
                <th>Loker Jaminan Dokumen</th>
                <th>Status Sewa</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="bookingsTableBody">
              ${renderBookingRows(bookings)}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Form Buat Reservasi Baru -->
    <div id="modalNewBooking" class="modal-backdrop">
      <div class="modal-content" style="max-width: 760px;">
        <div class="modal-header">
          <h3 style="font-size: 1.15rem; color: #fff; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="plus-circle" class="text-emerald"></i> Buat Reservasi Sewa Lepas Kunci
          </h3>
          <button class="btn btn-secondary btn-sm" id="btnCloseBookingModal"><i data-lucide="x"></i></button>
        </div>
        <form id="formNewBooking">
          <div class="modal-body">
            <!-- Step 1: Customer Selection -->
            <div class="form-group">
              <label class="form-label">Data Penyewa (Customer)</label>
              <div style="display: flex; gap: 8px;">
                <select class="form-control form-select" id="bookCustSelect" required>
                  <option value="">-- Pilih Pelanggan Terdaftar --</option>
                  ${store.getCustomers().map(c => `
                    <option value="${c.id}">${c.name} (${c.phone}) - KTP: ${c.nik ? 'Terverifikasi' : 'Belum'}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Step 2: Vehicle Selection -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Model Kendaraan</label>
                <select class="form-control form-select" id="bookCatalogSelect" required>
                  ${store.getCatalog().map(cat => `
                    <option value="${cat.id}">
                      ${cat.name} [${cat.category}] — ${cat.pricingType === 'jam' ? `${formatRupiah(cat.hourlyRate)}/Jam` : `${formatRupiah(cat.dailyRate)}/Hari`}
                    </option>
                  `).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Pilih Unit Fisik Tersedia (Plat)</label>
                <select class="form-control form-select" id="bookUnitSelect" required>
                  <!-- Populated dynamically based on catalog model -->
                </select>
              </div>
            </div>

            <!-- Step 3: Rental Dates & Dynamic Duration -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Mulai Sewa (Tanggal & Jam)</label>
                <input type="datetime-local" class="form-control" id="bookStartTime" required>
              </div>
              <div class="form-group">
                <label class="form-label">Selesai Sewa (Tanggal & Jam)</label>
                <input type="datetime-local" class="form-control" id="bookEndTime" required>
              </div>
            </div>

            <!-- Dynamic Duration & Rule Badge -->
            <div id="bookingDurationAlert" style="padding: 10px 14px; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); margin-bottom: 16px; font-size: 0.8rem; display: flex; align-items: center; justify-content: space-between;">
              <span id="durationCalculationText">Durasi: 1 Hari (Skema Tarif Harian)</span>
              <span class="badge badge-emerald" id="durationBadge">Mobil / Motor Per Hari</span>
            </div>

            <!-- Step 4: Insurance & Protection Package (Pertanyaan No. 5) -->
            <div class="form-group">
              <label class="form-label">Paket Proteksi & Asuransi Kendaraan</label>
              <select class="form-control form-select" id="bookInsuranceSelect">
                ${store.getInsurancePackages().map(ins => `
                  <option value="${ins.id}">
                    ${ins.name} (${ins.dailyPrice === 0 ? 'Gratis / Standar' : `+${formatRupiah(ins.dailyPrice)}/hari`}) — ${ins.description.split('.')[0]}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Step 5: Physical Document Vault & Payment (Pertanyaan No. 3) -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Metode Pembayaran</label>
                <select class="form-control form-select" id="bookPaymentMethod">
                  <option value="QRIS">QRIS (Scan Statis/Dinamis)</option>
                  <option value="Transfer Bank (BCA)">Transfer Bank (BCA 8820-1920)</option>
                  <option value="Transfer Bank (Mandiri)">Transfer Bank (Mandiri 137-00-192)</option>
                  <option value="Tunai (Cash)">Tunai (Cash di Cabang)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Loker Jaminan Fisik KTP/SIM Asli</label>
                <select class="form-control form-select" id="bookVaultLocker">
                  ${store.getVaultLockers().filter(l => l.status === 'Available').map(l => `
                    <option value="${l.lockerNo}">${l.lockerNo} (Kosong Siap Pakai)</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Price Breakdown Calculation Card -->
            <div class="card" style="background: var(--bg-surface-elevated); padding: 16px; margin-top: 8px; border: 1px solid var(--border-subtle);">
              <div style="font-size: 0.82rem; font-weight: 700; color: #fff; margin-bottom: 8px;">
                Rincian Biaya & Deposit Transaksi
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.78rem;">
                <div class="flex-between">
                  <span class="text-muted">Biaya Sewa Pokok:</span>
                  <span class="font-mono font-bold" id="calcRentalCost">Rp 0</span>
                </div>
                <div class="flex-between">
                  <span class="text-muted">Proteksi Asuransi:</span>
                  <span class="font-mono font-bold" id="calcInsuranceCost">Rp 0</span>
                </div>
                <div class="flex-between">
                  <span class="text-muted">Jaminan Deposit (Dikembalikan):</span>
                  <span class="font-mono font-bold text-amber" id="calcDeposit">Rp 0</span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Total Transaksi Kasir</span>
              <strong class="font-mono text-emerald" id="calcGrandTotal" style="font-size: 1.35rem; line-height: 1.2;">Rp 0</strong>
            </div>
            <div style="display: flex; gap: 10px;">
              <button type="button" class="btn btn-secondary" id="btnCancelBooking">Batal</button>
              <button type="submit" class="btn btn-primary" id="btnSubmitBooking">
                <i data-lucide="check-circle-2"></i> Konfirmasi & Terbitkan Booking
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;

  initIcons();

  // Helper to re-render rows
  function updateTable(list) {
    const tbody = container.querySelector('#bookingsTableBody');
    if (tbody) {
      tbody.innerHTML = renderBookingRows(list);
      bindRowActions();
      initIcons();
    }
  }

  function bindRowActions() {
    container.querySelectorAll('.btn-view-handover').forEach(btn => {
      btn.addEventListener('click', () => {
        const bId = btn.dataset.bookingId;
        onNavigate('handover', bId);
      });
    });
  }

  bindRowActions();

  // Search filter
  container.querySelector('#bookingSearchInput')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = bookings.filter(b => 
      b.bookingCode.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      (b.unitPlate && b.unitPlate.toLowerCase().includes(q))
    );
    updateTable(filtered);
  });

  // Status buttons
  container.querySelectorAll('.filter-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-status-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const status = btn.dataset.status;
      if (status === 'ALL') {
        updateTable(bookings);
      } else {
        const filtered = bookings.filter(b => b.bookingStatus === status);
        updateTable(filtered);
      }
    });
  });

  // Modal logic
  const modal = container.querySelector('#modalNewBooking');
  const btnOpenModal = container.querySelector('#btnCreateNewBooking');
  const btnCloseModal = container.querySelector('#btnCloseBookingModal');
  const btnCancel = container.querySelector('#btnCancelBooking');

  const openBookingModal = (preselectedCatId = null) => {
    modal.classList.add('open');
    // Set default times (Now until tomorrow same hour)
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const formatInputDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const startInput = container.querySelector('#bookStartTime');
    const endInput = container.querySelector('#bookEndTime');
    if (startInput) startInput.value = formatInputDate(now);
    if (endInput) endInput.value = formatInputDate(tomorrow);

    if (preselectedCatId) {
      const catSelect = container.querySelector('#bookCatalogSelect');
      if (catSelect) catSelect.value = preselectedCatId;
    }

    refreshUnitOptions();
    recalcTotal();
  };

  btnOpenModal?.addEventListener('click', () => openBookingModal());
  btnCloseModal?.addEventListener('click', () => modal.classList.remove('open'));
  btnCancel?.addEventListener('click', () => modal.classList.remove('open'));

  // Vehicle select change -> refresh unit list & recalc
  const catSelect = container.querySelector('#bookCatalogSelect');
  catSelect?.addEventListener('change', () => {
    refreshUnitOptions();
    recalcTotal();
  });

  function refreshUnitOptions() {
    const catId = catSelect.value;
    const cat = store.getCatalog().find(c => c.id === catId);
    const availableUnits = store.getUnits().filter(u => u.catalogId === catId && u.status === 'Tersedia');

    const unitSelect = container.querySelector('#bookUnitSelect');
    if (!unitSelect) return;

    if (availableUnits.length === 0) {
      unitSelect.innerHTML = `<option value="">⚠️ Tidak ada unit siap (Semua Sedang Disewa/Servis)</option>`;
    } else {
      unitSelect.innerHTML = availableUnits.map(u => `
        <option value="${u.id}">${u.plateNumber} — ${u.color} (Odo: ${u.odometerKm} KM)</option>
      `).join('');
    }
  }

  // Time & Insurance changes -> Recalc
  container.querySelector('#bookStartTime')?.addEventListener('change', recalcTotal);
  container.querySelector('#bookEndTime')?.addEventListener('change', recalcTotal);
  container.querySelector('#bookInsuranceSelect')?.addEventListener('change', recalcTotal);

  function recalcTotal() {
    const catId = catSelect?.value;
    const cat = store.getCatalog().find(c => c.id === catId);
    if (!cat) return;

    const startVal = container.querySelector('#bookStartTime')?.value;
    const endVal = container.querySelector('#bookEndTime')?.value;
    if (!startVal || !endVal) return;

    const dur = calculateDuration(startVal, endVal, cat.category);
    const durationText = container.querySelector('#durationCalculationText');
    const durationBadge = container.querySelector('#durationBadge');

    if (cat.category === 'Sepeda') {
      durationText.textContent = `Durasi Sewa: ${dur.display} (Dihitung Tarif Per Jam)`;
      durationBadge.className = 'badge badge-indigo';
      durationBadge.textContent = 'Sepeda: Per Jam';
    } else {
      durationText.textContent = `Durasi Sewa: ${dur.display} (Dihitung Tarif Harian Lepas Kunci)`;
      durationBadge.className = 'badge badge-emerald';
      durationBadge.textContent = `${cat.category}: Per Hari`;
    }

    // Rental cost
    let rentalCost = 0;
    if (cat.category === 'Sepeda') {
      rentalCost = dur.quantity * cat.hourlyRate;
    } else {
      rentalCost = dur.quantity * cat.dailyRate;
    }

    // Insurance cost
    const insId = container.querySelector('#bookInsuranceSelect')?.value;
    const ins = store.getInsurancePackages().find(i => i.id === insId);
    let insCost = 0;
    if (ins && ins.dailyPrice > 0) {
      if (cat.category === 'Sepeda') {
        insCost = dur.quantity * ins.hourlyPrice;
      } else if (cat.category === 'Motor') {
        insCost = dur.quantity * (ins.dailyMotorPrice || 35000);
      } else {
        insCost = dur.quantity * ins.dailyPrice;
      }
    }

    const depositCost = cat.depositDefault || 300000;
    const grandTotal = rentalCost + insCost + depositCost;

    container.querySelector('#calcRentalCost').textContent = formatRupiah(rentalCost);
    container.querySelector('#calcInsuranceCost').textContent = formatRupiah(insCost);
    container.querySelector('#calcDeposit').textContent = formatRupiah(depositCost);
    container.querySelector('#calcGrandTotal').textContent = formatRupiah(grandTotal);
  }

  // Handle Submit Booking
  container.querySelector('#formNewBooking')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const custId = container.querySelector('#bookCustSelect').value;
    const catId = container.querySelector('#bookCatalogSelect').value;
    const unitId = container.querySelector('#bookUnitSelect').value;
    const startTime = container.querySelector('#bookStartTime').value;
    const endTime = container.querySelector('#bookEndTime').value;
    const insId = container.querySelector('#bookInsuranceSelect').value;
    const paymentMethod = container.querySelector('#bookPaymentMethod').value;
    const lockerNo = container.querySelector('#bookVaultLocker').value;

    const customer = store.getCustomerById(custId);
    const cat = store.getCatalog().find(c => c.id === catId);
    const unit = store.getUnitById(unitId);
    const ins = store.getInsurancePackages().find(i => i.id === insId);

    if (!unit) {
      showDialogAlert({
        title: 'Unit Belum Dipilih',
        message: 'Mohon pilih unit fisik kendaraan yang siap digunakan di garasi pusat.',
        type: 'warning'
      });
      return;
    }

    const dur = calculateDuration(startTime, endTime, cat.category);
    let rentalCost = cat.category === 'Sepeda' ? dur.quantity * cat.hourlyRate : dur.quantity * cat.dailyRate;
    let insCost = 0;
    if (ins && ins.dailyPrice > 0) {
      insCost = cat.category === 'Sepeda' ? dur.quantity * ins.hourlyPrice : dur.quantity * (cat.category === 'Motor' ? ins.dailyMotorPrice : ins.dailyPrice);
    }
    const depositCost = cat.depositDefault || 300000;

    const newBooking = store.createBooking({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      unitId: unit.id,
      unitPlate: unit.plateNumber,
      unitModel: cat.name,
      category: cat.category,
      startTime,
      endTime,
      pricingType: cat.pricingType,
      durationDays: cat.pricingType === 'hari' ? dur.quantity : undefined,
      durationHours: cat.pricingType === 'jam' ? dur.quantity : undefined,
      baseRate: cat.pricingType === 'jam' ? cat.hourlyRate : cat.dailyRate,
      rentalTotal: rentalCost,
      insuranceId: ins.id,
      insuranceName: ins.name,
      insuranceCost: insCost,
      cashDeposit: depositCost,
      physicalDocsLocker: lockerNo,
      physicalDocs: ['KTP Asli Fisik', cat.licenseRequired === 'SIM A' ? 'SIM A Asli' : cat.licenseRequired === 'SIM C' ? 'SIM C Asli' : 'Identitas Pendukung'],
      grandTotal: rentalCost + insCost + depositCost,
      paymentMethod,
      paymentStatus: 'Lunas',
      bookingStatus: 'Terkonfirmasi'
    });

    modal.classList.remove('open');
    renderReservations(container, { onOpenNewBooking, onNavigate });
    showBookingSuccessDialog(newBooking, store.getBranch());
  });

  return { openBookingModal };
}

function renderBookingRows(bookings) {
  if (!bookings || bookings.length === 0) {
    return `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">Belum ada data reservasi.</td></tr>`;
  }

  return bookings.map(b => {
    let statusBadge = 'badge-emerald';
    if (b.bookingStatus === 'Berlangsung') statusBadge = 'badge-cyan';
    if (b.bookingStatus === 'Terkonfirmasi') statusBadge = 'badge-indigo';
    if (b.bookingStatus === 'Selesai') statusBadge = 'badge-slate';

    return `
      <tr>
        <td>
          <span class="font-mono font-bold" style="color: var(--accent-cyan);">${b.bookingCode}</span>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${formatDateTime(b.createdAt)}</div>
        </td>
        <td>
          <strong style="color: #fff;">${b.customerName}</strong>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${b.customerPhone}</div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="badge ${b.category === 'Mobil' ? 'badge-cyan' : b.category === 'Motor' ? 'badge-emerald' : 'badge-indigo'}">
              ${b.category}
            </span>
            <span class="font-mono font-bold" style="color: #fff;">${b.unitPlate || 'Unit Baru'}</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-secondary);">${b.unitModel}</div>
        </td>
        <td>
          <span style="font-weight: 600; color: #fff;">
            ${b.pricingType === 'jam' ? `${b.durationHours} Jam (Per Jam)` : `${b.durationDays} Hari (Harian)`}
          </span>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${formatDateTime(b.startTime)} s/d ${formatDateTime(b.endTime)}</div>
        </td>
        <td>
          <div class="font-mono font-bold" style="color: #34d399;">${formatRupiah(b.grandTotal)}</div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">Dep: ${formatRupiah(b.cashDeposit)} (${b.paymentMethod})</div>
        </td>
        <td>
          <span class="badge badge-amber font-mono">
            <i data-lucide="lock" style="width: 12px;"></i> ${b.physicalDocsLocker || '-'}
          </span>
          <div style="font-size: 0.68rem; color: var(--text-muted);">${(b.physicalDocs || []).join(', ')}</div>
        </td>
        <td>
          <span class="badge ${statusBadge}">${b.bookingStatus}</span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm btn-view-handover" data-booking-id="${b.id}">
            <i data-lucide="file-check-2"></i> Handover
          </button>
        </td>
      </tr>
    `;
  }).join('');
}
