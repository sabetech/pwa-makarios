import { useState } from 'react';
// import { UserContext } from '../../contexts/UserContext';
import { logoutUser } from '../../services/UserManagement';
// import { IPastoralPoint, IUserManager } from '../../interfaces/ServerResponse';
import { Grid, Space, FloatingBubble, Modal, ActionSheet, Divider } from 'antd-mobile'
import { useSignOut, useAuthUser, useAuthToken } from '../../hooks/AuthHooks';
import { MoreOutline } from 'antd-mobile-icons'
import { useLocation } from 'react-router-dom';
import { ValueCard } from '../../components/dashboard/ValueCard';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import * as StorageKeys from '../../constants/StorageKeys';
// import { getPastoralPoint, getBussing } from '../../services/StudentData';
// import { ServerResponse, IBussing } from '../../interfaces/ServerResponse';
// import { postAttendance } from '../../services/Attendance';
import type {
    Action
} from 'antd-mobile/es/components/action-sheet';

// import { IAttendanceRequestInfo } from '../../interfaces/Attendance';

import HeaderPanel from '../../components/dashboard/HeaderPanel';
import { getActions, ADMIN, SERVICES, DIRECTORY, ARRIVAL } from '../../constants/SidebarActions';

const Dashboard = () => {
    const authToken = useAuthToken();
    const location = useLocation();
    const signOut = useSignOut();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false)
    
    if (location?.state?.user != null) {
        localStorage.setItem(StorageKeys.USER, JSON.stringify(location.state.user));
    }

    const loggedInUser = useAuthUser()
    const user = loggedInUser()

    console.log("user::", user)

    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            return await logoutUser(authToken as string);
        },

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
    
    const actions: Action[] = [
       ...getActions(user.roles.length > 0 ? user.roles[0].name : 'General'),
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
                navigate("/dashboard/churches");
            break;
            case 'streams':
                navigate("/dashboard/streams");
            break;
            case 'regions':
                navigate("/dashboard/regions");
            break;
        }
        
    }

    return (
        <>
            <HeaderPanel setVisible={setVisible} loggedInUser={ user } />

            <Grid columns={3} gap={2} style={{marginTop: '5vh'}}>
                {
                user.permissions.length > 0 &&
                user.hasPermission?.({name: 'view churches'}) &&
                (<>
                <Grid.Item >
                    <ValueCard key={"churches"} title="Church" value={1} handleClick={() => handleClick("churches")  } />
                </Grid.Item>
                </>)
                }
                { 
                user.permissions.length > 0 &&
                user.hasPermission?.({name: 'view streams'}) &&
                (
                <>
                <Grid.Item>
                    <ValueCard key={"streams"} title="Streams" value={3} handleClick={() => handleClick("streams")} />
                </Grid.Item>
                </>
                )
                }
                {
                user.permissions.length > 0 &&
                user.hasPermission?.({name: 'view regions'}) && 
                <>
                <Grid.Item >
                    <ValueCard key={"regions"} title="Regions" value={7} handleClick={() => handleClick("regions")  } />
                </Grid.Item>
                </>
                }
                {
                user.permissions.length > 0 &&
                user.hasPermission?.({name: 'view zones'}) && 
                <>
                 <Grid.Item>
                    <ValueCard key={"zones"} title="Zones" value={7} handleClick={() => handleClick("zones")} />
                </Grid.Item>
                </>
                }
                {
                 user.permissions.length > 0 &&
                 user.hasPermission?.({name: 'view bacentas'}) && 
                <>
                <Grid.Item>
                   <ValueCard key={"bacentas"} title="Bacentas" value={7} handleClick={() => handleClick("bacentas")} />
               </Grid.Item>
               </>
                }
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