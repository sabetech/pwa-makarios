import { useState } from 'react';
// import { UserContext } from '../../contexts/UserContext';
import { logoutUser } from '../../services/UserManagement';
// import { IPastoralPoint, IUserManager } from '../../interfaces/ServerResponse';
import { Grid, Space, FloatingBubble, Modal, ActionSheet, Divider, Card } from 'antd-mobile'
import { useSignOut, useAuthUser, useAuthToken } from '../../hooks/AuthHooks';
import { MoreOutline } from 'antd-mobile-icons'
import { useLocation } from 'react-router-dom';
import { ValueCard } from '../../components/dashboard/ValueCard';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import * as StorageKeys from '../../constants/StorageKeys';
import * as App from '../../constants/App';
import { useGetDashboardSummaries } from '../../hooks/DashboardSummaryHooks';

import type {
    Action
} from 'antd-mobile/es/components/action-sheet';

// import { IAttendanceRequestInfo } from '../../interfaces/Attendance';

import HeaderPanel from '../../components/dashboard/HeaderPanel';
import { getActions, ADMIN, SERVICES, DIRECTORY, ARRIVAL } from '../../constants/SidebarActions';
import DataBar from '../../components/dashboard/charts/DataBar';
import { auto } from '@cloudinary/url-gen/actions/resize';

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

    // const dashboardCards
    const {data: dashboardSummary, isLoading} = useGetDashboardSummaries()

    console.log("Dashboard summary::", dashboardSummary)

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
        switch(label.toLowerCase()) {
            case App.CHURCHES:
                navigate("/dashboard/churches");
            break;
            case App.STREAMS:
                navigate("/dashboard/streams");
            break;
            case App.REGIONS:
                navigate("/dashboard/regions");
            break;
            case App.ZONES:
                navigate("/dashboard/zones");
            break;
        }
        
    }

    return (
        <>
            <HeaderPanel setVisible={setVisible} loggedInUser={ user } />

            {
                isLoading && <div>Loading...</div>
            }

            <Grid columns={3} gap={1} style={{marginTop: '10vh'}}>
                {
                    dashboardSummary && dashboardSummary?.length > 0 &&
                    dashboardSummary.map((summary: any, index: number) => 
                     (
                        <Grid.Item key={index}>
                  
                            <Card title={summary.name} onClick={() => {handleClick(summary.name)}} style={{boxShadow: '1px 1px 8px 0px rgba(0,0,0,0.25)'}}>
                                {summary.count}
                            </Card>
      
                            {/* <ValueCard key={index} title={summary.name} value={summary.count} handleClick={() => {handleClick(summary.name)}} /> */}
                        </Grid.Item>
                    ))
                }
            </Grid>
            <Divider />
            <Space direction='vertical' style={{marginLeft: 15, width: '100%'}}>
                <Grid columns={3} gap={8} style={{fontFamily: 'Verdana, sans-serif', fontSize: 13, display: 'flex', justifyContent: 'center'}}>
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
                    <Grid.Item>
                        <Space direction='vertical'>
                            <div>Avg Weekly Bussing </div>
                            <div>0</div>
                        </Space>
                    </Grid.Item>
                </Grid>
            </Space>
            <Divider />
            <DataBar />
            
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