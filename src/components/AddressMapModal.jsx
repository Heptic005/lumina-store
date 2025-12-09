import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { X, Search, MapPin, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks and updates
const MapController = ({ onLocationSelect, center }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo(center, 16);
        }
    }, [center, map]);

    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        },
    });

    return null;
};

const AddressMapModal = ({ isOpen, onClose, onConfirm }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null); // { lat, lng, address }
    const [mapCenter, setMapCenter] = useState([-6.2088, 106.8456]); // Default: Jakarta

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            // Try to get user's current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setMapCenter([latitude, longitude]);
                        // Optional: Auto-select current location
                        // handleLocationSelect({ lat: latitude, lng: longitude });
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                    }
                );
            }
        }
    }, [isOpen]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleLocationSelect = async (latlng) => {
        const { lat, lng } = latlng;
        // Reverse geocoding to get address details
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();

            setSelectedLocation({
                lat,
                lng,
                address: data.display_name,
                details: data.address
            });
            setMapCenter([lat, lng]);
            setSearchResults([]); // Clear search results
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            // Fallback if reverse geocoding fails
            setSelectedLocation({
                lat,
                lng,
                address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            });
        }
    };

    const handleSearchResultClick = (result) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        handleLocationSelect({ lat, lng: lon });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-4xl h-[80vh] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl animate-fade-in-up">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface z-10">
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-accent" />
                        Pilih Lokasi Pengiriman
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-secondary hover:text-primary">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 bg-background/50 border-b border-white/5 relative z-20">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari alamat, kota, atau gedung..."
                            className="w-full pl-12 pr-4 py-3 bg-surface border border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                        />
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 text-primary px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            disabled={isSearching}
                        >
                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cari'}
                        </button>
                    </form>

                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-4 right-4 mt-2 bg-surface border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto z-30">
                            {searchResults.map((result, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSearchResultClick(result)}
                                    className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                                >
                                    <p className="font-medium text-primary text-sm truncate">{result.display_name.split(',')[0]}</p>
                                    <p className="text-xs text-secondary truncate">{result.display_name}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Map Area */}
                <div className="flex-grow relative">
                    <MapContainer
                        center={mapCenter}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        className="z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapController onLocationSelect={handleLocationSelect} center={mapCenter} />
                        {selectedLocation && (
                            <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                        )}
                    </MapContainer>

                    {/* Selected Address Overlay */}
                    {selectedLocation && (
                        <div className="absolute bottom-4 left-4 right-4 bg-surface/95 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg z-[400]">
                            <p className="text-xs text-secondary mb-1">Lokasi Terpilih:</p>
                            <p className="text-sm font-medium text-primary mb-4 line-clamp-2">{selectedLocation.address}</p>
                            <button
                                onClick={() => onConfirm(selectedLocation)}
                                className="w-full bg-accent text-background py-3 rounded-lg font-bold hover:bg-accent/80 transition-colors shadow-lg shadow-accent/20"
                            >
                                Konfirmasi Lokasi Ini
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressMapModal;
