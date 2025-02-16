import { useState } from "react";
import ProfileCard from "../../components/Profile/ProfileCard"
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Card } from "antd-mobile";
import Averages from "../../components/Data/Averages";
import DataBar from "../../components/dashboard/charts/DataBar";

const Bacenta = () => {

    const navigate = useNavigate()

    // const { bacenta_id: id } = useParams();
    // if (!id) return null;
    // const {data: bacenta} = useGetBacenta( parseInt(id) )

    const location = useLocation();
    // const [bacenta, setBacenta] = useState<TBacenta>();
    const cachedBacenta = location.state.cachedBacenta

    console.log("cached bacenta::", cachedBacenta)

    console.log("siofe", cachedBacenta?.leader)

    const onMembersClick = () => {
        navigate(`members`, {
            state: {
                cachedBacentaMembers: cachedBacenta?.members
            }
        });
    }

    return (<>
            <ProfileCard 
                name={cachedBacenta?.leader?.name ?? "Unknown Person"}
                area={`${cachedBacenta?.name ?? "Unknown Bacenta"} - ${cachedBacenta?.region?.name ?? "Unknown Region"} - ${cachedBacenta?.region.stream?.name ?? "Unknown Stream"}`} 
                role={"Unknown Role"}
                avg_attendance={0}
                avg_bussing={0}
                avg_offering={0} 
                avatar={cachedBacenta?.leader?.img_url ?? "/404"} />

            <Space direction="vertical" style={{width: "100%"}}>
                <Card title='Members' onClick={() => onMembersClick() }>
                    { typeof cachedBacenta?.members !== 'undefined' ? cachedBacenta?.members.length : 0 }
                </Card>
            </Space>
            <Averages />
            <DataBar />
        </>
    )
}

export default Bacenta