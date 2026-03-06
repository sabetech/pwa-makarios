import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Form,
    Input,
    Button,
    DatePicker,
    Selector,
    Picker,
    TextArea,
    Toast,
    Space
} from 'antd-mobile';
import { FiCamera, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import './AddMember.css';

const AddMember: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [image, setImage] = useState<string | null>(null);
    const [dateVisible, setDateVisible] = useState(false);
    const [bacentaVisible, setBacentaVisible] = useState(false);
    const [basontaVisible, setBasontaVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock data for dropdowns
    const bacentas = [
        [
            { label: 'Bacenta A', value: 'bacenta-a' },
            { label: 'Bacenta B', value: 'bacenta-b' },
            { label: 'Bacenta C', value: 'bacenta-c' },
        ]
    ];

    const basontas = [
        [
            { label: 'Basonta X', value: 'basonta-x' },
            { label: 'Basonta Y', value: 'basonta-y' },
            { label: 'Basonta Z', value: 'basonta-z' },
        ]
    ];

    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
    ];

    const maritalStatusOptions = [
        { label: 'Single', value: 'single' },
        { label: 'Married', value: 'married' },
        { label: 'Divorced', value: 'divorced' },
        { label: 'Widowed', value: 'widowed' },
    ];

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        Toast.show({
            content: 'Member added successfully (Mock)',
            position: 'bottom',
        });
        setTimeout(() => navigate('/dashboard/members'), 1500);
    };

    const handleGetLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                form.setFieldsValue({
                    gps_location: `${position.coords.latitude}, ${position.coords.longitude}`
                });
                Toast.show('Location updated');
            }, (error) => {
                Toast.show('Error getting location: ' + error.message);
            });
        } else {
            Toast.show('Geolocation not supported');
        }
    };

    const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="add-member-page">
            <PageHeader title="Add New Member" />

            <div className="add-member-content">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    footer={
                        <Button block type="submit" color="primary" size="large" className="submit-btn">
                            Save Member
                        </Button>
                    }
                    className="add-member-form"
                >
                    <div className="picture-upload-section">
                        <div className="picture-preview" onClick={() => fileInputRef.current?.click()}>
                            {image ? (
                                <img src={image} alt="Preview" />
                            ) : (
                                <div className="placeholder">
                                    <FiCamera size={32} />
                                    <span>Capture Selfie / Upload Image</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleCapture}
                        />
                        <Form.Item name="picture" hidden rules={[{ required: true, message: 'Picture is required' }]}>
                            <Input />
                        </Form.Item>
                    </div>

                    <Form.Header>Personal Information</Form.Header>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter full name" />
                    </Form.Item>

                    <Space block direction="horizontal">
                        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                            <Input placeholder="Phone number" />
                        </Form.Item>
                        <Form.Item name="whatsapp" label="WhatsApp">
                            <Input placeholder="WhatsApp number" />
                        </Form.Item>
                    </Space>

                    <Form.Item name="email" label="Email">
                        <Input placeholder="Email address" />
                    </Form.Item>

                    <Form.Item
                        name="dob"
                        label="Date of Birth"
                        trigger="onConfirm"
                        onClick={() => setDateVisible(true)}
                    >
                        <DatePicker
                            visible={dateVisible}
                            onClose={() => setDateVisible(false)}
                            defaultDate={new Date('2000-01-01')}
                            onConfirm={(val) => {
                                setDateVisible(false);
                            }}
                        >
                            {value => value ? value.toDateString() : <span style={{ color: '#94a3b8' }}>Select date</span>}
                        </DatePicker>
                    </Form.Item>

                    <Form.Item name="gender" label="Gender">
                        <Selector
                            options={genderOptions}
                            columns={2}
                        />
                    </Form.Item>

                    <Form.Item name="marital_status" label="Marital Status">
                        <Selector
                            options={maritalStatusOptions}
                            columns={2}
                        />
                    </Form.Item>

                    <Form.Item name="occupation" label="Occupation">
                        <Input placeholder="Enter occupation" />
                    </Form.Item>

                    <Form.Header>Affiliation & Location</Form.Header>
                    <Form.Item name="address" label="Address (Optional)">
                        <TextArea placeholder="Enter residential address" autoSize={{ minRows: 2 }} />
                    </Form.Item>

                    <Form.Item name="gps_location" label="GPS Location (Optional)" extra={
                        <Button size="small" color="primary" fill="outline" onClick={(e) => {
                            e.stopPropagation();
                            handleGetLocation();
                        }}>
                            <FiMapPin size={14} style={{ marginRight: 4 }} /> Get Current
                        </Button>
                    }>
                        <Input placeholder="Latitude, Longitude" />
                    </Form.Item>

                    <Form.Item
                        name="bacenta"
                        label="Select Bacenta"
                        trigger="onConfirm"
                        onClick={() => setBacentaVisible(true)}
                    >
                        <Picker
                            columns={bacentas}
                            visible={bacentaVisible}
                            onClose={() => setBacentaVisible(false)}
                            onConfirm={() => setBacentaVisible(false)}
                        >
                            {value => value[0] ? value[0].label : <span style={{ color: '#94a3b8' }}>Select Bacenta</span>}
                        </Picker>
                    </Form.Item>

                    <Form.Item
                        name="basonta"
                        label="Basonta"
                        trigger="onConfirm"
                        onClick={() => setBasontaVisible(true)}
                    >
                        <Picker
                            columns={basontas}
                            visible={basontaVisible}
                            onClose={() => setBasontaVisible(false)}
                            onConfirm={() => setBasontaVisible(false)}
                        >
                            {value => value[0] ? value[0].label : <span style={{ color: '#94a3b8' }}>Select Basonta</span>}
                        </Picker>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AddMember;
