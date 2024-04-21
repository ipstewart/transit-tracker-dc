import Box from '@mui/material/Box';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';

import { getMetroStation } from '../../api/api';
import { BusStop } from '../../models/bus.model';
import { SearchLocation } from '../../models/location.model';
import { MetroStation, MetroStationEntrance } from '../../models/metro.model';
import BusResultSummary from '../BusResults/BusResultSummary/BusResultSummary';
import MetroResultSummary from '../MetroResults/MetroResultSummary/MetroResultSummary';
import './map.css';

const locationIcon = new L.Icon({
  iconUrl: './icons/location.svg',
  iconSize: [25, 25],
  iconAnchor: [16, 32],
});

const metroIcon = new L.Icon({
  iconUrl: './icons/metro-icon.svg',
  iconSize: [25, 25],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const busIcon = new L.Icon({
  iconUrl: './icons/bus-icon.svg',
  iconSize: [25, 25],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MetroMapProps {
  location: SearchLocation | null;
  busStops: BusStop[];
  metroEntrances: MetroStationEntrance[];
}

function MetroMap({ location, busStops, metroEntrances }: Readonly<MetroMapProps>) {
  const mapRef = useRef<L.Map>(null);

  // Default map position at the White House
  const memoizedDefaultLocation = useMemo<LatLngTuple>(() => [38.8976804, -77.0391047], []);

  const [metroStations, setMetroStations] = useState<MetroStation[]>([]);

  useEffect(() => {
    mapRef.current?.flyTo(location ? [location.lat, location.lon] : memoizedDefaultLocation);
  }, [location, memoizedDefaultLocation]);

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
      setMetroStations(filteredStations);
    });
  }, [metroEntrances]);

  return (
    <Box className="w-full h-full py-5">
      <MapContainer
        className="w-full h-full"
        center={location ? [location.lat, location.lon] : memoizedDefaultLocation}
        zoom={16}
        scrollWheelZoom={false}
        ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {location && <Marker position={[location.lat, location.lon]} icon={locationIcon} />}
        {metroStations.map((station) => (
          <Marker key={station.code} position={[station.lat, station.lon]} icon={metroIcon}>
            <Popup>
              {location && (
                <Box bgcolor="background.paper" p={2}>
                  <MetroResultSummary
                    location={location}
                    station={station}
                    station2={
                      metroStations.find(
                        (stationTwo) => stationTwo.code === station.stationTogether1,
                      ) ?? null
                    }
                    showExpandedIcon={false}
                  />
                </Box>
              )}
            </Popup>
          </Marker>
        ))}
        {busStops.map((stop) => (
          <Marker key={stop.stopId} position={[stop.lat, stop.lon]} icon={busIcon}>
            <Popup>
              {location && (
                <Box bgcolor="background.paper" p={2}>
                  <BusResultSummary location={location} stop={stop} showExpandedIcon={false} />
                </Box>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}

export default MetroMap;
