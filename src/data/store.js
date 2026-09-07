// Reactive Data Store with LocalStorage Persistence for RentalKu
import {
  DATA_VERSION,
  INITIAL_BRANCH,
  INITIAL_CATALOG,
  INITIAL_UNITS,
  INITIAL_CUSTOMERS,
  INITIAL_VAULT_LOCKERS,
  INITIAL_BOOKINGS,
  INITIAL_HANDOVERS,
  INITIAL_SERVICES,
  INITIAL_DAMAGE_CLAIMS,
  INSURANCE_PACKAGES
} from './initialData.js';

class Store {
  constructor() {
    this.listeners = [];
    this.initStorage();
  }

  initStorage() {
    const currentVersion = localStorage.getItem('rentalku_version');
    const existingBookings = JSON.parse(localStorage.getItem('rentalku_bookings')) || [];
    const existingCustomers = JSON.parse(localStorage.getItem('rentalku_customers')) || [];
    const existingUnits = JSON.parse(localStorage.getItem('rentalku_units')) || [];

    if (currentVersion !== DATA_VERSION) {
      localStorage.setItem('rentalku_version', DATA_VERSION);
      localStorage.setItem('rentalku_branch', JSON.stringify(INITIAL_BRANCH));
      localStorage.setItem('rentalku_catalog', JSON.stringify(INITIAL_CATALOG));
      
      // Preserve user-created bookings that aren't in INITIAL_BOOKINGS
      const initialBookingIds = new Set(INITIAL_BOOKINGS.map(b => b.id));
      const userBookings = existingBookings.filter(b => !initialBookingIds.has(b.id));
      const mergedBookings = [...userBookings, ...INITIAL_BOOKINGS];
      localStorage.setItem('rentalku_bookings', JSON.stringify(mergedBookings));

      // Preserve user-created customers
      const initialCustIds = new Set(INITIAL_CUSTOMERS.map(c => c.id));
      const userCusts = existingCustomers.filter(c => !initialCustIds.has(c.id));
      const mergedCustomers = [...INITIAL_CUSTOMERS, ...userCusts];
      localStorage.setItem('rentalku_customers', JSON.stringify(mergedCustomers));

      // Reconcile units: start with INITIAL_UNITS (21 units with GPS)
      let units = [...INITIAL_UNITS];

      // If user had existing units added via UI, retain them
      const initialUnitIds = new Set(INITIAL_UNITS.map(u => u.id));
      const userUnits = existingUnits.filter(u => !initialUnitIds.has(u.id));
      if (userUnits.length > 0) {
        units = [...units, ...userUnits];
      }

      // Mark units as 'Disewa' and activate GPS for all active bookings
      mergedBookings.forEach(b => {
        if (b.unitId && (b.bookingStatus === 'Terkonfirmasi' || b.bookingStatus === 'Berlangsung')) {
          const idx = units.findIndex(u => u.id === b.unitId);
          if (idx !== -1) {
            const u = units[idx];
            const isBicycle = u.category === 'Sepeda';
            const isMotor = u.category === 'Motor';
            units[idx] = {
              ...u,
              status: 'Disewa',
              currentLocation: {
                lat: isBicycle ? (-8.6940 + (Math.random() - 0.5) * 0.015) : isMotor ? (-8.6750 + (Math.random() - 0.5) * 0.02) : (-8.6850 + (Math.random() - 0.5) * 0.02),
                lng: isBicycle ? (115.2635 + (Math.random() - 0.5) * 0.015) : isMotor ? (115.2200 + (Math.random() - 0.5) * 0.02) : (115.2100 + (Math.random() - 0.5) * 0.02),
                speedKmh: isBicycle ? 18 : isMotor ? 36 : 45,
                heading: 140,
                engineStatus: isBicycle ? (u.modelName.includes('E-Bike') ? 'Motor Listrik Assist ON' : 'Gowes Aktif (Pedaling)') : 'ON',
                isOutOfBounds: false,
                lastUpdate: new Date().toISOString()
              }
            };
          }
        }
      });
      localStorage.setItem('rentalku_units', JSON.stringify(units));

      localStorage.setItem('rentalku_vault', JSON.stringify(INITIAL_VAULT_LOCKERS));
      localStorage.setItem('rentalku_handovers', JSON.stringify(INITIAL_HANDOVERS));
      localStorage.setItem('rentalku_services', JSON.stringify(INITIAL_SERVICES));
      localStorage.setItem('rentalku_claims', JSON.stringify(INITIAL_DAMAGE_CLAIMS));
      return;
    }

    if (!localStorage.getItem('rentalku_branch')) {
      localStorage.setItem('rentalku_branch', JSON.stringify(INITIAL_BRANCH));
    }
    if (!localStorage.getItem('rentalku_catalog')) {
      localStorage.setItem('rentalku_catalog', JSON.stringify(INITIAL_CATALOG));
    }
    if (!localStorage.getItem('rentalku_units')) {
      localStorage.setItem('rentalku_units', JSON.stringify(INITIAL_UNITS));
    }
    if (!localStorage.getItem('rentalku_customers')) {
      localStorage.setItem('rentalku_customers', JSON.stringify(INITIAL_CUSTOMERS));
    }
    if (!localStorage.getItem('rentalku_vault')) {
      localStorage.setItem('rentalku_vault', JSON.stringify(INITIAL_VAULT_LOCKERS));
    }
    if (!localStorage.getItem('rentalku_bookings')) {
      localStorage.setItem('rentalku_bookings', JSON.stringify(INITIAL_BOOKINGS));
    }
    if (!localStorage.getItem('rentalku_handovers')) {
      localStorage.setItem('rentalku_handovers', JSON.stringify(INITIAL_HANDOVERS));
    }
    if (!localStorage.getItem('rentalku_services')) {
      localStorage.setItem('rentalku_services', JSON.stringify(INITIAL_SERVICES));
    }
    if (!localStorage.getItem('rentalku_claims')) {
      localStorage.setItem('rentalku_claims', JSON.stringify(INITIAL_DAMAGE_CLAIMS));
    }

    // Secondary reconciliation to ensure every unit has GPS and active bookings are synced
    this.reconcileGpsAndBookings();
  }

