import { MapMarker } from "./MapMarker";
import 'leaflet/dist/leaflet.css';

import { MapCenter } from "@/types";
import { MapContainer, TileLayer } from 'react-leaflet'


interface MapProps {
    mapCenter: MapCenter
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
                    <MapMarker position={mapCenter}></MapMarker>
                </MapContainer>
        </>
    )
}
