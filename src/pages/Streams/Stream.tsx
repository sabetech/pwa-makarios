import { Grid, Card, Divider, Space, Button } from 'antd-mobile'

import MyNavBar from "../../components/NavBar";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPanel from '../../components/HeaderPanel';
import { useGetStream } from '../../hooks/StreamHooks';
import { useGetMembers } from '../../hooks/MemberHooks';

const Stream = () => {
    
    const navigate = useNavigate();
    const {stream_id} = useParams();

    const handleCouncilsClick = () => {
        navigate('/streams')
    }
    
    if (!stream_id) {
        navigate('/streams')
        return <></>
    }
    const {data: stream} = useGetStream(parseInt(stream_id))
    console.log("stream", stream)

    const{data: members} = useGetMembers({stream_id: stream?.id?? 0});

    console.log("Stream members::", members)

    console.log("face change::", stream?.regions)
    return (
        <>
            <MyNavBar prevPage="directory/churches" currentPage={`${stream?.name?? "Unknown Stream"} Stream `}/>
            <HeaderPanel title={`${stream?.name ?? "Unknown Stream"} Stream`} />
            <Grid columns={2} gap={8} style={{marginTop: 20, marginLeft: 30, marginRight: 20}}>
                <Grid.Item>
                    <Card title={"Members"} style={{fontSize: 20}}> {members?.length} </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card title={"Regions"} style={{fontSize: 20}}
                    onClick={handleCouncilsClick}
                    > {stream?.regionalInfo?.length} </Card>
                </Grid.Item>

                <Grid.Item>
                    <Card title={"Zones"} style={{fontSize: 20}}> { stream?.regionalInfo.reduce((acc, curr) => acc + (curr?.zones?.length ?? 0), 0) } </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card title={"Bacentas"} style={{fontSize: 20}}>  { stream?.regionalInfo.reduce((acc, curr) => acc + (curr?.bacentas?.length ?? 0), 0) }  </Card>
                </Grid.Item>
            </Grid>
            
            <Divider />

            <Space style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
                <Button size='large' color='primary' fill='solid' style={{paddingLeft: 40, paddingRight: 40}}>Service Forms</Button>
                <Button size='large' color='primary' fill='solid' style={{paddingLeft: 40, paddingRight: 40}}>View Trends</Button>
            </Space>
            
            <Divider />
            <ResponsiveContainer width="100%" height="40%">
                <BarChart data={[
                    {name: 'Week 1', income: 1800, attn: 200},
                    {name: 'Week 2', income: 2400, attn: 300},
                    {name: 'Week 3', income: 1800, attn: 200},
                    {name: 'Week 4', income: 2400, attn: 300},
                ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    
                    <Bar dataKey="income" fill="#F7A840" label={{ position: 'top' }}/>
                    <Bar dataKey="attn" fill="#250009" label={{ position: 'top' }}/>
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}

export default Stream;