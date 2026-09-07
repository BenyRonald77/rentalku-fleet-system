// Availability Calendar (Timeline / Gantt View per Unit)
import { store } from '../data/store.js';
import { formatDate } from '../utils/formatters.js';
import { initIcons } from '../utils/icons.js';

export function renderAvailabilityCalendar(container) {
  const units = store.getUnits();
  const bookings = store.getBookings();
  const services = store.getServices();

  // Generate next 7 days dates
  const today = new Date();
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    days.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: i === 0
    });
  }

  container.innerHTML = `
    <div class="calendar-view">
      <div class="flex-between mb-6">
        <div>
          <h2><i data-lucide="calendar"></i> Kalender Ketersediaan Armada</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">Visualisasi jadwal booking dan maintenance per unit untuk mencegah double-booking.</p>
        </div>
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.76rem;">
            <span style="display: inline-block; width: 12px; height: 12px; background: rgba(16, 185, 129, 0.4); border: 1px solid var(--accent-emerald); border-radius: 2px;"></span> Tersedia
          </div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.76rem;">
            <span style="display: inline-block; width: 12px; height: 12px; background: #0284c7; border-radius: 2px;"></span> Disewa (Booked)
          </div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.76rem;">
            <span style="display: inline-block; width: 12px; height: 12px; background: #d97706; border-radius: 2px;"></span> Servis / Perawatan
          </div>
        </div>
      </div>

      <div class="timeline-container">
        <div class="timeline-grid">
          <!-- Header Row -->
          <div class="timeline-header-cell unit-col">UNIT KENDARAAN (PLAT)</div>
          ${days.map(d => `
            <div class="timeline-header-cell ${d.isToday ? 'style="border-top: 2px solid var(--accent-emerald);"' : ''}">
              <div style="color: ${d.isToday ? 'var(--accent-emerald)' : 'var(--text-primary)'}; font-weight: 800;">
                ${d.dayNumber} ${d.dayName}
              </div>
              <div style="font-size: 0.68rem; color: var(--text-muted);">${d.isToday ? 'Hari Ini' : ''}</div>
            </div>
          `).join('')}

          <!-- Rows per Unit -->
          ${units.map(u => {
            return `
              <div class="timeline-row-unit">
                <span class="timeline-unit-plate">${u.plateNumber}</span>
                <span class="timeline-unit-model">${u.modelName}</span>
                <span class="badge ${u.category === 'Mobil' ? 'badge-cyan' : u.category === 'Motor' ? 'badge-emerald' : 'badge-indigo'} mt-1" style="width: fit-content;">
                  ${u.category}
                </span>
              </div>

              ${days.map(d => {
                // Check if unit is booked on this date
                const matchedBooking = bookings.find(b => {
                  if (b.unitId !== u.id || b.bookingStatus === 'Dibatalkan') return false;
                  const start = b.startTime.split('T')[0];
                  const end = b.endTime.split('T')[0];
                  return d.dateStr >= start && d.dateStr <= end;
                });

                // Check if unit is in service
                const matchedService = services.find(s => s.unitId === u.id && s.scheduledDate === d.dateStr);

                if (matchedBooking) {
                  return `
                    <div class="timeline-slot">
                      <div class="timeline-bar booked" title="Disewa oleh ${matchedBooking.customerName} (${matchedBooking.bookingCode})">
                        ${matchedBooking.customerName.split(' ')[0]}
                      </div>
                    </div>
                  `;
                } else if (matchedService) {
                  return `
                    <div class="timeline-slot">
                      <div class="timeline-bar maintenance" title="${matchedService.serviceType}">
                        Servis
                      </div>
                    </div>
                  `;
                } else {
                  return `
                    <div class="timeline-slot">
                      <div class="timeline-bar available">
                        Siap
                      </div>
                    </div>
                  `;
                }
              }).join('')}
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  initIcons();
}
