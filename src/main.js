// Main Application Entry Point for RentalKu
import { setupNavigation } from './modules/navigation.js';
import { renderDashboard } from './modules/dashboard.js';
import { renderFleet } from './modules/fleet.js';
import { renderAvailabilityCalendar } from './modules/availabilityCalendar.js';
import { renderGpsTracking } from './modules/gpsTracking.js';
import { renderReservations } from './modules/reservations.js';
import { renderCustomers } from './modules/customers.js';
import { renderHandover } from './modules/handover.js';
import { renderPayments } from './modules/payments.js';
import { renderMaintenance } from './modules/maintenance.js';
import { renderPublicPortal } from './modules/publicPortal.js';
import { initIcons } from './utils/icons.js';

let currentRoute = 'dashboard';
let currentMode = 'admin'; // 'admin' | 'public'

const mainContent = document.getElementById('mainContent');
const sidebarEl = document.getElementById('appSidebar');
const pageTitleEl = document.getElementById('topbarPageTitle');
const breadcrumbEl = document.getElementById('topbarBreadcrumb');

const routeTitles = {
  dashboard: { title: 'Dashboard Operasional', sub: 'Ringkasan Armada, Booking, & Keuangan' },
  fleet: { title: 'Manajemen Armada', sub: 'Katalog Kendaraan & Unit Fisik (Plat Nomor)' },
  calendar: { title: 'Kalender Ketersediaan', sub: 'Timeline Gantt Jadwal Booking per Unit' },
  gps: { title: 'GPS Tracking Real-Time', sub: 'Peta Telemetri, Kontak Mesin, & Geofencing' },
  reservations: { title: 'Booking Lepas Kunci', sub: 'Daftar Reservasi & Penugasan Unit' },
  customers: { title: 'Data Master Penyewa', sub: 'Verifikasi KTP, SIM A (Mobil), & SIM C (Motor)' },
  handover: { title: 'Inspeksi Serah Terima', sub: 'Checklist Fisik, Foto, & Tanda Tangan Digital' },
  payments: { title: 'Keuangan & Invoices', sub: 'Transaksi Kasir, QRIS, & Rekonsiliasi' },
  vault: { title: 'Brankas Jaminan Identitas', sub: 'Manajemen Loker Penitipan KTP/SIM Asli' },
  maintenance: { title: 'Perawatan & Asuransi', sub: 'Jadwal Servis Berkala & Klaim Kerusakan' }
};

function navigate(route, param = null) {
  currentRoute = route;

  // Update Topbar
  if (routeTitles[route]) {
    pageTitleEl.textContent = routeTitles[route].title;
    breadcrumbEl.textContent = `RentalKu • ${routeTitles[route].sub}`;
  }

  // Update active link in sidebar
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.target === route);
  });

  // Render Target Module
  switch (route) {
    case 'dashboard':
      renderDashboard(mainContent, {
        onOpenNewBooking: (catId) => openNewBookingFlow(catId),
        onNavigate: (r, p) => navigate(r, p)
      });
      break;

    case 'fleet':
      renderFleet(mainContent, {
        onOpenNewBooking: (catId) => openNewBookingFlow(catId)
      });
      break;

    case 'calendar':
      renderAvailabilityCalendar(mainContent);
      break;

    case 'gps':
      renderGpsTracking(mainContent);
      break;

    case 'reservations':
      renderReservations(mainContent, {
        onOpenNewBooking: (catId) => openNewBookingFlow(catId),
        onNavigate: (r, p) => navigate(r, p)
      });
      break;

    case 'customers':
      renderCustomers(mainContent);
      break;

    case 'handover':
      renderHandover(mainContent, param);
      break;

    case 'payments':
      renderPayments(mainContent, param || 'invoices');
      break;

    case 'vault':
      renderPayments(mainContent, 'vault');
      break;

    case 'maintenance':
      renderMaintenance(mainContent);
      break;

    default:
      renderDashboard(mainContent, {
        onOpenNewBooking: () => openNewBookingFlow(),
        onNavigate: (r, p) => navigate(r, p)
      });
  }

  initIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openNewBookingFlow(catId = null) {
  navigate('reservations');
  setTimeout(() => {
    const btn = document.getElementById('btnCreateNewBooking');
    if (btn) btn.click();
    if (catId) {
      const select = document.getElementById('bookCatalogSelect');
      if (select) {
        select.value = catId;
        select.dispatchEvent(new Event('change'));
      }
    }
  }, 100);
}

function switchMode(mode) {
  currentMode = mode;
  if (mode === 'public') {
    sidebarEl.style.display = 'none';
    document.querySelector('.main-wrapper').style.marginLeft = '0';
    pageTitleEl.textContent = 'RentalKu Customer Portal';
    breadcrumbEl.textContent = 'Katalog Publik & Booking Sewa Mandiri';
    renderPublicPortal(mainContent, {
      onSwitchToAdmin: () => switchMode('admin')
    });
  } else {
    sidebarEl.style.display = 'flex';
    document.querySelector('.main-wrapper').style.marginLeft = '';
    navigate(currentRoute);
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation(
    (route) => navigate(route),
    (mode) => switchMode(mode)
  );

  navigate('dashboard');
});
