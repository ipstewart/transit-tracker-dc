import { Loader, LoaderOptions } from '@googlemaps/js-api-loader';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Autocomplete, {
  AutocompleteCloseReason,
  AutocompleteProps,
  AutocompleteRenderGroupParams,
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';

import { SearchLocation } from '../models/location.model';

const apiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface SearchProps {
  location: SearchLocation | null;
  setLocation: (location: SearchLocation | null) => void;
}

function Search({ location, setLocation }: Readonly<SearchProps>) {
  // const [selectedLocation, setSelectedLocation] = useState<{ id: string; label: string }>({
  //   id: 'Current Location',
  //   label: 'Current Location',
  // });

  const autocomplete = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  const autocompleteRef = useRef<any | null>(null);

  const [addressOptions, setAddressOptions] = useState<{ id: string; label: string }[]>([]);
  const [currentLocation, setCurrentLocation] = useState<SearchLocation | null>();

  useEffect(() => {
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

    getCurrentLocation();

    const loaderOptions: LoaderOptions = {
      apiKey,
      libraries: ['places'],
    };

    const loader = new Loader(loaderOptions);
    loader.importLibrary('places').then((places) => {
      autocomplete.current = new places.AutocompleteService();
      geocoder.current = new google.maps.Geocoder();
    });
  }, []);

  const handleInputChange = (searchAddress: string) => {
    autocomplete.current?.getPlacePredictions({ input: searchAddress }, (predictions, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        predictions &&
        predictions.length > 0
      ) {
        autocompleteRef.current?.updateInputValue();
        autocompleteRef.current?.updateOptions(predictions);
        // setAddressOptions(
        //   predictions.map((prediction) => ({
        //     id: prediction.place_id,
        //     label: prediction.description,
        //   })),
        // );
      }
    });
  };

  const handleSelectLocation = (placeId: string, name: string) => {
    if (placeId === 'Current Location' && currentLocation) {
      setLocation(currentLocation);
    } else {
      geocoder.current = new google.maps.Geocoder();
      geocoder.current?.geocode({ placeId: placeId }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          const location = results[0].geometry?.location;
          if (location) {
            setLocation({ name, lat: location.lat(), lon: location.lng() });
          }
        }
      });
    }
  };

  const handleSelectOpen = () => {
    // if current location selected, clear
    // if
  };

  const handleSelectClose = (reason: AutocompleteCloseReason) => {
    if (reason === 'blur') {
      setLocation(null);
    }
  };

  return (
    <Box py={2}>
      {/* <Autocomplete
        disablePortal
        options={addressOptions}
        noOptionsText="Search for a location"
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_e, value) => (value ? getLocationFromAddress(value.id, value.label) : null)}
        onInputChange={(_e, value) => value && handleSearch(value)}
        renderInput={(params) => <TextField {...params} label="Location" />}
      /> */}
      <Autocomplete
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
      />
    </Box>
  );
}

export default Search;
