'use client'
import { MapMarker } from "./MapMarker";

import * as dotenv from 'dotenv'
import { useCallback, useEffect, useRef, useState } from "react";


import GoogleMap from 'google-maps-react-markers'

dotenv.config()


interface MapProps {
    mapCenter: any
}


export default function Map({mapCenter}: MapProps) {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [mapReady, setMapReady] = useState(false)

    const onGoogleApiLoaded = ({ map }: any) => {
        mapRef.current = map
        setMapReady(true)
      }


    useEffect(() => {
        if(mapRef.current !== null && mapReady) {
            mapRef.current.setCenter({ 
                lat: mapCenter.lat, 
                lng: mapCenter.lng 
            })
        }
    }, [mapCenter]);

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
