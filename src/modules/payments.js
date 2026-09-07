// Payments, Invoices, & Physical Document Vault Module (Open Question #3)
import { store } from '../data/store.js';
import { formatRupiah, formatDateTime } from '../utils/formatters.js';
import { initIcons } from '../utils/icons.js';
import { showDialogAlert, showDialogConfirm } from '../utils/dialog.js';
import confetti from 'canvas-confetti';

export function renderPayments(container, initialTab = 'invoices') {
  const bookings = store.getBookings();
  const lockers = store.getVaultLockers();

  container.innerHTML = `
    <div class="payments-view">
      <div class="flex-between mb-6">
        <div>
          <h2><i data-lucide="credit-card"></i> Keuangan & Brankas Jaminan Dokumen</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            Pengelolaan transaksi kasir (Cash, Transfer, QRIS) dan modul penahanan fisik KTP/SIM asli penyewa.
          </p>
        </div>
      </div>

      <!-- Tabs Header -->
      <div class="tabs-header">
        <button class="tab-button ${initialTab === 'invoices' ? 'active' : ''}" data-pay-tab="invoices">
          <i data-lucide="file-text"></i> Invoice & Transaksi Pembayaran (${bookings.length})
        </button>
        <button class="tab-button ${initialTab === 'vault' ? 'active' : ''}" data-pay-tab="vault">
          <i data-lucide="lock"></i> Brankas Loker Jaminan KTP & SIM (${lockers.filter(l => l.status === 'Occupied').length} Ditahan)
        </button>
        <button class="tab-button ${initialTab === 'qris' ? 'active' : ''}" data-pay-tab="qris">
          <i data-lucide="qr-code"></i> Terminal QRIS Dinamis
        </button>
      </div>

      <!-- Tab 1: Invoices & Transactions -->
      <div id="tabInvoicesPane" class="tab-pane ${initialTab === 'invoices' ? '' : 'hidden'}">
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title"><i data-lucide="file-text"></i> Riwayat Invoice & Pelunasan Kasir</h3>
              <p class="card-subtitle">Semua pembayaran biaya sewa, asuransi, dan deposit jaminan tercatat rapi</p>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>No. Invoice / Kode</th>
                  <th>Penyewa</th>
                  <th>Kendaraan</th>
                  <th>Metode Bayar</th>
                  <th>Biaya Sewa</th>
                  <th>Proteksi Asuransi</th>
                  <th>Deposit Jaminan</th>
                  <th>Total Invoice</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${bookings.map(b => {
                  let methodBadge = 'badge-cyan';
                  if (b.paymentMethod.includes('Cash') || b.paymentMethod.includes('Tunai')) methodBadge = 'badge-emerald';
                  if (b.paymentMethod.includes('QRIS')) methodBadge = 'badge-indigo';

                  return `
                    <tr>
                      <td>
                        <span class="font-mono font-bold" style="color: #fff;">INV-${b.bookingCode}</span>
                        <div style="font-size: 0.7rem; color: var(--text-muted);">${formatDateTime(b.createdAt)}</div>
                      </td>
                      <td>
                        <strong style="color: var(--text-primary);">${b.customerName}</strong>
                      </td>
                      <td>
                        <div style="font-size: 0.8rem; color: #fff;">${b.unitModel}</div>
                        <div class="font-mono" style="font-size: 0.72rem; color: var(--text-secondary);">${b.unitPlate || '-'}</div>
                      </td>
                      <td>
                        <span class="badge ${methodBadge}">${b.paymentMethod}</span>
                      </td>
                      <td>
                        <span class="font-mono">${formatRupiah(b.rentalTotal)}</span>
                      </td>
                      <td>
                        <span class="font-mono">${formatRupiah(b.insuranceCost || 0)}</span>
                        <div style="font-size: 0.68rem; color: var(--text-muted);">${b.insuranceName?.split(' ')[0] || 'Standar'}</div>
                      </td>
                      <td>
                        <span class="font-mono text-amber">${formatRupiah(b.cashDeposit || 0)}</span>
                      </td>
                      <td>
                        <strong class="font-mono text-emerald">${formatRupiah(b.grandTotal)}</strong>
                      </td>
                      <td>
                        <span class="badge badge-emerald">LUNAS</span>
                      </td>
                      <td>
                        <button class="btn btn-secondary btn-sm btn-print-invoice" data-booking-id="${b.id}">
                          <i data-lucide="eye"></i> Detail
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

      <!-- Tab 2: Physical Document Vault Lockers -->
      <div id="tabVaultPane" class="tab-pane ${initialTab === 'vault' ? '' : 'hidden'}">
        <div class="card mb-6" style="background: rgba(245, 158, 11, 0.04); border-color: rgba(245, 158, 11, 0.2);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent-amber);">
                <i data-lucide="lock" style="width: 24px; height: 24px;"></i>
              </div>
              <div>
                <h3 style="font-size: 1.05rem; color: #fff;">Brankas Loker Penitipan Identitas Fisik</h3>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">
                  SOP Lepas Kunci: Dokumen KTP & SIM Asli penyewa wajib disimpan di loker selama masa peminjaman unit.
                </p>
              </div>
            </div>
            <div style="display: flex; gap: 12px;">
              <span class="badge badge-amber font-mono" style="font-size: 0.8rem; padding: 6px 12px;">
                ${lockers.filter(l => l.status === 'Occupied').length} Loker Terisi
              </span>
              <span class="badge badge-emerald font-mono" style="font-size: 0.8rem; padding: 6px 12px;">
                ${lockers.filter(l => l.status === 'Available').length} Loker Tersedia
              </span>
            </div>
          </div>
        </div>

        <!-- Lockers Grid -->
        <div class="vault-locker-grid">
          ${lockers.map(l => {
            const isOccupied = l.status === 'Occupied';

            return `
              <div class="locker-card ${isOccupied ? 'occupied' : 'available'}">
                <i data-lucide="${isOccupied ? 'lock' : 'unlock'}" style="width: 22px; color: ${isOccupied ? 'var(--accent-amber)' : 'var(--accent-emerald)'};"></i>
                <div class="locker-number">${l.lockerNo}</div>
                <span class="locker-docs-badge ${isOccupied ? 'badge-amber' : 'badge-emerald'}">
                  ${isOccupied ? 'DITAHAN' : 'KOSONG'}
                </span>

                ${isOccupied ? `
                  <div style="font-size: 0.74rem; font-weight: 700; color: #fff; margin-top: 10px;">
                    ${l.customerName}
                  </div>
                  <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">
                    ${(l.documentsHeld || []).join(' + ')}
                  </div>
                  <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 4px;">
                    Kode: <strong>${l.bookingId}</strong>
                  </div>
                  <button class="btn btn-outline-emerald btn-sm mt-3 btn-release-locker" data-locker="${l.lockerNo}" style="width: 100%; font-size: 0.7rem; padding: 4px;">
                    Serahkan Kembali
                  </button>
                ` : `
                  <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 14px;">
                    Siap digunakan untuk booking baru
                  </div>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Tab 3: Dynamic QRIS Terminal -->
      <div id="tabQrisPane" class="tab-pane ${initialTab === 'qris' ? '' : 'hidden'}">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 960px; margin: 0 auto;">
          <div class="card" style="text-align: center; padding: 32px;">
            <div class="badge badge-emerald mb-3">QRIS Standar Bank Indonesia</div>
            <h3 style="font-size: 1.2rem; color: #fff; margin-bottom: 8px;">Scan untuk Pembayaran Instan</h3>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 20px;">
              Dapat di-scan dengan GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin Mandiri, BRImo, dll.
            </p>

            <div style="background: #fff; padding: 18px; border-radius: 12px; display: inline-block; box-shadow: 0 0 24px rgba(255,255,255,0.1);">
              <!-- Render modern realistic SVG QR Code -->
              <svg width="200" height="200" viewBox="0 0 100 100" fill="#000">
                <!-- QR positioning squares -->
                <rect x="5" y="5" width="25" height="25" fill="#000"/>
                <rect x="9" y="9" width="17" height="17" fill="#fff"/>
                <rect x="13" y="13" width="9" height="9" fill="#000"/>

                <rect x="70" y="5" width="25" height="25" fill="#000"/>
                <rect x="74" y="9" width="17" height="17" fill="#fff"/>
                <rect x="78" y="13" width="9" height="9" fill="#000"/>

                <rect x="5" y="70" width="25" height="25" fill="#000"/>
                <rect x="9" y="74" width="17" height="17" fill="#fff"/>
                <rect x="13" y="78" width="9" height="9" fill="#000"/>

                <!-- Simulated pattern dots -->
                <rect x="35" y="10" width="6" height="6"/>
                <rect x="45" y="15" width="8" height="6"/>
                <rect x="38" y="25" width="10" height="4"/>
                <rect x="55" y="10" width="6" height="12"/>
                <rect x="10" y="38" width="8" height="8"/>
                <rect x="25" y="45" width="6" height="14"/>
                <rect x="38" y="38" width="24" height="24" fill="#0284c7"/>
                <rect x="44" y="44" width="12" height="12" fill="#fff"/>
                <rect x="48" y="48" width="4" height="4" fill="#0284c7"/>
                <rect x="70" y="38" width="12" height="8"/>
                <rect x="85" y="42" width="6" height="16"/>
                <rect x="38" y="70" width="14" height="6"/>
                <rect x="56" y="65" width="8" height="18"/>
                <rect x="70" y="70" width="20" height="8"/>
                <rect x="75" y="82" width="15" height="8"/>
              </svg>
            </div>

            <div class="mt-4 font-mono font-bold" style="font-size: 1.1rem; color: #fff;">
              NMID: ID1020261928371
            </div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">Merchant: RentalKu Central Hub Denpasar</div>
          </div>

          <!-- Simulator Widget -->
          <div class="card" style="display: flex; flex-direction: column; justify-content: center;">
            <div class="card-header">
              <h3 class="card-title text-cyan"><i data-lucide="sparkles"></i> Simulator Transaksi Kasir</h3>
            </div>
            <div style="font-size: 0.83rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 14px;">
              <p>
                Gunakan simulator ini untuk menguji webhook notifikasi pelunasan instan secara real-time.
              </p>
              <div class="form-group">
                <label class="form-label">Pilih Reservasi yang Menunggu Verifikasi:</label>
                <select class="form-control form-select" id="simBookingSelect">
                  ${bookings.map(b => `
                    <option value="${b.id}">${b.bookingCode} — ${b.customerName} (${formatRupiah(b.grandTotal)})</option>
                  `).join('')}
                </select>
              </div>

              <button class="btn btn-primary" id="btnSimulatePayment">
                <i data-lucide="check-circle-2"></i> Simulasikan Notifikasi Pembayaran Berhasil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invoice Detail Modal -->
    <div id="modalInvoiceDetail" class="modal-backdrop">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h3 style="font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="file-text"></i> Cetak Invoice Resmi RentalKu
          </h3>
          <button class="btn btn-secondary btn-sm" id="btnCloseInvoice"><i data-lucide="x"></i></button>
        </div>
        <div class="modal-body" id="invoiceDetailBody">
          <!-- Injected dynamically -->
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="btnPrintInv">
            <i data-lucide="file-text"></i> Cetak Salinan
          </button>
          <button class="btn btn-primary" id="btnCloseInv2">Tutup</button>
        </div>
      </div>
    </div>
  `;

  initIcons();

  // Tab switching
  const tabButtons = container.querySelectorAll('.tab-button');
  const tabInvoices = container.querySelector('#tabInvoicesPane');
  const tabVault = container.querySelector('#tabVaultPane');
  const tabQris = container.querySelector('#tabQrisPane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.payTab;

      tabInvoices.classList.toggle('hidden', tab !== 'invoices');
      tabVault.classList.toggle('hidden', tab !== 'vault');
      tabQris.classList.toggle('hidden', tab !== 'qris');
    });
  });

  // Release locker button action
  container.querySelectorAll('.btn-release-locker').forEach(btn => {
    btn.addEventListener('click', async () => {
      const lockerNo = btn.dataset.locker;
      const confirmed = await showDialogConfirm({
        title: 'Konfirmasi Penyerahan Dokumen',
        message: `Serahkan kembali dokumen fisik asli di ${lockerNo} kepada pelanggan? Status loker akan kembali kosong.`,
        confirmText: 'Ya, Serahkan Kembali',
        cancelText: 'Batal',
        type: 'warning'
      });

      if (confirmed) {
        store.releaseLocker(lockerNo);
        renderPayments(container, 'vault');
        showDialogAlert({
          title: 'Dokumen Berhasil Dikembalikan',
          message: `Dokumen fisik di ${lockerNo} telah diserahkan kembali kepada pelanggan dan loker siap digunakan.`,
          type: 'success'
        });
      }
    });
  });

  // Simulator payment trigger
  container.querySelector('#btnSimulatePayment')?.addEventListener('click', () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    showDialogAlert({
      title: 'Pembayaran QRIS Sukses',
      message: 'Notifikasi Webhook Diterima: Transaksi QRIS berhasil diverifikasi lunas oleh sistem kasir!',
      type: 'success'
    });
  });

  // Print invoice modal logic
  const invModal = container.querySelector('#modalInvoiceDetail');
  const invBody = container.querySelector('#invoiceDetailBody');

  container.querySelectorAll('.btn-print-invoice').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.dataset.bookingId;
      const b = store.getBookingById(bId);
      if (!b) return;

      invBody.innerHTML = `
        <div style="background: var(--bg-surface-elevated); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-medium);">
          <div class="flex-between mb-4">
            <div>
              <h2 style="color: var(--accent-emerald); font-size: 1.3rem;">RentalKu</h2>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Sistem Sewa Kendaraan Lepas Kunci</div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge-emerald">LUNAS</span>
              <div class="font-mono" style="font-size: 0.8rem; color: #fff; margin-top: 4px;">INV-${b.bookingCode}</div>
            </div>
          </div>

          <div style="font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
            <div>Penyewa: <strong style="color: #fff;">${b.customerName}</strong> (${b.customerPhone})</div>
            <div>Kendaraan: <strong style="color: #fff;">${b.unitModel}</strong> (${b.unitPlate || '-'})</div>
            <div>Durasi: <strong style="color: #fff;">${b.durationDays ? `${b.durationDays} Hari` : `${b.durationHours} Jam`}</strong></div>
            <div>Loker Jaminan Identitas: <strong class="text-amber font-mono">${b.physicalDocsLocker || '-'}</strong></div>
          </div>

          <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem;">
            <div class="flex-between">
              <span>Sewa Pokok Kendaraan:</span>
              <span class="font-mono">${formatRupiah(b.rentalTotal)}</span>
            </div>
            <div class="flex-between">
              <span>Proteksi Asuransi (${b.insuranceName}):</span>
              <span class="font-mono">${formatRupiah(b.insuranceCost || 0)}</span>
            </div>
            <div class="flex-between">
              <span>Deposit Jaminan (Dapat Dikembalikan):</span>
              <span class="font-mono text-amber">${formatRupiah(b.cashDeposit || 0)}</span>
            </div>
            <div class="flex-between pt-2" style="border-top: 1px solid var(--border-medium); font-size: 1.05rem;">
              <strong style="color: #fff;">Grand Total Lunas:</strong>
              <strong class="font-mono text-emerald">${formatRupiah(b.grandTotal)}</strong>
            </div>
          </div>
        </div>
      `;

      invModal.classList.add('open');
    });
  });

  container.querySelector('#btnCloseInvoice')?.addEventListener('click', () => invModal.classList.remove('open'));
  container.querySelector('#btnCloseInv2')?.addEventListener('click', () => invModal.classList.remove('open'));
  container.querySelector('#btnPrintInv')?.addEventListener('click', () => {
    window.print();
  });
}
