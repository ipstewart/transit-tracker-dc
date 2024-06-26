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
  expanded?: boolean;
  showExpandedIcon?: boolean;
}

function BusResultSummary({
  location,
  stop,
  expanded,
  showExpandedIcon = true,
}: Readonly<BusResultSummaryProps>) {
  return (
    <Box className="w-full flex flex-col gap-3">
      <Box className="flex items-center gap-2">
        {showExpandedIcon && (
          <ArrowForwardIosIcon
            fontSize="small"
            sx={{ transform: expanded ? 'rotate(90deg)' : null, transition: 'transform 0.1s' }}
          />
        )}
        <Box bgcolor="primary.main" borderRadius="30px" p="5px">
          <DirectionsBusIcon sx={{ color: 'primary.contrastText' }} />
        </Box>
        <Typography variant="h5" color="text.primary">
          {stop.name}
        </Typography>
      </Box>
      <Box className="flex justify-between items-end">
        <Box>
          <Typography variant="body1" color="text.primary">
            Routes
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {stop.routes
              .filter((route) => !route.includes('*') && !route.includes('/'))
              .map((route) => (
                <Box
                  key={route}
                  className="flex items-center gap-[2px] px-[3px] py-[2px]"
                  border="1px solid #454545"
                  borderColor="text.primary">
                  <DirectionsBusIcon sx={{ fontSize: '14px', color: 'text.primary' }} />
                  <Typography variant="body2" lineHeight="14px" color="text.primary">
                    {route}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
        <Box className="flex gap-2">
          <DirectionsWalkIcon fontSize="small" sx={{ color: 'text.primary' }} />
          <Typography variant="body1" whiteSpace="nowrap" color="text.primary">
            {calculateDistance(location.lat, location.lon, stop.lat, stop.lon).distance}{' '}
            {calculateDistance(location.lat, location.lon, stop.lat, stop.lon).unit}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default BusResultSummary;
