// Custom Premium UI Dialog System (Replaces browser native alert and confirm)
import { initIcons } from './icons.js';
import confetti from 'canvas-confetti';

/**
 * Show a sleek custom modal alert
 * @param {Object} options
 * @param {string} options.title - Header text
 * @param {string} options.message - Descriptive text or HTML
 * @param {string} [options.type='success'] - 'success' | 'warning' | 'info' | 'error'
 * @param {string} [options.confirmText='Mengerti'] - Button label
 * @param {Array<{label: string, value: string}>} [options.details] - Key-value details rows
 * @returns {Promise<void>}
 */
export function showDialogAlert({
  title = 'Pemberitahuan',
  message = '',
  type = 'info',
  confirmText = 'Mengerti',
  details = null
}) {
  return new Promise((resolve) => {
    // Remove existing dialog if any
    const existing = document.getElementById('customAppDialog');
    if (existing) existing.remove();

    let iconName = 'check-circle-2';
    let iconClass = 'text-emerald';
    let glowClass = 'glow-emerald';

    if (type === 'warning') {
      iconName = 'alert-triangle';
      iconClass = 'text-amber';
      glowClass = 'glow-amber';
    } else if (type === 'error') {
      iconName = 'x-circle';
      iconClass = 'text-rose';
      glowClass = 'glow-rose';
    } else if (type === 'info') {
      iconName = 'bell';
      iconClass = 'text-cyan';
      glowClass = 'glow-cyan';
    }

    const backdrop = document.createElement('div');
    backdrop.id = 'customAppDialog';
    backdrop.className = 'custom-dialog-backdrop';

    backdrop.innerHTML = `
      <div class="custom-dialog-card ${glowClass}">
        <div class="dialog-icon-wrapper ${iconClass}">
          <i data-lucide="${iconName}" style="width: 38px; height: 38px;"></i>
        </div>

        <h3 class="dialog-title">${title}</h3>
        <p class="dialog-message">${message.replace(/\n/g, '<br>')}</p>

        ${details && details.length ? `
          <div class="dialog-details-box">
            ${details.map(d => `
              <div class="dialog-detail-row">
                <span class="detail-label">${d.label}</span>
                <span class="detail-value font-mono">${d.value}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="dialog-actions">
          <button class="btn btn-primary btn-lg" id="btnDialogConfirm" style="min-width: 160px; font-weight: 700;">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    initIcons();

    const btnConfirm = backdrop.querySelector('#btnDialogConfirm');
    btnConfirm.focus();

    const closeDialog = () => {
      backdrop.classList.add('closing');
      setTimeout(() => {
        backdrop.remove();
        resolve();
      }, 150);
    };

    btnConfirm.addEventListener('click', closeDialog);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeDialog();
    });

    const handleKeydown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        window.removeEventListener('keydown', handleKeydown);
        closeDialog();
      }
    };
    window.addEventListener('keydown', handleKeydown);
  });
}

/**
 * Show a sleek custom modal confirmation (Yes/Cancel)
 * @param {Object} options
 * @param {string} options.title - Header text
 * @param {string} options.message - Descriptive question
 * @param {string} [options.type='warning'] - 'warning' | 'danger' | 'info'
 * @param {string} [options.confirmText='Ya, Lanjutkan'] - Confirm button text
 * @param {string} [options.cancelText='Batal'] - Cancel button text
 * @returns {Promise<boolean>}
 */
export function showDialogConfirm({
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  type = 'warning',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal'
}) {
  return new Promise((resolve) => {
    const existing = document.getElementById('customAppDialog');
    if (existing) existing.remove();

    let iconName = 'alert-triangle';
    let iconClass = 'text-amber';
    let confirmBtnClass = 'btn-primary';

    if (type === 'danger') {
      iconName = 'trash-2';
      iconClass = 'text-rose';
      confirmBtnClass = 'btn-danger';
    }

    const backdrop = document.createElement('div');
    backdrop.id = 'customAppDialog';
    backdrop.className = 'custom-dialog-backdrop';

    backdrop.innerHTML = `
      <div class="custom-dialog-card glow-amber">
        <div class="dialog-icon-wrapper ${iconClass}">
          <i data-lucide="${iconName}" style="width: 38px; height: 38px;"></i>
        </div>

        <h3 class="dialog-title">${title}</h3>
        <p class="dialog-message">${message.replace(/\n/g, '<br>')}</p>

        <div class="dialog-actions-row">
          <button class="btn btn-secondary" id="btnDialogCancel" style="min-width: 120px;">
            ${cancelText}
          </button>
          <button class="btn ${confirmBtnClass}" id="btnDialogConfirmAction" style="min-width: 140px; font-weight: 700;">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    initIcons();

    const btnConfirm = backdrop.querySelector('#btnDialogConfirmAction');
    const btnCancel = backdrop.querySelector('#btnDialogCancel');
    btnConfirm.focus();

    const closeWithResult = (result) => {
      backdrop.classList.add('closing');
      setTimeout(() => {
        backdrop.remove();
        resolve(result);
      }, 150);
    };

    btnConfirm.addEventListener('click', () => closeWithResult(true));
    btnCancel.addEventListener('click', () => closeWithResult(false));
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeWithResult(false);
    });

    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        window.removeEventListener('keydown', handleKeydown);
        closeWithResult(false);
      }
    };
    window.addEventListener('keydown', handleKeydown);
  });
}

