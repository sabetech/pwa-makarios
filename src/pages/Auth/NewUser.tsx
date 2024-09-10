import { AutoCenter, PasscodeInput, Form, Button, NumberKeyboard, Space, Toast } from 'antd-mobile';
import { UserContext } from '../../contexts/UserContext';
import { useContext, useState } from 'react';
import { IUserManager, ResponseError } from '../../interfaces/ServerResponse';
import { useMutation } from 'react-query';
import { authenticateStudent } from '../../services/UserManagement';
import * as ResponseCodes from '../../constants/ResponseStatusCodes';
import { useNavigate } from 'react-router-dom';
interface loginProps {
    indexNumber: number;
    passcode: string;
}

const NewUser = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext) as IUserManager;
    const [passcode, setPasscode] = useState<string>('');

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

    return (
        <AutoCenter>
            <Space direction='vertical' >'
                <h1 style={{marginLeft: 15}}>
                    Hello {user?.name.substring(0, user?.name.indexOf(' '))},
                </h1>
                <div style={{marginBottom: "10vh", width: "90%" }}>
                    
                    <h2 style={{marginLeft: 20, textAlign: 'center'}}> 
                    Here is your Passcode: <br /><h1>{user?.passcode}</h1> <br />Use that to login and Remember it all the time.
                    </h2>
                </div>
            </Space>
            <Form
                layout='horizontal'
                footer={
                <Button loading={isLoading} loadingText='Signing In' block type='submit' color='primary' size='large' onClick={onLogin}>
                    Login
                </Button>
                }
            >
                <Form.Item
                    name='passcode'
                    label='Passcode:'
                    rules={[{ required: true, message: 'Please enter your passcode' }]}
                    >
                    <PasscodeInput length={4} keyboard={<NumberKeyboard />} onChange={setPasscode}/>
                </Form.Item>
                
            </Form>
                <div style={{ display:"flex", justifyContent: 'center' }}>
                    <a >Sign in with a different account</a>
                </div>
        </AutoCenter>
    );
}

export default NewUser;