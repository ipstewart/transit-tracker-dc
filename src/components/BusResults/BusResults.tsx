import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { getBusPredictionAtStop } from '../../api/api';
import { BusRoutePrediction, BusStop, RoutePrediction } from '../../models/bus.model';
import { SearchLocation } from '../../models/location.model';
import BusResultDetails from './BusResultDetails/BusResultDetails';
import BusResultSummary from './BusResultSummary/BusResultSummary';

interface BusResultsProps {
  location: SearchLocation | null;
  stops: BusStop[];
}

function BusResults({ location, stops }: Readonly<BusResultsProps>) {
  const [busPredictions, setBusPredictions] = useState<Record<string, BusRoutePrediction[]>>({});
  const [expanded, setExpanded] = useState<{ stopId: string; expanded: boolean }[]>([]);

  const getBusPredictions = async (stopId: string) => {
    setExpanded(
      expanded.map((e) =>
        e.stopId === stopId ? { stopId, expanded: !e.expanded } : { stopId, expanded: e.expanded },
      ),
    );

    getBusPredictionAtStop(stopId).then((predictions) => {
      if (predictions) {
        const routePredictions: BusRoutePrediction[] = [];
        const uniqueRoutes = [
          ...new Set(predictions.map((prediction) => prediction.directionText)),
        ];

        uniqueRoutes.forEach((route) => {
          const predictionsInRoute = predictions.filter(
            (prediction) => prediction.directionText === route,
          );

          const stopPredictions: RoutePrediction[] = [];
          predictionsInRoute.forEach((busAtStop) => {
            stopPredictions.push({
              minutes: busAtStop.minutes,
              tripId: busAtStop.tripId,
              vehicleId: busAtStop.vehicleId,
            });
          });

          routePredictions.push({
            directionNum: predictionsInRoute[0].directionNum,
            directionText: predictionsInRoute[0].directionText,
            routeId: predictionsInRoute[0].routeId,
            predictions: stopPredictions,
          });
        });
        setBusPredictions((prevPredictions) => ({
          ...prevPredictions,
          [stopId]: routePredictions,
        }));
      }
    });
  };

  useEffect(() => {
    const expandedStops: { stopId: string; expanded: boolean }[] = [];
    stops.forEach((stop) => {
      expandedStops.push({
        stopId: stop.stopId,
        expanded: false,
      });
    });
    setExpanded(expandedStops);
  }, [stops]);

  return (
    <Box mt={2}>
      {location &&
        stops.map((stop) => (
          <Accordion
            key={stop.stopId}
            disableGutters
            sx={{ my: 3, color: 'primary.light' }}
            elevation={2}
            onChange={() => getBusPredictions(stop.stopId)}>
            <AccordionSummary sx={{ py: 2, px: 3 }}>
              <BusResultSummary
                location={location}
                stop={stop}
                expanded={expanded.find((e) => e.stopId === stop.stopId)?.expanded}
              />
            </AccordionSummary>
            <AccordionDetails sx={{ py: 2, px: 3 }}>
              {busPredictions[stop.stopId] ? (
                <BusResultDetails stop={stop} busPredictions={busPredictions[stop.stopId]} />
              ) : (
                <Typography variant="h6">No predictions available</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
    </Box>
  );
}

export default BusResults;
