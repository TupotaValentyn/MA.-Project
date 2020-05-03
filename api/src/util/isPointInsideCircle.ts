import { LatLngLiteral } from '@googlemaps/google-maps-services-js/dist/common';

export default (circleCenter: LatLngLiteral, circleRadius: number, pointToCheck: LatLngLiteral): boolean => {
    const latitudeKmPerDegree = 40000 / 360;
    const longitudeKmPerDegree = Math.cos((Math.PI * circleCenter.lat) / 180.0) * latitudeKmPerDegree;

    const latitudeDelta = Math.abs(circleCenter.lng - pointToCheck.lng) * longitudeKmPerDegree;
    const longitudeDelta = Math.abs(circleCenter.lat - pointToCheck.lat) * latitudeKmPerDegree;

    return Math.sqrt(latitudeDelta * latitudeDelta + longitudeDelta * longitudeDelta) <= circleRadius;
};
