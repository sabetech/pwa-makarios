// This is list zones page
import { List } from 'antd-mobile';
import MyNavBar from "../../components/NavBar";
import { useGetZones } from '../../hooks/Zones';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from 'antd-mobile';

const Index = () => {
    const navigate = useNavigate();

    //get stream_id from navigate function
    const location = useLocation();
    const { stream_id } = location.state || {};

    console.log("stream_id:: ", stream_id)

    const zones = useGetZones({stream_id: stream_id ?? null});
    const handleZoneClick = (id: number) => {
        navigate(`${id}`);
    }
    return (
        <>
        <MyNavBar prevPage="directory/churches" currentPage="Zones" />
        <List header="Zones" style={{'--header-font-size': '20px'}} mode={'card'}>
            {
                zones && zones.data?.map(zone => (
                    <List.Item 
                        key={zone.id}
                        prefix={<Avatar src={zone.leader?.img_url ?? '/404'} />}
                        description={`${zone?.region?.region ?? "Unknown Region"} - ${zone?.stream?.name ?? "Unknown Stream"} - ${zone?.leader?.name ?? "Unknown Person"}` }
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