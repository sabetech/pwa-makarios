import { Avatar, List } from "antd-mobile";
import MyNavBar from "../../components/NavBar";
import { useGetRegions } from "../../hooks/RegionHooks";
import { useNavigate } from "react-router-dom";
const Index = () => {
    const navigate = useNavigate();
    //TODO: add regions based on the permission to add a region
    
    const regions = useGetRegions();
    const handleRegionClick = (id: number) => {
        navigate(`/dashboard/regions/${id}`);
    }

    return (<>
        <MyNavBar prevPage="directory/churches" currentPage="Regions" />
        <List header="Regions" style={{'--header-font-size': '20px'}}>
            {
                regions && regions.data?.map(region => (
                    <List.Item 
                        key={region.id}
                        prefix={<Avatar src={region.leader?.img_url ?? '/404'} />}
                        description={`${region.leader?.name} - ${region.stream.name}` }
                        onClick={() => handleRegionClick(region.id)}
                        >
                        {region.region}
                    </List.Item>
                ))
            }
        </List>
    </>)
}

export default Index;