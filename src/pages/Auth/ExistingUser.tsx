import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { IUserManager, ResponseError } from '../../interfaces/ServerResponse';
import { AutoCenter, Input, Form, Button, Toast } from 'antd-mobile'
import { useMutation } from 'react-query';
import { authenticateStudent } from '../../services/UserManagement';
import * as ResponseCodes from '../../constants/ResponseStatusCodes';

import { useNavigate } from 'react-router-dom';

interface loginProps {
    indexNumber: number;
    passcode: string;
}

const ExistingUser = () => {
    const [passcode, setPasscode] = useState<string>('');
    const navigate = useNavigate();
    
    const { user } = useContext(UserContext) as IUserManager;
    const { mutate, isLoading } = useMutation({
        mutationFn: async ({indexNumber, passcode}: loginProps) => {
            const response = await authenticateStudent(indexNumber, passcode);
            if (response.status === ResponseCodes.OK) {
                
                navigate('/dashboard');
            }
        },
        onSuccess: () => {

        },
        onError: (error: ResponseError) => {
            console.log(error)
            if (error.response?.status === ResponseCodes.UNAUTHORIZED) {
                Toast.show({
                    content: error.response.data.message,
                    duration: 4000,
                    icon: 'fail',
                    position: 'top'
                })
            }

        }
    })

    const onLogin = () => {
        
        if (passcode.length < 1) return
        mutate({indexNumber: user?.index_number as number, passcode: passcode})

    }

    return ( <>
        <AutoCenter>
            <div style={{marginTop: "10vh", marginLeft: 10, marginRight: 10}}>
                <h2>
                    Hello<br />{user?.name},
                </h2>
            </div>
            <h2 style={{marginTop: "20vh"}}> Please enter your passcode</h2>
            <Form
                layout='horizontal'
                footer={
                <Button loading={isLoading} loadingText='Signing In' block type='submit' color='primary' size='large' onClick={onLogin}>
                    Login
                </Button>
                }
            >
                <Form.Item
                    name='password'
                    label='password:'
                    rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                    <Input
                        
                        placeholder='xyz123'
                        type={'password'}
                    />
                </Form.Item>
                
            </Form>
            <div style={{ display:"flex", justifyContent: 'center, marginBottom: 10' }}>
                <a href={"/"}>Sign in with a different account</a>    
            </div>
            <div style={{ display:"flex", justifyContent: 'center' }}>
                <a href={"/"}>Forgot Password?</a>    
            </div>
        </AutoCenter>
    </>);
}

export default ExistingUser;