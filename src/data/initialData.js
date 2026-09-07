// Initial database seed for RentalKu - Expanded Fleet Edition
export const DATA_VERSION = 'v2.5';

export const INITIAL_BRANCH = {
  id: 'BR-01',
  name: 'RentalKu Central Hub — Garasi Utama',
  address: 'Jl. Bypass Ngurah Rai No. 88, Sanur, Denpasar, Bali 80227',
  phone: '+62 812-3456-7890',
  operatingHours: '07:00 - 22:00 WITA (Buka Setiap Hari)',
  facilities: ['Garasi 60 Unit Kendaraan', 'Brankas 16 Loker Jaminan Identitas Fisik', 'Service & Inspection Bay', 'Area Cuci & Prep Armada', 'Charging Station E-Bike'],
  geofence: {
    lat: -8.6852,
    lng: 115.2476,
    radiusMeters: 45000 // 45km rental coverage zone (Bali safe zone)
  }
};

export const INITIAL_CATALOG = [
  // --- KATEGORI MOBIL (TARIF HARIAN) ---
  {
    id: 'CAT-CAR-01',
    name: 'Toyota All New Avanza 1.5 CVT',
    category: 'Mobil',
    subCategory: 'MPV 7-Seater',
    pricingType: 'hari',
    dailyRate: 380000,
    hourlyRate: 50000,
    depositDefault: 500000,
    licenseRequired: 'SIM A',
    image: '/images/car_avanza.jpg',
    features: ['7 Penumpang', 'Transmisi Otomatis CVT', 'Mesin 1.5L Dual VVT-i', 'Dual Airbag', 'AC Double Blower', 'Audio Bluetooth', 'GPS Tracker Active'],
    description: 'MPV keluarga paling andal untuk perjalanan nyaman dan lapang di segala medan Bali & perkotaan.',
    status: 'Published'
  },
  {
    id: 'CAT-CAR-02',
    name: 'Honda Brio RS Urban Edition',
    category: 'Mobil',
    subCategory: 'City Car Compact',
    pricingType: 'hari',
    dailyRate: 320000,
    hourlyRate: 40000,
    depositDefault: 400000,
    licenseRequired: 'SIM A',
    image: '/images/car_brio.jpg',
    features: ['5 Penumpang', 'Transmisi CVT Hemat BBM', 'Mesin 1.2L i-VTEC', 'Velg Sporty 15"', 'Layar Touchscreen 7"', 'Mudah Parkir di Kota', 'GPS Tracker Active'],
    description: 'Hatchback lincah, gesit, dan sangat hemat bahan bakar. Pilihan terfavorit untuk pasangan & solo traveler.',
    status: 'Published'
  },
  {
    id: 'CAT-CAR-03',
    name: 'Toyota Innova Zenix Hybrid Luxury',
    category: 'Mobil',
    subCategory: 'Luxury MPV 7-Seater',
    pricingType: 'hari',
    dailyRate: 750000,
    hourlyRate: 85000,
    depositDefault: 1000000,
    licenseRequired: 'SIM A',
    image: '/images/car_zenix.jpg',
    features: ['7 Penumpang Captain Seat', 'Mesin 2.0L Hybrid EV', 'Panoramic Sunroof', 'Toyota Safety Sense (TSS)', 'Wireless Charger', 'Suspensi Ultra Lembut', 'GPS Tracker Active'],
    description: 'Kenyamanan kelas atas berteknologi Hybrid canggih dengan kabin senyap dan captain seat mewah.',
    status: 'Published'
  },
  {
    id: 'CAT-CAR-04',
    name: 'Toyota Fortuner GR Sport 4x4',
    category: 'Mobil',
    subCategory: 'Premium SUV 7-Seater',
    pricingType: 'hari',
    dailyRate: 950000,
    hourlyRate: 110000,
    depositDefault: 1500000,
    licenseRequired: 'SIM A',
    image: '/images/car_fortuner.jpg',
    features: ['7 Penumpang', 'Mesin 2.8L Diesel Turbo', 'Sistem Penggerak 4x4', 'Body Kit Sporty GR', 'Power Backdoor Kick Sensor', 'Gagah Menjelajah Alam', 'GPS Tracker Active'],
    description: 'SUV tangguh bertenaga buas untuk petualangan ke pegunungan Kintamani, Bedugul, dan pantai terpencil.',
    status: 'Published'
  },
  {
    id: 'CAT-CAR-05',
    name: 'Mitsubishi Xpander Ultimate',
    category: 'Mobil',
    subCategory: 'Comfort MPV 7-Seater',
    pricingType: 'hari',
    dailyRate: 420000,
    hourlyRate: 50000,
    depositDefault: 500000,
    licenseRequired: 'SIM A',
    image: '/images/car_avanza.jpg',
    features: ['7 Penumpang', 'Ground Clearance Tinggi', 'Transmisi Otomatis CVT', 'Kabin Kedap & Lapang', 'Cruising Comfort', 'GPS Tracker Active'],
    description: 'MPV modern dengan ground clearance tinggi layaknya SUV, sangat nyaman untuk jalan bergelombang.',
    status: 'Published'
  },

  // --- KATEGORI MOTOR (TARIF HARIAN) ---
  {
    id: 'CAT-BIKE-01',
    name: 'Yamaha NMAX 155 Connected',
    category: 'Motor',
    subCategory: 'Maxi Scooter 155cc',
    pricingType: 'hari',
    dailyRate: 140000,
    hourlyRate: 20000,
    depositDefault: 300000,
    licenseRequired: 'SIM C',
    image: '/images/bike_nmax.jpg',
    features: ['155cc VVA Engine', 'Keyless Smart Key', 'Dual Channel ABS', 'Bagasi Luas 24L', 'Electric Power Socket', 'TCS Traction Control', 'GPS Tracker Active'],
    description: 'Skuter matic bongsor bertenaga dengan posisi berkendara ergonomis dan bagasi super lega.',
    status: 'Published'
  },
  {
    id: 'CAT-BIKE-02',
    name: 'Honda Vario 160 ABS Sporty',
    category: 'Motor',
    subCategory: 'Sporty Scooter 160cc',
    pricingType: 'hari',
    dailyRate: 110000,
    hourlyRate: 15000,
    depositDefault: 250000,
    licenseRequired: 'SIM C',
    image: '/images/bike_vario.jpg',
    features: ['160cc 4-Katup eSP+', 'Sistem Rem ABS', 'Full Digital Panel Meter', 'Honda Smart Key System', 'USB Charger Console', 'Desain Agresif', 'GPS Tracker Active'],
    description: 'Performa akselerasi responsif dengan desain sporty tajam, sangat lincah membelah kepadatan lalu lintas.',
    status: 'Published'
  },
  {
    id: 'CAT-BIKE-03',
    name: 'Honda Beat Deluxe 110cc',
    category: 'Motor',
    subCategory: 'Matic Ringkas 110cc',
    pricingType: 'hari',
    dailyRate: 75000,
    hourlyRate: 12000,
    depositDefault: 200000,
    licenseRequired: 'SIM C',
    image: '/images/bike_beat.jpg',
    features: ['110cc eSP Hemat BBM', 'Idling Stop System (ISS)', 'Power Charger Socket', 'Rangka Ringan eSAF', 'Sangat Irit (60km/liter)', 'Mudah Dikendarai Siapa Saja', 'GPS Tracker Active'],
    description: 'Pilihan paling hemat dan bersahabat. Ringan, praktis, dan luar biasa irit untuk keliling area pantai.',
    status: 'Published'
  },
  {
    id: 'CAT-BIKE-04',
    name: 'Honda PCX 160 RoadSync',
    category: 'Motor',
    subCategory: 'Executive Scooter 160cc',
    pricingType: 'hari',
    dailyRate: 150000,
    hourlyRate: 20000,
    depositDefault: 350000,
    licenseRequired: 'SIM C',
    image: '/images/bike_nmax.jpg',
    features: ['160cc 4-Valves eSP+', 'HSTC Traction Control', 'Kapasitas Tangki 8.1L', 'Suspensi Belakang Nyaman', 'Lampu Full LED Mewah', 'GPS Tracker Active'],
    description: 'Skuter premium bernuansa elegan dan berwibawa dengan kenyamanan suspensi terbaik di kelasnya.',
    status: 'Published'
  },

  // --- KATEGORI SEPEDA (TARIF PER JAM) ---
  {
    id: 'CAT-BYC-01',
    name: 'Polygon Xtrada Mountain Bike (MTB)',
    category: 'Sepeda',
    subCategory: 'Sepeda Gunung MTB 29"',
    pricingType: 'jam', // Khusus sepeda: per jam!
    dailyRate: 150000,
    hourlyRate: 25000, // Rp 25k per jam
    depositDefault: 100000,
    licenseRequired: 'Tanpa SIM (KTP Saja)',
    image: '/images/bicycle_mtb.jpg',
    features: ['Frame Hydroformed Alloy ALX', 'Wheel 29 inch Maxxis', 'Shimano Deore 1x11 Speed', 'Hydraulic Disc Brakes', 'Suspension Fork with Lockout', 'Termasuk Helm & Gembok Kabel'],
    description: 'Sepeda gunung tangguh untuk gowes santai di tepi pantai maupun medan perbukitan berbatu.',
    status: 'Published'
  },
  {
    id: 'CAT-BYC-02',
    name: 'Polygon Path Smart E-Bike Commuter',
    category: 'Sepeda',
    subCategory: 'Sepeda Listrik Hybrid',
    pricingType: 'jam',
    dailyRate: 220000,
    hourlyRate: 40000, // Rp 40k per jam
    depositDefault: 200000,
    licenseRequired: 'Tanpa SIM (KTP Saja)',
    image: '/images/bicycle_ebike.jpg',
    features: ['Motor Elektrik Pedal Assist', 'Baterai Lithium 45km Range', 'Layar Display Speed & Battery', 'Hydraulic Disc Brake', 'Lampu Depan & Belakang Terintegrasi', 'Gowes Tanpa Keringat'],
    description: 'Sepeda listrik modern berdaya kayuh otomatis. Menikmati semilir angin pantai tanpa rasa lelah.',
    status: 'Published'
  },
  {
    id: 'CAT-BYC-03',
    name: 'Brompton C-Line Explore London',
    category: 'Sepeda',
    subCategory: 'Sepeda Lipat Premium',
    pricingType: 'jam',
    dailyRate: 280000,
    hourlyRate: 50000, // Rp 50k per jam
    depositDefault: 300000,
    licenseRequired: 'Tanpa SIM (KTP Saja)',
    image: '/images/bicycle_brompton.jpg',
    features: ['Original British Handmade', 'Lipat 3 Bagian Super Ringkas', 'Sadel Kulit Brooks', '6-Speed Wide Ratio', 'Bisa Masuk Bagasi Mobil / Kafe', 'Sangat Bergengsi & Estetik'],
    description: 'Sepeda lipat legendaris asal London. Desain estetik dan bisa dilipat dalam 15 detik untuk mampir ke kafe.',
    status: 'Published'
  },
  {
    id: 'CAT-BYC-04',
    name: 'Polygon Strattos Road Bike Carbon',
    category: 'Sepeda',
    subCategory: 'Sepeda Balap Road Bike',
    pricingType: 'jam',
    dailyRate: 200000,
    hourlyRate: 35000, // Rp 35k per jam
    depositDefault: 250000,
    licenseRequired: 'Tanpa SIM (KTP Saja)',
    image: '/images/bicycle_mtb.jpg',
    features: ['Frame ACX All-Rounder Carbon', 'Shimano 105 R7000 Groupset', 'Wheelset Aero 700c', 'Bobot Super Ringan (8.5kg)', 'Untuk Gowes Cepat Pagi Hari'],
    description: 'Sepeda balap ringan berkecepatan tinggi untuk pehobi gowes di jalur aspal mulus Bypass Bali.',
    status: 'Published'
  }
];

