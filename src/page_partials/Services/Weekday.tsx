import { useNavigate } from "react-router-dom";
import { Button, Collapse, Selector, CalendarPicker, Image, Tag } from 'antd-mobile';
import { useState } from "react";
import { useGetStreams } from '../../hooks/StreamHooks';
import { SpinLoading } from "antd-mobile";
import Card from '../../components/services/AttendanceCard';
import { TStream } from '../../types/stream';
import { useGetRegionServices } from "../../hooks/ServiceHooks";
import { TRegionServiceData } from "../../types/service";
import { List } from "antd-mobile";
//this only gets weekday services
const WeekdayServices = () => {

    const {data: regionServices, isLoading} = useGetRegionServices();
    const [filterOption, setFilterOption] = useState<{label: string, value: number}>({label: "All", value: 0});
    const { data: streams } = useGetStreams();

    const navigate = useNavigate();
    const [calenderVisible, setCalenderVisible] = useState(false);
    const singleDate: Date = new Date();
    const filters = streams?.map((stream: TStream) => {
        return {
            label: stream.name,
            value: stream.id ?? 0
        }
    }) ?? [];

    console.log("Region Services::", regionServices)

    return <>
        <Button block color='primary' fill='solid' size='large' onClick={() => navigate('/services/weekday/form')  }>
            Fill Weekday Service Form
        </Button>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        {
            isLoading && <SpinLoading style={{'--size': '48px', marginTop: 50}}/>
        }
        </div>
        <Collapse>
            <Collapse.Panel key='1' title={`Filters - ${filterOption.label}`}>
            <Selector
                style={{
                    '--border-radius': '100px',
                    '--border': 'solid transparent 1px',
                    '--checked-border': 'solid var(--adm-color-primary) 1px',
                    '--padding': '8px 24px',
                }}
                showCheckMark={false}
                options={[...filters, { label: "All", value: 0 }]}
                onChange={(_, extend) => {
                    setFilterOption(extend.items[0] as { label: string, value: number })
                }}
            />
            <Button onClick={() => {
                setCalenderVisible(true)
            }}
                color='primary'
                fill='outline'
                style={{
                marginTop: 10,
                borderRadius: 25,
                }}
            >
                Filter by Date
            </Button>
            <CalendarPicker
                    title={"Select Date"}
                    visible={calenderVisible}
                    selectionMode='single'
                    defaultValue={singleDate}
                    onClose={() => setCalenderVisible(false)}
                    onMaskClick={() => setCalenderVisible(false)}
                    onChange={(val) => {
                    console.log("Calendar::", val)
                }}
            />
            </Collapse.Panel>
        </Collapse>
        {
            regionServices && regionServices?.length > 0 && !isLoading &&
            regionServices.map((regionService: TRegionServiceData) => (
                <>
                    <Card
                        key={regionService.id}
                        regionName={regionService.name}
                        streamName={regionService.stream.name}
                        leaderName={regionService.leader.name}
                        leaderPicture={regionService.leader.img_url ?? '/404'}
                        averageAttendance={0}
                        averageOffering={0}
                        previewChartData={regionService.attendance_weekly_summary.map(item => item.total_attendance)}
                    />
                    <Collapse>
                        <Collapse.Panel key='1' title="Attendance Breakdown">
                        {
                            regionService.bacentas.map((bacenta) => (
                                <List>
                                    <List.Item
                                    key={bacenta.id}
                                    prefix={
                                        <Image
                                            src={bacenta.services.length > 0 ? bacenta.services[0].service_photo : '/404'}
                                            style={{ borderRadius: 20 }}
                                            fit='cover'
                                            width={40}
                                            height={40}
                                        />
                                    }
                                    extra={<Tag color='warning'>{`${bacenta.services.length} Services`}</Tag>}
                                    description={`Latest Attendance: ${bacenta.services.length > 0 ? bacenta.services[0].attendance : 0} | Latest Offering: ${bacenta.services.length > 0 ? bacenta.services[0].offering : 0}`}
                                    >
                                    {bacenta.name}
                                    </List.Item>
                                </List>
                            ))
                        }
                        </Collapse.Panel>
                    </Collapse>
                </>
            ))
        }
        
        <Collapse>
        <Collapse.Panel key='1' title="Attendance Breakdown">
        
        </Collapse.Panel>
        </Collapse>
        {/* <List style={{paddingLeft: 0, marginTop: 20}}>
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
        </List> */}

        {/* <List style={{paddingLeft: 0, marginTop: 20}}>
            <List.Item prefix={<FaEdit />} description="Weekday Services" style={listStyle}>Weekday Services</List.Item>
        </List> */}
    </>
}

export default WeekdayServices;