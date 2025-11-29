import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, AlertCircle, CheckCircle, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { geolocationService, type LocationData, type GeolocationError } from '../services/geolocation';
import { updateHospitalConfig } from '../forecasting/hospitalConfig';

const INDIAN_CITIES = [
    { name: 'Delhi', state: 'Delhi' },
    { name: 'Mumbai', state: 'Maharashtra' },
    { name: 'Bangalore', state: 'Karnataka' },
    { name: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Kolkata', state: 'West Bengal' },
    { name: 'Hyderabad', state: 'Telangana' },
    { name: 'Pune', state: 'Maharashtra' },
    { name: 'Ahmedabad', state: 'Gujarat' }
];

export const LocationDetector: React.FC = () => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showManualInput, setShowManualInput] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        const cached = geolocationService.getCachedLocation();
        if (cached) {
            setLocation(cached);
            updateHospitalLocation(cached);
        }
    }, []);

    const requestLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            const locationData = await geolocationService.getCurrentLocation();
            setLocation(locationData);
            updateHospitalLocation(locationData);
            setShowManualInput(false);
        } catch (err) {
            const geoError = err as GeolocationError;
            console.error('[LocationDetector] Geolocation failed:', geoError);
            setError('Auto-detection failed. Please select your city manually.');
            setShowManualInput(true);
        } finally {
            setLoading(false);
        }
    };

    const handleManualSelection = () => {
        if (!selectedCity) return;

        const cityData = INDIAN_CITIES.find(c => c.name === selectedCity);
        if (!cityData) return;

        const locationData: LocationData = {
            latitude: 0,
            longitude: 0,
            city: cityData.name,
            state: cityData.state,
            country: 'India',
            timestamp: Date.now()
        };

        setLocation(locationData);
        updateHospitalLocation(locationData);
        setShowManualInput(false);
        setError(null);
    };

    const updateHospitalLocation = (locationData: LocationData) => {
        updateHospitalConfig({
            location: {
                city: locationData.city,
                state: locationData.state,
                lat: locationData.latitude,
                lon: locationData.longitude
            }
        });
        console.log('[LocationDetector] Hospital location updated:', locationData.city);
    };

    return (
        <div className="fixed top-4 left-4 z-[9999]">
            <AnimatePresence>
                {!location && !showManualInput && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-2"
                    >
                        <button
                            onClick={requestLocation}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors shadow-lg disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                                    <span className="text-sm text-slate-300">Detecting...</span>
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-4 h-4 text-cyan-400" />
                                    <span className="text-sm text-slate-300">Auto-Detect</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setShowManualInput(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors shadow-lg"
                        >
                            <Edit3 className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-slate-300">Select City</span>
                        </button>
                    </motion.div>
                )}

                {showManualInput && !location && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg"
                    >
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:border-cyan-500 focus:outline-none"
                        >
                            <option value="">Select your city</option>
                            {INDIAN_CITIES.map(city => (
                                <option key={city.name} value={city.name}>
                                    {city.name}, {city.state}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleManualSelection}
                            disabled={!selectedCity}
                            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Set
                        </button>
                        <button
                            onClick={() => setShowManualInput(false)}
                            className="px-2 py-1 text-slate-400 hover:text-white text-sm"
                        >
                            ✕
                        </button>
                    </motion.div>
                )}

                {location && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <div>
                                <div className="text-xs text-slate-400">Current Location</div>
                                <div className="text-sm font-medium text-white">
                                    {location.city}, {location.state}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setLocation(null);
                                setShowManualInput(true);
                            }}
                            className="p-1 hover:bg-slate-700 rounded transition-colors"
                            title="Change location"
                        >
                            <Edit3 className="w-3 h-3 text-slate-400" />
                        </button>
                    </motion.div>
                )}

                {error && !showManualInput && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-900/20 border border-amber-700 rounded-lg shadow-lg max-w-xs"
                    >
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <div className="text-xs text-amber-400">{error}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
