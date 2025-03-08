// This is list zones page
import { useEffect, useState } from 'react';
import { List } from 'antd-mobile';
import MyNavBar from "../../components/NavBar";
import { useGetZones } from '../../hooks/Zones';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Avatar } from 'antd-mobile';
import { TZone } from '../../types/zone';

const Index = () => {
    const [zones, setZones] = useState<TZone[]>([]);
    const navigate = useNavigate();

    const location = useLocation();
    
    const { cachedRegionZones } = location.state || {};

    const { data:fetchedZones } = (cachedRegionZones && cachedRegionZones.length > 0) ? function() {
        return {
        data: cachedRegionZones,
    }}() : useGetZones();

    useEffect(() => {
        setZones(fetchedZones || [])
    },[fetchedZones])

    const handleZoneClick = (id: number) => {
        navigate(`${id}`);
    }
    return (
        <>
        <MyNavBar currentPage="Zones" />
        <List header="Zones" style={{'--header-font-size': '20px'}} mode={'card'}>
            {
                zones && zones?.map(zone => (
                    <List.Item 
                        key={zone.id}
                        prefix={<Avatar src={zone.leader?.img_url ?? '/404'} />}
                        description={`${zone?.region?.name ?? "Unknown Region"} - ${zone?.stream?.name ?? "Unknown Stream"} - ${zone?.leader?.name ?? "Unknown Person"}` }
                        onClick={() => handleZoneClick(zone.id)}
                        >
                        {zone.name}
                    </List.Item>
                ))
            }
        </List>
        </>
    )
}

export default Index