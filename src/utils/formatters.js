// Utility formatters for RentalKu

export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function formatDateTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date) + ' WIB';
}

export function calculateDuration(startTime, endTime, category) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = Math.max(0, end - start);
  const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
  
  if (category === 'Sepeda') {
    return {
      unit: 'jam',
      quantity: Math.max(1, totalHours),
      display: `${Math.max(1, totalHours)} Jam`
    };
  } else {
    // Motor & Mobil are daily
    const days = Math.max(1, Math.ceil(totalHours / 24));
    return {
      unit: 'hari',
      quantity: days,
      display: `${days} Hari (${totalHours} Jam)`
    };
  }
}
