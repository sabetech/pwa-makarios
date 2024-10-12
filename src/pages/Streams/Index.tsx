import MyNavBar from "../../components/NavBar"
import { List, FloatingBubble } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons'
import { useNavigate } from "react-router-dom";
import { useGetStreams } from '../../hooks/StreamHooks';
import { TStream } from "../../types/stream";

const Index = () => {
    const navigate = useNavigate();
    const showAddStreamsForm = () => {
        navigate('add');
    }

    const {data: streams} = useGetStreams()

    return (
        <>
            <MyNavBar prevPage="directory/churches" currentPage="Streams" />
            <List header="Streams" style={{'--header-font-size': '20px'}}>
            {
                streams && streams.data.map((stream: TStream) => (
                    <List.Item key={stream.name} 
                        onClick={() => {
                            navigate(`${stream.id}`)
                        }}
                        // prefix={<TeamOutline />}
                        style={listStyle}
                        description={`${stream.meeting_time} on ${stream.meeting_day}`}
                    >
                        {stream.name}
                    </List.Item>
                ))
            }
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