import { useState } from 'react'
import { Form, Button, DatePicker, Stepper, Input, Picker, Toast, Tag } from 'antd-mobile'
import { AddCircleOutline, MinusCircleOutline } from 'antd-mobile-icons'
import MyNavBar from '../../../components/NavBar'
import dayjs from "dayjs";
import UploadComponent from '../../../components/UploadImage';
import { useParams } from 'react-router-dom';
import { useAddService, useGetServiceTypes } from '../../../hooks/ServiceHooks';
import { PickerColumnItem, PickerValue } from 'antd-mobile/es/components/picker-view';
import { TServiceType } from '../../../types/service';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../../hooks/AuthHooks';
import { useGetBacentas } from '../../../hooks/BacentaHooks';
import { TBacenta } from '../../../types/bacenta';
import { useGetZones } from '../../../hooks/Zones';
import { useGetRegions } from '../../../hooks/RegionHooks';
import { TZone } from '../../../types/zone';
import { TRegion } from '../../../types/Region';


const startDate = dayjs('01-01-2000', 'DD-MM-YYYY'); // Using a custom date format
const calendarDefault = startDate.toDate();
const ParentForm: React.FC = () => {
    const [showDateSelector, setShowDateSelector] = useState(false)
    const [date, setDate] = useState<Date>(calendarDefault);
    const [selectedServiceType , setSelectedServiceType] = useState<PickerValue[]>([]);
    const [selectedSubjectaId, setSelectedSubjectId] = useState<PickerValue[]>([])

    const [form] = Form.useForm()
    const navigate = useNavigate();

    const { stream_id } = useParams();
    const { data:serviceTypes } = useGetServiceTypes();
    const {data: bacentas} = useGetBacentas();
    const {data: zones} = useGetZones();
    const {data: regions} = useGetRegions();
    let serviceTypeData = new Map()
    serviceTypes?.forEach((serviceType) => {
        switch (serviceType.service_type) {
 
            case 'Bacenta Service':
                serviceTypeData.set(serviceType.id, {
                    data: bacentas,
                    label: 'Select Bacenta',
                    field: 'bacenta_id',
                    subject: 'Bacenta'
                });
                break;
            case 'Joint Bacenta Service (Zonal Service)':
                serviceTypeData.set(serviceType.id, {
                    data: zones,
                    label: 'Select Zone',
                    field: 'zone_id',
                    subject: 'Zone'
                });
                break;
            case 'Joint Zonal Service (Regional Service)':
                serviceTypeData.set(serviceType.id,{
                    data: regions,
                    label: 'Select Region',
                    field: 'region_id',
                    subject: 'Region'
                });
                break;
        }
       
    })

    
    const {mutate: addService, isLoading: isAdding, isSuccess } = useAddService();
    const user = useAuthUser()();

    const onFinish = (values: any) => {
        console.log('values', values)

        if (!validateForm(values)) {
            return;
        }

        let treasures = [];
        if (values.treasurers) {
            treasures = values.treasurers.map((treasurer: any) => treasurer.name)
        }

        values.date = dayjs(date).format('YYYY-MM-DD')
        values.treasurers = treasures;
        if (values.service_type == undefined) {
            values.service_type = serviceTypes?.find((sv: TServiceType) => sv.service_type === "Stream Service")?.id;
        }

        if (values.service_type == 7) {
            values.stream_id = stream_id;
        }

        addService(values)

    }

    if (isSuccess) {
        Toast.show({
            content: 'Service Form Filled Successfully',
        });
        navigate("/services");
    }

    const validateForm = (values: any) => {

        //treasurers must be at least 2
        if (values.treasurers == undefined || values.treasurers.length < 2) {
            Toast.show({content: 'Please add at least 2 treasurers', icon: 'fail'})
            return false;
        }

        //validate service image
        if (!values.service_image) {
            Toast.show({content: 'Please add a service image', icon: 'fail'})
            return false;
        }

        if (!values.treasurers_picture) {
            Toast.show({content: 'Please add a treasurers picture', icon: 'fail'})
            return false;
        }

        return true
    }

    console.log("selected Subject ID::", selectedServiceType[0])

    console.log("List values for ",serviceTypeData.get(selectedServiceType[0])?.subject, "::", serviceTypeData.get(selectedServiceType[0])?.data)

    console.log("What valu eis this::", selectedSubjectaId[0], "::", serviceTypeData.get(selectedServiceType[0])?.data?.find((item: any) => item.id === selectedSubjectaId[0])?.name)
    
    return (
        <>
        <MyNavBar prevPage='' currentPage='Form' />
            <Form
                form={form}
                footer={
                    <Button block type='submit' color='primary' size='large' loading={isAdding}>
                      Submit
                    </Button>
                  }
                onFinish={onFinish}
            >
                {
                    <Tag color='warning'>You are filling as a { user.roles[0].name }</Tag>
                }

                <Form.Item
                    label='Service Date'
                    rules={[{ required: true, message: 'Please select Service date' }]}
                >
                    <Button onClick={() => setShowDateSelector(true)} fill={'none'} style={{color: 'brown'}}>{dayjs(date).format('ddd, DD-MMM-YYYY')}</Button>
                    <DatePicker
                        title='Choose Date (Year-Month-Day)'
                        style={{zIndex: 20}}
                        visible={showDateSelector}
                        onClose={() => {
                            setShowDateSelector(false)
                        }}
                        precision='day'
                        onConfirm={val => {
                            setDate(val as Date)
                        }}
                        defaultValue={date}
                        min={(dayjs().subtract(1, 'year')).toDate()}
                        max={(dayjs().add(0, 'year')).toDate()}
                    />
                </Form.Item>
                
                {
                    stream_id === 'weekday' &&
                    (<Form.Item
                        name='service_type'
                        label='Service Type'
                        rules={[{ required: true, message: 'Please select Service Type' }]}
                    >
                        <Button
                            onClick={async () => {
                                const value = await Picker.prompt({
                                confirmText: 'OK',
                                cancelText: 'Cancel',
                                columns: [ (serviceTypes && serviceTypes?.map((serviceType: TServiceType) => (
                                        {
                                            label: serviceType.service_type,
                                            value: serviceType.id
                                        } as PickerColumnItem
                                    )
                                )) ?? []
                                ] });
                                
                                setSelectedServiceType(value ?? [])
                                form.setFieldValue('service_type', value)

                            }}
                            fill='outline'
                            color='primary'
                            >
                            {selectedServiceType.length > 0 ? serviceTypes?.find((sv) => sv.id === selectedServiceType[0])?.service_type : 'Choose Service Type'}
                        </Button>
                    </Form.Item>) 
                    
                } 
                { /*Find a better solution to this */
                    (selectedServiceType[0] === 3 || selectedServiceType[0] === 4 || selectedServiceType[0] === 5) && 
                    <Form.Item
                        name={serviceTypeData.get(selectedServiceType[0])?.field}
                        label={serviceTypeData.get(selectedServiceType[0])?.label}
                        rules={[{ required: true, message: `Please ${serviceTypeData.get(selectedServiceType[0])?.label}` }]}
                    >
                        <Button
                            onClick={async () => {
                                const value = await Picker.prompt({
                                confirmText: 'OK',
                                cancelText: 'Cancel',
                                columns: [ (serviceTypeData.get(selectedServiceType[0])?.data && serviceTypeData.get(selectedServiceType[0])?.data?.map((serviceEntity: TBacenta | TRegion | TZone) => (
                                    {
                                        label: serviceEntity.name,
                                        value: serviceEntity.id
                                    } 
                                ))) ?? []
                                ]});
                                
                                setSelectedSubjectId(value ?? [])
                                form.setFieldValue(serviceTypeData.get(selectedServiceType[0])?.field, value)
                                console.log("Field: ", serviceTypeData.get(selectedServiceType[0])?.field, "Value: ", value)

                            }}
                            fill='outline'
                            color='primary'
                            >
                            {selectedSubjectaId.length > 0 ? serviceTypeData.get(selectedServiceType[0])?.data?.find((item: any) => item.id === selectedSubjectaId[0])?.name : `Select Your ${serviceTypeData.get(selectedServiceType[0])?.subject}`}
                        </Button>
                    </Form.Item>
                }
                <Form.Item
                    name='attendance'
                    label='Attendance'
                    rules={[{ required: true, message: 'Please enter attendance' }]}
                >
                    <Stepper 
                        min={0}
                    />
                </Form.Item>
                <Form.Item
                    name='offering'
                    label='Offering'
                    rules={[{ required: true, message: 'Please enter offering' }]}
                >
                    <Input placeholder="0.00" />
                </Form.Item>
                
                <Form.Item
                    name='foreign_currency'
                    label='Foreign Currency'
                >
                    <Input placeholder="0.00" />
                </Form.Item>

                <Form.Array
                    name='treasurers'
                    onAdd={operation => operation.add({ name: '' })}
                    renderAdd={() => (
                        <span>
                        <AddCircleOutline />Add treasurer
                        </span>
                    )}
                    renderHeader={({ index }, { remove }) => (
                        <>
                        <span>Treasurer {index + 1}</span>
                        <a onClick={() => remove(index)} style={{ float: 'right' }}>
                            <MinusCircleOutline />
                        </a>
                        </>
                    )}
                    >
                    {fields =>
                        fields.map(({ index }) => (
                        <>
                            <Form.Item
                            name={[index, 'name']}
                            label='Treasurer Name'
                            rules={[{ required: true, message: 'input name' }]}
                            >
                            <Input placeholder='Name Goes here' />
                            </Form.Item>
                        </>
                        ))
                    }
                </Form.Array>
                <Form.Item
                    name='treasurers_picture'
                    label='Treasurers Picture'
                >
                <UploadComponent 
                    onImageLoaded={(file) => {
                        form.setFieldValue('treasurers_picture', file)
                    }}
                    filename='treasurers_picture'
                    defaultImageUrl='/404'
                />
                </Form.Item>
                <Form.Item
                    name='service_image'
                    label='Service Image'
                >
                <UploadComponent 
                    onImageLoaded={(file) => {
                        form.setFieldValue('service_image', file)
                    }}
                    filename='service_image'
                    defaultImageUrl='/404'
                />
                </Form.Item>

            </Form>
        </>
    )
}

export default ParentForm;