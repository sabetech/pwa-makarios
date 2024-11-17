import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useGetRegion } from "../../hooks/RegionHooks";
import { useParams } from "react-router-dom";
import { Card, Space } from "antd-mobile";
import ProfileCard from "../../components/Profile/ProfileCard";

const Region = () => {
    //get region id from url param
    const { id } = useParams();
    
    if (!id) return null;

    const {data: region} = useGetRegion( parseInt(id) )
    console.log(region)
    
    return (<>
                <ProfileCard 
                    name={region?.leader?.name ?? "Unknown Person"}
                    area={`${region?.region ?? "Unknown Stream"} - ${region?.stream.name ?? "Unknown Stream"}`} 
                    role={region?.leader?.roles[0].name ?? "Unknown Role"}
                    avg_attendance={0} 
                    avg_bussing={0} 
                    avg_offering={0} 
                    avatar={region?.leader?.img_url ?? "/404"} />

                <Space direction="vertical" style={{width: "100%"}}>
                    <Card title='Members' >
                        { typeof region?.members !== 'undefined' ? region?.members.length : 0 }
                    </Card>
                    <Card title='Zones - Target: 10' >
                        {  typeof region?.zones !== 'undefined' ? region?.zones.length : 0 }
                    </Card>
                    <Card title='Bacentas - Target: 100' >
                        {  typeof region?.bacentas !== 'undefined' ? region?.bacentas.length : 0 }
                    </Card>
                    
                </Space>
                <ResponsiveContainer width="100%" height="40%">
                    <BarChart data={[
                        {name: 'Week 1', income: 400, attn: 200, bussing: 100},
                        {name: 'Week 2', income: 400, attn: 300, bussing: 100},
                        {name: 'Week 3', income: 400, attn: 200, bussing: 100},
                        {name: 'Week 4', income: 400, attn: 300, bussing: 100},
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        
                        <Bar dataKey="income" fill="#F7A840" label={{ position: 'top' }}/>
                        <Bar dataKey="attn" fill="#250009" label={{ position: 'top' }}/>
                        <Bar dataKey="bussing" fill="#C0C0C0" label={{ position: 'top' }}/>
                    </BarChart>
                </ResponsiveContainer>
            </>
        )
}

export default Region;