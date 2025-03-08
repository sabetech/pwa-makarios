import { useState } from 'react';
// import { UserContext } from '../../contexts/UserContext';
import { logoutUser } from '../../services/UserManagement';
// import { IPastoralPoint, IUserManager } from '../../interfaces/ServerResponse';
import { Grid, Space, FloatingBubble, Modal, ActionSheet, Divider, Card, SpinLoading, Tag } from 'antd-mobile'
import { useSignOut, useAuthUser, useAuthToken } from '../../hooks/AuthHooks';
import { MoreOutline } from 'antd-mobile-icons'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import * as StorageKeys from '../../constants/StorageKeys';
import * as App from '../../constants/App';
import { useGetDashboardSummaries } from '../../hooks/DashboardSummaryHooks';

import type {
    Action
} from 'antd-mobile/es/components/action-sheet';

import HeaderPanel from '../../components/dashboard/HeaderPanel';
import { getActions, ADMIN, SERVICES, DIRECTORY, ARRIVAL } from '../../constants/SidebarActions';
import DataBar from '../../components/dashboard/charts/DataBar';
import { useGetServiceAverageAttnAndOffering } from '../../hooks/ServiceHooks';

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
    const {data: dashboardAverage} = useGetServiceAverageAttnAndOffering()

    console.log("Dashboard summary::", dashboardSummary)
    console.log("Service Average::", dashboardAverage)

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
            case App.BACENTAS:
                navigate("/dashboard/bacentas");
            break;
            case App.MEMBERS:
                navigate("/dashboard/members");
            break;
        }
        
    }

    return (
        <>
            <HeaderPanel setVisible={setVisible} loggedInUser={ user } />
            <div style={{display: 'flex', justifyContent: 'center'}}>
            {
                isLoading && <SpinLoading style={{'--size': '48px', marginTop: 50}}/>
            }
            </div>

            <Grid columns={3} gap={1} style={{marginTop: '7vh'}}>
                {
                    dashboardSummary && dashboardSummary?.length > 0 &&
                    dashboardSummary.map((summary: any, index: number) => 
                     (
                        <Grid.Item key={index}>
                  
                            <Card title={summary.name} onClick={() => {handleClick(summary.name)}} style={{boxShadow: '1px 1px 8px 0px rgba(0,0,0,0.25)'}}>
                                { summary.count }
                            </Card>
    
                        </Grid.Item>
                    ))
                }
            </Grid>
            <Divider />
            <Space direction='vertical' style={{marginLeft: 15}}>
                <Grid columns={3} gap={8} style={{fontFamily: 'Verdana, sans-serif', fontSize: 13, display: 'flex', justifyContent: 'center'}}>
                    <Grid.Item>
                        <Space direction='vertical' style={{alignItems: 'center'}}>
                            <div>Avg Attendance</div>
                            <div><Tag round={true} style={{fontSize: '0.8rem'}}>{ Math.round(dashboardAverage?.avgAttn ?? 0) }</Tag></div>
                        </Space>
                    </Grid.Item>
                    <Grid.Item>
                        <Space direction='vertical' style={{alignItems: 'center'}}>
                            <div>Avg Weekly Income (Ghc)</div>
                            <div><Tag round={true} style={{fontSize: '0.8rem'}}>{ Math.round(dashboardAverage?.avgOffering ?? 0) }</Tag> </div>
                        </Space>
                    </Grid.Item>
                    <Grid.Item>
                        <Space direction='vertical' style={{alignItems: 'center'}}>
                            <div>Avg Weekly Bussing </div>
                            <div><Tag round={true} style={{fontSize: '0.8rem'}}>0</Tag></div>
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