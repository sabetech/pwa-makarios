import { useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { IUserManager } from '../../interfaces/ServerResponse';
import { NavBar, List, FloatingBubble, Modal, Form, Stepper, Button, DatePicker, ImageUploader } from 'antd-mobile'
import { CheckOutline, AddOutline  } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { postNumberBussed, getBussing } from '../../services/StudentData';
import { ResponseError,ServerResponse, IBussing } from '../../interfaces/ServerResponse';
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'
import { IBussingInfo } from '../../interfaces/BussingInfo';
import { getUserFriendlyDateFormat } from '../../utils/helper';

const now = new Date()

const BussingDetails = () => {
    const { user } = useContext(UserContext) as IUserManager;
    const navigate = useNavigate();
    const [numberBussed, setNumberBussed] = useState<IBussing[]>([]);
    const [bussingTotal, setBussingTotal] = useState<number>(0);
    const [bussingImage, setBussingImage] = useState<File>();
    const [showDateSelector, setShowDateSelector] = useState<boolean>(false);
    const [date, setDate] = useState<Date>(now);
    const [bussingForm] = Form.useForm()
    
    const { data: bussingData, isLoading: bussingLoading } = useQuery<ServerResponse>(['bussing'], () => getBussing(user?.index_number as number));

    useEffect(() => {
        if (bussingData?.data) {
            const bussingDetails = bussingData.data?.data.map((bussing: IBussing) => {
                return bussing;
            });

            setNumberBussed(bussingDetails as IBussing[])
            setBussingTotal(bussingDetails.reduce((total: number, bussing: IBussing) => {
                return total + bussing.number_bussed
            }, 0));

        }
    }, [bussingData]);

    useEffect(() => {
        
        const dateStringDisplay = document.getElementById("date_string_display");
        if (dateStringDisplay) {
            dateStringDisplay.innerHTML = date.toDateString();
        }
        
    },[date])

    const { mutate, isLoading } = useMutation({
        mutationFn: async (bussingInfo: IBussingInfo) => {
            return await postNumberBussed({...bussingInfo, bussing_image: bussingImage}) //This hack is what is making me get access to the bussing Image after several hours
        },
        onSuccess: () => {

        },
        onError: (error: ResponseError) => {
            console.log(error)
        }
    });

    const onBussingEntryConfirm = async () => {
        const number_bussed = bussingForm.getFieldValue("number_bussed")
    
        mutate({
            date: date,
            number_bussed: number_bussed,
            index_number: user?.index_number,
            bussing_image: bussingImage
            } as IBussingInfo);
    }

    const loadImage = async (file: File) => {
        
        setBussingImage(file);
        
        return await {
            url: URL.createObjectURL(file),
          }
    }

    const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

    return (
        <>
           <NavBar onBack={() => navigate("/dashboard")} style={{'--height': '60px', backgroundColor: '#b12340', color:'white'}} > Bussing Detail </NavBar>
           
            <List header={'Bussing Total:' + bussingTotal}>
                {
                    numberBussed.map((bussing: IBussing) => 
                        <List.Item key={bussing.id} arrow={false} prefix={<CheckOutline style={{ color: 'green' }}/>} extra={'Attendance:'+bussing.number_bussed} onClick={() => {}} >
                            { getUserFriendlyDateFormat(bussing.date) }
                        </List.Item>
                    )
                }
            </List>
            <FloatingBubble
                style={{
                    '--initial-position-bottom': '24px',
                    '--initial-position-right': '24px',
                    '--edge-distance': '24px',
                    '--z-index': '10px'
                }}
               onClick={() => {
                Modal.show({
                    title: 'Enter Bussing Details',
                    closeOnAction: true,
                    onClose: () => {
                        setShowDateSelector(false)
                    },
                    actions: [{
                        key: 'saveBussingDetails',
                        text: 'Save',
                        primary: true
                    }],
                    onAction: () => {
                        console.log("SAVING")
                        onBussingEntryConfirm()
                    },
                    content: <>
                    <Form layout='horizontal' 
                        form={bussingForm}
                         >
                        <>
                            <Button
                                onClick={() => {
                                    setShowDateSelector(true)
                                }}
                                color='primary' fill='none'
                            >
                                Change Date
                            </Button>
                            <label id="date_string_display">{ date.toDateString() }</label>
                        </>
                        <Form.Item name='number_bussed' label='Number Bussed' childElementPosition='normal'
                            initialValue={0}
                            rules={[
                              {
                                min: 0,
                                type: 'number',
                              },
                            ]}
                        >
                            <Stepper />
                        </Form.Item>
                        <Form.Item name='bussing_image' label='Upload Picture'>
                            <ImageUploader
                                value={fileList}
                                onChange={setFileList}
                                maxCount={1}
                                upload={loadImage}
                                />
                        </Form.Item>
                        </Form>
                    </>,
                    showCloseButton: true,
                })
               }}
            >
                
            <AddOutline fontSize={32} />
        </FloatingBubble>
        <DatePicker
            title='Select Date'
            style={{zIndex: 20}}
            visible={showDateSelector}
            onClose={() => {
                setShowDateSelector(false)
            }}
            precision='day'
            onConfirm={val => {
                console.log(val as Date)
                setDate(val as Date)
            }}
        />
        </>
    )
}

export default BussingDetails;