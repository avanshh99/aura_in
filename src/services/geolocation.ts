/**
 * Geolocation Service
 * Handles browser geolocation API and reverse geocoding
 */

export interface LocationData {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
    timestamp: number;
}

export interface GeolocationError {
    code: number;
    message: string;
}

class GeolocationService {
    private currentLocation: LocationData | null = null;

    /**
   * Request user's current location with IP fallback
   */
    async getCurrentLocation(): Promise<LocationData> {
        try {
            // Try browser geolocation first
            return await this.getBrowserLocation();
        } catch (error) {
            console.warn('[Geolocation] Browser location failed, trying IP fallback...', error);
            // Fallback to IP-based location
            return await this.getIpLocation();
        }
    }

    /**
     * Get location from browser API
     */
    private getBrowserLocation(): Promise<LocationData> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject({
                    code: 0,
                    message: 'Geolocation is not supported by this browser'
                });
                return;
            }

            console.log('[Geolocation] Requesting browser location...');

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    console.log('[Geolocation] Permission granted, got coordinates');
                    const { latitude, longitude } = position.coords;

                    try {
                        const locationData = await this.reverseGeocode(latitude, longitude);
                        this.currentLocation = locationData;
                        console.log('[Geolocation] Location detected:', locationData.city);
                        resolve(locationData);
                    } catch (error) {
                        console.error('[Geolocation] Reverse geocoding failed:', error);
                        resolve({
                            latitude,
                            longitude,
                            city: 'Unknown City',
                            state: 'Unknown State',
                            country: 'Unknown',
                            timestamp: Date.now()
                        });
                    }
                },
                (error) => {
                    console.error('[Geolocation] Browser Error:', error);
                    reject({
                        code: error.code,
                        message: this.getErrorMessage(error.code)
                    });
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }

    /**
     * Get location from IP address (Fallback)
     */
    private async getIpLocation(): Promise<LocationData> {
        try {
            console.log('[Geolocation] Fetching IP location...');
            const response = await fetch('https://ipapi.co/json/');

            if (!response.ok) {
                throw new Error('IP Geolocation failed');
            }

            const data = await response.json();
            console.log('[Geolocation] IP Location success:', data.city);

            const locationData = {
                latitude: data.latitude,
                longitude: data.longitude,
                city: data.city || 'Unknown City',
                state: data.region || 'Unknown State',
                country: data.country_name || 'Unknown',
                timestamp: Date.now()
            };

            this.currentLocation = locationData;
            return locationData;
        } catch (error) {
            console.error('[Geolocation] IP Location failed:', error);
            throw {
                code: 2,
                message: 'Could not detect location. Please select city manually.'
            };
        }
    }

    /**
   * Reverse geocode coordinates to city name using OpenStreetMap Nominatim
   */
    private async reverseGeocode(lat: number, lon: number): Promise<LocationData> {
        try {
            console.log(`[Geolocation] Reverse geocoding: ${lat}, ${lon}`);

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'AuraIn-Hospital-Management/1.0',
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Geocoding API returned ${response.status}`);
            }

            const data = await response.json();

            if (!data || !data.address) {
                throw new Error('Invalid geocoding response');
            }

            const address = data.address;

            const locationData = {
                latitude: lat,
                longitude: lon,
                city: address.city || address.town || address.village || address.county || 'Unknown City',
                state: address.state || address.region || 'Unknown State',
                country: address.country || 'Unknown',
                timestamp: Date.now()
            };

            console.log('[Geolocation] Geocoding successful:', locationData);
            return locationData;
        } catch (error) {
            console.warn('[Geolocation] Reverse geocoding failed, using coordinates only:', error);
            // Fallback to coordinates only
            return {
                latitude: lat,
                longitude: lon,
                city: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
                state: 'Unknown',
                country: 'Unknown',
                timestamp: Date.now()
            };
        }
    }

    /**
     * Check geolocation permission status
     */
    async checkPermission(): Promise<PermissionState> {
        try {
            const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
            return result.state;
        } catch (error) {
            // Fallback for browsers that don't support permissions API
            return 'prompt';
        }
    }

    /**
     * Get cached location if available
     */
    getCachedLocation(): LocationData | null {
        return this.currentLocation;
    }

    /**
     * Clear cached location
     */
    clearCache(): void {
        this.currentLocation = null;
    }

    /**
     * Get user-friendly error message
     */
    private getErrorMessage(code: number): string {
        switch (code) {
            case 1:
                return 'Location access denied. Please enable location permissions.';
            case 2:
                return 'Location unavailable. Please check your device settings.';
            case 3:
                return 'Location request timed out. Please try again.';
            default:
                return 'Unable to get your location.';
        }
    }

    /**
     * Watch position for continuous updates (optional)
     */
    watchPosition(callback: (location: LocationData) => void): number {
        return navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const locationData = await this.reverseGeocode(latitude, longitude);
                this.currentLocation = locationData;
                callback(locationData);
            },
            (error) => {
                console.error('Watch position error:', error);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 600000 // 10 minutes
            }
        );
    }

    /**
     * Stop watching position
     */
    clearWatch(watchId: number): void {
        navigator.geolocation.clearWatch(watchId);
    }
}

export const geolocationService = new GeolocationService();
