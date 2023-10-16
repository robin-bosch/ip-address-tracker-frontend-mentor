'use client'
import { MapMarker } from "./MapMarker";

import { useEffect, useRef, useState } from "react";

import GoogleMap from 'google-maps-react-markers'
import { MapCenter } from "@/types";


interface MapProps {
    mapCenter: MapCenter
}

export default function Map({mapCenter}: MapProps) {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [mapReady, setMapReady] = useState<boolean>(false)

    /**
     * Set map ref and map ready when map is loaded
     * @param param0 
     */
    const onGoogleApiLoaded = ({ map }: any) => {
        mapRef.current = map
        setMapReady(true)
    }

    /**
     * Update position of the map when the geolocation is set in the map center
     */
    useEffect(() => {
        if(mapRef.current !== null && mapReady) {
            mapRef.current.setCenter({ 
                lat: mapCenter.lat, 
                lng: mapCenter.lng 
            })
        }
    }, [mapCenter]);

    // Default props for the map
    const defaultProps = {
        defaultCenter: mapCenter,
        zoom: 15
    };

    return(
        <GoogleMap
            apiKey={"" + process.env.NEXT_PUBLIC_API_KEY}
            defaultCenter={defaultProps.defaultCenter}
            defaultZoom={defaultProps.zoom}
            options={{
                disableDefaultUI: true,
                center: mapCenter
            }}
            onGoogleApiLoaded={onGoogleApiLoaded}
        >
            <MapMarker
                lat={mapCenter.lat}
                lng={mapCenter.lng}
            />
        </GoogleMap>
    )
}
