import { Grid, Card, Divider, Space, Button } from 'antd-mobile'

import MyNavBar from "../../components/Nav/NavBar";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPanel from '../../components/HeaderPanel';
import { useGetStream } from '../../hooks/StreamHooks';
import { useGetMembers } from '../../hooks/MemberHooks';
import DataBar from '../../components/dashboard/charts/DataBar';

const Stream = () => {
    
    const navigate = useNavigate();
    const {stream_id} = useParams();

    const handleRegionsClick = () => {
        navigate('regions');
    }

    const handleZonesClick = () => {
        navigate('zones', {
            state: {
                stream_id: stream_id
            }
        });
    }

    const handleMembersClick = () => {
        navigate('members', {
            state: {
                stream_id: stream_id
            }
        });
    }
    
    if (!stream_id) {
        navigate('/streams')
        return <></>
    }
    const {data: stream, isLoading} = useGetStream(parseInt(stream_id))
    console.log("stream", stream)

    const{data: members} = useGetMembers({stream_id: stream?.id?? 0});

    console.log("Stream members::", members)

    console.log("face change::", stream?.regions)

    
    return (
        <>
            <MyNavBar currentPage={`${stream?.name?? "Unknown Stream"} Stream `}/>
            <HeaderPanel title={`${stream?.name ?? "Unknown Stream"} Stream`} />
            {
                isLoading && <div>Loading...</div>
            }
            <Grid columns={2} gap={8} style={{marginTop: 20, marginLeft: 30, marginRight: 20}}>
                <Grid.Item>
                    <Card title={"Members"} style={cardStyle} onClick={handleMembersClick}> {members?.length} </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card title={"Regions"} style={cardStyle}
                    onClick={handleRegionsClick}
                    > {stream?.regionalInfo?.length ?? 0} </Card>
                </Grid.Item>

                <Grid.Item>
                    <Card title={"Zones"} style={cardStyle}
                    onClick={handleZonesClick}
                    > { stream?.regionalInfo?.reduce((acc, curr) => acc + (curr?.zones?.length ?? 0), 0) ?? 0 } </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card title={"Bacentas"} style={cardStyle}>  { stream?.regionalInfo?.reduce((acc, curr) => acc + (curr?.bacentas?.length ?? 0), 0) ?? 0 }  </Card>
                </Grid.Item>
            </Grid>
            
            <Divider />

            <Space style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
                <Button size='large' color='primary' fill='solid' style={{paddingLeft: 40, paddingRight: 40}}>Service Forms</Button>
                <Button size='large' color='primary' fill='solid' style={{paddingLeft: 40, paddingRight: 40}}>View Trends</Button>
            </Space>
            
            <Divider />
            <DataBar />
        </>
    )
}
const cardStyle = {
    fontSize: 20,
    boxShadow: '1px 1px 8px 0px rgba(0,0,0,0.25)'
}


export default Stream;