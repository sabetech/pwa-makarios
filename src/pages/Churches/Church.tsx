import { Grid, Card, Divider, Space, Button } from 'antd-mobile'
import { useLocation } from "react-router-dom";
import MyNavBar from "../../components/NavBar";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Church = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleStreamClick = () => {
        navigate('/streams')
    }

    return (
        <>
            <MyNavBar prevPage="churches" currentPage={location.state.church.name}/>
            <Grid columns={2} gap={8} style={{marginTop: 20, marginLeft: 30, marginRight: 20}}>
                <Grid.Item>
                    <Card title={"Members"} style={{fontSize: 20}}> 800 </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card title={"Streams"} style={{fontSize: 20}}
                    onClick={handleStreamClick}
                    > 3 </Card>
                </Grid.Item>

                <Grid.Item>
                    <Card title={"Governors"} style={{fontSize: 20}}> 0 </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card title={"Pastors"} style={{fontSize: 20}}> 0 </Card>
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