import ProfileCard from "../../components/Profile/ProfileCard"
import { useLocation, useNavigate } from "react-router-dom";
import { Space, Card } from "antd-mobile";
import DataBar from "../../components/dashboard/charts/DataBar";
import { useAuthUser } from "../../hooks/AuthHooks";
import ServiceHistoryList from "../../components/services/ServicesHistoryList";
import { TServiceResponse } from "../../types/service";
import { useState } from "react";
import { TMember } from "../../types/member";
import { useGetMembers } from "../../hooks/MemberHooks";

const Bacenta = () => {

    const navigate = useNavigate()
    const user = useAuthUser()();
    console.log("Auth User in Bacenta Page::", user)

    const location = useLocation();
    const cachedBacenta = location.state.cachedBacenta

    // if (cachedBacenta.members == undefined || cachedBacenta.members.length == 0) {
    //     cachedBacenta.members = [];
    //     const { data: members } = useGetMembers({bacenta_id: cachedBacenta.id})
    //     if (members && members.length > 0) {
    //         cachedBacenta.members = members;
    //     }
    // }

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
                area={`${cachedBacenta?.name ?? "Unknown Bacenta"} - ${cachedBacenta?.region?.name ?? "Unknown Region"} - ${cachedBacenta?.region?.stream?.name ?? "Unknown Stream"}`} 
                role={"Unknown Role"}
                avg_attendance={ cachedBacenta?.services && cachedBacenta.services.length > 0 ? Math.round(cachedBacenta.services.reduce((sum: number, service: TServiceResponse) => sum + service.attendance, 0) / cachedBacenta.services.length) : 0 }
                avg_bussing={0}
                avg_offering={ cachedBacenta?.services && cachedBacenta.services.length > 0 ? Math.round(cachedBacenta.services.reduce((sum: number, service: TServiceResponse) => sum + Number(service.offering), 0) / cachedBacenta.services.length) : 0 }
                avatar={cachedBacenta?.leader?.img_url ?? "/404"} />

            <Space direction="vertical" style={{width: "100%"}}>
                <Card title='Members' onClick={() => onMembersClick() }>
                    { typeof cachedBacenta?.members !== 'undefined' ? cachedBacenta?.members.length : 0 }
                </Card>
            </Space>
            
            <ServiceHistoryList services={cachedBacenta?.services} />

            <DataBar />
        </>
    )
}

export default Bacenta