  reconcileGpsAndBookings() {
    let units = JSON.parse(localStorage.getItem('rentalku_units')) || [];
    const bookings = JSON.parse(localStorage.getItem('rentalku_bookings')) || [];
    let changed = false;

    const activeBookingsMap = {};
    bookings.forEach(b => {
      if (b.unitId && (b.bookingStatus === 'Terkonfirmasi' || b.bookingStatus === 'Berlangsung')) {
        activeBookingsMap[b.unitId] = b;
      }
    });

    units = units.map(u => {
      const isBicycle = u.category === 'Sepeda';
      const isMotor = u.category === 'Motor';
      const activeBooking = activeBookingsMap[u.id];
      const isDisewa = Boolean(activeBooking) || u.status === 'Disewa';

      let loc = u.currentLocation;
      if (!loc || !u.gpsId || (activeBooking && u.status !== 'Disewa')) {
        changed = true;
      }

      const defaultGpsId = isBicycle ? `GPS-BYC-${u.id.replace('U-', '')}` : isMotor ? `GPS-MTR-${u.id.replace('U-', '')}` : `GPS-CAR-${u.id.replace('U-', '')}`;
      const gpsId = u.gpsId || defaultGpsId;

      if (!loc) {
        loc = {
          lat: isDisewa ? (-8.6940 + (Math.random() - 0.5) * 0.015) : -8.6852,
          lng: isDisewa ? (115.2635 + (Math.random() - 0.5) * 0.015) : 115.2476,
          speedKmh: isDisewa ? (isBicycle ? 18 : isMotor ? 36 : 45) : 0,
          heading: isDisewa ? 140 : 0,
          engineStatus: isDisewa ? (isBicycle ? (u.modelName.includes('E-Bike') ? 'Motor Listrik Assist ON' : 'Gowes Aktif (Pedaling)') : 'ON') : (isBicycle ? 'Standby / Parkir' : 'OFF'),
          isOutOfBounds: false,
          lastUpdate: new Date().toISOString()
        };
      }

      return {
        ...u,
        status: isDisewa ? 'Disewa' : u.status,
        gpsId,
        currentLocation: loc
      };
    });

    if (changed) {
      localStorage.setItem('rentalku_units', JSON.stringify(units));
    }
  }

