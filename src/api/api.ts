import axios from 'axios';

import {
  BusPathDetails,
  BusPathDetailsResponse,
  BusPathDirection,
  BusPathDirectionResponse,
  BusPrediction,
  BusPredictionResponse,
  BusStop,
  BusStopResponse,
} from '../models/bus.model';
import {
  MetroPrediction,
  MetroPredictionResponse,
  MetroStation,
  MetroStationEntrance,
  MetroStationEntranceResponse,
  MetroStationResponse,
} from '../models/metro.model';

const apiKey: string = import.meta.env.VITE_WMATA_API_KEY;
const apiUrl: string = import.meta.env.VITE_WMATA_API_URL;

// Get all bus stops at lat long within radius
export const getBusStops = async (
  lat: number,
  lon: number,
  radius: number,
): Promise<BusStop[] | null> => {
  try {
    const url = `${apiUrl}Bus.svc/json/jStops?Lat=${lat}&Lon=${lon}&Radius=${radius}`;
    const response = await axios.get<BusStopResponse>(url, {
      headers: {
        api_key: apiKey,
      },
    });

    const mappedBusStops: BusStop[] = response.data.Stops.map((stop) => ({
      lat: stop.Lat,
      lon: stop.Lon,
      name: stop.Name,
      routes: stop.Routes,
      stopId: stop.StopID,
    }));

    return mappedBusStops;
  } catch (error) {
    console.error(error || 'An error occurred');
    return null;
  }
};

// Get bus arrival time predictions at stop
export const getBusPredictionAtStop = async (stopId: string): Promise<BusPrediction[] | null> => {
  try {
    const url = `${apiUrl}NextBusService.svc/json/jPredictions?StopID=${stopId}`;
    const response = await axios.get<BusPredictionResponse>(url, {
      headers: {
        api_key: apiKey,
      },
    });

    const busPredictions: BusPrediction[] = response.data.Predictions.map((prediction) => ({
      directionNum: prediction.DirectionNum,
      directionText: prediction.DirectionText,
      minutes: prediction.Minutes,
      routeId: prediction.RouteID,
      tripId: prediction.TripID,
      vehicleId: prediction.VehicleID,
    }));

    return busPredictions;
  } catch (error) {
    console.error(error || 'An error occurred');
    return null;
  }
};

// Get bus path details for route
export const getBusPathDetails = async (routeId: string): Promise<BusPathDetails | null> => {
  const mapPathDirection = (pathDirectionResponse: BusPathDirectionResponse | null) => {
    if (!pathDirectionResponse) return null;
    const pathDirection: BusPathDirection = {
      directionNum: pathDirectionResponse.DirectionNum,
      directionText: pathDirectionResponse.DirectionText,
      tripHeadsign: pathDirectionResponse.TripHeadsign,
      stops: pathDirectionResponse.Stops.map((stop) => ({
        lat: stop.Lat,
        lon: stop.Lon,
        name: stop.Name,
        routes: stop.Routes,
        stopId: stop.StopID,
      })),
      shape: pathDirectionResponse.Shape.map((shape) => ({
        lat: shape.Lat,
        lon: shape.Lon,
        seqNumber: shape.SeqNumber,
      })),
    };
    return pathDirection;
  };

  try {
    const url = `${apiUrl}Bus.svc/json/jRouteDetails?RouteID=${routeId}`;
    const response = await axios.get<BusPathDetailsResponse>(url, {
      headers: {
        api_key: apiKey,
      },
    });

    const busRoute: BusPathDetails = {
      name: response.data.Name,
      routeId: response.data.RouteID,
      direction0: mapPathDirection(response.data.Direction0),
      direction1: mapPathDirection(response.data.Direction1),
    };

    return busRoute;
  } catch (error) {
    console.error(error || 'An error occurred');
    return null;
  }
};

// Get all metro station entrances at lat long within radius
export const getMetroStationEntrances = async (
  lat: number,
  lon: number,
  radius: number,
): Promise<MetroStationEntrance[] | null> => {
  try {
    const url = `${apiUrl}Rail.svc/json/jStationEntrances?Lat=${lat}&Lon=${lon}&Radius=${radius}`;
    const response = await axios.get<MetroStationEntranceResponse>(url, {
      headers: {
        api_key: apiKey,
      },
    });

    const mappedMetroEntrances: MetroStationEntrance[] = response.data.Entrances.map((station) => ({
      description: station.Description,
      lat: station.Lat,
      lon: station.Lon,
      name: station.Name,
      stationCode1: station.StationCode1,
      stationCode2: station.StationCode2,
    }));

    return mappedMetroEntrances;
  } catch (error) {
    console.error(error || 'An error occurred');
    return null;
  }
};

// Get metro station from station code
export const getMetroStation = async (stationCode: string): Promise<MetroStation | null> => {
  try {
    const url = `${apiUrl}Rail.svc/json/jStationInfo?StationCode=${stationCode}`;
    const response = await axios.get<MetroStationResponse>(url, {
      headers: {
        api_key: apiKey,
      },
    });

    const metroStation: MetroStation = {
      address: {
        city: response.data.Address.City,
        state: response.data.Address.State,
        street: response.data.Address.State,
        zip: response.data.Address.Zip,
      },
      code: response.data.Code,
      lat: response.data.Lat,
      lon: response.data.Lon,
      lineCode1: response.data.LineCode1,
      lineCode2: response.data.LineCode2,
      lineCode3: response.data.LineCode3,
      lineCode4: response.data.LineCode4,
      name: response.data.Name,
      stationTogether1: response.data.StationTogether1,
      stationTogether2: response.data.StationTogether2,
    };

    return metroStation;
  } catch (error) {
    console.error(error || 'An error occurred');
    return null;
  }
};

// Get metro arrival time predictions at stop
export const getMetroPredictionAtStation = async (
  stationCode: string,
): Promise<MetroPrediction[] | null> => {
  try {
    const url = `${apiUrl}StationPrediction.svc/json/jGetPrediction/${stationCode}`;
    const response = await axios.get<MetroPredictionResponse>(url, {
      headers: {
        api_key: apiKey,
      },
    });

    const metroPredictions: MetroPrediction[] = response.data.Trains.map((prediction) => ({
      car: prediction.Car,
      destination: prediction.Destination,
      destinationCode: prediction.DestinationCode,
      destinationName: prediction.DestinationName,
      group: prediction.Group,
      line: prediction.Line,
      locationCode: prediction.LocationCode,
      locationName: prediction.LocationName,
      min: prediction.Min,
    }));

    return metroPredictions;
  } catch (error) {
    console.error(error || 'An error occurred');
    return null;
  }
};
