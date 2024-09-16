import { List, NavBar, Image, SearchBar, Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import myData from '../../data/fake.json';
const Members = () => {

    const navigate = useNavigate();

    return (
    <>
        <NavBar 
        onBack={() => navigate("/directory")} style={{'--height': '60px', backgroundColor: '#570A22', color:'white'}} 
        right={<Button color={"default"}>Add New</Button>}
        > Members </NavBar>
        <SearchBar placeholder='Search for member by name' showCancelButton 
            style={{'--height': '60px', backgroundColor: '#570A22', color:'white', '--border-radius': '0px'}}
        />
        <List header="Michael's Members - 6" style={{'--header-font-size': '20px'}}>
        {
        myData.map((member) => (
            <List.Item
                key={member._id}
                onClick={() => {
                    navigate("/directory/members/")
                }}
                prefix={<Image
                    src={member.picture}
                    style={{ borderRadius: 20 }}
                    fit='cover'
                    width={40}
                    height={40}
                  />} 
                description={`member.phone`}
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