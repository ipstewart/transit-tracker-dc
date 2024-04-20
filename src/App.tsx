import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TrainIcon from '@mui/icons-material/Train';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getBusStops, getMetroStationEntrances } from './api/api';
import BusResults from './components/BusResults/BusResults';
import MetroResults from './components/MetroResults/MetroResults';
import Search from './components/Search';
import { BusStop } from './models/bus.model';
import { SearchLocation } from './models/location.model';
import { MetroStationEntrance } from './models/metro.model';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function App() {
  const { locationLabel, locationId } = useParams();

  const [searchCoords, setSearchCoords] = useState<SearchLocation | null>(null);

  const [stops, setStops] = useState<BusStop[]>([]);
  const [metroEntrances, setMetroEntrances] = useState<MetroStationEntrance[]>([]);

  const [tab, setTab] = useState(0);

  // .5 miles bus, 1 mile metro
  const busRadius = 800;
  const metroRadius = 1600;

  useEffect(() => {
    if (searchCoords) {
      getBusStops(searchCoords.lat, searchCoords.lon, busRadius).then((stops) => {
        if (stops) {
          setStops(stops);
        }
      });

      getMetroStationEntrances(searchCoords.lat, searchCoords.lon, metroRadius).then(
        (metroEntrances) => {
          if (metroEntrances) {
            setMetroEntrances(metroEntrances);
          }
        },
      );
    } else {
      setStops([]);
      setMetroEntrances([]);
    }
  }, [searchCoords]);

  return (
    <Container maxWidth="md">
      <Box p={2} pt={4}>
        <Typography variant="h4" fontWeight="400">
          Where To{' '}
          <Typography component="span" variant="h4" fontWeight="700" color="primary">
            DMV
          </Typography>
        </Typography>
        <Typography variant="body1">
          Input an address to discover the best real-time Washington, DC public transportation
          options.
        </Typography>
      </Box>
      <Search
        locationLabel={locationLabel}
        locationId={locationId}
        setSearchCoords={setSearchCoords}
      />

      <Tabs value={tab} onChange={(_e, value) => setTab(value)} aria-label="bus and metro tabs">
        <Tab icon={<DirectionsBusIcon />} label="BUS" />
        <Tab icon={<TrainIcon />} label="METRO" color="secondary" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <BusResults location={searchCoords} stops={stops} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <MetroResults location={searchCoords} metroEntrances={metroEntrances} />
      </TabPanel>
    </Container>
  );
}

export default App;
