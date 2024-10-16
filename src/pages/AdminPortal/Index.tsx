import { ValueCard } from "../../components/dashboard/ValueCard"
import MyNavBar from "../../components/NavBar"
import { Card, Space, ErrorBlock, List } from 'antd-mobile'
import { MdOutlineChurch } from "react-icons/md";
import { FaWater } from "react-icons/fa6";
import { FaMapMarked } from "react-icons/fa";
import { FaBus } from "react-icons/fa";
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from "react-router-dom";


const Index = () => {
    const navigate = useNavigate();
    return (
        <>
            <MyNavBar prevPage="dashboard" currentPage="Admin Portal" />
            <Space direction="vertical" style={{'--gap': '10px', width: '100%'}}>
                <List header="Menu" style={{'--header-font-size': '20px'}}>
                    <List.Item  
                        prefix={<MdOutlineChurch />}
                        style={listStyle}
                        description={"0 Churches"}
                        onClick={() => {
                            navigate("/directory/churches")
                        }}
                    >
                        Churches
                    </List.Item>
                    <List.Item  
                        prefix={<FaWater />}
                        style={listStyle}
                        description={"0 Streams"}
                        
                    >
                        Streams
                    </List.Item>
                    <List.Item  
                        prefix={<FaMapMarked />}
                        style={listStyle}
                        description={"0 Councils"}
                        
                    >
                        Councils
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
                        description={"0 Fellowships"}
                        
                    >
                        Fellowships
                    </List.Item>
                </List>
                
            </Space>
        </>
    )
    
}
const listStyle = {fontFamily: 'Verdana, sans-serif', fontSize: 30, fontWeight: 400, color: "#570A22"}
export default Index