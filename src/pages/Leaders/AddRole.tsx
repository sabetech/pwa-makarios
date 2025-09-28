import { Form, Button, Input } from "antd-mobile";
import MyNavBar from "../../components/Nav/NavBar";
import { TRole } from "../../types/user";
import { useAddRole } from "../../hooks/UserHooks";
const AddRole = () => {
    const [form] = Form.useForm();
    const { mutate: addRole, isLoading: isAdding, error } = useAddRole();

    const onFinish = (values: TRole) => {
        console.log("Form Values:", values);
        addRole(values);
    };

    return (<> 
        <MyNavBar currentPage="Add New Role" />
        <Form
                form={form}
                layout="horizontal"
                mode="card"
                onFinish={onFinish}
                footer={
                    <Button block type="submit" color="primary" loading={isAdding}>
                        Add Role
                    </Button>
                }
                style={{ marginTop: 60 }}
            >

            <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
                <Input placeholder="Enter role name" /> 
            </Form.Item>

            </Form>
    </>)
}

export default AddRole;