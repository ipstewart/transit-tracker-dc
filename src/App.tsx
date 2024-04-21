import DarkModeIcon from '@mui/icons-material/DarkMode';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LightModeIcon from '@mui/icons-material/LightMode';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import TrainIcon from '@mui/icons-material/Train';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getBusStops, getMetroStationEntrances } from './api/api';
import BusResults from './components/BusResults/BusResults';
import InfoDialog from './components/InfoDialog';
import MetroResults from './components/MetroResults/MetroResults';
import Search from './components/Search';
import { BusStop } from './models/bus.model';
import { SearchLocation } from './models/location.model';
import { MetroStationEntrance } from './models/metro.model';
import { ThemeContext } from './theme/ThemeContext';

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
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const { location } = useParams();

  const [searchCoords, setSearchCoords] = useState<SearchLocation | null>(null);

  const [stops, setStops] = useState<BusStop[]>([]);
  const [metroEntrances, setMetroEntrances] = useState<MetroStationEntrance[]>([]);

  const [tab, setTab] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);

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
      <Box className="flex items-center justify-between pt-4 gap-2">
        <Box
          component="img"
          src={isDarkMode ? './logo-light-blue.svg' : './logo.svg'}
          height="60px"
        />
        <Box className="flex items-center gap-2">
          <IconButton aria-label="info" color="primary" size="medium" onClick={toggleTheme}>
            {isDarkMode ? (
              <LightModeIcon fontSize="inherit" />
            ) : (
              <DarkModeIcon fontSize="inherit" />
            )}
          </IconButton>
          <IconButton
            aria-label="info"
            color="primary"
            size="medium"
            onClick={() => setOpenDialog(true)}>
            <QuestionMarkIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>
      <Search location={location} setSearchCoords={setSearchCoords} />

      <Tabs value={tab} onChange={(_e, value) => setTab(value)} aria-label="bus and metro tabs">
        <Tab icon={<DirectionsBusIcon />} label="BUS" sx={{ maxWidth: 'none', flex: 1 }} />
        <Tab
          icon={<TrainIcon />}
          label="METRO"
          color="secondary"
          sx={{ maxWidth: 'none', flex: 1 }}
        />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <BusResults location={searchCoords} stops={stops} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <MetroResults location={searchCoords} metroEntrances={metroEntrances} />
      </TabPanel>

      <InfoDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Container>
  );
}

export default App;
