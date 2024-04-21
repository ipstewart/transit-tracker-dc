import PeopleIcon from '@mui/icons-material/People';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Moment } from 'moment';

import { MetroPrediction } from '../../../models/metro.model';
import { getMetroColor } from '../../../utils/utils';

interface MetroResultDetailsProps {
  metroPredictions: MetroPrediction[];
  metroPredictionsStation2: MetroPrediction[];
  lastUpdated: Moment;
  getMetroPredictions: (stationCodes: string[]) => Promise<void>;
}

function MetroResultDetails({
  metroPredictions,
  metroPredictionsStation2,
  lastUpdated,
  getMetroPredictions,
}: Readonly<MetroResultDetailsProps>) {
  return (
    <>
      <Box className="flex items-center gap-2 mb-2">
        <Typography
          variant="body1"
          color="info.contrastText"
          bgcolor="info.main"
          lineHeight="14px"
          p="3px">
          LIVE {lastUpdated.format('hh:mm:ss')}
        </Typography>
        <IconButton
          aria-label="refresh"
          size="small"
          color="info"
          onClick={() =>
            getMetroPredictions([
              ...metroPredictions.map((prediction) => prediction.locationCode),
              ...metroPredictionsStation2.map((prediction) => prediction.locationCode),
            ])
          }>
          <RefreshIcon fontSize="inherit" />
        </IconButton>
      </Box>
      {metroPredictions
        .concat(metroPredictionsStation2)
        .sort((a, b) => {
          if (a.min === b.min) {
            if (isNaN(parseInt(a.min))) {
              // If both are non-numeric ("ARR" or "BRD")
              return a.min === 'BRD' ? -1 : 1;
            } else {
              // If both are numeric
              return 0;
            }
          } else {
            // If min values are different
            if (isNaN(parseInt(a.min)) || isNaN(parseInt(b.min))) {
              // If either is non-numeric ("ARR" or "BRD")
              return a.min === 'BRD' ? -1 : 1;
            } else {
              // If both are numeric, compare numerically
              return parseInt(a.min) - parseInt(b.min);
            }
          }
        })
        .map((prediction) => (
          <Box key={prediction.destination + prediction.min} className="flex justify-between mb-2">
            <Box className="flex items-center gap-3">
              <Box className="flex items-center gap-2">
                <Box
                  className="h-[25px] w-[25px] flex items-center justify-center"
                  borderRadius="20px"
                  sx={{
                    backgroundColor: getMetroColor(prediction.line).stationColor,
                    color: getMetroColor(prediction.line).textColor,
                  }}>
                  <Typography variant="body2" lineHeight="14px">
                    {prediction.line}
                  </Typography>
                </Box>
                <Typography variant="body1">{prediction.destinationName}</Typography>
              </Box>
              <Box className="flex items-center gap-1">
                <PeopleIcon sx={{ fontSize: '14px' }} />
                <Typography variant="body1">{prediction.car}</Typography>
              </Box>
            </Box>
            <Box className="flex items-center gap-1">
              <Typography variant="body1">
                {['BRD', 'ARR'].includes(prediction.min)
                  ? prediction.min
                  : `${prediction.min} minutes`}
              </Typography>
            </Box>
          </Box>
        ))}
    </>
  );
}

export default MetroResultDetails;
