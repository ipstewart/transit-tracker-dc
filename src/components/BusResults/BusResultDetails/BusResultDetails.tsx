import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { getBusPathDetails } from '../../../api/api';
import { BusPathDetails, BusRoutePrediction, BusStop } from '../../../models/bus.model';

interface BusResultDetailsProps {
  stop: BusStop;
  busPredictions: BusRoutePrediction[];
}

function BusResultDetails({ stop, busPredictions }: Readonly<BusResultDetailsProps>) {
  const [showRoutes, setShowRoutes] = useState<
    { stopId: string; routeId: string; routeName: string; routeDirection: string }[]
  >([]);
  const [routeInfo, setRouteInfo] = useState<Record<string, BusPathDetails>>({});

  useEffect(() => {
    showRoutes.forEach((route) => {
      if (!routeInfo.hasOwnProperty(route.routeId)) {
        getBusPathDetails(route.routeId).then((path) => {
          if (path) {
            setRouteInfo({ ...routeInfo, [route.stopId]: path });
          }
        });
      }
    });
  }, [showRoutes]);

  const renderRoute = (stopId: string) => {
    const route = routeInfo[stopId];
    const routeDetails = showRoutes.find((details) => details.stopId === stopId);

    const routeTemplate = (stopId: string, name: string) => (
      <Box key={stopId} display="flex" alignItems="center" gap={1}>
        <Box height="2px" width="10px" bgcolor="primary.main" ml="-25px" />
        <Typography
          variant="h6"
          fontWeight={stopId === stop.stopId ? 600 : 300}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis">
          {name}
        </Typography>
      </Box>
    );

    if (route && routeDetails) {
      // Get correct route direction
      if (routeDetails.routeDirection === '1') {
        return (
          <>
            {route.direction1?.stops.map((routeStop) =>
              routeTemplate(routeStop.stopId, routeStop.name),
            )}
          </>
        );
      } else {
        return (
          <>
            {route.direction0?.stops.map((routeStop) =>
              routeTemplate(routeStop.stopId, routeStop.name),
            )}
          </>
        );
      }
    }
  };

  return (
    <Box overflow="hidden" width="100%" display="flex">
      <Slide
        direction="right"
        in={!showRoutes.map((route) => route.stopId).includes(stop.stopId)}
        // {...(!showRoutes.map((route) => route.stopId).includes(stop.stopId)
        //   ? { timeout: 3000 }
        //   : {})}
        mountOnEnter
        unmountOnExit>
        <Box key={stop.stopId} width="100%">
          {busPredictions.map((route, index) => (
            <Box
              key={stop.stopId + route.routeId}
              display="flex"
              flexDirection="column"
              gap={1}
              mb={index < busPredictions.length - 1 ? 3 : 0}>
              <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} minWidth={0}>
                  <Box
                    className="flex gap-[2px] items-center px-[3px] py-[2px]"
                    border="1px solid #454545"
                    borderLeft="3px solid #002F6C">
                    <DirectionsBusIcon sx={{ fontSize: '14px' }} />
                    <Typography variant="body2" lineHeight="14px">
                      {route.routeId}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis">
                    {route.directionText}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="info.contrastText"
                    bgcolor="info.main"
                    lineHeight="14px"
                    p="2px">
                    LIVE
                  </Typography>
                </Box>
                {!showRoutes.map((route) => route.stopId).includes(stop.stopId) && (
                  <Button
                    endIcon={<ArrowForwardIosIcon />}
                    sx={{ color: 'primary.light' }}
                    onClick={() =>
                      setShowRoutes([
                        ...showRoutes,
                        {
                          stopId: stop.stopId,
                          routeId: route.routeId,
                          routeName: route.directionText,
                          routeDirection: route.directionNum,
                        },
                      ])
                    }>
                    ROUTE
                  </Button>
                )}
              </Box>
              <Box width="200px" maxWidth="100%" height="1px" bgcolor="primary.light" />
              <Box width="200px" maxWidth="100%">
                {route.predictions.map((prediction) => (
                  <Box key={prediction.tripId} display="flex" justifyContent="space-between">
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
      </Slide>
      <Slide
        direction="left"
        in={showRoutes.map((route) => route.stopId).includes(stop.stopId)}
        mountOnEnter
        unmountOnExit>
        <Box width="100%" display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between" gap={1}>
            <Box display="flex" alignItems="center" gap={1} minWidth="0">
              <Box
                className="flex gap-[2px] items-center px-[3px] py-[2px]"
                border="1px solid #454545"
                borderLeft="3px solid #002F6C">
                <DirectionsBusIcon sx={{ fontSize: '14px' }} />
                <Typography variant="body2" lineHeight="14px">
                  {showRoutes.find((route) => route.stopId === stop.stopId)?.routeId}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis">
                {showRoutes.find((route) => route.stopId === stop.stopId)?.routeName}
              </Typography>
            </Box>
            <Button
              endIcon={<ArrowForwardIosIcon />}
              sx={{ color: 'primary.light' }}
              onClick={() =>
                setShowRoutes(showRoutes.filter((shownRoute) => shownRoute.stopId !== stop.stopId))
              }>
              ROUTE
            </Button>
          </Box>
          <Box width="200px" height="1px" bgcolor="primary.light" />

          <Box className="flex" alignItems="center" gap={2} ml={1}>
            <Box
              height="calc(100% - 30px)"
              display="flex"
              flexDirection="column"
              alignItems="center">
              <Box height="2px" width="20px" bgcolor="primary.main" />
              <Box flex="1" width="2px" bgcolor="primary.main" />
              <Box height="2px" width="20px" bgcolor="primary.main" />
            </Box>
            <Box>{renderRoute(stop.stopId)}</Box>
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}

export default BusResultDetails;
