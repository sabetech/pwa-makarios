import { useState } from 'react';
import { Button, Tabs, List,Image, Tag } from 'antd-mobile';
import MyNavBar from "../../components/NavBar"
import { useNavigate } from "react-router-dom";
import { useGetStreams } from '../../hooks/StreamHooks';
import { TStream } from '../../types/stream';
import { useGetServices } from '../../hooks/ServiceHooks';
import { getUserFriendlyDateFormat } from '../../utils/helper';
import { AiFillHome } from "react-icons/ai";

const Services = () => {

    const [selectedStream, setSelectedStream] = useState<number>(1);
   
    const { data: streams } = useGetStreams();
    const { data: services } = useGetServices({stream_id: selectedStream});
    console.log("services::", services)
    const navigate = useNavigate();

    return (<>
        <MyNavBar prevPage="dashboard" currentPage="Services" rightNode={<Button fill='none' onClick={() => navigate("/dashboard")}><AiFillHome color='white' size={20} /></Button>} />
        
        <Tabs
            defaultActiveKey={streams && streams?.length > 0 ? "1" : "0"}
            style={{ height: '100%', background: 'transparent'}}
            onChange={(key) => setSelectedStream(parseInt(key))}
        >
             {
                //generate tabs using the list of streams
                streams?.map((stream: TStream) => (
                    <Tabs.Tab title={stream.name} key={stream.id}>
                        <Button block color='primary' fill='solid' size='large' onClick={() => navigate(`/services/${stream.id}/form`)  }>
                            Fill {stream.name} Form
                        </Button>
                        <List style={{paddingLeft: 0, marginTop: 20}}>
                {
                    services?.filter((service) => service.service_type_id == 7).map((service) => (
                        <List.Item
                        key={service.id}
                        prefix={
                          <Image
                            src={service.service_photo}
                            style={{ borderRadius: 20 }}
                            fit='cover'
                            width={40}
                            height={40}
                          />
                        }
                        extra={<Tag color='warning'>{service.service_type.service_type}</Tag>}
                        description={`Attendance: ${service.attendance} | Offering: ${service.offering}`}
                      >
                        {`${getUserFriendlyDateFormat(service.date)} - ${service?.bacenta?.name ?? ''}`}
                      </List.Item>
                    ))
                }
                </List>
                    </Tabs.Tab>
                ))
             }
             <Tabs.Tab title="Weekday Services" key="0">
                <Button block color='primary' fill='solid' size='large' onClick={() => navigate('/services/weekday/form')  }>
                    Fill Weekday Service Form
                </Button>
                <List style={{paddingLeft: 0, marginTop: 20}}>
                {
                    services?.filter((service) => service.service_type_id !== 7).map((service) => (
                        <List.Item
                        key={service.id}
                        prefix={
                          <Image
                            src={service.service_photo}
                            style={{ borderRadius: 20 }}
                            fit='cover'
                            width={40}
                            height={40}
                          />
                        }
                        extra={<Tag color='warning'>{service.service_type.service_type}</Tag>}
                        description={`Attendance: ${service.attendance} | Offering: ${service.offering}`}
                      >
                        {`${getUserFriendlyDateFormat(service.date)} - ${service?.bacenta?.name ?? ''}`}
                      </List.Item>
                    ))
                }
                </List>

                {/* <List style={{paddingLeft: 0, marginTop: 20}}>
                    <List.Item prefix={<FaEdit />} description="Weekday Services" style={listStyle}>Weekday Services</List.Item>
                </List> */}

             </Tabs.Tab>
           
        </Tabs>


    </>
)
}

const listStyle = {fontFamily: 'Verdana, sans-serif', fontSize: 30, fontWeight: 400, color: 'black'}

export default Services