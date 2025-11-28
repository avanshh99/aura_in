import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { weatherService } from '../services/weather';
import type { WeatherData } from '../services/weather';
import { Loader2, AlertTriangle, Thermometer, Droplets, Wind } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const CITY_COORDINATES: Record<string, [number, number]> = {
    'Delhi,IN': [28.6139, 77.2090],
    'Mumbai,IN': [19.0760, 72.8777],
    'Bangalore,IN': [12.9716, 77.5946],
    'Chennai,IN': [13.0827, 80.2707],
    'Kolkata,IN': [22.5726, 88.3639],
    'Hyderabad,IN': [17.3850, 78.4867]
};

export const LiveMap: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            const data = await weatherService.getAllCitiesWeather();
            setWeatherData(data);
            setLoading(false);
        };

        fetchWeather();
        // Poll every 5 minutes
        const interval = setInterval(fetchWeather, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getRiskColor = (temp: number) => {
        if (temp > 40) return 'red';
        if (temp > 35) return 'orange';
        return 'green';
    };

    if (loading) {
        return (
            <div className="h-[400px] bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                    <p>Initializing Satellite Link...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[400px] rounded-xl overflow-hidden border border-slate-800 relative z-0">
            <MapContainer
                center={[20.5937, 78.9629]} // Center of India
                zoom={4}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {weatherData.map((data) => {
                    const coords = CITY_COORDINATES[data.location];
                    if (!coords) return null;

                    const riskColor = getRiskColor(data.temp);

                    return (
                        <Marker key={data.location} position={coords}>
                            <Popup className="custom-popup">
                                <div className="p-2 min-w-[200px]">
                                    <div className="flex items-center justify-between mb-2 border-b border-slate-200 pb-1">
                                        <h3 className="font-bold text-slate-800">{data.location.split(',')[0]}</h3>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${riskColor === 'red' ? 'bg-red-100 text-red-600' :
                                            riskColor === 'orange' ? 'bg-orange-100 text-orange-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                            {riskColor === 'red' ? 'CRITICAL' : riskColor === 'orange' ? 'MODERATE' : 'NORMAL'}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Thermometer className="w-4 h-4 text-slate-400" />
                                            <span>{data.temp}°C</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Droplets className="w-4 h-4 text-slate-400" />
                                            <span>{data.humidity}% Humidity</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Wind className="w-4 h-4 text-slate-400" />
                                            <span>{data.conditions}</span>
                                        </div>
                                        {data.alert && (
                                            <div className="mt-2 p-2 bg-red-50 text-red-600 text-xs rounded flex items-start gap-1">
                                                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                                {data.alert}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};
