import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { getMetroPredictionAtStation, getMetroStation } from '../../api/api';
import { SearchLocation } from '../../models/location.model';
import { MetroPrediction, MetroStation, MetroStationEntrance } from '../../models/metro.model';
import MetroResultDetails from './MetroResultDetails/MetroResultDetails';
import MetroResultSummary from './MetroResultSummary/MetroResultSummary';

interface MetroResultsProps {
  location: SearchLocation | null;
  metroEntrances: MetroStationEntrance[];
}

function MetroResults({ location, metroEntrances }: Readonly<MetroResultsProps>) {
  const [metroStations, setMetroStations] = useState<MetroStation[]>([]);
  const [metroPredictions, setMetroPredictions] = useState<Record<string, MetroPrediction[]>>({});
  const [expanded, setExpanded] = useState<{ stationCode: string; expanded: boolean }[]>([]);

  useEffect(() => {
    const uniqueStationCodes = [
      ...new Set(
        metroEntrances.map((entrance) => [entrance.stationCode1, entrance.stationCode2]).flat(),
      ),
    ];

    // Only take the first 5 stations if large list, to avoid the TooManyRequests WMATA API error
    const metroStations = uniqueStationCodes
      .filter((code) => code)
      .slice(0, Math.min(5, uniqueStationCodes.length))
      .map((code) => getMetroStation(code));

    Promise.all(metroStations).then((stations) => {
      const filteredStations = stations.filter((station) => station) as MetroStation[];
      setExpanded(
        filteredStations.map((station) => ({ stationCode: station.code, expanded: false })),
      );
      setMetroStations(filteredStations);
    });
  }, [metroEntrances]);

  const getMetroPredictions = async (stationCodes: string[]) => {
    setExpanded(
      expanded.map((e) => ({
        stationCode: e.stationCode,
        expanded: e.stationCode === stationCodes[0] ? !e.expanded : e.expanded,
      })),
    );

    const metroStationPredictions = stationCodes
      .filter((code) => code)
      .map((code) => getMetroPredictionAtStation(code));

    Promise.all(metroStationPredictions).then((predictions) => {
      predictions
        .filter((prediction) => prediction)
        .forEach((prediction, i) => {
          setMetroPredictions((prevPredictions) => ({
            ...prevPredictions,
            [stationCodes[i]]: prediction as MetroPrediction[],
          }));
        });
    });
  };

  return (
    <Box my={2}>
      {location &&
        metroStations
          .filter(
            (station, i) =>
              !station.stationTogether1 ||
              !metroStations
                .slice(0, i)
                .map((compareStation) => compareStation.code)
                .includes(station.stationTogether1),
          )
          .map((station) => (
            <Accordion
              key={station.code}
              disableGutters
              sx={{ my: 3 }}
              elevation={2}
              onChange={() => getMetroPredictions([station.code, station.stationTogether1])}>
              <AccordionSummary sx={{ py: 2, px: 3 }}>
                <MetroResultSummary
                  location={location}
                  station={station}
                  station2={
                    metroStations.find(
                      (stationTwo) => stationTwo.code === station.stationTogether1,
                    ) ?? null
                  }
                  expanded={expanded.find((e) => e.stationCode === station.code)?.expanded}
                />
              </AccordionSummary>
              <AccordionDetails sx={{ py: 2, px: 3 }}>
                {metroPredictions[station.code] ? (
                  <MetroResultDetails
                    metroPredictions={metroPredictions[station.code]}
                    metroPredictionsStation2={
                      station.stationTogether1 ? metroPredictions[station.stationTogether1] : []
                    }
                    lastUpdated={moment()}
                    getMetroPredictions={getMetroPredictions}
                  />
                ) : (
                  <Typography variant="h6">No predictions available</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
      {metroStations.length === 0 && (
        <Typography variant="h6" fontWeight="300" textAlign="center" m={2}>
          No nearby metro stations. Choose a different address to see transit options.
        </Typography>
      )}
    </Box>
  );
}

export default MetroResults;
