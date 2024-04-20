import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import moment from 'moment';
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

  useEffect(() => {
    setExpanded(stops.map((stop) => ({ stopId: stop.stopId, expanded: false })));
  }, [stops]);

  const getBusPredictions = async (stopId: string) => {
    setExpanded(
      expanded.map((e) => ({
        stopId: e.stopId,
        expanded: e.stopId === stopId ? !e.expanded : e.expanded,
      })),
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
            lastUpdated: moment(),
          });
        });
        setBusPredictions((prevPredictions) => ({
          ...prevPredictions,
          [stopId]: routePredictions,
        }));
      }
    });
  };

  return (
    <Box my={2}>
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
                <BusResultDetails
                  stop={stop}
                  busPredictions={busPredictions[stop.stopId]}
                  getBusPredictions={getBusPredictions}
                />
              ) : (
                <Typography variant="h6">No predictions available</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      {stops.length === 0 && (
        <Typography variant="h6" fontWeight="300" textAlign="center" m={2}>
          No nearby bus stops. Choose a different address to see transit options.
        </Typography>
      )}
    </Box>
  );
}

export default BusResults;
