import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import TrainIcon from '@mui/icons-material/Train';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { SearchLocation } from '../../../models/location.model';
import { MetroStation } from '../../../models/metro.model';
import { calculateDistance, getMetroColor } from '../../../utils/utils';

interface MetroResultSummaryInterface {
  location: SearchLocation;
  station: MetroStation;
  station2: MetroStation | null;
  expanded: boolean | undefined;
}

function MetroResultSummary({
  location,
  station,
  station2,
  expanded,
}: Readonly<MetroResultSummaryInterface>) {
  const stationLines = [station.lineCode1, station.lineCode2, station.lineCode3, station.lineCode4];
  const station2Lines = station2
    ? [station2?.lineCode1, station2?.lineCode2, station2?.lineCode3, station2?.lineCode4]
    : [];

  return (
    <Box className="flex flex-col w-full gap-2">
      <Box className="flex items-center gap-1">
        <ArrowForwardIosIcon
          fontSize="small"
          sx={{ transform: expanded ? 'rotate(90deg)' : null, transition: 'transform 0.1s' }}
        />
        <Box bgcolor="primary.main" borderRadius="30px" p="5px">
          <TrainIcon sx={{ color: 'primary.contrastText' }} />
        </Box>
        <Typography variant="h5">{station.name}</Typography>
      </Box>
      <Box className="flex justify-between items-end" color="primary.light">
        <Box>
          <Typography variant="body1">Lines</Typography>
          <Box className="flex flex-wrap gap-1">
            {stationLines
              .concat(station2Lines)
              .filter((lineCode) => lineCode)
              .map((lineCode) => (
                <Box
                  key={lineCode}
                  className="h-[25px] w-[25px] flex items-center justify-center"
                  borderRadius="20px"
                  sx={{
                    backgroundColor: getMetroColor(lineCode).stationColor,
                    color: getMetroColor(lineCode).textColor,
                  }}>
                  <Typography variant="body2" lineHeight="14px">
                    {lineCode}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
        <Box className="flex gap-1">
          <DirectionsWalkIcon fontSize="small" />
          <Typography variant="body1" whiteSpace="nowrap">
            {calculateDistance(location.lat, location.lon, station.lat, station.lon).distance}{' '}
            {calculateDistance(location.lat, location.lon, station.lat, station.lon).unit}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default MetroResultSummary;
