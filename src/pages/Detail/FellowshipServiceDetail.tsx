import { useState, useContext } from 'react';
import { NavBar, List, Space, Button, Modal, Form, TextArea,SpinLoading, Image } from 'antd-mobile'
import { StopOutline } from 'antd-mobile-icons';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { IUserManager, ServerResponse } from '../../interfaces/ServerResponse';
import { TFellowshipService, TCancelFellowshipService } from '../../types/fellowshipFormFields'
import { getFellowshipServices, cancelFellowshipService } from '../../services/FellowshipService';
import { getUserFriendlyDateFormat } from '../../utils/helper'
import dayjs from 'dayjs';
import MyNavBar from '../../components/Nav/NavBar';



const FellowshipServiceDetails = () => {
    const navigate = useNavigate()
    const { user } = useContext(UserContext) as IUserManager;
    const [fellowshipCancelForm] = Form.useForm();

    // const {data: fellowshipServices, isFetching, isSuccess} = useQuery<ServerResponse>(
    //     {
    //         queryKey: ['fellowship_services'],
    //         queryFn: () => getFellowshipServices(user?.id as number)
    //     },
    // );

    const { mutate: cancelService } = useMutation({
        mutationFn: async (cancelFellowshipInfo: TCancelFellowshipService) => {
            return await cancelFellowshipService(user?.id as number, cancelFellowshipInfo.reason, cancelFellowshipInfo.service_date)
        },
    });

    const handleFillServiceForm = () => {
        navigate('/fellowship/fill-form');
    }

    // console.log("Fellowship services", fellowshipServices);

    const onFellowshipServiceCancel = () => {
        console.log(
            fellowshipCancelForm.getFieldValue("reason")
        )

        cancelService({
            reason: fellowshipCancelForm.getFieldValue("reason"),
            service_date: dayjs().format("YYYY-MM-DD"),
        })

        fellowshipCancelForm.resetFields();
    }

    const handleCancelServiceClick = () => {
        Modal.show({
            title: 'Cancel Service Reason',
            closeOnAction: true,
            actions: [{
                key: 'ok',
                text: 'Ok',
                primary: true
            }, {
                key: 'ignore',
                text: 'Ignore'
            }],
            onAction: (action, index) => {
                
                if (action.key !== 'ok') return;
                onFellowshipServiceCancel()

            },
            content: <>
                <Form layout='vertical' 
                      form={fellowshipCancelForm}
                >
                    <Form.Item label='Reason' name='reason'>
                        <TextArea
                            placeholder='Type your Reason here'
                        />
                    </Form.Item>
                </Form>
            </>
        })
    }

    return (
        <>        
           <MyNavBar prevPage={"dashboard"} currentPage={"Fellowship Service Detail"} />           
            {/* Use virtual list in the future */}
            {/* {
                isFetching && <SpinLoading />
            } */}
            <List header='Attendance Average: 0 | Offering Average: 0'>
                {/* {
                    isSuccess &&
                    fellowshipServices.data.map( (fellowshipService: TFellowshipService) => 
                        { return fellowshipService.cancel_service_reason == null 
                            ?
                            (
                                <List.Item key={fellowshipService.id}  
                                    arrow={false} prefix={<Image
                                    src={fellowshipService.image_url}
                                    style={{ borderRadius: 20 }}
                                    fit='cover'
                                    width={40}
                                    height={40}
                                  />} 
                                  description={`Offering: ${fellowshipService.offering} GHc`} extra={`Attendance: ${ fellowshipService.attendance }`} >
                                    { getUserFriendlyDateFormat(fellowshipService.service_date) }
                                </List.Item>
                            ) 
                            :
                            (
                                <List.Item key={fellowshipService.id}
                                    arrow={false} prefix={<StopOutline fontSize={32} color='red'/>}
                                    description={fellowshipService.cancel_service_reason} extra={`Attendance: 0`}
                                >  
                                    { getUserFriendlyDateFormat(fellowshipService.service_date) }
                                </List.Item>
                            )   
                        } 
                    )
                }
                 */}
            </List>
            <Space direction='horizontal' justify='center' align='center' block>
                <Button block shape='rectangular' color='primary' size='large' onClick={handleFillServiceForm}>
                    Fill Service Form!
                </Button>
                <Button block shape='rectangular' fill='outline' size='large' onClick={handleCancelServiceClick}>
                    Cancel Service
                </Button>
            </Space>
            
            
        </>
    )
}

export default FellowshipServiceDetails;