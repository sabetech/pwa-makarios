import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { logoutUser } from '../../services/UserManagement';
import { IPastoralPoint, IUserManager } from '../../interfaces/ServerResponse';
import { Grid, Space, FloatingBubble, Modal, Image, ActionSheet, Divider } from 'antd-mobile'
import { useSignOut } from '../../hooks/AuthHooks';
import { SystemQRcodeOutline, MoreOutline, TeamOutline } from 'antd-mobile-icons'

import { ValueCard } from '../../components/dashboard/ValueCard';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { getPastoralPoint, getBussing } from '../../services/StudentData';
import { ServerResponse, IBussing } from '../../interfaces/ServerResponse';
import { postAttendance } from '../../services/Attendance';
import type {
    Action
} from 'antd-mobile/es/components/action-sheet';

import { IAttendanceRequestInfo } from '../../interfaces/Attendance';

import HeaderPanel from '../../components/dashboard/HeaderPanel';
import { getActions, ADMIN, SERVICES, DIRECTORY, ARRIVAL } from '../../constants/SidebarActions';

const Dashboard = () => {
    // const auth = useAuthUser();
    
    const signOut = useSignOut();
    const navigate = useNavigate();
    const [_, setPastoralPoint] = useState<IPastoralPoint[]>([]);
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [visible, setVisible] = useState(false)
    const { user, storeUser } = useContext(UserContext) as IUserManager;
    // const loggedInUser = auth()

    // console.log("User::", loggedInUser)

    // const {data: pastoralPoints, isLoading} = useQuery<ServerResponse>(['pastoral_points'], () => getPastoralPoint(user?.index_number as number));
    // const { data: bussingData, isLoading: bussingLoading } = useQuery<ServerResponse>(['bussing'], () => getBussing(user?.index_number as number));
    const [averageBussing, setAverageBussing] = useState<number>(0);

    const { mutate: logout, isLoading: loggingOut } = useMutation({
        // mutationFn: async () => {
        //     return await logoutUser(authHeader() as string);
        // },

        onSuccess: () => {
            signOut();
            navigate('/');
        },
        onError: (error) => {
            signOut();
            navigate('/');
            console.log(error)
        }
    })

    // useEffect(() => {

    //     if (pastoralPoints?.data) {
    //         const parameters = pastoralPoints.data?.data.map((pastoralPoint: IPastoralPoint) => {
    //             return pastoralPoint
    //         });
    //         setPastoralPoint(parameters);
    //         const myTotalPoints = pastoralPoints.data?.data.reduce((total: number, pastoralPoint: IPastoralPoint) => {
    //             return total + pastoralPoint.pivot.points
    //         }, 0)
    //         setTotalPoints(myTotalPoints as number);
    //     }

    // },[pastoralPoints])

    // useEffect(() => {

    //     if (bussingData?.data) {
    //         const bussingDetails = bussingData.data?.data.map((bussing: IBussing) => {
    //             return bussing;
    //         });

    //         const myAverageBussing = bussingDetails.reduce((total: number, bussing: IBussing) => {
    //             return total + bussing.number_bussed
    //         }, 0) / bussingDetails.length;
    //         setAverageBussing(myAverageBussing.toFixed(0) as unknown as number);
    //     }

    // }, [bussingData])


    
    const actions: Action[] = [
       ...getActions('Super Admin' as string),
        {
            text: 'Logout', key: 'logout', danger: true,
            onClick: () => {
                Modal.confirm({
                    title: 'Logout',
                    content: 'Are you sure you want to logout?',
                    confirmText: 'Yes',
                    cancelText: 'No',
                    showCloseButton: true,
                    onConfirm: () => {
                        logout();
                    },
                    onCancel: () => {
                        setVisible(false)
                    }
                })
            }
        }
    ];

    const onAction = (action: Action) => {
        switch(action.key) {
            case ADMIN:
                navigate("/admin/portal");
                break;
            case DIRECTORY:
                navigate('/directory');
                break;
            case SERVICES:
                navigate('/services');
                break;
            case ARRIVAL:
                navigate('/arrivals');
                break;
        }
    }

    const handleClick = (label: string) => {
        switch(label) {
            case 'churches':
                navigate("/churches");
            break;

            case 'fellowship':
                navigate("/fellowship");    
            break;

            case 'bacenta':
                navigate("/bussing");
            break;

            case 'pastoral_point':
                navigate("/pastoral_point")
            break;
        }
        
    }

    return (
        <>
            <HeaderPanel setVisible={setVisible} loggedInUser={"fas"} />

            <Grid columns={3} gap={2}>
                <Grid.Item >
                    <ValueCard key={"churches"} title="Churches" value={1} handleClick={() => handleClick("churches")  } Icon={<SystemQRcodeOutline />}/>
                </Grid.Item>
                 {/* <Grid.Item>
                    <ValueCard key={"streams"} title="Streams" value={3} handleClick={() => handleClick("streams")} Icon={<TeamOutline />}/>
                </Grid.Item>
                <Grid.Item >
                    <ValueCard key={"councils"} title="Councils" value={7} handleClick={() => handleClick("councils")  } Icon={<SystemQRcodeOutline />}/>
                </Grid.Item>
                 <Grid.Item>
                    <ValueCard key={"bacentas"} title="Bacentas" value={3} handleClick={() => handleClick("bacentas")} Icon={<TeamOutline />}/>
                </Grid.Item>
                <Grid.Item>
                    <ValueCard key={"fellowships"} title="Fellowships" value={20} handleClick={() => handleClick("fellowship")} Icon={<TeamOutline />}/>
                </Grid.Item> */}
            </Grid>
            <Divider />
            <Space direction='horizontal' style={{marginTop: 30, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Grid columns={2} gap={2} style={{fontFamily: 'Verdana, sans-serif', fontSize: 14}}>
                    <Grid.Item>
                        <Space direction='vertical'>
                            <div>Avg Attendance</div>
                            <div>0</div>
                        </Space>
                    </Grid.Item>
                    <Grid.Item>
                        <Space direction='vertical'>
                            <div>Avg Weekly Income (Ghc)</div>
                            <div>0</div>
                        </Space>
                    </Grid.Item>
                </Grid>
            </Space>
            <Divider />
            
        <FloatingBubble
            style={{
                '--initial-position-bottom': '24px',
                '--initial-position-right': '24px',
                '--edge-distance': '24px',
                '--z-index': '10px'
            }}
            onClick={() => {setVisible(true)}}
        >
            <MoreOutline fontSize={32} color={'white'} />
        </FloatingBubble>
        
        <ActionSheet
            visible={visible}
            actions={actions}
            onClose={() => setVisible(false)}
            extra={`Logged in as: `}
            onAction={onAction}
        />
        </>
    )
}

export default Dashboard;