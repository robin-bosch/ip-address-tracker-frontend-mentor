import { FaMapMarkerAlt } from "react-icons/fa";
import styles from '@/styles/modules/Marker.module.scss'
import { Marker } from '@adamscybot/react-leaflet-component-marker';
import { MapCenter } from "@/types";

interface MapProps {
    mapCenter: MapCenter
}

function MapMarker({mapCenter}: MapProps) {
    return (
        <Marker 
            position={mapCenter} 
            icon={
                <div className={styles.markerContainer}>
                    <FaMapMarkerAlt className={styles.marker}/>
                </div>
            } 
            iconComponentLayout={"fit-parent"}
        />
    )
}

export default MapMarker;
