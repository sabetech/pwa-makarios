import { useState, useRef, useContext, useEffect } from 'react';
import { Space, Image, Form, Input, SafeArea, Button, Toast } from "antd-mobile";
import makarios_logo from "../../assets/makarios_log_trans_bg.png";
import { useMutation } from 'react-query';
import { useSignIn } from '../../hooks/AuthHooks';
import { IUserManager, ResponseError } from '../../interfaces/ServerResponse';
import * as ResponseCodes from '../../constants/ResponseStatusCodes';
import { UserContext } from '../../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/UserManagement';
import "./Auth.css";
import { TUserResponse } from '../../types/user';

const Welcome: React.FC = () => {
    const emailTextRef = useRef(null);
    const passwordTextRef = useRef(null);
    const [emailText, setEmailText] = useState<string>('');
    const [passwordText, setPasswordText] = useState<string>('');
    const [isFormEmpty, setFormEmpty] = useState<boolean>(false);
    const { storeUser } = useContext(UserContext) as IUserManager;
    const navigate = useNavigate();
    
    const signIn = useSignIn()

    const { mutate, isLoading } = useMutation({
        mutationFn: async ( {email, password}: {email: string, password: string} ): Promise<TUserResponse> => { 
            
            const response = await loginUser(email, password);

            if (response.status === ResponseCodes.OK) {

                const success = signIn({
                    token: response.data.data.token,
                    tokenType: 'Bearer',
                    user: response.data.data.user
                })

                if (!success) {
                    hintUserError()
                }
            }
            return response.data;
        },
       
        onSuccess: (responseData: TUserResponse) => {

            console.log("response ", responseData)

            storeUser(responseData.data.user)
            if (responseData.data.user.img_url) {
                navigate('/dashboard')
            }else {
                navigate('/set-photo', {
                    state: {
                        user: responseData.data.user
                    }
                });
            }
            Toast.show({
                content: 'Login Successful',
                duration: 1000,
                icon: 'success',
                position: 'top'
            })
        },
        onError: ( error: ResponseError ) => {
            hintUserError()
            if (error.response?.status === ResponseCodes.UNAUTHORIZED) {
                Toast.show({
                    content: error.response.data.data.error,
                    duration: 4000,
                    icon: 'fail',
                    position: 'top'
                })
            }
            console.log('error', error.response?.data)
        }
    });

    const onLogin = () => {
       
        if (emailText.length < 1 || passwordText.length < 1) {
            hintUserError()
            return
        }
        
        mutate({email: emailText, password: passwordText})
    }

    const hintUserError = () => {
        setFormEmpty(true)
        setTimeout(() => {
            setFormEmpty(false)
        }, 1000)
    }

    const onEmailTextChange = (text: string) => {
        setEmailText(text)
    }

    const onPasswordTextChange = (text: string) => {
        setPasswordText(text)
    }

    return (
        <div style={{width: "100%"}}>
            <SafeArea position='top' />
            <Space direction='vertical' align='center' style={{ '--gap': '40px' }} block>

                <h1 style={{textAlign: 'center', marginRight: 20, marginLeft: 20}}>Welcome to Makarios Admin</h1>
                <Image 
                    src={makarios_logo} 
                    width={170} height={170} fit='contain'
                />
                <Form layout='vertical'
                    footer={
                        <Button loading={isLoading} color='primary' loadingText='Verifying' block size={"large"} onClick={onLogin}>
                            Login
                        </Button>
                    }
                    style={{width: '300px'}}
                >
                    <Form.Item  
                        label='Email' 
                        name='email' 
                        className={isFormEmpty ? 'shake-animation': undefined}
                    >
                        <Input ref={emailTextRef} onChange={onEmailTextChange} placeholder='makarios.member@gmail.com' clearable />
                    </Form.Item>
                    <Form.Item  
                        label='Password' 
                        name='password' 
                        className={isFormEmpty ? 'shake-animation': undefined}
                    >
                        <Input ref={passwordTextRef} type='password' placeholder='xxxxxx' onChange={onPasswordTextChange} clearable />   
                    </Form.Item>
                </Form>
                <Link to="/forgot-password" style={{marginTop: 5}}>Forgot Password?</Link>
                <Link to="/register" style={{marginTop: 5, paddingBottom: 30}}>Don't have an Account? Register</Link>
            </Space>
    </div>
    );
}

export default Welcome;