import { Loader, LoaderOptions } from '@googlemaps/js-api-loader';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SearchLocation } from '../models/location.model';

const apiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface SearchProps {
  location: string | undefined;
  setSearchCoords: (coords: SearchLocation | null) => void;
}

function Search({ location, setSearchCoords }: Readonly<SearchProps>) {
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const autocomplete = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<SearchLocation | null>();

  const CURRENT_LOCATION = 'Current Location';

  useEffect(() => {
    const getCurrentLocation = (): Promise<SearchLocation | null> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser'));
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                name: CURRENT_LOCATION,
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              });
            },
            (error) => {
              if (error.code === error.PERMISSION_DENIED) {
                resolve(null); // User denied the request for Geolocation
              } else {
                reject(error); // Other errors
              }
            },
          );
        }
      });
    };

    getCurrentLocation().then((currentLocation) => setCurrentLocation(currentLocation));
  }, []);

  useEffect(() => {
    const loadMapApi = () => {
      const loaderOptions: LoaderOptions = {
        apiKey,
        libraries: ['places'],
      };
      const loader = new Loader(loaderOptions);
      return loader.importLibrary('places').then((places) => {
        autocomplete.current = new places.AutocompleteService();
        geocoder.current = new google.maps.Geocoder();
      });
    };

    const searchAddress = (address: string | undefined) => {
      if (!address) {
        setAddressOptions(currentLocation ? [CURRENT_LOCATION] : []);
      } else if (address === CURRENT_LOCATION && currentLocation) {
        setSearchCoords(currentLocation);
        setSelectedLocation(address);
        navigate(`/${encodeURIComponent(address)}`);
      } else {
        geocoder.current?.geocode({ address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
            const location = results[0].geometry?.location;
            setSearchCoords({
              name: address,
              lat: location.lat(),
              lon: location.lng(),
            });
            setSelectedLocation(address);
          }
        });
      }
    };

    // If this is the first load, initialize the map API
    if (!geocoder.current) {
      loadMapApi().then(() => searchAddress(location));
    } else {
      searchAddress(location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation, setSearchCoords]);

  const handleInputChange = (searchAddress: string) => {
    if (searchAddress === CURRENT_LOCATION) {
      setAddressOptions([]);
      return;
    }
    if (!searchAddress) {
      setAddressOptions(currentLocation ? [CURRENT_LOCATION] : []);
      return;
    }
    autocomplete.current?.getPlacePredictions({ input: searchAddress }, (predictions, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        predictions &&
        predictions.length > 0
      ) {
        const predictionList = predictions.map((prediction) => prediction.description);
        setAddressOptions(predictionList);
      }
    });
  };

  const handleSelectLocation = (selection: string | null) => {
    if (!selection) {
      setSearchCoords(null);
      setAddressOptions(currentLocation ? [CURRENT_LOCATION] : []);
      setSelectedLocation(null);
      navigate('/');
    } else if (selection === CURRENT_LOCATION && currentLocation) {
      setSearchCoords(currentLocation);
      setSelectedLocation(selection);
      navigate(`/${encodeURIComponent(selection)}`);
    } else {
      geocoder.current?.geocode({ address: selection }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          const location = results[0].geometry?.location;
          if (location) {
            setSearchCoords({ name: selection, lat: location.lat(), lon: location.lng() });
            setSelectedLocation(selection);
            navigate(`/${encodeURIComponent(selection)}`);
          }
        }
      });
    }
  };

  return (
    <Box py={2}>
      <Autocomplete
        disablePortal
        freeSolo
        clearOnBlur
        selectOnFocus
        options={addressOptions}
        value={selectedLocation}
        noOptionsText="Search for a location"
        onChange={(_e, value) => handleSelectLocation(value)}
        onInputChange={(_e, value) => handleInputChange(value)}
        renderOption={(props, option) => (
          <li {...props}>
            <Box className="flex gap-2 w-full">
              {option === CURRENT_LOCATION ? <MyLocationIcon color="primary" /> : null}
              <Box className="max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
                {option}
              </Box>
            </Box>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search for a location or address"
            sx={{ '& fieldset': { borderRadius: 1 } }}
          />
        )}
      />
    </Box>
  );
}

export default Search;
