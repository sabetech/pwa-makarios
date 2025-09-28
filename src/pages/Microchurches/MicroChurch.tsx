import { List, Button, Space, Card, Divider, Avatar } from 'antd-mobile';
import { useParams, useNavigate } from "react-router-dom";
import MyNavBar from "../../components/Nav/NavBar";
import { useGetMicrochurchById } from '../../hooks/MicroChurchesHooks';
import DataBar from '../../components/dashboard/charts/DataBar';
import HomeButtonIcon from '../../components/Nav/HomeButtonIcon';

const MicroChurch = () => {
    const { id } = useParams();
    
    const { data: microchurch, isLoading } = useGetMicrochurchById(Number(id ?? 0));
    const navigate = useNavigate();

    return (
        <>
            <MyNavBar currentPage={microchurch?.name+" Microchurch"} rightNode={<HomeButtonIcon />}/>
            <Card
                style={{ marginTop: '60px'}}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>  
                    <Avatar src={microchurch?.leader?.img_url ?? '/404'} style={{ '--size': '120px', border: '2px solid #F7A840', boxShadow: '3px 3px 20px 1px rgba(0,0,0,0.25)', '--border-radius': '90px' }}/>
                    <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {microchurch?.leader.name}
                        <p style={{ fontSize: '14px', fontWeight: 'normal', color: 'grey', textAlign: 'center'}}>Leader</p>
                    </p>
                </div>
            </Card>
            <List style={{ padding: '5px'}}>
                <List.Item extra={0} onClick={() => console.log("Navigate to Members")}>
                    Members
                </List.Item>
                <List.Item extra={0} onClick={() => console.log("Navigate to Attendance")}>
                    Average Attendance
                </List.Item>
                <List.Item extra={0} onClick={() => console.log("Navigate to Offering")}>
                    Average Offering
                </List.Item>
            </List>
             <Divider />
            
            <Space style={{display: 'flex', justifyContent: 'center'}}>
                <Button size='small' color='primary' fill='solid' style={{marginLeft: 10,paddingLeft: 10, paddingRight: 10}}
                    onClick={() => {
                        console.log("Fill Service Form")
                        navigate(`/services/microchurch/form`, {
                            state: {
                                microchurch: microchurch,
                                cachedStream: microchurch?.stream,
                                cachedRegion: microchurch?.region
                            }
                        })
                    }
                }>
                        Fill Service Form
                </Button>
                <Button size='small' color='primary' fill='outline'>View Services</Button>
                <Button size='small' color='primary' fill='outline' style={{paddingLeft: 10, paddingRight: 10, marginRight: 10}}
                    onClick={() => console.log("Add Member")}>
                    Add Member
                </Button>
            </Space>
            <Divider />
            <Space style={{display: 'flex', justifyContent: 'left', marginLeft: 20, marginRight: 20}}>
                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>Weekly Performance</p>
            </Space>
            <DataBar />
            {/* <BottomTabs /> */}
        </>
    )
}

export default MicroChurch;
