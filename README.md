# 🚗 RentalKu — Sistem Manajemen Sewa Kendaraan (Motor, Mobil, Sepeda)

> **Platform Manajemen Rental Kendaraan Lepas Kunci Terpadu** yang dilengkapi pelacakan GPS *real-time*, brankas loker jaminan fisik identitas (KTP/SIM), inspeksi serah terima (*handover*) digital bertanda tangan, serta portal pemesanan mandiri untuk pelanggan.

---

## 🌟 Fitur Unggulan

1. **🏢 Garasi Pusat Terpadu (1 Cabang Utama)**
   - Operasional terpusat di Garasi Pusat (RentalKu Central Hub) dengan fasilitas *inspection bay*, *service bay*, dan brankas loker dokumen jaminan.
2. **🔑 Murni Lepas Kunci (100% Self-Drive)**
   - Validasi kepatuhan hukum berkendara (Wajib SIM A untuk Mobil, SIM C untuk Motor, tanpa SIM untuk Sepeda).
3. **💳 Multi-Metode Pembayaran & Brankas Jaminan Identitas Fisik**
   - Mendukung pembayaran **Tunai (Cash)**, **Transfer Bank (BCA & Mandiri)**, dan **Terminal QRIS Dinamis**.
   - **Physical Document Vault (16 Loker Jaminan)**: Melacak penahanan KTP dan SIM fisik asli penyewa selama masa sewa dan pelepasan otomatis saat unit kembali.
4. **📡 GPS Tracking Real-Time & Telemetri Armada**
   - Peta interaktif satelit/dark Leaflet dengan simulasi pergerakan armada Mobil & Motor.
   - Indikator kecepatan (*speedometer* km/h), status kontak mesin ON/OFF, level BBM, odometer, geofence radius aman (45 KM), serta tombol darurat **Remote Engine Kill (Immobilizer)**.
5. **🛡️ Proteksi Asuransi Terintegrasi**
   - Pilihan paket: **Standar Protection** (*deductible* 50%), **All-Risk Gold** (0% *deductible* untuk baret/lecet halus), dan **TLO**.
   - Modul *Damage & Claims* yang mengkalkulasi otomatis tanggungan asuransi vs pemotongan deposit penyewa.
6. **⏱️ Diferensiasi Satuan Tarif Sewa**
   - **Sepeda**: Dihitung **per jam** (*hourly rate*, mulai Rp 25.000/jam).
   - **Motor & Mobil**: Dihitung **per hari** (*daily rate*, mulai Rp 75.000/hari untuk motor dan Rp 320.000/hari untuk mobil).
7. **✍️ Inspeksi Digital Handover (Pickup & Return)**
   - Checklist kondisi fisik multi-titik (bodi, ban, lampu, kelengkapan STNK & kunci kontak).
   - **Canvas Tanda Tangan Digital** untuk penyewa dan staf operasional.
   - Deteksi otomatis kerusakan baru saat unit kembali untuk penerbitan klaim kerusakan.
8. **🌐 Customer Public Portal (Situs Publik Mandiri)**
   - Calon penyewa dapat memilih armada, memesan mandiri, menghitung estimasi biaya seketika, dan melacak status reservasi menggunakan kode booking.

---

## 🚘 Variasi Armada Kendaraan

- **Mobil (5 Varian)**: Toyota Avanza 1.5 CVT, Honda Brio RS Urban, Toyota Innova Zenix Hybrid, Toyota Fortuner GR Sport 4x4, Mitsubishi Xpander Ultimate.
- **Motor (4 Varian)**: Yamaha NMAX 155 Connected, Honda Vario 160 ABS, Honda Beat Deluxe 110cc, Honda PCX 160 RoadSync.
- **Sepeda (4 Varian)**: Polygon Xtrada MTB 29", Polygon Path Smart E-Bike, Brompton C-Line London Foldable, Polygon Strattos Road Bike Carbon.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, Vanilla JavaScript (ES6+ Modular Architecture), CSS3 (Modern Vanilla CSS dengan Glassmorphism & Responsive Layout).
- **Mapping & Geolocation**: Leaflet.js & OpenStreetMap (CartoDB Dark Tiles).
- **Icons & Visuals**: Lucide Icons, Canvas-Confetti, HTML5 Canvas Signature Pad.
- **Build Tool**: Vite 6.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Prasyarat
- Node.js (versi 18 ke atas)
- NPM atau PNPM

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Development Lokal
```bash
npm run dev
```
Akses aplikasi melalui browser di: **`http://localhost:3000/`**

### 4. Melakukan Build untuk Produksi
```bash
npm run build
```

---

## 📂 Struktur Direktori Proyek

```
Rentalku/
├── index.html                   # Entry point aplikasi web
├── package.json                 # Konfigurasi dependensi dan scripts
├── vite.config.js               # Konfigurasi server Vite
├── PRD_RentalKu_Sewa_Kendaraan.md # Dokumen PRD spesifikasi lengkap
├── public/
│   └── images/                  # Aset foto studio komersial kendaraan & logo
└── src/
    ├── main.js                  # Router dan inisialisasi aplikasi
    ├── styles/                  # Arsitektur CSS Vanilla
    │   ├── variables.css        # Token warna, gradien, tipografi
    │   ├── layout.css           # Sidebar, topbar, grid layout
    │   ├── components.css       # Modals, buttons, cards, tables, badges
    │   ├── modules.css          # Styling khusus GPS HUD, timeline, loker
    │   └── main.css             # Bundle utama CSS
    ├── data/
    │   ├── initialData.js       # Seed data armada, unit fisik, loker, & booking
    │   └── store.js             # Reactive store dengan LocalStorage persistence
    ├── utils/
    │   ├── icons.js             # Helper ikon Lucide
    │   ├── formatters.js        # Format mata uang Rupiah, tanggal, kalkulasi durasi
    │   └── signaturePad.js      # Engine canvas tanda tangan digital
    └── modules/
        ├── navigation.js        # Kontrol navigasi sidebar & mode switcher
        ├── dashboard.js         # Dashboard analitik & KPI
        ├── fleet.js             # Manajemen katalog & unit fisik individual
        ├── availabilityCalendar.js # Kalender ketersediaan (Gantt timeline 7 hari)
        ├── gpsTracking.js       # Peta real-time GPS & remote immobilizer
        ├── reservations.js      # Manajemen booking & modal kalkulasi harga
        ├── customers.js         # Master data penyewa & verifikasi KTP/SIM
        ├── handover.js          # Checklist serah terima fisik & tanda tangan
        ├── payments.js          # Kasir invoice, QRIS dinamis, & brankas jaminan loker
        ├── maintenance.js       # Jadwal servis armada & klaim asuransi
        └── publicPortal.js      # Situs publik customer-facing & pelacak booking
```

---

## 📄 Lisensi
Hak Cipta © 2026 RentalKu Team. Seluruh hak cipta dilindungi undang-undang.
