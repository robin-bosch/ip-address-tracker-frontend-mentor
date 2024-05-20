import MapMarker from "./MapMarker";
import 'leaflet/dist/leaflet.css';

import { MapCenter } from "@/types";
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect } from "react";

interface MapProps {
    mapCenter: MapCenter
}

/**
 * Controller for the map
 * Only used to update the map center
 * @param mapCenter - Array of latitude and longitude 
 * @returns 
 */
function MapController({mapCenter}: MapProps) {
    const map = useMap();

    useEffect(() => {
        if (map && mapCenter) {
          map.flyTo(mapCenter, 13, { duration: 3});
        }
      }, [mapCenter, map]);

    return null;
}

export default function Map({mapCenter}: MapProps) {
    return(
        <>
            <MapContainer center={mapCenter} zoom={13} zoomControl={false}>
                {/* Attribution required */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                    <MapController mapCenter={mapCenter}></MapController>
                    <MapMarker mapCenter={mapCenter}/>
            </MapContainer>
        </>
    )
}
