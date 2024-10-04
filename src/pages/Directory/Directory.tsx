import { List, NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { TeamOutline } from 'antd-mobile-icons'
import { MdOutlineChurch } from "react-icons/md";
import { BsStars } from "react-icons/bs";

const Directory = () => {
    const navigate = useNavigate();

    return (<>
        <NavBar onBack={() => navigate("/dashboard")} style={{'--height': '60px', backgroundColor: '#570A22', color:'white'}} > Directory </NavBar>
        <List header="Michael's Directory" style={{'--header-font-size': '20px'}}>
            <List.Item  onClick={() => {
                navigate("/directory/members")
            }}
                prefix={<TeamOutline />}
                style={listStyle}
                description={"0 Members"}
            >
                Members
            </List.Item>
            <List.Item onClick={() => {}}
                prefix={<MdOutlineChurch />}
                style={listStyle}
                description={"0 Churches"}
            >
                Churches
            </List.Item>
            <List.Item onClick={() => {}}
                prefix={<BsStars />}
                style={listStyle}
                description={"Quick facts about your church"}
                >
                Quick Fact
            </List.Item>
      </List>
    </>)
}

const listStyle = {fontFamily: 'Verdana, sans-serif', fontSize: 30, fontWeight: 400, color: 'black'}

export default Directory