  // Subscribe to changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb());
  }

  // Getters
  getBranch() {
    return JSON.parse(localStorage.getItem('rentalku_branch'));
  }

  getCatalog() {
    return JSON.parse(localStorage.getItem('rentalku_catalog')) || [];
  }

  getUnits() {
    return JSON.parse(localStorage.getItem('rentalku_units')) || [];
  }

  getUnitById(id) {
    return this.getUnits().find(u => u.id === id);
  }

  getCustomers() {
    return JSON.parse(localStorage.getItem('rentalku_customers')) || [];
  }

  getCustomerById(id) {
    return this.getCustomers().find(c => c.id === id);
  }

  getVaultLockers() {
    return JSON.parse(localStorage.getItem('rentalku_vault')) || [];
  }

  getBookings() {
    return JSON.parse(localStorage.getItem('rentalku_bookings')) || [];
  }

  getBookingById(id) {
    return this.getBookings().find(b => b.id === id);
  }

  getBookingByCode(code) {
    return this.getBookings().find(b => b.bookingCode?.toUpperCase() === code.trim().toUpperCase());
  }

  getActiveBookingForUnit(unitId) {
    const bookings = this.getBookings();
    return bookings.find(b => b.unitId === unitId && (b.bookingStatus === 'Terkonfirmasi' || b.bookingStatus === 'Berlangsung'));
  }

  getHandovers() {
    return JSON.parse(localStorage.getItem('rentalku_handovers')) || [];
  }

  getServices() {
    return JSON.parse(localStorage.getItem('rentalku_services')) || [];
  }

  getDamageClaims() {
    return JSON.parse(localStorage.getItem('rentalku_claims')) || [];
  }

  getInsurancePackages() {
    return INSURANCE_PACKAGES;
  }

  // Mutations
  updateUnit(id, updates) {
    const units = this.getUnits().map(u => u.id === id ? { ...u, ...updates } : u);
    localStorage.setItem('rentalku_units', JSON.stringify(units));
    this.notify();
  }

  createBooking(bookingData) {
    const bookings = this.getBookings();
    const newBooking = {
      id: `BK-2026-${String(bookings.length + 1).padStart(3, '0')}`,
      bookingCode: `RK-${bookingData.category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      handoverPickupDone: false,
      handoverReturnDone: false,
      ...bookingData
    };
    bookings.unshift(newBooking);
    localStorage.setItem('rentalku_bookings', JSON.stringify(bookings));

    // Immediately set unit to Disewa and activate real-time GPS tracking coordinates
    if (newBooking.unitId) {
      const unit = this.getUnitById(newBooking.unitId);
      if (unit) {
        const isBicycle = unit.category === 'Sepeda';
        const isMotor = unit.category === 'Motor';

        const activeGps = isBicycle ? {
          lat: -8.6940 + (Math.random() - 0.5) * 0.015,
          lng: 115.2635 + (Math.random() - 0.5) * 0.015,
          speedKmh: Math.floor(14 + Math.random() * 10),
          heading: 140,
          engineStatus: unit.modelName.includes('E-Bike') ? 'Motor Listrik Assist ON' : 'Gowes Aktif (Pedaling)',
          isOutOfBounds: false,
          lastUpdate: new Date().toISOString()
        } : isMotor ? {
          lat: -8.6750 + (Math.random() - 0.5) * 0.02,
          lng: 115.2200 + (Math.random() - 0.5) * 0.02,
          speedKmh: Math.floor(32 + Math.random() * 15),
          heading: 180,
          engineStatus: 'ON',
          isOutOfBounds: false,
          lastUpdate: new Date().toISOString()
        } : {
          lat: -8.6850 + (Math.random() - 0.5) * 0.02,
          lng: 115.2100 + (Math.random() - 0.5) * 0.02,
          speedKmh: Math.floor(40 + Math.random() * 20),
          heading: 130,
          engineStatus: 'ON',
          isOutOfBounds: false,
          lastUpdate: new Date().toISOString()
        };

        this.updateUnit(newBooking.unitId, {
          status: 'Disewa',
          gpsId: unit.gpsId || `GPS-${unit.category.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
          currentLocation: {
            ...(unit.currentLocation || {}),
            ...activeGps
          }
        });
      }
    }

    // Assign vault locker if physical docs deposited
    if (newBooking.physicalDocsLocker) {
      this.assignLocker(newBooking.physicalDocsLocker, {
        bookingId: newBooking.id,
        customerName: newBooking.customerName,
        documentsHeld: newBooking.physicalDocs || ['KTP Asli Fisik'],
        depositDateTime: new Date().toISOString(),
        notes: `Jaminan sewa ${newBooking.unitModel} (${newBooking.unitPlate || 'Unit Baru'})`
      });
    }

    this.notify();
    return newBooking;
  }

  updateBooking(id, updates) {
    const bookings = this.getBookings().map(b => b.id === id ? { ...b, ...updates } : b);
    localStorage.setItem('rentalku_bookings', JSON.stringify(bookings));
    this.notify();
  }

  createCustomer(custData) {
    const customers = this.getCustomers();
    const newCustomer = {
      id: `CUST-${String(customers.length + 1).padStart(2, '0')}`,
      rentalCount: 1,
      rating: 5.0,
      notes: 'Pelanggan baru',
      ...custData
    };
    customers.push(newCustomer);
    localStorage.setItem('rentalku_customers', JSON.stringify(customers));
    this.notify();
    return newCustomer;
  }

  assignLocker(lockerNo, data) {
    const lockers = this.getVaultLockers().map(l => {
      if (l.lockerNo === lockerNo) {
        return {
          ...l,
          status: 'Occupied',
          ...data
        };
      }
      return l;
    });
    localStorage.setItem('rentalku_vault', JSON.stringify(lockers));
    this.notify();
  }

  releaseLocker(lockerNo) {
    const lockers = this.getVaultLockers().map(l => {
      if (l.lockerNo === lockerNo) {
        return {
          ...l,
          status: 'Available',
          bookingId: null,
          customerName: null,
          documentsHeld: [],
          depositDateTime: null,
          notes: 'Telah dikembalikan kepada penyewa saat unit kembali.'
        };
      }
      return l;
    });
    localStorage.setItem('rentalku_vault', JSON.stringify(lockers));
    this.notify();
  }

  createHandover(handoverData) {
    const handovers = this.getHandovers();
    const newHandover = {
      id: `HO-${String(handovers.length + 1).padStart(2, '0')}`,
      timestamp: new Date().toISOString(),
      ...handoverData
    };
    handovers.unshift(newHandover);
    localStorage.setItem('rentalku_handovers', JSON.stringify(handovers));

    // If Pickup, set booking handoverPickupDone: true & status 'Berlangsung'
    if (handoverData.type === 'Pickup') {
      this.updateBooking(handoverData.bookingId, {
        handoverPickupDone: true,
        bookingStatus: 'Berlangsung'
      });
      const booking = this.getBookingById(handoverData.bookingId);
      if (booking && booking.unitId) {
        this.updateUnit(booking.unitId, { status: 'Disewa' });
      }
    } else if (handoverData.type === 'Return') {
      // If Return, mark booking Selesai, release locker, return unit to Tersedia (or Servis if damage)
      this.updateBooking(handoverData.bookingId, {
        handoverReturnDone: true,
        bookingStatus: 'Selesai'
      });
      const booking = this.getBookingById(handoverData.bookingId);
      if (booking) {
        if (booking.physicalDocsLocker) {
          this.releaseLocker(booking.physicalDocsLocker);
        }
        if (booking.unitId) {
          const nextStatus = handoverData.hasDamage ? 'Dalam Servis' : 'Tersedia';
          this.updateUnit(booking.unitId, {
            status: nextStatus,
            odometerKm: handoverData.returnKm || undefined
          });
        }
      }
    }

    this.notify();
    return newHandover;
  }

  createDamageClaim(claimData) {
    const claims = this.getDamageClaims();
    const newClaim = {
      id: `CLM-${String(claims.length + 1).padStart(2, '0')}`,
      incidentDate: new Date().toISOString().split('T')[0],
      status: 'Dalam Peninjauan',
      claimApproved: false,
      ...claimData
    };
    claims.unshift(newClaim);
    localStorage.setItem('rentalku_claims', JSON.stringify(claims));
    this.notify();
    return newClaim;
  }

  createService(serviceData) {
    const services = this.getServices();
    const newService = {
      id: `SRV-${String(services.length + 1).padStart(2, '0')}`,
      status: 'Terjadwal',
      ...serviceData
    };
    services.unshift(newService);
    localStorage.setItem('rentalku_services', JSON.stringify(services));
    this.notify();
    return newService;
  }

  // Telemetry simulation
  updateGpsTelemetry(unitId, data) {
    const units = this.getUnits().map(u => {
      if (u.id === unitId && u.currentLocation) {
        return {
          ...u,
          currentLocation: {
            ...u.currentLocation,
            ...data,
            lastUpdate: new Date().toISOString()
          }
        };
      }
      return u;
    });
    localStorage.setItem('rentalku_units', JSON.stringify(units));
    this.notify();
  }

  toggleEngineKill(unitId) {
    const unit = this.getUnitById(unitId);
    if (!unit || !unit.currentLocation) return null;
    
    if (unit.category === 'Sepeda') {
      const isLocked = unit.currentLocation.engineStatus.includes('Terkunci') || unit.currentLocation.engineStatus.includes('Standby');
      const newStatus = isLocked 
        ? (unit.modelName.includes('E-Bike') ? 'Motor Listrik Assist ON' : 'Gowes Aktif (Pedaling)')
        : 'Terkunci (Gembok Smart Lock Aktif)';
      this.updateGpsTelemetry(unitId, {
        engineStatus: newStatus,
        speedKmh: isLocked ? (unit.modelName.includes('E-Bike') ? 20 : 15) : 0
      });
      return { isLocked: !isLocked, status: newStatus, isBicycle: true };
    } else {
      const isEngineOn = unit.currentLocation.engineStatus === 'ON';
      const newStatus = isEngineOn ? 'OFF (Immobilized)' : 'ON';
      this.updateGpsTelemetry(unitId, {
        engineStatus: newStatus,
        speedKmh: newStatus === 'ON' ? 32 : 0
      });
      return { isEngineOn: !isEngineOn, status: newStatus, isBicycle: false };
    }
  }
}

export const store = new Store();
