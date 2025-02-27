import { Grid, Card, Divider, Space, Button } from 'antd-mobile'
import { useLocation, useParams } from "react-router-dom";
import MyNavBar from "../../components/NavBar";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import HeaderPanel from '../../components/HeaderPanel';
import { useGetMembers } from '../../hooks/MemberHooks';
import { useGetStreams } from '../../hooks/StreamHooks';
import { useGetRegions } from '../../hooks/RegionHooks';
import { useGetZones } from '../../hooks/Zones';

const Church = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const { id } = useParams();

    const {data: members} = useGetMembers()
    const {data: streams} = useGetStreams()
    const {data: regions} = useGetRegions()
    const {data: zones} = useGetZones()

    console.log("REgion ::", regions)

    return (
        <>
            <MyNavBar prevPage="directory/churches" currentPage={location.state.church.name}/>
            <HeaderPanel title={location.state.church.name} />
            <Grid columns={2} gap={8} style={{marginTop: 20, marginLeft: 30, marginRight: 20}}>
                <Grid.Item>
                    <Card title={"Members"} style={{fontSize: 20}} onClick={() => navigate('members')}> { typeof members !== 'undefined' ? members.length : 0 } </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card title={"Streams"} style={{fontSize: 20}}
                    onClick={() => navigate('streams')}
                    > { typeof streams !== 'undefined' ? streams.length : 0 } </Card>
                </Grid.Item>

                <Grid.Item>
                    <Card title={"Regions"} style={{fontSize: 20}} onClick={() => navigate('regions')}> {  typeof regions !== 'undefined' ? regions.length : 0 } </Card>
                </Grid.Item>

                <Grid.Item>
                    <Card title={"Zones"} style={{fontSize: 20}}  onClick={() => navigate('zones')}> {  typeof zones !== 'undefined' ? zones.length : 0 } </Card>
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

export default Church;