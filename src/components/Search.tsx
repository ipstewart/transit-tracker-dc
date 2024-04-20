import { Loader, LoaderOptions } from '@googlemaps/js-api-loader';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SearchLocation } from '../models/location.model';

const apiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface SearchProps {
  locationLabel: string | undefined;
  locationId: string | undefined;
  setSearchCoords: (coords: SearchLocation | null) => void;
}

function Search({ locationLabel, locationId, setSearchCoords }: Readonly<SearchProps>) {
  const [selectedLocation, setSelectedLocation] = useState<{ id: string; label: string } | null>(
    null,
  );
  const navigate = useNavigate();

  const autocomplete = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  const [addressOptions, setAddressOptions] = useState<{ id: string; label: string }[]>([]);
  const [currentLocation, setCurrentLocation] = useState<SearchLocation | null>();

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

    const searchAddress = (locationLabel: string, locationId: string) => {
      geocoder.current?.geocode({ placeId: locationId }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          const locationResults = results[0].geometry?.location;

          if (location) {
            setSearchCoords({
              name: locationLabel,
              lat: locationResults.lat(),
              lon: locationResults.lng(),
            });
            setSelectedLocation({ id: locationId, label: locationLabel });
          }
        }
      });
    };

    if (!locationLabel || !locationId) {
      loadMapApi();
      return;
    }

    // If this is the first load, initialize the map API
    if (!geocoder.current) {
      loadMapApi().then(() => searchAddress(locationLabel, locationId));
    } else {
      searchAddress(locationLabel, locationId);
    }
  }, [locationLabel, locationId, setSearchCoords]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            name: 'Your Location',
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleInputChange = (searchAddress: string) => {
    autocomplete.current?.getPlacePredictions({ input: searchAddress }, (predictions, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        predictions &&
        predictions.length > 0
      ) {
        const predictionList = predictions.map((prediction) => ({
          id: prediction.place_id,
          label: prediction.description,
        }));
        setAddressOptions(
          selectedLocation &&
            !predictionList.map((prediction) => prediction.id).includes(selectedLocation.id)
            ? [...predictionList, selectedLocation]
            : predictionList,
        );
      }
    });
  };

  const handleSelectLocation = (selection: { id: string; label: string } | null) => {
    if (!selection) {
      setSearchCoords(null);
      setAddressOptions([]);
      setSelectedLocation(null);
      navigate('/');
      return;
    }
    if (selection.id === 'Current Location' && currentLocation) {
      setSearchCoords(currentLocation);
    } else {
      geocoder.current = new google.maps.Geocoder();
      geocoder.current?.geocode({ placeId: selection.id }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          const location = results[0].geometry?.location;
          if (location) {
            setSearchCoords({ name: selection.label, lat: location.lat(), lon: location.lng() });
            setSelectedLocation({ label: selection.label, id: selection.label });
            navigate(`/${encodeURIComponent(selection.label)}/${selection.id}`);
          }
        }
      });
    }
  };

  return (
    <Box py={2}>
      <Autocomplete
        disablePortal
        options={addressOptions}
        value={selectedLocation}
        noOptionsText="Search for a location"
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_e, value) => handleSelectLocation(value)}
        onInputChange={(e, value) => handleInputChange(value)}
        renderInput={(params) => <TextField {...params} label="Location" />}
      />
      {/* <Autocomplete
        ref={autocompleteRef}
        onChange={(_e, value) => (value ? handleSelectLocation(value.id, value.label) : null)}
        options={[] as { id: string; label: string }[]}
        getOptionLabel={(option) => option.label}
        onInputChange={(_e, value) => value && handleInputChange(value)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        noOptionsText="Search for a location"
        onClose={(_e, value) => handleSelectClose(value)}
        renderInput={(params) => (
          <TextField {...params} label="Search for an address" variant="outlined" fullWidth />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <div>
              {option.label === currentLocation?.name ? <LocationOnIcon /> : null}
              <Box
                component="span"
                fontWeight={option.label === currentLocation?.name ? '600' : '400'}>
                {option.label}
              </Box>
            </div>
          </li>
        )}
        sx={{ '& fieldset': { borderRadius: '10px' } }}
      /> */}
    </Box>
  );
}

export default Search;
