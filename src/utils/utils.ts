// Calculate the distance between two coords
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): { distance: string; unit: string } => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 0.621371; // Distance in miles

  if (distance < 0.1) {
    // Convert to feet if the distance is less than 0.1 miles
    return { distance: (distance * 5280).toFixed(0), unit: 'feet' };
  } else {
    return { distance: distance.toFixed(2), unit: 'miles' };
  }
};

// Get metro color from line code
export const getMetroColor = (lineCode: string): { stationColor: string; textColor: string } => {
  switch (lineCode) {
    case 'RD':
      return { stationColor: '#BF0D3E', textColor: '#FFF' };
    case 'OR':
      return { stationColor: '#ED8B00', textColor: '#000' };
    case 'BL':
      return { stationColor: '#009CDE', textColor: '#FFF' };
    case 'GR':
      return { stationColor: '#00B140', textColor: '#FFF' };
    case 'YL':
      return { stationColor: '#FFD100', textColor: '#000' };
    default:
      return { stationColor: '#919D9D', textColor: '#000' };
  }
};
