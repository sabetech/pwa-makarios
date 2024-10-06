import { useState, useRef, useContext, useEffect } from 'react';
import { Space, Image, Form, Input, SafeArea, Button, Toast } from "antd-mobile";
import makarios_logo from "../../assets/makarios_log_trans_bg.png";
import { useMutation } from 'react-query';
import { registerUser } from '../../services/UserManagement';
import { ResponseError } from '../../interfaces/ServerResponse';
import * as ResponseCodes from '../../constants/ResponseStatusCodes';

import { Link, useNavigate } from 'react-router-dom';
import "./Auth.css";

type TUserRegister = {
    name: string,
    email: string,
    password: string,
    c_password: string
}

const Register: React.FC = () => {
    const emailTextRef = useRef(null);
    // const [emailText, setEmailText] = useState<string>(''); //TODO: Validate later
    const [isFormEmpty, setFormEmpty] = useState<boolean>(false);
    // const { storeUser } = useContext(UserContext) as IUserManager;
    const navigate = useNavigate();
    const [form] = Form.useForm()

    // useEffect(() => {

    //     //log the user in if they are already logged in
    //     if (localStorage.getItem(StorageKeys.USER)) {
    //         const user = JSON.parse(localStorage.getItem(StorageKeys.USER) as string) as User;
    //         storeUser(user);
    //         navigate('/dashboard')
    //     }

    // },[]);

    const { mutate, isLoading } = useMutation({
        mutationFn: async ({name, email, password, c_password}: TUserRegister) => { 
            const response = await registerUser(name, email, password, c_password);
            if (response.status === ResponseCodes.OK) {
                
                console.log(response.data.data.name);
                
                // storeUser(response.data.user as User)
                // localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user))

               navigate('/set-photo', {
                state: {
                    name: response.data.data.name
                }
               });
            }
        },
        onSuccess: () => {
            Toast.show({
                content: 'Registration Successful',
                duration: 1000,
                icon: 'success',
                position: 'top'
            })
        },
        onError: ( error: ResponseError ) => {
            if (error.response?.status === ResponseCodes.UNAUTHORIZED) {
                Toast.show({
                    content: error.response.data.message,
                    duration: 4000,
                    icon: 'fail',
                    position: 'top'
                })
            }

            //TODO:: Fix the list of validation message from the server
            if (error.response?.status === ResponseCodes.BAD_REQUEST) {
                console.log("Error::", error.response.data.data.email[0])
                
                Toast.show({
                    content: error.response.data.data.email[0],
                    duration: 4000,
                    icon: 'fail',
                    position: 'top'
                })
            }
        }
    });

    const onRegister = (values: TUserRegister) => {
       //validate the form
       console.log(values);
       if (values.name === undefined || values.email === undefined || values.password === undefined || values.c_password === undefined) {
        
            hintUserError();
           return Toast.show({
               content: 'Please fill in all fields',
               duration: 4000,
               icon: 'fail',
               position: 'top'
           })
       }

        if (values.password !== values.c_password) {
            hintUserError();
            return Toast.show({
                content: 'Passwords do not match',
                duration: 4000,
                icon: 'fail',
                position: 'top'
            })
        }
        
        mutate(values)
    }

    const hintUserError = () => {
        setFormEmpty(true)
        setTimeout(() => {
            setFormEmpty(false)
        }, 1000)
    }

    // const onEmailTextChange = (text: string) => {
    //     setEmailText(text)
    // }

    return (
        <div style={{width: "100%"}}>
            <SafeArea position='top' />
            <Space direction='vertical' align='center' style={{ '--gap': '40px' }} block>

                <h1 style={{textAlign: 'center', marginRight: 20, marginLeft: 20}}>Register</h1>

                <Image 
                    src={makarios_logo} 
                    width={170} height={170} fit='contain'
                />
                <Form layout='vertical'
                    form={form}
                    onFinish={onRegister}
                    footer={
                        <Button loading={isLoading} color='primary' loadingText='Verifying' block size={"large"} type='submit'>
                            Register
                        </Button>
                    }
                    mode='card'
                    style={{width: '300px'}}
                >
                    <Form.Item  
                        label='Full Name' 
                        name='name' 
                        className={isFormEmpty ? 'shake-animation': undefined}
                    >
                        <Input ref={emailTextRef} placeholder='makarios.member@gmail.com' clearable />
                    </Form.Item>
                    
                    <Form.Item  
                        label='Email' 
                        name='email' 
                        className={isFormEmpty ? 'shake-animation': undefined}
                    >
                        <Input ref={emailTextRef} placeholder='makarios.member@gmail.com' clearable />
                    </Form.Item>
                    <Form.Item  
                        label='Password' 
                        name='password' 
                        className={isFormEmpty ? 'shake-animation': undefined}
                    >
                        <Input type='password' placeholder='xxxxxx' clearable />   
                    </Form.Item>
                    <Form.Item  
                        label='Confirm Password' 
                        name='c_password' 
                        className={isFormEmpty ? 'shake-animation': undefined}
                    >
                        <Input type='password' placeholder='xxxxxxxxx' clearable />   
                    </Form.Item>
                </Form>
                <Link to="/login" style={{marginTop: 5}}>Got an Account? Login</Link>
            </Space>
    </div>
    );
}

export default Register;