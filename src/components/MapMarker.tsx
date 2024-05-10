import React, { useState } from "react";
import { Marker, MarkerProps } from "react-leaflet";
import ReactDOM from "react-dom/client";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import styles from '@/styles/modules/Marker.module.scss'

/**
 * The marker is based of this solution, very elegant:
 * https://codesandbox.io/p/sandbox/react-leaflet-jsx-markers-8g1uvd?file=%2Fsrc%2FJSXMarker.tsx
 */

interface Props extends MarkerProps {
    iconOptions?: L.DivIconOptions;
}

export const MapMarker = React.forwardRef<L.Marker, Props>(({ children, iconOptions, ...rest }, refInParent) => {
    
    const [ref, setRef] = useState<L.Marker>();

    const node = React.useMemo(() => (ref ? ReactDOM.createRoot(ref?.getElement()!) : null), [ref]);

    return (
        <>
            {React.useMemo(() => (
                <Marker
                    {...rest}
                    ref={(r) => {
                        setRef(r as L.Marker);
                            if (refInParent) {
                                // @ts-expect-error fowardref ts defs are tricky
                                refInParent.current = r;
                            }
                        }
                    }
                    icon={L.divIcon(iconOptions)}
                />
            ),[]
        )}

        {ref && node && node.render(
            <div className={styles.markerContainer}>
                <FaMapMarkerAlt className={styles.marker}/>
            </div>
        )}
      </>
    );
  }
);
