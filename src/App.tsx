import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TrainIcon from '@mui/icons-material/Train';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { getBusStops } from './api/api';
import BusResults from './components/BusResults/BusResults';
import Search from './components/Search';
import { BusStop } from './models/bus.model';
import { SearchLocation } from './models/location.model';

// Default location White House if user doesn't enable location
const DEFAULT_LOCATION = {
  name: 'The White House, Pennsylvania Avenue Northwest, Washington, DC, USA',
  lat: 38.897692811818395,
  lon: -77.03652647629332,
};

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
  const [location, setLocation] = useState<SearchLocation | null>(DEFAULT_LOCATION);

  const [stops, setStops] = useState<BusStop[]>([]);

  const [tab, setTab] = useState(0);

  // .5 miles search radius
  const radius = 800;

  useEffect(() => {
    if (location) {
      getBusStops(location.lat, location.lon, radius).then((stops) => {
        if (stops) {
          setStops(stops);
        }
      });
    } else {
      setStops([]);
    }
  }, [location]);

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
      <Search location={location} setLocation={setLocation} />

      <Tabs value={tab} onChange={(_e, value) => setTab(value)} aria-label="bus and metro tabs">
        <Tab icon={<DirectionsBusIcon />} label="BUS" />
        <Tab icon={<TrainIcon />} label="METRO" color="secondary" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <BusResults location={location} stops={stops} />
      </TabPanel>
    </Container>
  );
}

export default App;
