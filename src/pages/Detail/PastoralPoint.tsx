import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { IPastoralPoint, IUserManager } from '../../interfaces/ServerResponse';
import { NavBar, Tabs, List, SpinLoading, SafeArea } from 'antd-mobile'
import { CheckOutline } from 'antd-mobile-icons';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ServerResponse } from '../../interfaces/ServerResponse';
import { getPastoralPoint } from '../../services/StudentData';


const PastoralPointDetail = () => {
    const [parameters, setParameters] = useState<IPastoralPoint[]>([]);
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const navigate = useNavigate()
    const { user } = useContext(UserContext) as IUserManager;
    // user?.index_number as number
    const {data: pastoralPoints, isLoading} = useQuery<ServerResponse>(['pastoral_points'], () => getPastoralPoint(user?.index_number as number));

    useEffect(() => {
        if (pastoralPoints?.data) {
            const parameters = pastoralPoints.data?.data.map((pastoralPoint: IPastoralPoint) => {
                return pastoralPoint
            })
            setParameters(parameters);

            const myTotalPoints = pastoralPoints.data?.data.reduce((total: number, pastoralPoint: IPastoralPoint) => {
                return total + pastoralPoint.pivot.points
            }, 0);
            setTotalPoints(myTotalPoints as number);
        }

    },[pastoralPoints])

    return (
        <>
           <SafeArea position='top' />
           <NavBar onBack={() => navigate("/dashboard")} style={{'--height': '60px', backgroundColor: '#b12340', color:'white'}} > Fellowship Service Detail </NavBar>
           
            <List header={'Pastoral Point: '+totalPoints} style={{overflow: 'scroll', height: "80vh", marginBottom: 20}}>
                {
                    isLoading ? <SpinLoading /> : parameters.map((pastoralPoint: IPastoralPoint) => {
                        return (
                            <List.Item key={pastoralPoint.id} arrow={false} prefix={<CheckOutline style={{ color: 'green' }}/>} extra={'Point:'+pastoralPoint.pivot.points } >
                                {pastoralPoint.parameter}
                            </List.Item>
                        )
                    })
                }
            </List>
            <SafeArea position='bottom' />
        </>
    )
}

export default PastoralPointDetail;