import { Coordinates } from "../types/location";

export const useGetLocation = () => {
    const getLocation = (): Promise<Coordinates> => {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            (error: GeolocationPositionError) => {
              reject(error);
            }
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });
    };
  
    return { getLocation };
  };