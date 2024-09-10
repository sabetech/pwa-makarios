import { NavBar, Tabs,} from 'antd-mobile'
import { useNavigate } from 'react-router-dom';
import { VisionLecturesAttendance } from './Attendance/children/Vision';
import { PillarLecturesAttendance } from './Attendance/children/Pillar';
import { FoundationalLecturesAttendance } from './Attendance/children/Foundational'
import { BMCDRAttendance } from './Attendance/children/Bmcdr';
import { Anagkazo_LiveAttendance } from './Attendance/children/Anagkazo_live';
import { The4AMPrayerAttendance } from './Attendance/children/4AMPrayer'
import { AnagkazoEncounterAttendance } from './Attendance/children/AnagkazoEncounter';
import { SundayServiceAttendance } from './Attendance/children/SundayService';
import { WaitingOnGodAttendance } from './Attendance/children/WaitingOnGod';
import { TutorialAttendance } from './Attendance/children/Tutorials';
import { SpecialServiceAttendance } from './Attendance/children/SpecialServices';

const AttendanceDetails = () => {
    const navigate = useNavigate()

    return (
        <>
           <NavBar onBack={() => navigate("/dashboard")} style={{'--height': '60px', backgroundColor: '#b12340', color:'white'}} > Attendance Detail </NavBar>
           <Tabs defaultActiveKey='1'>
                <Tabs.Tab title='Vision' key='1'>
                    <VisionLecturesAttendance />
                </Tabs.Tab>
                <Tabs.Tab title='Pillar' key='2'>
                    <PillarLecturesAttendance />
                </Tabs.Tab>
                <Tabs.Tab title='Foundational' key='3'>
                    <FoundationalLecturesAttendance />
                </Tabs.Tab>
                <Tabs.Tab title='BMCDR' key='4'>
                    <BMCDRAttendance />
                </Tabs.Tab>
                <Tabs.Tab title='Anagkazo Live' key='5'>
                    <Anagkazo_LiveAttendance />
                </Tabs.Tab>
                <Tabs.Tab title='4AM Prayer' key='6'>
                    <The4AMPrayerAttendance />
                </Tabs.Tab>
                <Tabs.Tab title='Anagkazo Encounter' key='7'>
                    <AnagkazoEncounterAttendance />
                </Tabs.Tab>
                <Tabs.Tab title='Sunday Service' key='8'>
                    <SundayServiceAttendance />
                </Tabs.Tab>
                <Tabs.Tab title='Waiting On God' key='9'>
                    <WaitingOnGodAttendance />
                </Tabs.Tab>
                <Tabs.Tab title='Tutorials' key='10'>
                    <TutorialAttendance />
                </Tabs.Tab>
                <Tabs.Tab title='Special Services' key='11'>
                    <SpecialServiceAttendance />
                </Tabs.Tab>
            </Tabs>
        </>
    )
}

export default AttendanceDetails;