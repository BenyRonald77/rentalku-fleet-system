// Customer-Facing Public Portal (Situs Publik RentalKu)
import { store } from '../data/store.js';
import { formatRupiah, formatDateTime, calculateDuration } from '../utils/formatters.js';
import { initIcons } from '../utils/icons.js';
import { showDialogAlert, showBookingSuccessDialog } from '../utils/dialog.js';
import confetti from 'canvas-confetti';

export function renderPublicPortal(container, { onSwitchToAdmin }) {
  const branch = store.getBranch();
  const catalog = store.getCatalog();
  const units = store.getUnits();
  let currentCategory = 'ALL';

  function renderPage() {
    const filteredCatalog = currentCategory === 'ALL'
      ? catalog
      : catalog.filter(c => c.category === currentCategory);

    const carCount = catalog.filter(c => c.category === 'Mobil').length;
    const bikeCount = catalog.filter(c => c.category === 'Motor').length;
    const cycleCount = catalog.filter(c => c.category === 'Sepeda').length;

    container.innerHTML = `
      <div class="public-portal-wrapper">
        <!-- Hero Section -->
        <div class="portal-hero">
          <div style="display: flex; justify-content: center; margin-bottom: 20px;">
            <span class="badge badge-emerald" style="padding: 6px 16px; font-size: 0.82rem;">
              <i data-lucide="shield-check"></i> 100% Murni Lepas Kunci • Armada Terawat & GPS Ready
            </span>
          </div>
          <h1>Jelajahi Perjalananmu Bersama RentalKu</h1>
          <p>
            Pusat persewaan Mobil, Motor, dan Sepeda terlengkap di Bali & Jakarta. 
            Proses booking mandiri cepat, jaminan aman di brankas loker, dan proteksi asuransi terpercaya.
          </p>

          <!-- Search & Filter Category Bar -->
          <div class="portal-search-bar">
            <div>
              <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">Pilih Kategori</label>
              <select class="form-control form-select" id="portalCatSelect">
                <option value="ALL" ${currentCategory === 'ALL' ? 'selected' : ''}>Semua Armada (${catalog.length} Pilihan)</option>
                <option value="Mobil" ${currentCategory === 'Mobil' ? 'selected' : ''}>Mobil (${carCount} Model • Tarif Harian)</option>
                <option value="Motor" ${currentCategory === 'Motor' ? 'selected' : ''}>Motor (${bikeCount} Model • Tarif Harian)</option>
                <option value="Sepeda" ${currentCategory === 'Sepeda' ? 'selected' : ''}>Sepeda (${cycleCount} Model • Tarif Per Jam)</option>
              </select>
            </div>

            <div>
              <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">Lokasi Garasi Pusat</label>
              <input type="text" class="form-control" value="${branch.name.split('—')[0]}" readonly style="cursor: not-allowed; background: rgba(0,0,0,0.3);">
            </div>

            <div>
              <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">Lacak Booking Mandiri</label>
              <input type="text" class="form-control font-mono" id="inputTrackBooking" placeholder="Ketik Kode Booking (ex: RK-AVZ-991)">
            </div>

            <div>
              <label class="form-label" style="opacity: 0;">Aksi</label>
              <button class="btn btn-primary" id="btnTrackBooking" style="width: 100%;">
                <i data-lucide="search"></i> Cek Status
              </button>
            </div>
          </div>

          <!-- Quick Category Badges Bar -->
          <div style="display: flex; justify-content: center; gap: 10px; margin-top: 24px; flex-wrap: wrap;">
            <button class="btn btn-sm ${currentCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'} portal-filter-btn" data-cat="ALL">
              Semua Armada (${catalog.length})
            </button>
            <button class="btn btn-sm ${currentCategory === 'Mobil' ? 'btn-primary' : 'btn-secondary'} portal-filter-btn" data-cat="Mobil">
              <i data-lucide="car"></i> Mobil (${carCount})
            </button>
            <button class="btn btn-sm ${currentCategory === 'Motor' ? 'btn-primary' : 'btn-secondary'} portal-filter-btn" data-cat="Motor">
              <i data-lucide="bike"></i> Motor (${bikeCount})
            </button>
            <button class="btn btn-sm ${currentCategory === 'Sepeda' ? 'btn-primary' : 'btn-secondary'} portal-filter-btn" data-cat="Sepeda">
              <i data-lucide="activity"></i> Sepeda (${cycleCount})
            </button>
          </div>
        </div>

        <!-- Fleet Grid -->
        <div class="portal-fleet-grid">
          ${filteredCatalog.map(cat => {
            const readyUnits = units.filter(u => u.catalogId === cat.id && u.status === 'Tersedia').length;

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
                    <span class="badge ${readyUnits > 0 ? 'badge-emerald' : 'badge-amber'}">
                      ${readyUnits > 0 ? `${readyUnits} Unit Siap` : 'Penuh'}
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
                      <span style="font-size: 0.68rem; color: var(--text-muted);">Skema Tarif</span>
                      <div style="font-size: 0.8rem; font-weight: 700; color: #fff;">
                        ${cat.pricingType === 'jam' ? 'Per Jam (Min 2 Jam)' : 'Per Hari Lepas Kunci'}
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm btn-book-public" data-cat-id="${cat.id}">
                      Pesan Sekarang <i data-lucide="arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Single Branch & Guarantee Policy Banner -->
        <div style="max-width: 1200px; margin: 0 auto 64px; padding: 0 32px;">
          <div class="card" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(6, 182, 212, 0.06) 100%); border-color: rgba(16, 185, 129, 0.2);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
              <div>
                <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                  <i data-lucide="map-pin" class="text-emerald"></i> Garasi Pusat (1 Cabang)
                </h4>
                <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5;">
                  ${branch.name}<br>${branch.address}<br>
                  Buka setiap hari 07:00 - 22:00 WITA.
                </p>
              </div>

              <div>
                <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                  <i data-lucide="lock" class="text-amber"></i> Kebijakan Jaminan Dokumen Asli
                </h4>
                <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5;">
                  Sesuai standar operasional lepas kunci, penyewa wajib menyerahkan KTP & SIM asli fisik untuk disimpan di Loker Jaminan berkode unik selama masa sewa.
                </p>
              </div>

              <div>
                <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                  <i data-lucide="shield-check" class="text-cyan"></i> Pilihan Asuransi Fleksibel
                </h4>
                <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5;">
                  Tersedia opsi perlindungan All-Risk Gold (bebas potongan deposit bila baret halus) dan TLO untuk kenyamanan liburan Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Public Booking Modal (FIXED: Layout with pinned, non-bleeding sticky modal-footer) -->
      <div id="modalPublicBooking" class="modal-backdrop">
        <div class="modal-content" style="max-width: 680px;">
          <div class="modal-header">
            <h3 style="font-size: 1.15rem; color: #fff; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="calendar" class="text-emerald"></i> Formulir Sewa Mandiri RentalKu
            </h3>
            <button class="btn btn-secondary btn-sm" id="btnClosePublicModal"><i data-lucide="x"></i></button>
          </div>

          <form id="formPublicBooking">
            <!-- Scrollable Body for all inputs -->
            <div class="modal-body">
              <div id="publicSelectedModelInfo" style="padding: 12px 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); margin-bottom: 16px; display: flex; align-items: center; gap: 14px; border: 1px solid var(--border-subtle);">
                <!-- Filled dynamically -->
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nama Lengkap Sesuai KTP</label>
                  <input type="text" class="form-control" id="pubCustName" required placeholder="Nama Lengkap Anda">
                </div>
                <div class="form-group">
                  <label class="form-label">Nomor WhatsApp Aktif</label>
                  <input type="tel" class="form-control" id="pubCustPhone" required placeholder="08123456789">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nomor NIK KTP</label>
                  <input type="text" class="form-control font-mono" id="pubCustNik" required placeholder="16 Digit NIK KTP">
                </div>
                <div class="form-group">
                  <label class="form-label">Nomor Lisensi SIM (A / C)</label>
                  <input type="text" class="form-control font-mono" id="pubCustSim" placeholder="Nomor SIM (Wajib untuk Mobil / Motor)">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Mulai Sewa (Tanggal & Jam)</label>
                  <input type="datetime-local" class="form-control" id="pubStartTime" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Selesai Sewa (Tanggal & Jam)</label>
                  <input type="datetime-local" class="form-control" id="pubEndTime" required>
                </div>
              </div>

              <!-- Insurance Selection -->
              <div class="form-group">
                <label class="form-label">Pilih Paket Proteksi Asuransi</label>
                <select class="form-control form-select" id="pubInsuranceSelect">
                  ${store.getInsurancePackages().map(ins => `
                    <option value="${ins.id}">
                      ${ins.name} (${ins.dailyPrice === 0 ? 'Gratis / Standar' : `+${formatRupiah(ins.dailyPrice)}/hari`})
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Payment selection -->
              <div class="form-group">
                <label class="form-label">Pilihan Pembayaran</label>
                <select class="form-control form-select" id="pubPaymentMethod">
                  <option value="QRIS">QRIS Dinamis (Scan Langsung)</option>
                  <option value="Transfer Bank (BCA)">Transfer Bank BCA</option>
                  <option value="Tunai (Cash)">Bayar Tunai di Garasi Saat Pengambilan</option>
                </select>
              </div>

              <!-- Important notice -->
              <div style="padding: 12px 16px; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); font-size: 0.78rem; color: #fbbf24;">
                <i data-lucide="lock" style="width: 14px; vertical-align: middle; margin-right: 4px;"></i> 
                <strong>Ketentuan Jaminan Fisik:</strong> Saat pengambilan unit di Garasi Pusat, Anda wajib menyerahkan KTP Asli dan SIM Asli untuk disimpan di brankas loker jaminan.
              </div>
            </div>

            <!-- Fixed Pinned Footer: Total Calculation & Submit Button (Never Bleeds or Cuts Off) -->
            <div class="modal-footer">
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.03em;">Estimasi Total Pembayaran</span>
                <div class="font-mono font-bold text-emerald" id="pubGrandTotal" style="font-size: 1.35rem; line-height: 1.2;">
                  Rp 0
                </div>
              </div>
              <button type="submit" class="btn btn-primary btn-lg" id="btnSubmitPubBooking" style="padding: 12px 24px; font-weight: 700;">
                <i data-lucide="check-circle-2"></i> Konfirmasi & Dapatkan Kode Booking
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tracking Status Modal -->
      <div id="modalTrackResult" class="modal-backdrop">
        <div class="modal-content" style="max-width: 540px;">
          <div class="modal-header">
            <h3 style="font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="search"></i> Status Reservasi RentalKu
            </h3>
            <button class="btn btn-secondary btn-sm" id="btnCloseTrackModal"><i data-lucide="x"></i></button>
          </div>
          <div class="modal-body" id="trackResultBody">
            <!-- Populated on search -->
          </div>
          <div class="modal-footer" style="justify-content: flex-end;">
            <button class="btn btn-primary" id="btnCloseTrackModal2">Tutup</button>
          </div>
        </div>
      </div>
    `;

    initIcons();

    // Category filter dropdown
    container.querySelector('#portalCatSelect')?.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      renderPage();
    });

    // Category filter pills
    container.querySelectorAll('.portal-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.cat;
        renderPage();
      });
    });

    // Tracking Button Logic
    container.querySelector('#btnTrackBooking')?.addEventListener('click', () => {
      const code = container.querySelector('#inputTrackBooking')?.value;
      if (!code) {
        showDialogAlert({
          title: 'Kode Booking Diperlukan',
          message: 'Mohon ketikkan Kode Booking Anda (contoh: RK-AVZ-991) untuk melacak status sewa.',
          type: 'warning'
        });
        return;
      }

      const booking = store.getBookingByCode(code);
      const trackBody = container.querySelector('#trackResultBody');
      const trackModal = container.querySelector('#modalTrackResult');

      if (!booking) {
        trackBody.innerHTML = `
          <div style="text-align: center; padding: 24px;">
            <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
            <h4 style="color: #fff; margin-bottom: 6px;">Booking Tidak Ditemukan</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Pastikan kode booking yang Anda ketik sudah sesuai (contoh: RK-AVZ-991).</p>
          </div>
        `;
      } else {
        trackBody.innerHTML = `
          <div style="background: var(--bg-surface-elevated); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-medium);">
            <div class="flex-between mb-3">
              <span class="font-mono font-bold text-cyan" style="font-size: 1.1rem;">${booking.bookingCode}</span>
              <span class="badge ${booking.bookingStatus === 'Berlangsung' ? 'badge-cyan' : 'badge-emerald'}">
                ${booking.bookingStatus}
              </span>
            </div>
            <div style="font-size: 0.83rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px;">
              <div>Penyewa: <strong style="color: #fff;">${booking.customerName}</strong></div>
              <div>Kendaraan: <strong style="color: #fff;">${booking.unitModel}</strong> (${booking.unitPlate || 'Unit Siap Handover'})</div>
              <div>Loker Jaminan Identitas: <strong class="text-amber font-mono">${booking.physicalDocsLocker || 'Loker Terjadwal'}</strong></div>
              <div>Pengambilan: <strong>${formatDateTime(booking.startTime)}</strong></div>
              <div>Pengembalian: <strong>${formatDateTime(booking.endTime)}</strong></div>
              <div class="mt-2 pt-2 flex-between" style="border-top: 1px solid var(--border-subtle);">
                <span>Total Biaya:</span>
                <strong class="font-mono text-emerald" style="font-size: 1rem;">${formatRupiah(booking.grandTotal)}</strong>
              </div>
            </div>
          </div>
        `;
      }

      trackModal?.classList.add('open');
      initIcons();
    });

    container.querySelector('#btnCloseTrackModal')?.addEventListener('click', () => {
      container.querySelector('#modalTrackResult')?.classList.remove('open');
    });
    container.querySelector('#btnCloseTrackModal2')?.addEventListener('click', () => {
      container.querySelector('#modalTrackResult')?.classList.remove('open');
    });

    // Public Booking Modal Handlers
    const pubModal = container.querySelector('#modalPublicBooking');
    let selectedCat = null;

    container.querySelectorAll('.btn-book-public').forEach(btn => {
      btn.addEventListener('click', () => {
        const cId = btn.dataset.catId;
        selectedCat = catalog.find(c => c.id === cId);
        if (!selectedCat) return;

        // Populate selected model box
        const modelBox = container.querySelector('#publicSelectedModelInfo');
        if (modelBox) {
          modelBox.innerHTML = `
            <img src="${selectedCat.image}" style="width: 70px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-medium);">
            <div style="flex: 1;">
              <div class="flex-between">
                <strong style="color: #fff; font-size: 0.95rem;">${selectedCat.name}</strong>
                <span class="badge ${selectedCat.category === 'Mobil' ? 'badge-cyan' : selectedCat.category === 'Motor' ? 'badge-emerald' : 'badge-indigo'}">
                  ${selectedCat.category}
                </span>
              </div>
              <div style="font-size: 0.76rem; color: var(--accent-emerald); font-weight: 700; margin-top: 2px;">
                ${selectedCat.pricingType === 'jam' ? `${formatRupiah(selectedCat.hourlyRate)} / Jam (Sepeda)` : `${formatRupiah(selectedCat.dailyRate)} / Hari Lepas Kunci`}
              </div>
              <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
                Deposit: ${formatRupiah(selectedCat.depositDefault)} • Syarat: ${selectedCat.licenseRequired}
              </div>
            </div>
          `;
        }

        // Setup default dates
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

        const startInput = container.querySelector('#pubStartTime');
        const endInput = container.querySelector('#pubEndTime');
        if (startInput) startInput.value = formatInputDate(now);
        if (endInput) endInput.value = formatInputDate(tomorrow);

        updatePubEstimatedTotal();
        pubModal.classList.add('open');
      });
    });

    container.querySelector('#btnClosePublicModal')?.addEventListener('click', () => {
      pubModal.classList.remove('open');
    });

    container.querySelector('#pubStartTime')?.addEventListener('change', updatePubEstimatedTotal);
    container.querySelector('#pubEndTime')?.addEventListener('change', updatePubEstimatedTotal);
    container.querySelector('#pubInsuranceSelect')?.addEventListener('change', updatePubEstimatedTotal);

    function updatePubEstimatedTotal() {
      if (!selectedCat) return;
      const start = container.querySelector('#pubStartTime')?.value;
      const end = container.querySelector('#pubEndTime')?.value;
      if (!start || !end) return;

      const dur = calculateDuration(start, end, selectedCat.category);
      let rentalCost = selectedCat.pricingType === 'jam'
        ? dur.quantity * selectedCat.hourlyRate
        : dur.quantity * selectedCat.dailyRate;

      const insId = container.querySelector('#pubInsuranceSelect')?.value;
      const ins = store.getInsurancePackages().find(i => i.id === insId);
      let insCost = 0;
      if (ins && ins.dailyPrice > 0) {
        insCost = selectedCat.category === 'Sepeda'
          ? dur.quantity * ins.hourlyPrice
          : dur.quantity * (selectedCat.category === 'Motor' ? ins.dailyMotorPrice : ins.dailyPrice);
      }

      const deposit = selectedCat.depositDefault || 300000;
      const grandTotal = rentalCost + insCost + deposit;

      const totalEl = container.querySelector('#pubGrandTotal');
      if (totalEl) totalEl.textContent = formatRupiah(grandTotal);
    }

    // Submit Public Booking
    container.querySelector('#formPublicBooking')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!selectedCat) return;

      const custName = container.querySelector('#pubCustName').value.trim();
      const custPhone = container.querySelector('#pubCustPhone').value.trim();
      const custNik = container.querySelector('#pubCustNik').value.trim();
      const custSim = container.querySelector('#pubCustSim').value.trim();
      const startTime = container.querySelector('#pubStartTime').value;
      const endTime = container.querySelector('#pubEndTime').value;
      const insId = container.querySelector('#pubInsuranceSelect').value;
      const paymentMethod = container.querySelector('#pubPaymentMethod').value;

      // Find available unit
      const availableUnits = store.getUnits().filter(u => u.catalogId === selectedCat.id && u.status === 'Tersedia');
      const assignedUnit = availableUnits[0] || store.getUnits().find(u => u.catalogId === selectedCat.id);

      // Find available locker
      const availableLocker = store.getVaultLockers().find(l => l.status === 'Available') || { lockerNo: 'LOKER-A05' };

      const dur = calculateDuration(startTime, endTime, selectedCat.category);
      let rentalCost = selectedCat.pricingType === 'jam' ? dur.quantity * selectedCat.hourlyRate : dur.quantity * selectedCat.dailyRate;
      const ins = store.getInsurancePackages().find(i => i.id === insId);
      let insCost = 0;
      if (ins && ins.dailyPrice > 0) {
        insCost = selectedCat.category === 'Sepeda' ? dur.quantity * ins.hourlyPrice : dur.quantity * (selectedCat.category === 'Motor' ? ins.dailyMotorPrice : ins.dailyPrice);
      }
      const deposit = selectedCat.depositDefault || 300000;

      // Create new customer record
      const cust = store.createCustomer({
        name: custName,
        phone: custPhone,
        email: `${custName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        nik: custNik,
        ktpVerified: true,
        simA: selectedCat.category === 'Mobil' ? custSim : null,
        simAVerified: Boolean(custSim && selectedCat.category === 'Mobil'),
        simC: selectedCat.category === 'Motor' ? custSim : null,
        simCVerified: Boolean(custSim && selectedCat.category === 'Motor'),
        address: 'Booking Mandiri via Situs Publik',
        notes: 'Penyewa baru lewat customer portal'
      });

      // Create booking
      const newBooking = store.createBooking({
        customerId: cust.id,
        customerName: cust.name,
        customerPhone: cust.phone,
        unitId: assignedUnit ? assignedUnit.id : 'U-01',
        unitPlate: assignedUnit ? assignedUnit.plateNumber : 'Unit Terjadwal',
        unitModel: selectedCat.name,
        category: selectedCat.category,
        startTime,
        endTime,
        pricingType: selectedCat.pricingType,
        durationDays: selectedCat.pricingType === 'hari' ? dur.quantity : undefined,
        durationHours: selectedCat.pricingType === 'jam' ? dur.quantity : undefined,
        baseRate: selectedCat.pricingType === 'jam' ? selectedCat.hourlyRate : selectedCat.dailyRate,
        rentalTotal: rentalCost,
        insuranceId: ins.id,
        insuranceName: ins.name,
        insuranceCost: insCost,
        cashDeposit: deposit,
        physicalDocsLocker: availableLocker.lockerNo,
        physicalDocs: ['KTP Asli Fisik', custSim ? 'SIM Asli' : 'Dokumen Pendukung'],
        grandTotal: rentalCost + insCost + deposit,
        paymentMethod,
        paymentStatus: paymentMethod === 'QRIS' ? 'Lunas' : 'Menunggu Konfirmasi',
        bookingStatus: 'Terkonfirmasi'
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });

      pubModal.classList.remove('open');

      showBookingSuccessDialog(newBooking, branch);
    });
  }

  renderPage();
}
