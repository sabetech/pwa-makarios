import { List, NavBar, Image, SearchBar, Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../hooks/AuthHooks';
import { useGetMembers } from '../../hooks/MemberHooks';
const Members = () => {
    const loggedInUser = useAuthUser()
    const navigate = useNavigate();
    const user = loggedInUser()

    const { data:members } = useGetMembers()

console.log("members::", members)
    return (
    <>
        <NavBar 
        onBack={() => navigate("/directory")} style={{'--height': '60px', backgroundColor: '#570A22', color:'white'}} 
        right={<Button color={"default"} onClick={() => navigate("/directory/members/add")}>Add New</Button>}
        > Members </NavBar>
        <SearchBar placeholder='Search for member by name' showCancelButton 
            style={{'--height': '60px', backgroundColor: '#570A22', color:'white', '--border-radius': '0px'}}
        />
        <List header={`${user.name}'s Members`} style={{'--header-font-size': '20px'}}>
        {
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