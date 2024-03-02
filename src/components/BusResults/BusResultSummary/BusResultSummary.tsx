import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BusStop } from '../../../models/bus.model';
import { SearchLocation } from '../../../models/location.model';

interface BusResultSummaryProps {
  location: SearchLocation;
  stop: BusStop;
  expanded: boolean | undefined;
}

function BusResultSummary({ location, stop, expanded }: Readonly<BusResultSummaryProps>) {
  const calculateDistance = (
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

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <ArrowForwardIosIcon
          fontSize="small"
          sx={{ transform: expanded ? 'rotate(90deg)' : null, transition: 'transform 0.1s' }}
        />
        <Box bgcolor="primary.main" borderRadius="30px" p="5px">
          <DirectionsBusIcon sx={{ color: 'primary.contrastText' }} />
        </Box>
        <Typography variant="h5">{stop.name}</Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        color="primary.light">
        <Box>
          <Typography variant="body1">Routes:</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {stop.routes
              .filter((route) => !route.includes('*') && !route.includes('/'))
              .map((route) => (
                <Box
                  key={route}
                  display="flex"
                  gap="2px"
                  alignItems="center"
                  border="1px solid #454545"
                  px="3px"
                  py="2px">
                  <DirectionsBusIcon sx={{ fontSize: '14px' }} />
                  <Typography variant="body2" lineHeight="14px">
                    {route}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <DirectionsWalkIcon fontSize="small" />
          <Typography variant="body1" whiteSpace="nowrap">
            {calculateDistance(location.lat, location.lon, stop.lat, stop.lon).distance}{' '}
            {calculateDistance(location.lat, location.lon, stop.lat, stop.lon).unit}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default BusResultSummary;
