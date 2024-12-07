// This is list zones page
import { List } from 'antd-mobile';
import MyNavBar from "../../components/NavBar";
import { useGetZones } from '../../hooks/Zones';
import { useNavigate } from 'react-router-dom';

const Index = () => {
    const navigate = useNavigate();
    const zones = useGetZones();
    const handleZoneClick = (id: number) => {
        navigate(`/dashboard/zones/${id}`);
    }
    return (
        <>
        <MyNavBar prevPage="directory/churches" currentPage="Zones" />
        <List header="Zones" style={{'--header-font-size': '20px'}} mode={'card'}>
            {

            }
        </List>
        </>
    )
}

export default Index