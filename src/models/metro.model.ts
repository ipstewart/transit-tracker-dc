export interface MetroStationResponse {
  Address: {
    City: string;
    State: string;
    Street: string;
    Zip: string;
  };
  Code: string;
  Lat: number;
  LineCode1: string;
  LineCode2: string;
  LineCode3: string;
  LineCode4: string;
  Lon: number;
  Name: string;
  StationTogether1: string;
  StationTogether2: string;
}

export interface MetroStation {
  address: {
    city: string;
    state: string;
    street: string;
    zip: string;
  };
  code: string;
  lat: number;
  lineCode1: string;
  lineCode2: string;
  lineCode3: string;
  lineCode4: string;
  lon: number;
  name: string;
  stationTogether1: string;
  stationTogether2: string;
}

export interface MetroStationEntranceResponse {
  Entrances: {
    Description: string;
    Lat: number;
    Lon: number;
    Name: string;
    StationCode1: string;
    StationCode2: string;
  }[];
}

export interface MetroStationEntrance {
  description: string;
  lat: number;
  lon: number;
  name: string;
  stationCode1: string;
  stationCode2: string;
}

export interface MetroPredictionResponse {
  Trains: {
    Car: string;
    Destination: string;
    DestinationCode: string;
    DestinationName: string;
    Group: string;
    Line: string;
    LocationCode: string;
    LocationName: string;
    Min: string;
  }[];
}

export interface MetroPrediction {
  car: string;
  destination: string;
  destinationCode: string;
  destinationName: string;
  group: string;
  line: string;
  locationCode: string;
  locationName: string;
  min: string;
}
