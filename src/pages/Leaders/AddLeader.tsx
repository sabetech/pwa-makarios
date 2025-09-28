import { TUser } from "../../types/user";
import { useState } from "react";
import { Form, Button, Input, Picker } from 'antd-mobile';
import { useAddUser, useGetRoles } from "../../hooks/UserHooks";
import MyNavBar from "../../components/Nav/NavBar";
import { PickerColumnItem, PickerValue } from "antd-mobile/es/components/picker-view";

const AddLeader = () => {
    const { mutate: addLeader, isLoading: isAdding, error } = useAddUser();
    const { isLoading: isLoadingRoles, data: roles } = useGetRoles();
    const [pickerVisible, setPickerVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<PickerValue[] | null>(null);
    const [form] = Form.useForm();
    
    const onFinish = (values: TUser) => {
        console.log("Form Values:", values);
        addLeader(values);
    };

    return (
        <>
        <MyNavBar currentPage="Add New Leader" />
            <Form
                form={form}
                layout="horizontal"
                mode="card"
                onFinish={onFinish}
                footer={
                    <Button block type="submit" color="primary" loading={isAdding}>
                        Add Leader
                    </Button>
                }
                style={{ marginTop: 60 }}
            >
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Input placeholder="Enter leader's name" />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input placeholder="Enter leader's email" />
                </Form.Item>
                <Form.Item name="roles" label="Role">
                    <Button block color="primary" fill="outline" size="large" onClick={() => setPickerVisible(true)}>
                       {selectedRole ? roles?.find(role => role.id === selectedRole[0])?.name : "Select Role"}
                    </Button>
                    <Picker
                        columns={roles ? [roles.map(role => ({ label: role.name, value: role.id } as PickerColumnItem))] : [[]]}
                        onConfirm={(value) => {
                            console.log("Selected Role:", value);
                            setPickerVisible(false); 
                            setSelectedRole(value);
                            form.setFieldValue('roles', value); // Set the selected role in the form
                        }}
                        onCancel={() => setPickerVisible(false)}
                        visible={pickerVisible}
                    />
                </Form.Item>
                
            </Form>
        </>
    );
}

export default AddLeader;