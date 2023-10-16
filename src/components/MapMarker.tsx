import { FaMapMarkerAlt } from 'react-icons/fa';
import styles from '@/styles/modules/Marker.module.scss'

// Marker props only needed for passthrough to the google react maps library
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