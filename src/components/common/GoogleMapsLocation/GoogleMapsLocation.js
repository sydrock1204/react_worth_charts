import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import styles from './googleMapsLocation.module.scss';
const POSITION_DEFAULT = {
    lat: -34.603722,
    lng: -58.381592,
};
const GoogleMapsLocation = ({ position }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || '',
    });
    return (_jsx(_Fragment, { children: isLoaded && (_jsx(GoogleMap, { zoom: 14, center: position || POSITION_DEFAULT, mapContainerClassName: styles.imageMap, children: _jsx(Marker, { position: position || POSITION_DEFAULT }) })) }));
};
export default GoogleMapsLocation;
