import MyNavBar from "../../components/NavBar"
import { List, FloatingBubble } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons'
import { useNavigate } from "react-router-dom";

const Index = () => {
    const navigate = useNavigate();
    const showAddStreamsForm = () => {
        navigate('add');
    }

    return (
        <>
            <MyNavBar prevPage="churches" currentPage="Streams" />
            <List header="Streams" style={{'--header-font-size': '20px'}}>
            <List.Item  onClick={() => {
                        
                    }}
                        // prefix={<TeamOutline />}
                        style={listStyle}
                        description={"Stream Name"}
                    >
                        {"Stream Name"}
                    </List.Item>
            </List>
            <FloatingBubble
                style={{
                '--initial-position-bottom': '24px',
                '--initial-position-right': '24px',
                '--edge-distance': '24px',
                }}
                onClick={showAddStreamsForm}
            >
                <AddOutline fontSize={32} />
            </FloatingBubble>
        </>
    )
}

const listStyle = {fontFamily: 'Verdana, sans-serif', fontSize: 20, fontWeight: 400, color: 'black'}
export default Index