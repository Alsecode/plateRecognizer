export type DistanceEstimationResult = {
  distance: number;
  coordinates: { 
    lat: number;
    lng: number;
  } | null;
}