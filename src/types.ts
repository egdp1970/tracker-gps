export interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export interface SavedRoute {
  id: string;
  name: string;
  points: RoutePoint[];
  created_at: Date;
}