/**
 * Dedicated Booking Success Modal with receipt card, copyable code, and confetti
 */
export function showBookingSuccessDialog(booking, branch) {
  return new Promise((resolve) => {
    const existing = document.getElementById('customAppDialog');
    if (existing) existing.remove();

    confetti({
      particleCount: 130,
      spread: 80,
      origin: { y: 0.5 }
    });

    const backdrop = document.createElement('div');
    backdrop.id = 'customAppDialog';
    backdrop.className = 'custom-dialog-backdrop';

    backdrop.innerHTML = `
      <div class="custom-dialog-card glow-emerald" style="max-width: 520px; text-align: left;">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
          <div class="dialog-icon-wrapper text-emerald" style="margin: 0; width: 48px; height: 48px;">
            <i data-lucide="check-circle-2" style="width: 28px; height: 28px;"></i>
          </div>
          <div>
            <span class="badge badge-emerald font-mono">RESERVASI BERHASIL</span>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin-top: 2px;">
              Selamat! Booking Anda Diterbitkan
            </h3>
          </div>
        </div>

        <p style="font-size: 0.83rem; color: var(--text-secondary); margin-bottom: 18px; line-height: 1.5;">
          Data reservasi sewa lepas kunci telah tersimpan secara aman di sistem RentalKu.
        </p>

        <!-- Receipt Box -->
        <div class="dialog-details-box" style="margin-bottom: 18px;">
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 1px dashed var(--border-medium); margin-bottom: 10px;">
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Kode Booking Unik</div>
              <div class="font-mono font-bold text-cyan" style="font-size: 1.3rem;">${booking.bookingCode}</div>
            </div>
            <button class="btn btn-secondary btn-sm" id="btnCopyCode" title="Salin Kode">
              <i data-lucide="copy"></i> Salin
            </button>
          </div>

          <div class="dialog-detail-row">
            <span class="detail-label">Model Kendaraan:</span>
            <strong class="detail-value text-white">${booking.unitModel}</strong>
          </div>
          <div class="dialog-detail-row">
            <span class="detail-label">Alokasi Plat Unit:</span>
            <span class="detail-value font-mono text-emerald font-bold">${booking.unitPlate || 'Unit Siap'}</span>
          </div>
          <div class="dialog-detail-row">
            <span class="detail-label">Loker Jaminan Identitas:</span>
            <span class="detail-value badge badge-amber font-mono" style="font-size: 0.78rem;">
              <i data-lucide="lock" style="width: 12px; margin-right: 4px;"></i> ${booking.physicalDocsLocker || 'Loker Terjadwal'}
            </span>
          </div>
        </div>

        <!-- Warning Notice Box -->
        <div style="padding: 12px 16px; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); font-size: 0.78rem; color: #fbbf24; margin-bottom: 22px; line-height: 1.5;">
          <i data-lucide="lock" style="width: 14px; vertical-align: middle; margin-right: 4px;"></i>
          <strong>SOP Pengambilan Unit:</strong> Mohon bawa <strong>KTP Asli</strong> & <strong>SIM Asli</strong> Anda saat serah terima di <strong>${branch?.name || 'Garasi Pusat RentalKu'}</strong> untuk dititipkan di brankas loker jaminan.
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button class="btn btn-primary btn-lg" id="btnDialogSuccessClose" style="width: 100%; font-weight: 700;">
            <i data-lucide="check"></i> Selesai & Buka Halaman Utama
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    initIcons();

    const btnClose = backdrop.querySelector('#btnDialogSuccessClose');
    const btnCopy = backdrop.querySelector('#btnCopyCode');

    btnCopy?.addEventListener('click', () => {
      navigator.clipboard?.writeText(booking.bookingCode);
      btnCopy.innerHTML = `<i data-lucide="check"></i> Tersalin!`;
      initIcons();
      setTimeout(() => {
        btnCopy.innerHTML = `<i data-lucide="copy"></i> Salin`;
        initIcons();
      }, 2000);
    });

    const closeDialog = () => {
      backdrop.classList.add('closing');
      setTimeout(() => {
        backdrop.remove();
        resolve();
      }, 150);
    };

    btnClose.addEventListener('click', closeDialog);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeDialog();
    });
  });
}

/**
 * Automatically hook window.alert and window.confirm to use the custom UI dialog
 */
export function setupGlobalDialogOverrides() {
  window.alert = function (message) {
    showDialogAlert({
      title: 'Pemberitahuan Sistem',
      message: String(message),
      type: 'info'
    });
  };

  // Provide a safe confirm replacement if needed
  window.customConfirm = showDialogConfirm;
}
