import { useState } from 'react';
import MyNavBar from "../../components/Nav/NavBar";
import { Button, CascadePicker, Form, Input, Picker, Toast } from "antd-mobile";
import { useGetStreamsAndRegions } from "../../hooks/StreamHooks";
import { PickerColumnItem } from 'antd-mobile/es/components/picker-view';
import Autocomplete from '../../components/Autocomplete';
import { useGetUsers } from '../../hooks/UserHooks';
import { useAddMicrochurch } from '../../hooks/MicroChurchesHooks';
import { useNavigate } from 'react-router-dom';

const AddMicrochurch = () => {

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const { data: streamRegionOptions, isLoading: loadingStreams } = useGetStreamsAndRegions();
    const {data: leaders} = useGetUsers();
    const [selectedStreamAndRegion, setSelectedStreamAndRegion] = useState<(PickerColumnItem | null)[]>([]);
    const { mutate: addMicrochurch, isLoading, isSuccess } = useAddMicrochurch();
    const navigate = useNavigate();

    console.log("Stream and Region Options:", streamRegionOptions);

    const onFinish = (values: any) => {
        console.log("Form values:", values);
        
        // Handle form submission logic here
        addMicrochurch(values)
    };

    if (isSuccess) {
        Toast.show({
            content: 'Microchurch added successfully',
            position: 'bottom',
            duration: 2000,
        });
        
        navigate(-1);
    }

    return (<>
        <MyNavBar currentPage="Add Microchurch" />
        <Form
            layout="horizontal"
            mode="card"
            form={form}
            style={{ padding: '20px', marginTop: '60px' }}
            footer={
                <Button block color="primary" type="submit" loading={isLoading}>
                    Submit
                </Button>
            }
            onFinish={(values) => {
               onFinish(values);
            }}
        >
            <Form.Item name="name" label="Microchurch Name" rules={[{ required: true, message: 'Please enter the microchurch name' }]}>
                <Input placeholder="Enter microchurch name" />
            </Form.Item>
            <Form.Item name="stream_and_region" label="Choose Stream and Region">
                <Button onClick={() => setVisible(true)} fill='outline' color="primary" loading={loadingStreams}>
                    {
                        selectedStreamAndRegion.length > 0
                            ? `${selectedStreamAndRegion.map(item => item?.label).join(':- ')}`
                            : 'Select Stream and Region' // Default text when no selection
                    }
                </Button>
                <CascadePicker 
                    title="Select Stream and Region"
                    options={
                        streamRegionOptions ? streamRegionOptions.map((streamRegion: any) => ({
                            label: streamRegion.name,
                            value: streamRegion.id,
                            children: streamRegion.regions.map((region: any) => ({
                                label: region.name,
                                value: region.id,
                            }))
                        })) : []
                    }
                    visible={visible}
                    onClose={() => {
                        setVisible(false)
                    }}
                    onConfirm={(val, extend) => {
                        console.log('onConfirm', val, extend.items)
                        setSelectedStreamAndRegion(extend.items)
                        form.setFieldValue('stream_and_region', val);
                        setVisible(false);
                    }}
                    onSelect={val => {
                        console.log('onSelect', val)
                    }}
                />
            </Form.Item>
            <Form.Item name="leader" label="Leader" rules={[{ required: true, message: 'Please enter the leader name' }]}>
                <Autocomplete
                    placeholder="Search for a leader"
                    items={
                        (leaders ?? []).length > 0
                            ? (leaders ?? [])
                                .filter(user => user.id !== undefined && user.name !== undefined)
                                .map(user => ({
                                    id: user.id as string | number,
                                    name: user.name
                                }))
                            : []
                    }
                    onItemSelected={(val) => {
                        form.setFieldValue('leader', val); // Clear the field after selection
                        
                    }}
                />
            </Form.Item>
            
        </Form>
    </>
    )
}

export default AddMicrochurch;