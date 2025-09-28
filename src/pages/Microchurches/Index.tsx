import { useNavigate } from "react-router-dom";
import { Button, List } from "antd-mobile";
import { useGetMicrochurches } from "../../hooks/MicroChurchesHooks";
import MyNavBar from "../../components/Nav/NavBar";
import { TMicrochurch } from "../../types/microchurch";
import { ErrorBlock, Tag } from 'antd-mobile'
import { outline } from "@cloudinary/url-gen/actions/effect";
const Index = () => {

    const navigate = useNavigate();
    const { data: fetchedMicrochurches, isLoading } = useGetMicrochurches();

    console.log("Fetched Microchurches:", fetchedMicrochurches);

    return (<>
        <MyNavBar currentPage="Microchurches" rightNode={<Button onClick={() => navigate('add')}>Add</Button>}/>
        <List
            style={{ marginTop: '60px', paddingTop: '10px'}}
        >
            {fetchedMicrochurches?.map((microchurch) => (
                <List.Item 
                    key={microchurch.id} onClick={() => navigate(`${microchurch.id}`)}
                    description={`${microchurch.stream.name} - ${microchurch.region.name}`}
                    extra={microchurch.leader.name}
                    >
                    {microchurch.name}
                </List.Item>
            ))}
            {isLoading && <List.Item>Loading...</List.Item>}
            {!isLoading && fetchedMicrochurches?.length === 0 && <List.Item><ErrorBlock status='empty' /></List.Item>}
        </List>
    </>)
}

export default Index;