import { useEffect, useState } from 'react';
import { List, Image, SearchBar, Button } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthUser } from '../../hooks/AuthHooks';
import { useGetMembers } from '../../hooks/MemberHooks';
import { useParams } from "react-router-dom";
import MyNavBar from '../../components/NavBar';
import { TMember } from '../../types/member';
const Members = () => {
    const loggedInUser = useAuthUser()
    const navigate = useNavigate();
    const user = loggedInUser()
    const [members, setMembers] = useState<TMember[]>([]);

    const { stream_id: stream_id } = useParams();
    const { region_id: region_id } = useParams();
    const { zone_id: zone_id } = useParams();
    const location = useLocation();

    let val = stream_id ?? region_id ?? zone_id ?? null
    let key = null;

    if (stream_id) {
        key = 'stream_id';
    } else if (region_id) {
        key = 'region_id';
    } else if (zone_id) {
        key = 'zone_id';
    } else {
        key = 'stream_id';
    }

    const { data:fetchedMembers, isLoading, isFetched } = (location.state?.cachedRegionMembers && location.state.cachedRegionMembers?.length > 0) ? function() {
        return {
        data: location.state.cachedRegionMembers,
        isLoading: false,
        isFetched: true,
    }}() 
    : useGetMembers(val ? { [key]: val } : undefined)
    
    useEffect(() => {
        setMembers(fetchedMembers ?? [])
    },[fetchedMembers])

    return (
    <>
        <MyNavBar prevPage="/directory" currentPage="Members" rightNode={<Button color={"default"} onClick={() => navigate("/directory/members/add")}>Add New</Button>}/>
        <SearchBar placeholder='Search for member by name' showCancelButton 
            style={{'--height': '60px', backgroundColor: '#570A22', color:'white', '--border-radius': '0px'}}
        />
        <List header={`${user.name}'s Members - ${members?.length}`} style={{'--header-font-size': '20px'}}>
        {isLoading ? <List.Item>Loading...</List.Item> :
        members && members.length > 0 && members.map((member) => (
            <List.Item
                key={member.id}
                prefix={<Image
                    src={member.img_url}
                    style={{ borderRadius: 20 }}
                    fit='cover'
                    width={40}
                    height={40}
                  />} 
                description={member.phone}
                onClick={() => {
                    navigate(`${member.id}`, {
                        state: {
                            member
                        }
                    });
                }}
                clickable={true}
            >
                {member.name}
            </List.Item>
        ))
        }
        </List>
    </>
)
}

export default Members;