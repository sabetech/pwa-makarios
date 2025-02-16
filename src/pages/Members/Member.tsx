import MemberProfileCard from "../../components/Profile/MemberProfileCard";
import { useLocation } from "react-router-dom";
import { List } from "antd-mobile";

const Member= () => {
    const location = useLocation();

    const memberDetail = location.state?.member || {}

    console.log(memberDetail)


    return (
        <>
            <MemberProfileCard 
                member={memberDetail}
            />
            <List header={'Personal Information'}>
                <List.Item
                    description={"Date of Birth"}
                >
                    {memberDetail.date_of_birth}
                    
                </List.Item>

                <List.Item
                    description={"Email"}
                >
                    {memberDetail.email ?? "N/A"}
                </List.Item>

                <List.Item
                    description={"Gender"}
                >
                    {memberDetail.gender}
                </List.Item>

                <List.Item
                    
                    description={"Marital Status"}
                >
                    {memberDetail.marital_status}
                    
                </List.Item>

                <List.Item
                    
                    description={"Occupation"}
                >
                    {memberDetail.occupation}
                    
                </List.Item>
            </List>

            <List header={'Church Information'}>
                <List.Item
                    description={"Bacenta"}
                >
                    {memberDetail.bacenta?.name ?? "N/A"}
                    
                </List.Item>
                <List.Item
                    description={"Zone"}
                >
                    {memberDetail.zone?.name ?? "N/A"}
                    
                </List.Item>

                <List.Item
                    description={"Region"}
                >
                    {memberDetail.region?.name ?? "N/A"}
                    
                </List.Item>
                <List.Item
                    description={"Stream"}
                >
                    {memberDetail.stream?.name ?? "N/A"}
                    
                </List.Item>
            </List>
        </>
    )
}

export default Member;