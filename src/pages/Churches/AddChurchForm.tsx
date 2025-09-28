import { useState } from 'react';
import MyNavBar from "../../components/Nav/NavBar";
import { Form, Button, Input, Picker } from 'antd-mobile';
import { useGetUsers } from '../../hooks/UserHooks';
import { useAddChurch } from '../../hooks/ChurchHooks';
import { TChurchInfo } from '../../types/church';


const AddChurchform = () => {

    const {mutate:addChurch, isLoading: isAdding, error } = useAddChurch()
    const {isLoading: isLoadingPastors, data: pastors} = useGetUsers({role: 'branch pastor'})
    
    const [pickerVisible, setPickerVisible] = useState(false)


    const onFinish = (values: TChurchInfo) => {
        
        addChurch(values)
    }

    return (
        <>
        <MyNavBar prevPage="directory/churches" currentPage="Add New Church" />
        <Form
            name='add-church-form'
            onFinish={onFinish}
            footer={
            <Button block type='submit' color='primary' size='large'>
                Add Church
            </Button>
            }
            style={{marginTop: 60}}
        >
            <Form.Item name='name' label='Church Name'>
                <Input placeholder="Church Name" />
            </Form.Item>

            <Form.Item name='description' label='Description'>
                <Input placeholder="Description" />
            </Form.Item>
            <Form.Item name="head_pastor" label="Head Pastor">
                <Button block color='primary' fill='outline' size='large' onClick={() => {
                        setPickerVisible(true)
                    }}
                    style={{marginRight: 20, marginLeft: 10, width: '50%'}}
                    >
                        Select Head Pastor
                    </Button>
            </Form.Item>
            <Picker 
                columns={[
                    ['Pastor 1', 'Pastor 2', 'Pastor 3']
                ]}
                onConfirm={v => {
                    console.log(v)
                    setPickerVisible(false)
                }}
                onCancel={() => setPickerVisible(false)}
                visible={pickerVisible}
            />
        </Form>

        </>
    )
}

export default AddChurchform