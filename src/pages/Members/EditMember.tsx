import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Form,
    Input,
    Button,
    DatePicker,
    Selector,
    Picker,
    TextArea,
    Toast,
    Space,
    DotLoading
} from 'antd-mobile';
import { FiMapPin } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader/PageHeader';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { useMember } from '../../hooks/useMembers';
import { useUpdateMember } from '../../hooks/useUpdateMember';
import api from '../../api/axios';
import './EditMember.css';

const EditMember: React.FC = () => {
    const { id = '' } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { data: member, isLoading } = useMember(id);
    const updateMutation = useUpdateMember();
    
    const [image, setImage] = useState<string | null>(null);
    const [dateVisible, setDateVisible] = useState(false);
    const [bacentaVisible, setBacentaVisible] = useState(false);
    const [basontaVisible, setBasontaVisible] = useState(false);
    const [bacentas, setBacentas] = useState<any[][]>([[]]);
    const [basontas, setBasontas] = useState<any[][]>([[]]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [bacentasRes, basontasRes] = await Promise.all([
                    api.get('/v2/bacentas'),
                    api.get('/v2/basontas').catch(() => ({ data: { data: [] } }))
                ]);

                if (bacentasRes.data?.data) {
                    setBacentas([bacentasRes.data.data.map((b: any) => ({ label: b.name, value: String(b.id) }))]);
                }

                if (basontasRes.data?.data) {
                    setBasontas([basontasRes.data.data.map((b: any) => ({ label: b.name, value: String(b.id) }))]);
                }
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };
        fetchDropdownData();
    }, []);

    useEffect(() => {
        if (member) {
            const bacentaVal = member.bacenta 
                ? (typeof member.bacenta === 'object' ? String((member.bacenta as any).id) : String(member.bacenta))
                : undefined;
            const basontaVal = member.basonta 
                ? (typeof member.basonta === 'object' ? String((member.basonta as any).id) : String(member.basonta))
                : undefined;
            form.setFieldsValue({
                ...member,
                dob: member.dob ? new Date(member.dob) : undefined,
                picture: member.img_url,
                bacenta: bacentaVal ? [bacentaVal] : undefined,
                basonta: basontaVal ? [basontaVal] : undefined
            });
            setImage(member.img_url);
        }
    }, [member, form]);

    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];

    const maritalStatusOptions = [
        { label: 'Single', value: 'Single' },
        { label: 'Married', value: 'Married' },
        { label: 'Divorced', value: 'Divorced' },
        { label: 'Widowed', value: 'Widowed' },
    ];

    const onFinish = (values: any) => {
        const formattedValues = {
            ...values,
            dob: values.dob ? values.dob.toISOString().split('T')[0] : null,
            img_url: image,
            bacenta: Array.isArray(values.bacenta) ? values.bacenta[0] : values.bacenta,
            basonta: Array.isArray(values.basonta) ? values.basonta[0] : values.basonta
        };

        updateMutation.mutate({ id, data: formattedValues }, {
            onSuccess: () => {
                Toast.show({
                    icon: 'success',
                    content: 'Member updated successfully',
                    position: 'bottom',
                });
                setTimeout(() => navigate(`/dashboard/members/${id}`), 1000);
            },
            onError: (error) => {
                Toast.show({
                    icon: 'fail',
                    content: 'Failed to update member',
                });
            }
        });
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

    if (isLoading) {
        return (
            <div className="edit-member-page">
                <PageHeader title="Loading Member..." />
                <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                    <DotLoading color='primary' />
                </div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="edit-member-page">
                <PageHeader title="Member Not Found" />
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>The member protocol could not be found.</p>
                    <Button color="primary" onClick={() => navigate('/dashboard/members')}>Back to Members</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-member-page">
            <PageHeader title="Edit Member Profile" />

            <div className="edit-member-content">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    footer={
                        <Button 
                            block 
                            type="submit" 
                            color="primary" 
                            size="large" 
                            className="submit-btn"
                            loading={updateMutation.isLoading}
                        >
                            Save Changes
                        </Button>
                    }
                    className="edit-member-form"
                >
                    <div className="picture-upload-section">
                        <ImageUpload
                            label="Profile Photo"
                            value={image || ''}
                            onChange={(imageData: string) => {
                                setImage(imageData);
                                form.setFieldsValue({ picture: imageData });
                            }}
                            preferCamera={true}
                        />
                        <Form.Item name="picture" hidden>
                            <Input />
                        </Form.Item>
                    </div>

                    <Form.Header>Personal Information</Form.Header>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter full name" />
                    </Form.Item>

                    <Space block direction="horizontal">
                        <Form.Item name="phone" label="Phone" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <Input placeholder="Phone number" />
                        </Form.Item>
                        <Form.Item name="whatsapp" label="WhatsApp" style={{ flex: 1 }}>
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
                            onConfirm={(val) => {
                                setDateVisible(false);
                            }}
                        >
                            {value => {
                                if (value instanceof Date) {
                                  return value.toDateString();
                                }
                                return <span style={{ color: '#94a3b8' }}>Select date</span>;
                            }}
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
                            {value => {
                                if (Array.isArray(value) && value.length > 0 && value[0] !== null) {
                                    const item = value[0] as any;
                                    const selected = bacentas[0]?.find(b => b.value === String(item));
                                    return selected ? selected.label : String(item);
                                }
                                return <span style={{ color: '#94a3b8' }}>Select Bacenta</span>;
                            }}
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
                            {value => {
                                if (Array.isArray(value) && value.length > 0 && value[0] !== null) {
                                    const item = value[0] as any;
                                    const selected = basontas[0]?.find(b => b.value === String(item));
                                    return selected ? selected.label : String(item);
                                }
                                return <span style={{ color: '#94a3b8' }}>Select Basonta</span>;
                            }}
                        </Picker>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default EditMember;
