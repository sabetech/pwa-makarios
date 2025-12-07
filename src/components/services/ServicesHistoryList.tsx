import { List, Image } from "antd-mobile";
import {getUserFriendlyDateFormat} from "../../utils/helper";
import { TServiceResponse } from "../../types/service";

type ServiceHistoryListProps = {
    services: Array<TServiceResponse>;
}

const ServiceHistoryList:React.FC<ServiceHistoryListProps> = ({ services }) => {
    
    return (<>
        
        <List header={`Services: ${services?.length}`} style={{'--header-font-size': '20px', marginTop: '1vh'}} mode={'card'}>
            {
                services && services?.map((service: TServiceResponse) => (
                    <List.Item 
                        prefix={<Image
                            src={service.service_photo}
                            style={{ borderRadius: 20 }}
                            fit='cover'
                            width={40}
                            height={40}
                        />}
                    
                        key={service.id}
                        description={`Attendance: ${service.attendance} | Offering: ${service.offering}` }
                        extra={<Image
                            src={service.treasurer_photo}
                            style={{ borderRadius: 20 }}
                            fit='cover'
                            width={40}
                            height={40}
                        />}
                    >

                        {`${getUserFriendlyDateFormat(service.date)}`}
                        
                    </List.Item>
                ))
            }
        </List>
    </>)
}

export default ServiceHistoryList;