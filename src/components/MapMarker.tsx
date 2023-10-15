import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import styles from '@/styles/modules/Marker.module.scss'

interface MapMarkerProps {
    lat: number,
    lng: number
}

export const MapMarker = ({lat, lng}: MapMarkerProps) => {
    return(
        <div className={styles.markerContainer}>
            <FaMapMarkerAlt className={styles.marker}/>
        </div>
    );
}