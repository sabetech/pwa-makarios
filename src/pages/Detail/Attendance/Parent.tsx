import { useContext } from 'react';
import { List, SpinLoading, ErrorBlock } from 'antd-mobile'
import { CheckOutline, ExclamationCircleOutline } from 'antd-mobile-icons';
import { useQuery } from 'react-query';
import { getAttendance } from '../../../services/Attendance';
import { ServerResponse, IUserManager } from '../../../interfaces/ServerResponse';
import { UserContext } from '../../../contexts/UserContext';
import { getUserFriendlyDateFormat, isTimeGreaterThan } from '../../../utils/helper';
import { AttendanceInfo } from '../../../types/attendanceInfo';

export const Parent = ({event, suffix}: {event: string, suffix: string})  => {
    const { user } = useContext(UserContext) as IUserManager;
    const {data: attendance, isLoading} = useQuery<ServerResponse>([`${event}`], () => getAttendance(user?.index_number as number, event));

    const getAttendanceStatus = (attendance: AttendanceInfo)  => {
        
        if ((attendance.time_in) && (attendance.time_out)) {
            if (attendance.late_condition && isTimeGreaterThan(attendance.time_in, attendance.late_condition)) {
                return <p style={{ color: 'red' }}>Late</p>
            }else{
                return (<p style={{ color: 'green' }}>Present</p>)
            }
        }
        
        if (attendance.time_in) {
            if (attendance.late_condition && isTimeGreaterThan(attendance.time_in, attendance.late_condition)) 
            return <><p style={{ color: 'red' }}>Late <span style={{color: 'grey'}}>(-10 mins)</span> </p></>
            else return <p style={{ color: 'red' }}> Absent </p> 
        }

        if (attendance.time_out) {
            if (event != 'VISION')
            return (<p style={{ color: 'red' }}>Late </p>)
            else (<p style={{ color: 'red' }}>Absent </p>)
        }
        return <p style={{ color: 'red' }}>Absent</p>
    }

    return (
        <List header={`${event} ${suffix}`}>
            {
                isLoading ? <List.Item><SpinLoading style={{ '--size': '18px' }} /></List.Item> :
                attendance?.data?.data.length === 0 ? 
                <ErrorBlock status='empty' 
                    title={`No ${event} ${suffix} yet`}
                    description={""}
                    image={"https://icons.veryicon.com/png/o/miscellaneous/designer-icon-1/empty-29.png"}
                /> :
                attendance?.data?.data.map((attendance: AttendanceInfo, idx: number) => {
                    return <List.Item arrow={false} key={idx}
                    prefix={attendance?.time_in ? 
                    <CheckOutline style={{ color: 'green' }}/> 
                    : 
                    <ExclamationCircleOutline style={{ color: 'red' }}/>} 
                    title={`Time in: ${attendance?.time_in ?? "Not Scanned In"}`} 
                    description={`Time out: ${attendance?.time_out ?? "Not Scanned Out"}`} 
                    extra={<strong>{getAttendanceStatus(attendance)}</strong>}
                    > 
                        {getUserFriendlyDateFormat(attendance?.date)}
                    </List.Item>
                })
            }


            {/* <List.Item arrow={false} prefix={<CheckOutline style={{ color: 'green' }}/>} title='Time in: 6:01am' description='Time out: 09:00am' extra={<p style={{ color: 'green' }}>Present</p>} onClick={() => {}} >
                6th Work In Progress 2023
            </List.Item> */}
            {/* <List.Item arrow={false} prefix={<ExclamationCircleOutline style={{ color: 'red' }}/>} title='Time in: N/A' description='Time out: N/A' extra={<p style={{ color: 'red' }}>Absent</p>} onClick={() => {}}>
                5 July 2023
            </List.Item>*/}
            {/* <List.Item arrow={false} prefix={<SpinLoading style={{ '--size': '18px' }} />} title='Time in: 6:31am' description='Time out: 09:00am' extra={<>Late</>} onClick={() => {}}>
                6th Work In Progress 2023 <br />
                6th Work In Progress 2023
            </List.Item>  */}
        </List>
    )
}