export const INITIAL_UNITS = [
  // --- UNIT MOBIL (Plat Nomor Nyata & GPS Telemetri Aktif) ---
  {
    id: 'U-01',
    catalogId: 'CAT-CAR-01',
    plateNumber: 'DK 1420 AX',
    engineNumber: '2NR-FE-881920',
    modelName: 'Toyota All New Avanza 1.5 CVT',
    category: 'Mobil',
    year: 2024,
    color: 'Polar White',
    condition: 'Sangat Baik',
    status: 'Disewa',
    odometerKm: 14250,
    fuelLevelPercent: 85,
    gpsId: 'GPS-AVZ-01',
    currentLocation: {
      lat: -8.6725,
      lng: 115.2280, // Sanur Area
      speedKmh: 42,
      heading: 125,
      engineStatus: 'ON',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-02',
    catalogId: 'CAT-CAR-01',
    plateNumber: 'DK 1892 CZ',
    engineNumber: '2NR-FE-993812',
    modelName: 'Toyota All New Avanza 1.5 CVT',
    category: 'Mobil',
    year: 2023,
    color: 'Silver Metallic',
    condition: 'Baik',
    status: 'Tersedia',
    odometerKm: 28900,
    fuelLevelPercent: 100,
    gpsId: 'GPS-AVZ-02',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'OFF',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-03',
    catalogId: 'CAT-CAR-02',
    plateNumber: 'DK 2011 BR',
    engineNumber: 'L12B-102910',
    modelName: 'Honda Brio RS Urban Edition',
    category: 'Mobil',
    year: 2024,
    color: 'Rallye Red',
    condition: 'Sangat Baik',
    status: 'Tersedia',
    odometerKm: 6400,
    fuelLevelPercent: 95,
    gpsId: 'GPS-BRIO-01',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'OFF',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-04',
    catalogId: 'CAT-CAR-02',
    plateNumber: 'DK 3310 BR',
    engineNumber: 'L12B-309182',
    modelName: 'Honda Brio RS Urban Edition',
    category: 'Mobil',
    year: 2024,
    color: 'Modern Steel Grey',
    condition: 'Sangat Baik',
    status: 'Disewa',
    odometerKm: 9800,
    fuelLevelPercent: 75,
    gpsId: 'GPS-BRIO-02',
    currentLocation: {
      lat: -8.7032,
      lng: 115.1762, // Kuta Area
      speedKmh: 32,
      heading: 180,
      engineStatus: 'ON',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-05',
    catalogId: 'CAT-CAR-03',
    plateNumber: 'DK 8901 ZX',
    engineNumber: 'M20A-FXS-7721',
    modelName: 'Toyota Innova Zenix Hybrid Luxury',
    category: 'Mobil',
    year: 2024,
    color: 'Dark Grey Mica',
    condition: 'Istimewa / Seperti Baru',
    status: 'Tersedia',
    odometerKm: 4120,
    fuelLevelPercent: 100,
    gpsId: 'GPS-ZNX-01',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'OFF',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-06',
    catalogId: 'CAT-CAR-04',
    plateNumber: 'DK 4010 FT',
    engineNumber: '1GD-FTV-9901',
    modelName: 'Toyota Fortuner GR Sport 4x4',
    category: 'Mobil',
    year: 2024,
    color: 'Attitude Black',
    condition: 'Sangat Baik',
    status: 'Tersedia',
    odometerKm: 11500,
    fuelLevelPercent: 90,
    gpsId: 'GPS-FTN-01',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'OFF',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-07',
    catalogId: 'CAT-CAR-05',
    plateNumber: 'DK 5521 XP',
    engineNumber: '4A91-55102',
    modelName: 'Mitsubishi Xpander Ultimate',
    category: 'Mobil',
    year: 2023,
    color: 'Quartz White Pearl',
    condition: 'Baik',
    status: 'Dalam Servis',
    odometerKm: 31200,
    fuelLevelPercent: 60,
    gpsId: 'GPS-XPD-01',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'OFF',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },

  // --- UNIT MOTOR (Plat Nomor Nyata & GPS Telemetri Aktif) ---
  {
    id: 'U-08',
    catalogId: 'CAT-BIKE-01',
    plateNumber: 'DK 5821 FX',
    engineNumber: 'G3E4E-339102',
    modelName: 'Yamaha NMAX 155 Connected',
    category: 'Motor',
    year: 2024,
    color: 'Matte Black',
    condition: 'Sangat Baik',
    status: 'Disewa',
    odometerKm: 8120,
    fuelLevelPercent: 70,
    gpsId: 'GPS-NMX-01',
    currentLocation: {
      lat: -8.7210,
      lng: 115.1780, // Jimbaran Area
      speedKmh: 38,
      heading: 210,
      engineStatus: 'ON',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-09',
    catalogId: 'CAT-BIKE-01',
    plateNumber: 'DK 3912 BL',
    engineNumber: 'G3E4E-551029',
    modelName: 'Yamaha NMAX 155 Connected',
    category: 'Motor',
    year: 2023,
    color: 'Matte Blue',
    condition: 'Baik',
    status: 'Tersedia',
    odometerKm: 16500,
    fuelLevelPercent: 95,
    gpsId: 'GPS-NMX-02',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'OFF',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-10',
    catalogId: 'CAT-BIKE-02',
    plateNumber: 'DK 6012 BT',
    engineNumber: 'KF71E-102910',
    modelName: 'Honda Vario 160 ABS Sporty',
    category: 'Motor',
    year: 2024,
    color: 'Grande Matte Red',
    condition: 'Sangat Baik',
    status: 'Tersedia',
    odometerKm: 5200,
    fuelLevelPercent: 90,
    gpsId: 'GPS-VAR-01',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'OFF',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-11',
    catalogId: 'CAT-BIKE-02',
    plateNumber: 'DK 6910 BT',
    engineNumber: 'KF71E-309182',
    modelName: 'Honda Vario 160 ABS Sporty',
    category: 'Motor',
    year: 2024,
    color: 'Active Matte Black',
    condition: 'Sangat Baik',
    status: 'Disewa',
    odometerKm: 7800,
    fuelLevelPercent: 80,
    gpsId: 'GPS-VAR-02',
    currentLocation: {
      lat: -8.6500,
      lng: 115.1320, // Canggu Area
      speedKmh: 45,
      heading: 290,
      engineStatus: 'ON',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-12',
    catalogId: 'CAT-BIKE-03',
    plateNumber: 'DK 7120 VR',
    engineNumber: 'JM81E-449102',
    modelName: 'Honda Beat Deluxe 110cc',
    category: 'Motor',
    year: 2024,
    color: 'Deluxe Silver',
    condition: 'Sangat Baik',
    status: 'Tersedia',
    odometerKm: 3400,
    fuelLevelPercent: 100,
    gpsId: 'GPS-BEAT-01',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'OFF',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-13',
    catalogId: 'CAT-BIKE-03',
    plateNumber: 'DK 7890 VR',
    engineNumber: 'JM81E-771920',
    modelName: 'Honda Beat Deluxe 110cc',
    category: 'Motor',
    year: 2024,
    color: 'Deluxe Black',
    condition: 'Sangat Baik',
    status: 'Tersedia',
    odometerKm: 4800,
    fuelLevelPercent: 90,
    gpsId: 'GPS-BEAT-02',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'OFF',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-14',
    catalogId: 'CAT-BIKE-04',
    plateNumber: 'DK 2390 PC',
    engineNumber: 'KF52E-119201',
    modelName: 'Honda PCX 160 RoadSync',
    category: 'Motor',
    year: 2024,
    color: 'Imperial Matte Blue',
    condition: 'Sangat Baik',
    status: 'Tersedia',
    odometerKm: 3100,
    fuelLevelPercent: 95,
    gpsId: 'GPS-PCX-01',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'OFF',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },

  // --- UNIT SEPEDA (Kode Inventaris Fisik, Tarif Per Jam & GPS Tracking Aktif) ---
  {
    id: 'U-15',
    catalogId: 'CAT-BYC-01',
    plateNumber: 'BYC-XTR-01',
    engineNumber: 'PGN-XT7-2024-001',
    modelName: 'Polygon Xtrada Mountain Bike',
    category: 'Sepeda',
    year: 2024,
    color: 'Teal Black',
    condition: 'Sangat Baik',
    status: 'Tersedia',
    odometerKm: 340,
    fuelLevelPercent: 100,
    gpsId: 'GPS-BYC-01',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'Standby / Parkir',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-16',
    catalogId: 'CAT-BYC-01',
    plateNumber: 'BYC-XTR-02',
    engineNumber: 'PGN-XT7-2024-002',
    modelName: 'Polygon Xtrada Mountain Bike',
    category: 'Sepeda',
    year: 2024,
    color: 'Teal Black',
    condition: 'Baik',
    status: 'Disewa',
    odometerKm: 510,
    fuelLevelPercent: 100,
    gpsId: 'GPS-BYC-02',
    currentLocation: {
      lat: -8.6940,
      lng: 115.2635, // Sanur Beach Cycling Track
      speedKmh: 18,
      heading: 140,
      engineStatus: 'Gowes Aktif (Pedaling)',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-17',
    catalogId: 'CAT-BYC-02',
    plateNumber: 'BYC-EBK-01',
    engineNumber: 'PGN-EBK-2024-101',
    modelName: 'Polygon Path Smart E-Bike',
    category: 'Sepeda',
    year: 2024,
    color: 'Matte Graphite',
    condition: 'Sangat Baik',
    status: 'Tersedia',
    odometerKm: 180,
    fuelLevelPercent: 100,
    gpsId: 'GPS-EBK-01',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'Standby / Parkir',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-18',
    catalogId: 'CAT-BYC-02',
    plateNumber: 'BYC-EBK-02',
    engineNumber: 'PGN-EBK-2024-102',
    modelName: 'Polygon Path Smart E-Bike',
    category: 'Sepeda',
    year: 2024,
    color: 'Matte Graphite',
    condition: 'Sangat Baik',
    status: 'Disewa',
    odometerKm: 220,
    fuelLevelPercent: 90,
    gpsId: 'GPS-EBK-02',
    currentLocation: {
      lat: -8.7070,
      lng: 115.2530, // Pantai Mertasari
      speedKmh: 24,
      heading: 190,
      engineStatus: 'Motor Listrik Assist ON',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-19',
    catalogId: 'CAT-BYC-03',
    plateNumber: 'BYC-BRM-01',
    engineNumber: 'BRM-LDN-2024-001',
    modelName: 'Brompton C-Line Explore London',
    category: 'Sepeda',
    year: 2024,
    color: 'Racing Green & Tan Leather',
    condition: 'Istimewa / Seperti Baru',
    status: 'Disewa',
    odometerKm: 95,
    fuelLevelPercent: 100,
    gpsId: 'GPS-BRM-01',
    currentLocation: {
      lat: -8.6912,
      lng: 115.1685, // Seminyak Area
      speedKmh: 14,
      heading: 80,
      engineStatus: 'Gowes Aktif (Pedaling)',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-20',
    catalogId: 'CAT-BYC-03',
    plateNumber: 'BYC-BRM-02',
    engineNumber: 'BRM-LDN-2024-002',
    modelName: 'Brompton C-Line Explore London',
    category: 'Sepeda',
    year: 2024,
    color: 'Flame Lacquer',
    condition: 'Sangat Baik',
    status: 'Tersedia',
    odometerKm: 140,
    fuelLevelPercent: 100,
    gpsId: 'GPS-BRM-02',
    currentLocation: {
      lat: -8.6852,
      lng: 115.2476,
      speedKmh: 0,
      heading: 0,
      engineStatus: 'Standby / Parkir',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'U-21',
    catalogId: 'CAT-BYC-04',
    plateNumber: 'BYC-STR-01',
    engineNumber: 'PGN-STR-2024-991',
    modelName: 'Polygon Strattos Road Bike Carbon',
    category: 'Sepeda',
    year: 2024,
    color: 'Gloss Carbon White',
    condition: 'Sangat Baik',
    status: 'Tersedia',
    odometerKm: 320,
    fuelLevelPercent: 100,
    gpsId: 'GPS-STR-01',
    currentLocation: {
      lat: -8.6750,
      lng: 115.2400,
      speedKmh: 28,
      heading: 20,
      engineStatus: 'Gowes Cepat (Road Cycling)',
      isOutOfBounds: false,
      lastUpdate: new Date().toISOString()
    }
  }
];

export const INSURANCE_PACKAGES = [
  {
    id: 'INS-01',
    name: 'Standar Rental Protection',
    dailyPrice: 0,
    dailyMotorPrice: 0,
    hourlyPrice: 0,
    deductibleRate: 0.5,
    description: 'Perlindungan dasar standar rental. Penyewa menanggung 50% dari total estimasi biaya perbaikan insiden fisik.'
  },
  {
    id: 'INS-02',
    name: 'All-Risk Gold Protection',
    dailyPrice: 75000, // Rp 75k/hari untuk mobil
    dailyMotorPrice: 35000, // Rp 35k/hari untuk motor
    hourlyPrice: 5000, // Rp 5k/jam untuk sepeda
    deductibleRate: 0, // 0% deductible
    description: 'Bebas cemas 100%! Tanggungan klaim penuh hingga Rp 5.000.000 tanpa potongan deposit untuk baret & lecet tidak sengaja.'
  },
  {
    id: 'INS-03',
    name: 'Total Loss Protection (TLO)',
    dailyPrice: 40000,
    dailyMotorPrice: 20000,
    hourlyPrice: 3000,
    deductibleRate: 0.2,
    description: 'Proteksi untuk kerusakan berat di atas 75% atau kehilangan unit kendaraan.'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-01',
    name: 'Budi Santoso',
    phone: '081298765432',
    email: 'budi.santoso@gmail.com',
    nik: '3171012908850001',
    ktpVerified: true,
    simA: 'SIM-A-8819201920',
    simAVerified: true,
    simC: 'SIM-C-9918291029',
    simCVerified: true,
    address: 'Jl. Melati No. 14, Jakarta Selatan',
    rentalCount: 5,
    rating: 5.0,
    notes: 'Pelanggan loyal, selalu tepat waktu & unit kembali bersih.'
  },
  {
    id: 'CUST-02',
    name: 'Sarah Wijaya',
    phone: '081377889900',
    email: 'sarah.wijaya@outlook.com',
    nik: '5171025501920003',
    ktpVerified: true,
    simA: null,
    simAVerified: false,
    simC: 'SIM-C-5510291823',
    simCVerified: true,
    address: 'Jl. Sunset Road No. 22, Seminyak, Bali',
    rentalCount: 3,
    rating: 4.8,
    notes: 'Sering sewa motor matic untuk keliling Bali.'
  },
  {
    id: 'CUST-03',
    name: 'Kevin Pratama',
    phone: '085611223344',
    email: 'kevin.p@yahoo.com',
    nik: '3273011405980004',
    ktpVerified: true,
    simA: null,
    simAVerified: false,
    simC: null,
    simCVerified: false,
    address: 'Jl. Dago Asri No. 5, Bandung',
    rentalCount: 2,
    rating: 5.0,
    notes: 'Sewa sepeda untuk rute gowes Sanur - Pantai Mertasari.'
  },
  {
    id: 'CUST-04',
    name: 'Denny Sumargo',
    phone: '081190223311',
    email: 'denny.s@gmail.com',
    nik: '3174021204890002',
    ktpVerified: true,
    simA: 'SIM-A-77019201',
    simAVerified: true,
    simC: null,
    simCVerified: false,
    address: 'Pondok Indah Blok B-4, Jakarta',
    rentalCount: 1,
    rating: 5.0,
    notes: 'Sewa Fortuner 4x4 untuk trip Bedugul.'
  }
];

// Expanded Physical Document Vault Lockers (16 Lokers)
export const INITIAL_VAULT_LOCKERS = [
  {
    lockerNo: 'LOKER-A01',
    status: 'Occupied',
    bookingId: 'BK-2026-001',
    customerName: 'Budi Santoso',
    documentsHeld: ['KTP Asli Fisik', 'SIM A Asli Fisik'],
    depositDateTime: '2026-09-06T09:00:00.000Z',
    notes: 'Disimpan di tray A-1 saat pickup Avanza DK 1420 AX.'
  },
  {
    lockerNo: 'LOKER-A02',
    status: 'Occupied',
    bookingId: 'BK-2026-002',
    customerName: 'Sarah Wijaya',
    documentsHeld: ['KTP Asli Fisik', 'SIM C Asli Fisik'],
    depositDateTime: '2026-09-07T08:30:00.000Z',
    notes: 'Disimpan di tray A-2 saat pickup NMAX DK 5821 FX.'
  },
  {
    lockerNo: 'LOKER-A03',
    status: 'Occupied',
    bookingId: 'BK-2026-003',
    customerName: 'Kevin Pratama',
    documentsHeld: ['KTP Asli Fisik'],
    depositDateTime: '2026-09-07T09:15:00.000Z',
    notes: 'Disimpan di tray A-3 saat sewa Polygon Xtrada.'
  },
  {
    lockerNo: 'LOKER-A04',
    status: 'Occupied',
    bookingId: 'BK-2026-004',
    customerName: 'Denny Sumargo',
    documentsHeld: ['KTP Asli Fisik', 'SIM A Asli Fisik'],
    depositDateTime: '2026-09-07T09:40:00.000Z',
    notes: 'Disimpan di tray A-4 saat pickup Brio RS DK 3310 BR.'
  },
  { lockerNo: 'LOKER-A05', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' },
  { lockerNo: 'LOKER-A06', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' },
  { lockerNo: 'LOKER-A07', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' },
  { lockerNo: 'LOKER-A08', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' },
  { lockerNo: 'LOKER-A09', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' },
  { lockerNo: 'LOKER-A10', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' },
  { lockerNo: 'LOKER-A11', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' },
  { lockerNo: 'LOKER-A12', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' },
  { lockerNo: 'LOKER-A13', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' },
  { lockerNo: 'LOKER-A14', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' },
  { lockerNo: 'LOKER-A15', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' },
  { lockerNo: 'LOKER-A16', status: 'Available', bookingId: null, customerName: null, documentsHeld: [], depositDateTime: null, notes: '' }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'BK-2026-001',
    bookingCode: 'RK-AVZ-991',
    customerId: 'CUST-01',
    customerName: 'Budi Santoso',
    customerPhone: '081298765432',
    unitId: 'U-01',
    unitPlate: 'DK 1420 AX',
    unitModel: 'Toyota All New Avanza 1.5 CVT',
    category: 'Mobil',
    startTime: '2026-09-06T09:00:00.000Z',
    endTime: '2026-09-08T09:00:00.000Z',
    pricingType: 'hari',
    durationDays: 2,
    baseRate: 380000,
    rentalTotal: 760000,
    insuranceId: 'INS-02',
    insuranceName: 'All-Risk Gold Protection',
    insuranceCost: 150000,
    cashDeposit: 500000,
    physicalDocsLocker: 'LOKER-A01',
    physicalDocs: ['KTP Asli', 'SIM A Asli'],
    grandTotal: 1410000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    bookingStatus: 'Berlangsung',
    handoverPickupDone: true,
    handoverReturnDone: false,
    createdAt: '2026-09-05T14:30:00.000Z'
  },
  {
    id: 'BK-2026-002',
    bookingCode: 'RK-NMX-882',
    customerId: 'CUST-02',
    customerName: 'Sarah Wijaya',
    customerPhone: '081377889900',
    unitId: 'U-08',
    unitPlate: 'DK 5821 FX',
    unitModel: 'Yamaha NMAX 155 Connected',
    category: 'Motor',
    startTime: '2026-09-07T08:30:00.000Z',
    endTime: '2026-09-09T08:30:00.000Z',
    pricingType: 'hari',
    durationDays: 2,
    baseRate: 140000,
    rentalTotal: 280000,
    insuranceId: 'INS-01',
    insuranceName: 'Standar Rental Protection',
    insuranceCost: 0,
    cashDeposit: 300000,
    physicalDocsLocker: 'LOKER-A02',
    physicalDocs: ['KTP Asli', 'SIM C Asli'],
    grandTotal: 580000,
    paymentMethod: 'Transfer Bank (BCA)',
    paymentStatus: 'Lunas',
    bookingStatus: 'Berlangsung',
    handoverPickupDone: true,
    handoverReturnDone: false,
    createdAt: '2026-09-06T19:00:00.000Z'
  },
  {
    id: 'BK-2026-003',
    bookingCode: 'RK-XTR-103',
    customerId: 'CUST-03',
    customerName: 'Kevin Pratama',
    customerPhone: '085611223344',
    unitId: 'U-16',
    unitPlate: 'BYC-XTR-02',
    unitModel: 'Polygon Xtrada Mountain Bike',
    category: 'Sepeda',
    startTime: '2026-09-07T09:15:00.000Z',
    endTime: '2026-09-07T13:15:00.000Z',
    pricingType: 'jam',
    durationHours: 4,
    baseRate: 25000,
    rentalTotal: 100000,
    insuranceId: 'INS-01',
    insuranceName: 'Standar Rental Protection',
    insuranceCost: 0,
    cashDeposit: 100000,
    physicalDocsLocker: 'LOKER-A03',
    physicalDocs: ['KTP Asli'],
    grandTotal: 200000,
    paymentMethod: 'Tunai (Cash)',
    paymentStatus: 'Lunas',
    bookingStatus: 'Berlangsung',
    handoverPickupDone: true,
    handoverReturnDone: false,
    createdAt: '2026-09-07T08:50:00.000Z'
  },
  {
    id: 'BK-2026-004',
    bookingCode: 'RK-BRI-440',
    customerId: 'CUST-04',
    customerName: 'Denny Sumargo',
    customerPhone: '081190223311',
    unitId: 'U-04',
    unitPlate: 'DK 3310 BR',
    unitModel: 'Honda Brio RS Urban Edition',
    category: 'Mobil',
    startTime: '2026-09-07T09:40:00.000Z',
    endTime: '2026-09-10T09:40:00.000Z',
    pricingType: 'hari',
    durationDays: 3,
    baseRate: 320000,
    rentalTotal: 960000,
    insuranceId: 'INS-02',
    insuranceName: 'All-Risk Gold Protection',
    insuranceCost: 225000,
    cashDeposit: 400000,
    physicalDocsLocker: 'LOKER-A04',
    physicalDocs: ['KTP Asli', 'SIM A Asli'],
    grandTotal: 1585000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    bookingStatus: 'Berlangsung',
    handoverPickupDone: true,
    handoverReturnDone: false,
    createdAt: '2026-09-07T09:30:00.000Z'
  }
];

export const INITIAL_HANDOVERS = [
  {
    id: 'HO-01',
    bookingId: 'BK-2026-001',
    type: 'Pickup',
    timestamp: '2026-09-06T09:05:00.000Z',
    staffName: 'Rendi (Staff Lapangan)',
    checklist: {
      bodyOuter: 'Mulus Bersih',
      tiresAndRims: 'Tekanan Angin Baik & Velg Mulus',
      lightsAndIndicators: 'Semua Menyala Normal',
      acAndAudio: 'Dingin & Berfungsi Baik',
      stnkPresent: true,
      spareKeyPresent: true,
      starterTest: 'Normal Cepat'
    },
    initialKm: 14210,
    fuelLevel: '85%',
    customerSignature: 'Signed by Budi Santoso',
    photos: ['/images/car_avanza.jpg']
  }
];

export const INITIAL_SERVICES = [
  {
    id: 'SRV-01',
    unitId: 'U-02',
    plateNumber: 'DK 1892 CZ',
    modelName: 'Toyota All New Avanza 1.5 CVT',
    serviceType: 'Servis Berkala 30.000 KM',
    scheduledDate: '2026-09-12',
    targetKm: 30000,
    currentKm: 28900,
    status: 'Terjadwal',
    costEstimate: 850000,
    vendor: 'Auto2000 Sanur'
  },
  {
    id: 'SRV-02',
    unitId: 'U-09',
    plateNumber: 'DK 3912 BL',
    modelName: 'Yamaha NMAX 155 Connected',
    serviceType: 'Ganti Oli & CVT Check',
    scheduledDate: '2026-09-15',
    targetKm: 17000,
    currentKm: 16500,
    status: 'Terjadwal',
    costEstimate: 220000,
    vendor: 'Yamaha Surya Motor'
  },
  {
    id: 'SRV-03',
    unitId: 'U-07',
    plateNumber: 'DK 5521 XP',
    modelName: 'Mitsubishi Xpander Ultimate',
    serviceType: 'Brake Pad Replacement & Tune Up',
    scheduledDate: '2026-09-08',
    targetKm: 32000,
    currentKm: 31200,
    status: 'Dalam Pengerjaan',
    costEstimate: 1200000,
    vendor: 'Mitsubishi Denpasar'
  }
];

export const INITIAL_DAMAGE_CLAIMS = [
  {
    id: 'CLM-01',
    bookingId: 'BK-HIST-990',
    unitId: 'U-02',
    plateNumber: 'DK 1892 CZ',
    modelName: 'Toyota All New Avanza 1.5 CVT',
    incidentDate: '2026-08-28',
    description: 'Baret halus 15cm pada bemper kanan depan saat parkir minimarket.',
    repairCost: 450000,
    insuranceCoverage: 450000,
    customerDeduction: 0,
    status: 'Selesai Diperbaiki',
    claimApproved: true
  }
];
