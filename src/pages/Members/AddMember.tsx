import { Form, Button, Input } from "antd-mobile"

import MyNavBar from "../../components/NavBar"

const AddMember = () => {
    const [form] = Form.useForm()

    const onFinish = () => {
        console.log('form', form.getFieldsValue())
    }

    return (
        <>
            {/* Handle back navigation properly */}
            <MyNavBar prevPage="members" currentPage="Add Member" />
            <Form
                 form={form}
                 onFinish={onFinish}
                 footer={
                    <Button block type='submit' color='primary' size='large'>
                      Save
                    </Button>
                  }
            >
                <Form.Header>Save Member</Form.Header>
                <Form.Item
                    name='name'
                    label='Member Name'
                >
                    <Input placeholder="Member Name" />
                </Form.Item>

                <Form.Item
                    name='phone'
                    label='Member Phone'
                >
                    <Input placeholder="Member Phone" />
                </Form.Item>

                <Form.Item
                    name='email'
                    label='Member Email'
                >
                    <Input placeholder="Member Email" />
                </Form.Item>

            </Form>
        </>
    )
}

export default AddMember