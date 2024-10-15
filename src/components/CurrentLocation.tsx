import { useState } from "react";
import {Input, Button} from "antd-mobile";
import { useGetLocation } from "../hooks/LocationHooks";
import { Coordinates } from "../types/location";


const CurrentLocation = ({ onLocationChange }: { onLocationChange: (coordinates: Coordinates) => void }) => {
  const [location, setLocation] = useState<Coordinates>({ lat: null, lng: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { getLocation } = useGetLocation();

  // Function to get user's current position
  const handleGetLocation = async () => {
    if (navigator.geolocation) {
        setIsLoading(true);
        let loc = await getLocation()
        setIsLoading(false);
        setLocation(loc)
        onLocationChange(loc)
    } else {
    }
        
  };


    return (
        <>
            <Input placeholder="4.904500, -1.768530" value={location.lat ? `${location.lat}, ${location.lng}` : ""} readOnly />
            <Button fill='outline' color='primary' size='middle' style={{float: 'right', marginRight: 20}} onClick={handleGetLocation} loading={isLoading}>Use Device Location</Button>
        </>
    )
}

export default CurrentLocation