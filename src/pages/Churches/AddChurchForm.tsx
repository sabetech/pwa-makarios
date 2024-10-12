import { useState } from 'react';
import MyNavBar from "../../components/NavBar";
import { Form, Button, Input, ImageUploader } from 'antd-mobile';
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import { useAddChurch } from '../../hooks/ChurchHooks';
import { TChurchInfo } from '../../types/church';


const AddChurchform = () => {

    const [fileList, setFileList] = useState<ImageUploadItem[]>([])
    const {mutate:addChurch, isLoading: isAdding, error } = useAddChurch()

    const imgUpload = async (file: File) => {
        return {
            url: URL.createObjectURL(file),
          }
    }

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
        >
            <Form.Item name='name' label='Church Name'>
                <Input placeholder="Church Name" />
            </Form.Item>

            {/* <Form.Item name='location' label='Location'>
                <Input placeholder="Location" />
            </Form.Item> */}

            <Form.Item name='description' label='Description'>
                <Input placeholder="Description" />
            </Form.Item>

            {/* <Form.Item name='head_pastor' label='Head Pastor'>
                <Input placeholder="Bishop/Rev/Ps ..." />
            </Form.Item> */}

            {/* <Form.Item name='church_img' label='Church Image'>
            <ImageUploader
                value={fileList}
                onChange={setFileList}
                upload={imgUpload}
    />
            </Form.Item> */}

        </Form>

        </>
    )
}

export default AddChurchform