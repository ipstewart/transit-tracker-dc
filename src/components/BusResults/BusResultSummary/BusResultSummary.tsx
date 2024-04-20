import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BusStop } from '../../../models/bus.model';
import { SearchLocation } from '../../../models/location.model';
import { calculateDistance } from '../../../utils/utils';

interface BusResultSummaryProps {
  location: SearchLocation;
  stop: BusStop;
  expanded: boolean | undefined;
}

function BusResultSummary({ location, stop, expanded }: Readonly<BusResultSummaryProps>) {
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
          <Typography variant="body1">Routes</Typography>
          <Box className="flex flex-wrap" gap={1}>
            {stop.routes
              .filter((route) => !route.includes('*') && !route.includes('/'))
              .map((route) => (
                <Box
                  key={route}
                  className="flex items-center"
                  gap="2px"
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
