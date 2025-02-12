import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Map, Route } from 'lucide-react';
import MapComponent from './components/Map';
import { RoutePoint } from './types';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

function App() {
  const [currentPosition, setCurrentPosition] = useState<RoutePoint | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Request location permission and get initial position
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date(),
          };
          setCurrentPosition(newPoint);
        },
        (error) => {
          setError('Error al obtener la ubicación: ' + error.message);
        }
      );
    } else {
      setError('Geolocalización no disponible en este dispositivo');
    }
  }, []);

  useEffect(() => {
    let intervalId: number;

    if (isTracking) {
      intervalId = window.setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newPoint = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date(),
            };
            setCurrentPosition(newPoint);
            setRoutePoints(prev => [...prev, newPoint]);
          },
          (error) => {
            setError('Error al actualizar la ubicación: ' + error.message);
          }
        );
      }, 60000); // Update every minute
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTracking]);

  const handleStartTracking = () => {
    setIsTracking(true);
    setRoutePoints([]);
  };

  const handleStopTracking = async () => {
    setIsTracking(false);
    
    if (routePoints.length === 0) {
      alert('No hay puntos registrados en la ruta');
      return;
    }

    const routeName = prompt('Introduce un nombre para guardar la ruta:');
    if (!routeName) return;

    try {
      const { error } = await supabase
        .from('routes')
        .insert([
          {
            name: routeName,
            points: routePoints,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
      alert('Ruta guardada correctamente');
      setRoutePoints([]);
    } catch (error) {
      console.error('Error al guardar la ruta:', error);
      alert('Error al guardar la ruta');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={isTracking ? handleStopTracking : handleStartTracking}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isTracking
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isTracking ? (
              <>
                <Route className="w-5 h-5" />
                Finalizar Paseo
              </>
            ) : (
              <>
                <Map className="w-5 h-5" />
                Iniciar Registro
              </>
            )}
          </button>
        </div>

        <div className="h-[calc(100vh-8rem)] rounded-lg overflow-hidden shadow-lg">
          <MapComponent
            currentPosition={currentPosition}
            routePoints={routePoints}
          />
        </div>
      </div>
    </div>
  );
}

export default App