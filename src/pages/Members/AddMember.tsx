import { useState } from "react"
import { Form, Button, Input, Radio, Space, Divider, TextArea, DatePicker, Toast } from "antd-mobile"
import CurrentLocation from "../../components/CurrentLocation"
import { Coordinates } from "../../types/location";

import MyNavBar from "../../components/NavBar";
import Autocomplete from "../../components/Autocomplete";
import dayjs from "dayjs";
import { useGetBacentas } from "../../hooks/BacentaHooks";
import { useGetBasontas } from "../../hooks/BasontaHooks";
import UploadComponent from "../../components/UploadImage";
import { useAddMember } from "../../hooks/MemberHooks";
import { useNavigate } from "react-router-dom";


const startDate = dayjs('01-01-2000', 'DD-MM-YYYY'); // Using a custom date format
const calendarDefault = startDate.toDate();
const AddMember = () => {
    const [form] = Form.useForm()
    const [showDateSelector, setShowDateSelector] = useState(false)
    const [date, setDate] = useState<Date>(calendarDefault);
    const [bacenta, setBacenta] = useState({});
    const [basonta, setBasonta] = useState({});
    const [location, setLocation] = useState<Coordinates>({ lat: null, lng: null });
    const [memberName, setMemberName] = useState("");
    const [picture, setPicture] = useState<File>();
    const navigate = useNavigate()

    const { data:bacentas } = useGetBacentas();
    const { data: basontas } = useGetBasontas();

    const {mutate: addMember, isLoading: isAdding, isSuccess } = useAddMember()

    const onFinish = (_values: any) => {
        console.log('form', form.getFieldsValue())
        console.log('values', _values)
        
        if (!bacenta || !basonta) {
            return Toast.show({
                content: 'Please select a bacenta and basonta',
                duration: 4000,
                icon: 'fail',
                position: 'top'
            })
        }

        if (!picture) {
            return Toast.show({
                content: 'Please select a picture',
                duration: 4000,
                icon: 'fail',
                position: 'top'
            })
        }

        const request = {
            ..._values,
            date_of_birth: dayjs(date).format("YYYY-MM-DD"),
            bacenta_id: (bacenta as any).id,
            basonta_id: (basonta as any).id,
            location: location.lat ? `${location.lat}, ${location.lng}` : "",
            picture: picture
        }

        console.log("Save member request ::", request)

        addMember(request)
    }

    if (isSuccess) {
        Toast.show({
            content: 'Member Added Successfully',
        });
        navigate("/directory/members");
    }

    return (
        <>
            {/* Handle back navigation properly */}
            <MyNavBar prevPage="members" currentPage="Add Member" />
            <Form
                 form={form}
                 onFinish={onFinish}
                 footer={
                    <Button block type='submit' color='primary' size='large' loading={isAdding}>
                      Save
                    </Button>
                  }
            >
                <Form.Header>Register A New Member</Form.Header>
                <Form.Item
                    name='member_name'
                    label='Member Name'
                    rules={[{ required: true, message: 'Please enter member name' }]}
                >
                    <Input placeholder="Adwoa Oluwaseun" onChange={(val) => setMemberName(val)}/>
                </Form.Item>

                <Form.Item
                    name='phone'
                    label='Member Phone'
                >
                    <Input placeholder="+233541231123" />
                </Form.Item>
                <Form.Item
                    name='whatsapp'
                    label='Member Whatsapp Number'
                >
                    <Input placeholder="+233541231123" />
                </Form.Item>

                <Form.Item
                    name='email'
                    label='Member Email'
                >
                    <Input placeholder="adwoamansah@mail.com" />
                </Form.Item>
                <Form.Item
                    label='Date of Birth'
                    rules={[{ required: true, message: 'Please select date of birth' }]}
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
                        max={(dayjs().subtract(5, 'year')).toDate()}
                        min={(dayjs().subtract(80, 'year')).toDate()}
                    />
                </Form.Item>
                <Form.Item
                    name='gender'
                    label='Gender'
                >
                    <Radio.Group>
                        <Space direction='vertical'>
                            <Radio value='male'>Male</Radio>
                            <Radio value='female'>Female</Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name='marital_status'
                    label='Marital Status'
                >
                    <Radio.Group>
                        <Space direction='vertical'>
                            <Radio value='married'>Married</Radio>
                            <Radio value='single'>Single</Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name='occupation'
                    label='Occupation'
                    rules={[{ required: true, message: 'Please enter member occupation' }]}
                >
                    <Input placeholder="Student" />
                </Form.Item>
                <Form.Item
                    name='address'
                    label='Address'
                >
                    <TextArea placeholder="Summit Close 4, Effia Anaji, Takoradi" />
                </Form.Item>

                <Form.Item
                    label='GPS Location (You have to where the member lives)'
                >   
                    <CurrentLocation onLocationChange={setLocation} />
                </Form.Item>
                
                <Divider />

                <Form.Item
                    
                    label='Select Fellowship'
                    rules={[{ required: true, message: 'Please select Fellowhip!' }]}
                >
                    <Autocomplete
                        items={bacentas ? bacentas.map((bacenta) => ({ id: bacenta.id, name: bacenta.name })): []}
                        onItemSelected={(item) => {
                                setBacenta(item)
                            }}
                        placeholder="Select Fellowship"
                    />
                    <Input value="fellowshp" type={"hidden"} />
                </Form.Item>
                <Form.Item
                    
                    label="Basonta"
                    rules={[{ required: true, message: 'Please select your basonta!' }]}
                >
                    <Autocomplete
                        items={basontas ? basontas.map((basonta) => ({ id: basonta.id, name: basonta.name })): []}
                        onItemSelected={(item) => {
                                setBasonta(item)
                            }}
                        placeholder="Select Basonta"
                    />
                    
                </Form.Item>
                
                <Form.Item
                    label='Upload Picture'
                >
                <UploadComponent onImageLoaded={setPicture} filename={memberName} />
                </Form.Item>

            </Form>
        </>
    )
}

export default AddMember