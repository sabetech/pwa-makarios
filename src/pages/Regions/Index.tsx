import { Avatar, List } from "antd-mobile";
import MyNavBar from "../../components/Nav/NavBar";
import { useGetRegions } from "../../hooks/RegionHooks";
import { useNavigate, useParams } from "react-router-dom";
const Index = () => {
    const navigate = useNavigate();
    //TODO: add regions based on the permission to add a region
    const { stream_id:id} = useParams();

    const regions = useGetRegions(id !== undefined ? { stream_id: id ?? null } : undefined);
    const handleRegionClick = (id: number) => {
        navigate(`/dashboard/regions/${id}`);
    }

    return (<>
        <MyNavBar currentPage="Regions" />
        <List header="Regions" style={{'--header-font-size': '20px'}} mode={'card'}>
            {
                regions && regions.data?.map(region => (
                    <List.Item 
                        key={region.id}
                        prefix={<Avatar src={region.leader?.img_url ?? '/404'} />}
                        description={`${region.leader?.name} - ${region?.stream?.name}` }
                        onClick={() => handleRegionClick(region.id)}
                        >
                        {region.name}
                    </List.Item>
                ))
            }
        </List>
    </>)
}

export default Index;