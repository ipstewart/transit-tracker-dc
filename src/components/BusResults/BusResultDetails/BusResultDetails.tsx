import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

import { getBusPathDetails } from '../../../api/api';
import { BusPathDetails, BusRoutePrediction, BusStop } from '../../../models/bus.model';

interface BusResultDetailsProps {
  stop: BusStop;
  busPredictions: BusRoutePrediction[];
  getBusPredictions: (stopId: string) => Promise<void>;
}

function BusResultDetails({
  stop,
  busPredictions,
  getBusPredictions,
}: Readonly<BusResultDetailsProps>) {
  const [route, setRoute] = useState<{
    stopId: string;
    routeId: string;
    routeName: string;
    routeDirection: string;
  } | null>(null);
  const [routeDetails, setRouteDetails] = useState<Record<string, BusPathDetails>>({});
  const [accordionHeight, setAccordionHeight] = useState(0);

  const scheduleRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (route) {
      getBusPathDetails(route.routeId).then((path) => {
        if (path) {
          setRouteDetails({ ...routeDetails, [route.stopId]: path });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  useEffect(() => {
    setAccordionHeight(
      (route ? routeRef.current?.clientHeight : scheduleRef.current?.clientHeight) ?? 0,
    );
  }, [route, routeDetails]);

  const renderRoute = (stopId: string) => {
    const displayRouteDetails = routeDetails[stopId];

    const routeTemplate = (stopId: string, name: string) => (
      <Box key={stopId} className="flex items-center gap-2">
        <Box className="h-[2px] w-[10px]" bgcolor="text.primary" />
        <Typography
          variant="body1"
          fontWeight={stopId === stop.stopId ? 600 : 300}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis">
          {name}
        </Typography>
      </Box>
    );

    if (route && displayRouteDetails) {
      // Get correct route direction
      if (route.routeDirection === '1') {
        return (
          <>
            {displayRouteDetails.direction1?.stops.map((routeStop) =>
              routeTemplate(routeStop.stopId, routeStop.name),
            )}
          </>
        );
      } else {
        return (
          <>
            {displayRouteDetails.direction0?.stops.map((routeStop) =>
              routeTemplate(routeStop.stopId, routeStop.name),
            )}
          </>
        );
      }
    }
  };

  return (
    <Box width="100%" height={accordionHeight} overflow="hidden" display="grid" position="relative">
      <Box
        className={`w-full absolute top-0 ${route ? '-left-full' : 'left-0'}`}
        sx={{ transition: 'left 0.3s' }}
        ref={scheduleRef}>
        <Box key={stop.stopId} width="100%">
          {busPredictions.map((busRoute, index) => (
            <Box
              key={stop.stopId + busRoute.routeId}
              className="flex flex-col gap-2"
              mb={index < busPredictions.length - 1 ? 3 : 0}>
              <Box className="flex justify-between items-center gap-3">
                <Box className="flex items-center flex-wrap gap-2 min-w-0">
                  <Box
                    className="flex gap-[2px] items-center px-[3px] py-[2px]"
                    border="1px solid"
                    borderLeft="3px solid"
                    borderColor="text.primary"
                    sx={{ borderLeftColor: 'primary.main' }}>
                    <DirectionsBusIcon sx={{ fontSize: '14px' }} />
                    <Typography variant="body2" lineHeight="14px">
                      {busRoute.routeId}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis">
                    {busRoute.directionText}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="info.contrastText"
                    bgcolor="info.main"
                    lineHeight="14px"
                    p="3px">
                    LIVE {busRoute.lastUpdated.format('hh:mm:ss')}
                  </Typography>
                  <IconButton
                    aria-label="refresh"
                    size="small"
                    color="info"
                    onClick={() => getBusPredictions(stop.stopId)}>
                    <RefreshIcon fontSize="inherit" />
                  </IconButton>
                </Box>
                {!route && (
                  <Button
                    endIcon={<ArrowForwardIosIcon />}
                    onClick={() =>
                      setRoute({
                        stopId: stop.stopId,
                        routeId: busRoute.routeId,
                        routeName: busRoute.directionText,
                        routeDirection: busRoute.directionNum,
                      })
                    }>
                    ROUTE
                  </Button>
                )}
              </Box>
              <Box className="w-[200px] h-[1px]" bgcolor="text.primary" />
              <Box className="w-[200px] max-w-full">
                {busRoute.predictions.map((prediction) => (
                  <Box key={prediction.tripId} className="flex justify-between">
                    <Typography variant="body1">
                      {prediction.minutes === 0 ? 'ARRIVING' : `${prediction.minutes} minutes`}
                    </Typography>
                    <Typography variant="body1">
                      {moment().add(prediction.minutes, 'minutes').format('h:mm A')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        className={`w-full absolute top-0 ${route ? 'left-0' : 'left-full'}`}
        sx={{ transition: 'left 0.3s' }}
        ref={routeRef}>
        <Box className="w-full flex flex-col gap-2">
          <Box className="flex justify-between gap-2">
            <Box className="flex items-center min-w-0 gap-2">
              <Box
                className="flex gap-[2px] items-center px-[3px] py-[2px]"
                border="1px solid"
                borderLeft="3px solid"
                borderColor="text.primary"
                sx={{ borderLeftColor: 'primary.main' }}>
                <DirectionsBusIcon sx={{ fontSize: '14px' }} />
                <Typography variant="body2" lineHeight="14px">
                  {route?.routeId}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis">
                {route?.routeName}
              </Typography>
            </Box>
            <Button startIcon={<ArrowBackIosIcon />} onClick={() => setRoute(null)}>
              SCHEDULE
            </Button>
          </Box>
          <Box className="w-[200px] h-[1px]" bgcolor="text.primary" />
          <Box
            className="flex items-center gap-3"
            borderLeft="2px solid"
            borderColor="text.primary">
            <Box className="w-full">{renderRoute(stop.stopId)}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default BusResultDetails;
