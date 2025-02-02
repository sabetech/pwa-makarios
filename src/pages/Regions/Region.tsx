import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useGetRegion } from "../../hooks/RegionHooks";
import { useParams } from "react-router-dom";
import { Card, Space } from "antd-mobile";
import ProfileCard from "../../components/Profile/ProfileCard";
import DataBar from '../../components/dashboard/charts/DataBar';

const Region = () => {
    //get region id from url param
    const { id } = useParams();
    
    if (!id) return null;

    const {data: region} = useGetRegion( parseInt(id) )
    console.log(region)
    
    return (<>
                <ProfileCard 
                    name={region?.leader?.name ?? "Unknown Person"}
                    area={`${region?.name ?? "Unknown Stream"} - ${region?.stream.name ?? "Unknown Stream"}`} 
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
                <DataBar />
            </>
        )
}

export default Region;