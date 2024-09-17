import { useState, RefObject, useContext } from 'react';
import { Form, Button, DatePicker, Stepper, ImageUploader, Input, Dialog, Toast } from 'antd-mobile'
import MyNavBar from '../../components/NavBar';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker'
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'
import { FellowshipServiceFormFields } from '../../types/fellowshipFormFields'
import { useMutation } from 'react-query';
import { ResponseError } from '../../interfaces/ServerResponse'
import { postFellowshipService } from '../../services/FellowshipService'
import { UserContext } from '../../contexts/UserContext';
import { IUserManager } from '../../interfaces/ServerResponse';

const now = new Date()
const FellowshipServiceForm = () => {
    const navigate = useNavigate();
    const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
    const [fellowshipImage, setFellowshipImage] = useState<File>();
    const [fellowshipservice] = Form.useForm()
    const { user, storeUser } = useContext(UserContext) as IUserManager;

    const {  mutate: saveFellowshipForm, isLoading } = useMutation({
        mutationFn: async (fellowshipServiceFields: FellowshipServiceFormFields) => {
            return await postFellowshipService(user?.id as number, fellowshipServiceFields)
        },
        onSuccess: (data) => {
            Toast.show({
                content: 'Service form Filled Successfully',
                duration: 1000,
                icon: 'success',
                position: 'top'
            })
            navigate("/fellowship");
        },
        onError: (error: ResponseError) => {
            console.log(error)
        }
    });

    const onFormSubmit = (fellowshipServiceFields: any) => {
        // console.log("FELLOWSHIP SERVICE FEIELDS::", fellowshipServiceFields)
        if ((fellowshipServiceFields.fellowship_service_image == null) || (typeof fellowshipServiceFields.fellowship_service_image === 'undefined')) {
            Dialog.alert({
                content: 'Image is not uploaded. Kindly upload an image from your device!',
                closeOnMaskClick: true,
                confirmText: 'OK'
            });
            return
        } 

        fellowshipServiceFields = {...fellowshipServiceFields, service_date: dayjs(fellowshipServiceFields.service_date).format("YYYY-MM-DD"), fellowship_service_image: fellowshipImage}

        saveFellowshipForm(fellowshipServiceFields as FellowshipServiceFormFields)
    }

    const loadImage = async (file: File) => {
        
        setFellowshipImage(file);
        
        return await {
            url: URL.createObjectURL(file),
          }
    }

    return (
        <>
           <MyNavBar prevPage={"fellowship"} currentPage={"Fellowship Service Form"} />           
           <Form
                form={fellowshipservice}
                layout='horizontal'
                footer={
                    <Button block type='submit' color='primary' size='large' loading={isLoading}>
                        Submit
                    </Button>
                }
                onFinish={onFormSubmit}
                initialValues={{
                    service_date: new Date(),
                    attendance: 0,
                    offering: 0,
                    foreign_offering: 0
                }}
            >               
                <Form.Item
                    name='service_date'
                    label='Service Date'
                    trigger='onConfirm'
                    onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
                        datePickerRef.current?.open()
                    }}
                    >
                    <DatePicker>
                        {value =>
                        value ? dayjs(value).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
                        }
                    </DatePicker>
                </Form.Item>
                <Form.Item name='attendance' label='Attendance' childElementPosition='normal'
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
                <Form.Item
                    name='offering'
                    label='Offering (GHC)'
                    rules={[{ required: true, message: 'Enter your Offering here!' }]}
                >
                    <Input  placeholder={'60.00'}  />
                </Form.Item>
                <Form.Item
                    name='foreign_offering'
                    label='Offering (Foreign Currency)'
                    rules={[{ required: false}]}
                >
                    <Input placeholder='60.00' />
                </Form.Item>
                <Form.Item name='fellowship_service_image' label='Upload Service Picture'>
                    <ImageUploader
                        value={fileList}
                        onChange={setFileList}
                        maxCount={1}
                        upload={loadImage}
                        />
                </Form.Item>
                
            </Form>
        </>
        );
}
    
export default FellowshipServiceForm