export const getCoords = (): any => {
  // let coords = {};
  return navigator.geolocation.getCurrentPosition((position) => {
    const {
      coords: { latitude, longitude }
    } = position;
    console.log(position);
    return { lat: latitude, lng: longitude };
  });
  // return coords;
};
