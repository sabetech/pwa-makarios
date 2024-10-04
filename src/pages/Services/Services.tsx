import { List } from 'antd-mobile';
import MyNavBar from "../../components/NavBar"
import { FaEdit } from "react-icons/fa";

const Services = () => {
    return (<>
        <MyNavBar prevPage="dashboard" currentPage="Services" />
        <List header="Michael's Services" style={{'--header-font-size': '20px'}}>
            <List.Item  onClick={() => {
                // navigate("/directory/members")
            }}
                prefix={<FaEdit />}
                style={listStyle}
                description={"Fill your fellowship form here"}
            >
                Fill Service Form
            </List.Item>
        </List>
    </>
)
}

const listStyle = {fontFamily: 'Verdana, sans-serif', fontSize: 30, fontWeight: 400, color: 'black'}

export default Services