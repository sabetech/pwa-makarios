import MyNavBar from "../../components/Nav/NavBar"
import { Space, List } from 'antd-mobile'
import { MdOutlineChurch } from "react-icons/md";
import { FaWater } from "react-icons/fa6";
import { FaBus } from "react-icons/fa";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";


const Index = () => {
    const navigate = useNavigate();
    return (
        <>
            <MyNavBar prevPage="/dashboard" currentPage="Admin Portal" />
            <Space direction="vertical" style={{'--gap': '10px', width: '100%'}}>
                <List header="Menu" style={{'--header-font-size': '20px', marginTop: '10px'}}>
                    <List.Item  
                        prefix={<MdOutlineChurch />}
                        style={listStyle}
                        description={"0 Churches"}
                        onClick={() => {
                            navigate("/admin/churches")
                        }}
                    >
                        Churches
                    </List.Item>
                    <List.Item  
                        prefix={<FaWater />}
                        style={listStyle}
                        description={"0 Streams"}
                        onClick={() => {
                            navigate("/admin/streams")
                        }}
                    >
                        Streams
                    </List.Item>
                    <List.Item  
                        prefix={<FaBus />}
                        style={listStyle}
                        description={"0 Zones"}
                    >
                        Regions
                    </List.Item>
                    <List.Item  
                        prefix={<FaBus />}
                        style={listStyle}
                        description={"0 Zones"}
                    >
                        Zones
                    </List.Item>
                    <List.Item  
                        prefix={<FaBus />}
                        style={listStyle}
                        description={"0 Bacentas"}
                    >
                        Bacentas
                    </List.Item>
                    <List.Item  
                        prefix={<TbUsersGroup />}
                        style={listStyle}
                        description={"0 Leaders"}
                        onClick={() => {
                            navigate("/admin/leaders")
                        }}
                    >
                        Leaders and Roles
                    </List.Item>
                    <List.Item  
                        prefix={<TbUsersGroup />}
                        style={listStyle}
                        description={"0 Members"}
                    >
                        Members
                    </List.Item>
                    <List.Item  
                        prefix={<TbUsersGroup />}
                        style={listStyle}
                        description={"0 Microchurches"}
                        onClick={() => {
                            navigate("/admin/microchurches")
                        }}
                    >
                        Microchurches
                    </List.Item>
                    <List.Item  
                        prefix={<TbUsersGroup />}
                        style={listStyle}
                        description={"0 SSMG"}
                    >
                        SSMG
                    </List.Item>
                </List>
                
            </Space>
        </>
    )
    
}
const listStyle = {fontFamily: 'Verdana, sans-serif', fontSize: 30, fontWeight: 400, color: "#570A22"}
export default Index