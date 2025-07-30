import MyNavBar from "../../components/NavBar"
import { List, FloatingBubble, Avatar } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons'
import { useNavigate } from "react-router-dom";
import { useGetStreams } from '../../hooks/StreamHooks';
import { TStream } from "../../types/stream";

const Index = () => {
    const navigate = useNavigate();
    const showAddStreamsForm = () => {
        navigate('add');
    }

    const {data: streams, isLoading} = useGetStreams()

    console.log("streams", streams)

    return (
        <>
            <MyNavBar currentPage="Streams" />
            {
                isLoading && <div>Loading...</div>
            }
            <List header="Streams" style={{'--header-font-size': '20px', marginTop: 20}}>
            {
                streams && streams.map((stream: TStream) => (
                    <List.Item key={stream.name} 
                        onClick={() => {
                            navigate(`${stream.id}`)
                        }}
                        prefix={<Avatar src={stream.overseer?.img_url ?? '/404'} style={{'--border-radius': '50%'}}/>}
                        style={listStyle}
                        description={`${stream.church.name}: ${stream.meeting_day} by ${stream.overseer?.name}`}
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