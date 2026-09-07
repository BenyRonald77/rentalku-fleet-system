// Handover Module (Pickup & Return Digital Inspection with Signature Pad)
import { store } from '../data/store.js';
import { SimpleSignaturePad } from '../utils/signaturePad.js';
import { formatDateTime } from '../utils/formatters.js';
import { initIcons } from '../utils/icons.js';
import confetti from 'canvas-confetti';

export function renderHandover(container, preselectedBookingId = null) {
  const bookings = store.getBookings();
  const handovers = store.getHandovers();

  // Pick first active or preselected booking
  let activeBooking = preselectedBookingId
    ? store.getBookingById(preselectedBookingId)
    : bookings.find(b => b.bookingStatus === 'Berlangsung' || b.bookingStatus === 'Terkonfirmasi') || bookings[0];

  const isReturnMode = activeBooking && activeBooking.handoverPickupDone;

  container.innerHTML = `
    <div class="handover-view">
      <div class="flex-between mb-6">
        <div>
          <h2><i data-lucide="file-check-2"></i> Inspeksi Serah Terima (Handover Digital)</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            Pemeriksaan kondisi fisik, foto 4 sudut, dan tanda tangan digital untuk mencegah sengketa kerusakan.
          </p>
        </div>
        <div style="display: flex; gap: 8px;">
          <span class="badge ${isReturnMode ? 'badge-cyan' : 'badge-emerald'}" style="font-size: 0.85rem; padding: 6px 14px;">
            Mode: ${isReturnMode ? 'Pengembalian Unit (Return Inspection)' : 'Penyerahan Keluar (Pickup Inspection)'}
          </span>
        </div>
      </div>

      <!-- Booking Selector Card -->
      <div class="card mb-6" style="padding: 16px 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <label class="form-label" style="margin: 0; white-space: nowrap;">Pilih Reservasi:</label>
            <select class="form-control form-select" id="handoverBookingSelect" style="min-width: 320px;">
              ${bookings.map(b => `
                <option value="${b.id}" ${activeBooking && activeBooking.id === b.id ? 'selected' : ''}>
                  ${b.bookingCode} — ${b.customerName} (${b.unitPlate || b.unitModel}) [${b.bookingStatus}]
                </option>
              `).join('')}
            </select>
          </div>

          ${activeBooking ? `
            <div style="display: flex; gap: 14px; font-size: 0.8rem; color: var(--text-secondary);">
              <div>Loker Jaminan: <strong class="text-amber font-mono">${activeBooking.physicalDocsLocker || '-'}</strong></div>
              <div>Unit: <strong style="color: #fff;">${activeBooking.unitPlate || activeBooking.unitModel}</strong></div>
              <div>Status: <span class="badge badge-emerald">${activeBooking.bookingStatus}</span></div>
            </div>
          ` : ''}
        </div>
      </div>

      ${!activeBooking ? `
        <div class="card" style="text-align: center; padding: 48px;">
          <p style="color: var(--text-muted);">Tidak ada reservasi aktif untuk serah terima saat ini.</p>
        </div>
      ` : `
        <!-- Handover Form Inspection -->
        <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px;">
          <!-- Left Column: Inspection Multi-Point Checklist -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i data-lucide="check-circle-2"></i> Checklist Kondisi Kendaraan (${isReturnMode ? 'Return' : 'Pickup'})
              </h3>
            </div>

            <form id="formHandoverInspection">
              <div class="inspection-grid">
                <div class="inspection-item">
                  <div>
                    <strong style="color: #fff; font-size: 0.85rem;">Bodi Luar & Cat</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Bebas baret, penyok, atau retak</div>
                  </div>
                  <select class="form-control form-select" id="chkBody" style="width: 140px;">
                    <option value="Mulus Bersih">Mulus Bersih</option>
                    <option value="Baret Ringan">Baret Ringan</option>
                    <option value="Penyok / Rusak Baru">Penyok / Rusak</option>
                  </select>
                </div>

                <div class="inspection-item">
                  <div>
                    <strong style="color: #fff; font-size: 0.85rem;">Ban & Velg</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Tekanan angin & ketebalan ban</div>
                  </div>
                  <select class="form-control form-select" id="chkTires" style="width: 140px;">
                    <option value="Baik & Tekanan Pas">Baik & Aman</option>
                    <option value="Kurang Angin">Kurang Angin</option>
                    <option value="Bocor / Baret Velg">Bocor / Lecet</option>
                  </select>
                </div>

                <div class="inspection-item">
                  <div>
                    <strong style="color: #fff; font-size: 0.85rem;">Lampu & Kelistrikan</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Headlamp, sein, klakson, starter</div>
                  </div>
                  <select class="form-control form-select" id="chkLights" style="width: 140px;">
                    <option value="Menyala Normal">Menyala Normal</option>
                    <option value="Lampu Mati 1">Lampu Mati</option>
                  </select>
                </div>

                <div class="inspection-item">
                  <div>
                    <strong style="color: #fff; font-size: 0.85rem;">Kelengkapan Fisik</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">STNK Asli, Kunci Kontak, Helm</div>
                  </div>
                  <select class="form-control form-select" id="chkDocs" style="width: 140px;">
                    <option value="Lengkap & Asli">Lengkap Asli</option>
                    <option value="Helm Kurang 1">Helm Kurang</option>
                    <option value="STNK Tidak Ada">STNK Hilang</option>
                  </select>
                </div>
              </div>

              <!-- Odometer & Fuel Reading -->
              <div class="form-row mt-4">
                <div class="form-group">
                  <label class="form-label"><i data-lucide="gauge" style="width: 14px;"></i> Angka Odometer Terkini (KM)</label>
                  <input type="number" class="form-control font-mono" id="handoverKm" value="14250" required>
                </div>
                <div class="form-group">
                  <label class="form-label"><i data-lucide="fuel" style="width: 14px;"></i> Level BBM Terkini (%)</label>
                  <select class="form-control form-select" id="handoverFuel">
                    <option value="100%">100% (Full Tank)</option>
                    <option value="80%">80%</option>
                    <option value="50%">50% (Setengah)</option>
                    <option value="25%">25% (Perlu Isi)</option>
                  </select>
                </div>
              </div>

              <!-- Photo Inspection Preview -->
              <div class="form-group mt-3">
                <label class="form-label"><i data-lucide="camera" style="width: 14px;"></i> Dokumentasi Foto Fisik (4 Sudut)</label>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                  <div style="height: 70px; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-subtle); position: relative;">
                    <img src="/images/car_avanza.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                    <span style="position: absolute; bottom: 2px; left: 4px; font-size: 0.65rem; background: rgba(0,0,0,0.7); padding: 1px 4px; border-radius: 2px;">Depan</span>
                  </div>
                  <div style="height: 70px; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-subtle); position: relative;">
                    <img src="/images/car_avanza.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                    <span style="position: absolute; bottom: 2px; left: 4px; font-size: 0.65rem; background: rgba(0,0,0,0.7); padding: 1px 4px; border-radius: 2px;">Kanan</span>
                  </div>
                  <div style="height: 70px; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-subtle); position: relative;">
                    <img src="/images/car_avanza.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                    <span style="position: absolute; bottom: 2px; left: 4px; font-size: 0.65rem; background: rgba(0,0,0,0.7); padding: 1px 4px; border-radius: 2px;">Kiri</span>
                  </div>
                  <div style="height: 70px; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-subtle); position: relative;">
                    <img src="/images/car_avanza.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                    <span style="position: absolute; bottom: 2px; left: 4px; font-size: 0.65rem; background: rgba(0,0,0,0.7); padding: 1px 4px; border-radius: 2px;">Belakang</span>
                  </div>
                </div>
              </div>

              <!-- Right: Digital Signature Pad Canvas -->
              <div class="mt-4">
                <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
                  <span><i data-lucide="signature" style="width: 14px;"></i> Tanda Tangan Digital Penyewa (${activeBooking.customerName})</span>
                  <span style="font-size: 0.7rem; color: var(--text-muted);">Gunakan mouse / touch screen</span>
                </label>
                
                <div class="signature-pad-container">
                  <canvas id="handoverSignatureCanvas" class="signature-canvas"></canvas>
                </div>
                <div class="signature-actions">
                  <button type="button" class="btn btn-secondary btn-sm" id="btnClearSig">
                    <i data-lucide="rotate-ccw"></i> Bersihkan Tanda Tangan
                  </button>
                </div>
              </div>

              <div class="mt-6 flex-between" style="border-top: 1px solid var(--border-subtle); padding-top: 16px;">
                <div style="font-size: 0.78rem; color: var(--text-muted);">
                  Staf Inspektur: <strong>Rendi (Staf Lapangan RentalKu)</strong>
                </div>
                <button type="submit" class="btn ${isReturnMode ? 'btn-accent' : 'btn-primary'}" id="btnSubmitHandover">
                  <i data-lucide="check-circle-2"></i> ${isReturnMode ? 'Selesaikan Return & Lepas Jaminan' : 'Selesaikan Pickup & Mulai Sewa'}
                </button>
              </div>
            </form>
          </div>

          <!-- Right Column: Verification & Locker Info -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Document Custody Card -->
            <div class="card" style="border-color: rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.03);">
              <div class="card-header">
                <h3 class="card-title text-amber">
                  <i data-lucide="lock"></i> Brankas Jaminan Identitas
                </h3>
              </div>
              <div style="font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px;">
                <div class="flex-between">
                  <span>Nomor Loker:</span>
                  <strong class="font-mono text-amber" style="font-size: 1.1rem;">${activeBooking.physicalDocsLocker || 'Loker A-01'}</strong>
                </div>
                <div class="flex-between">
                  <span>Dokumen Ditahan:</span>
                  <strong style="color: #fff;">${(activeBooking.physicalDocs || ['KTP Asli Fisik']).join(', ')}</strong>
                </div>
                <div class="flex-between">
                  <span>Uang Deposit:</span>
                  <strong class="font-mono text-emerald">${activeBooking.cashDeposit ? `Rp ${activeBooking.cashDeposit.toLocaleString()}` : '-'}</strong>
                </div>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin-top: 6px; border-top: 1px dashed var(--border-medium); padding-top: 8px;">
                  ${isReturnMode ? '⚠️ Saat tombol "Selesaikan Return" diklik, sistem akan otomatis membuka status loker ini dan menyerahkan kembali identitas fisik kepada pelanggan.' : '✓ Pastikan KTP dan SIM asli telah diverifikasi keasliannya dan diletakkan dalam nampan loker sebelum menyerahkan kunci unit.'}
                </p>
              </div>
            </div>

            <!-- Unit Info & Inspection History -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title"><i data-lucide="file-text"></i> Riwayat Serah Terima Unit</h3>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.8rem;">
                ${handovers.filter(h => h.bookingId === activeBooking.id).length === 0 ? `
                  <div style="color: var(--text-muted); text-align: center; padding: 14px;">Belum ada riwayat handover untuk booking ini.</div>
                ` : handovers.filter(h => h.bookingId === activeBooking.id).map(h => `
                  <div style="padding: 10px 12px; border-radius: var(--radius-sm); background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle);">
                    <div class="flex-between mb-1">
                      <span class="badge ${h.type === 'Pickup' ? 'badge-emerald' : 'badge-cyan'}">${h.type} Selesai</span>
                      <span style="font-size: 0.7rem; color: var(--text-muted);">${formatDateTime(h.timestamp)}</span>
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-secondary);">
                      Odo: <strong>${h.initialKm || h.returnKm || '-'} KM</strong> | BBM: <strong>${h.fuelLevel || '85%'}</strong>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `}
    </div>
  `;

  initIcons();

  // Initialize Canvas Signature Pad
  const canvasEl = container.querySelector('#handoverSignatureCanvas');
  let sigPad = null;
  if (canvasEl) {
    sigPad = new SimpleSignaturePad(canvasEl);
    container.querySelector('#btnClearSig')?.addEventListener('click', () => {
      sigPad.clear();
    });
  }

  // Booking select change
  container.querySelector('#handoverBookingSelect')?.addEventListener('change', (e) => {
    const selectedId = e.target.value;
    renderHandover(container, selectedId);
  });

  // Handle Submit Handover
  container.querySelector('#formHandoverInspection')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeBooking) return;

    const bodyCondition = container.querySelector('#chkBody').value;
    const hasDamage = bodyCondition.includes('Penyok') || bodyCondition.includes('Baret Ringan');
    const odo = parseInt(container.querySelector('#handoverKm').value) || 14250;
    const fuel = container.querySelector('#handoverFuel').value;

    const handoverType = isReturnMode ? 'Return' : 'Pickup';

    store.createHandover({
      bookingId: activeBooking.id,
      type: handoverType,
      staffName: 'Rendi (Staf Lapangan)',
      checklist: {
        body: bodyCondition,
        tires: container.querySelector('#chkTires').value,
        lights: container.querySelector('#chkLights').value,
        docs: container.querySelector('#chkDocs').value
      },
      returnKm: isReturnMode ? odo : undefined,
      initialKm: !isReturnMode ? odo : undefined,
      fuelLevel: fuel,
      hasDamage,
      signatureRecorded: true
    });

    // If damage detected during return, auto-create damage claim!
    if (isReturnMode && hasDamage) {
      store.createDamageClaim({
        bookingId: activeBooking.id,
        unitId: activeBooking.unitId,
        plateNumber: activeBooking.unitPlate,
        modelName: activeBooking.unitModel,
        description: `Inspeksi pengembalian menemukan: ${bodyCondition}. Terdeteksi oleh staf Rendi.`,
        repairCost: 650000,
        insuranceCoverage: activeBooking.insuranceName?.includes('All-Risk') ? 650000 : 325000,
        customerDeduction: activeBooking.insuranceName?.includes('All-Risk') ? 0 : 325000
      });
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    alert(isReturnMode 
      ? `Pengembalian unit selesai! Status booking telah diselesaikan, dan dokumen jaminan di ${activeBooking.physicalDocsLocker} siap diserahkan kembali kepada penyewa.`
      : `Serah terima Pickup selesai! Status booking sekarang 'Berlangsung' dan unit telah aktif disewa.`
    );

    renderHandover(container, activeBooking.id);
  });
}
