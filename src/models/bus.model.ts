import { Moment } from 'moment';

export interface BusStopResponse {
  Stops: {
    Lat: number;
    Lon: number;
    Name: string;
    Routes: string[];
    StopID: string;
  }[];
}

export interface BusStop {
  lat: number;
  lon: number;
  name: string;
  routes: string[];
  stopId: string;
}

export interface BusPredictionResponse {
  Predictions: {
    DirectionNum: string;
    DirectionText: string;
    Minutes: number;
    RouteID: string;
    TripID: string;
    VehicleID: string;
  }[];
}

export interface BusPathDirectionResponse {
  DirectionNum: string;
  DirectionText: string;
  Shape: {
    Lat: number;
    Lon: number;
    SeqNumber: number;
  }[];
  Stops: {
    Lat: number;
    Lon: number;
    Name: string;
    Routes: string[];
    StopID: string;
  }[];
  TripHeadsign: string;
}

export interface BusPathDetailsResponse {
  Direction0: BusPathDirectionResponse | null;
  Direction1: BusPathDirectionResponse | null;
  Name: string;
  RouteID: string;
}

export interface BusPrediction {
  directionNum: string;
  directionText: string;
  minutes: number;
  routeId: string;
  tripId: string;
  vehicleId: string;
}

export interface RoutePrediction {
  minutes: number;
  tripId: string;
  vehicleId: string;
}

export interface BusRoutePrediction {
  directionNum: string;
  directionText: string;
  routeId: string;
  predictions: RoutePrediction[];
  lastUpdated: Moment;
}

export interface BusPathDirection {
  directionNum: string;
  directionText: string;
  shape: {
    lat: number;
    lon: number;
    seqNumber: number;
  }[];
  stops: {
    lat: number;
    lon: number;
    name: string;
    routes: string[];
    stopId: string;
  }[];
  tripHeadsign: string;
}

export interface BusPathDetails {
  direction0: BusPathDirection | null;
  direction1: BusPathDirection | null;
  name: string;
  routeId: string;
}
