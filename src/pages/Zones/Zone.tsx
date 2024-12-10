import ProfileCard from "../../components/Profile/ProfileCard";
import { Card, Space } from "antd-mobile";
import { useParams } from "react-router-dom";
import { useGetZone } from "../../hooks/Zones";
import DataBar from "../../components/dashboard/charts/DataBar";
const Zone = () => {

    const { zone_id: id } = useParams();
    
    if (!id) return null;

    const {data: zone} = useGetZone( parseInt(id) )

    return (<>
                <ProfileCard 
                    name={zone?.leader?.name ?? "Unknown Person"}
                    area={`${zone?.region?.region ?? "Unknown Region"} - ${zone?.name ?? "Unknown Zone"}`} 
                    role={zone?.leader?.roles[0].name ?? "Unknown Role"}
                    avg_attendance={0} 
                    avg_bussing={0} 
                    avg_offering={0} 
                    avatar={zone?.leader?.img_url ?? "/404"} />
                <Space direction="vertical" style={{width: "100%"}}>
                    <Card title='Members' >
                        { typeof zone?.members !== 'undefined' ? zone?.members.length : 0 }
                    </Card>
                    <Card title='Bacentas - Target: 10' >
                        {  typeof zone?.bacentas !== 'undefined' ? zone?.bacentas.length : 0 }
                    </Card>
                </Space>
                <DataBar />
            </>)
}

export default Zone;