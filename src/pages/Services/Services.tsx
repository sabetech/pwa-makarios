import { Button, List, Tabs } from 'antd-mobile';
import MyNavBar from "../../components/NavBar"
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetStreams } from '../../hooks/StreamHooks';
import { TStream } from '../../types/stream';

const Services = () => {
    //Make the services configurable in the future
    //In the database,

    //based on who is logged in
    /*
    super admin sees all 

    */
   
    const { data: streams } = useGetStreams();
    console.log("streams::", streams)

    const navigate = useNavigate();

    return (<>
        <MyNavBar prevPage="dashboard" currentPage="Services" />
        
        <Tabs
            defaultActiveKey="1"
            style={{ height: '100%', background: 'transparent'}}
        >
             {
                //generate tabs using the list of streams
                streams?.map((stream: TStream) => (
                    <Tabs.Tab title={stream.name} key={stream.id}>
                        <Button block color='primary' fill='solid' size='large' onClick={() => navigate(`/services/${stream.id}/form`)  }>
                            Fill {stream.name} Form
                        </Button>
                        <List style={{paddingLeft: 0, marginTop: 20}}>
                            <List.Item prefix={<FaEdit />} description={stream.church.name} style={listStyle}>{stream.name}</List.Item>
                        </List>
                    </Tabs.Tab>
                ))
             }
             <Tabs.Tab title="Weekday Services" key="10">
                <Button block color='primary' fill='solid' size='large' onClick={() => navigate('/services/weekday/form')  }>
                    Fill Weekday Service Form
                </Button>
                <List style={{paddingLeft: 0, marginTop: 20}}>
                    <List.Item prefix={<FaEdit />} description="Weekday Services" style={listStyle}>Weekday Services</List.Item>
                </List>
             </Tabs.Tab>
           
            {/* <Tabs.Tab title="Sunday Services" key="1">
                <Button block color='primary' fill='solid' size='large' onClick={() => navigate('/services/sunday/form')  }>
                    Fill Sunday Service Form
                </Button>
                <List style={{paddingLeft: 0, marginTop: 20}}>
                    <List.Item prefix={<FaEdit />} description="Sunday Services" style={listStyle}>Sunday Services</List.Item>
                </List>

            </Tabs.Tab>
            <Tabs.Tab title="Friday Services" key="2">
                <Button block color='primary' fill='solid' size='large'>
                    Fill Friday Service Form
                </Button>
            </Tabs.Tab>
            <Tabs.Tab title="Weekday Services" key="3">
                <h1>Weekday Services</h1>
            </Tabs.Tab> */}
        </Tabs>


    </>
)
}

const listStyle = {fontFamily: 'Verdana, sans-serif', fontSize: 30, fontWeight: 400, color: 'black'}

export default Services