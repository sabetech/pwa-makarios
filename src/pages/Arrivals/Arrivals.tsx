import { useRef, useCallback } from "react";
import MyNavBar from "../../components/NavBar";
import { NoticeBar, Steps, Space, Form, DatePicker, Button } from "antd-mobile";
import {InformationCircleOutline, CheckCircleFill, ClockCircleFill, CameraOutline, UploadOutline } from 'antd-mobile-icons'
import { FaBusAlt } from "react-icons/fa";
// import { TbCapture } from "react-icons/tb";

import Webcam from "react-webcam";

const { Step } = Steps
const Arrivals = () => {
    const [form] = Form.useForm()

    const onSubmit = () => {
        form.submit()
    }

    const webcamRef = useRef<Webcam>(null);
    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();

            console.log("imageSrc", imageSrc);
        }
    },
    [webcamRef]
  );

    return (
        <>
            <MyNavBar prevPage="dashboard" currentPage="Arrivals" />
            <NoticeBar content='You bus on Fridays and Sundays.' color='alert' icon={ <InformationCircleOutline /> } />
            
            <Steps current={0} 
                style={{
                    '--title-font-size': '17px',
                    '--description-font-size': '15px',
                    '--indicator-margin-right': '12px',
                    '--icon-size': '22px',
                }}
            >
                <Step title='Pre-Mobilization' description='Timer. 00:02:00' icon={<ClockCircleFill />} />
                <Step title='On Our Way' description='Timer: 01:00:00' icon={<FaBusAlt />}  />
                <Step title='Arrived' description='11:15:00 AM' icon={<CheckCircleFill />} />
            </Steps>

            <Space block direction='vertical' style={{width: '100%'}}>
            <Form
                form={form}
                footer={
                    <Button block color='primary' onClick={onSubmit} size='large'>
                      Submit
                    </Button>
                  }
            >

                {/* <Form.Header>Take a selfie with your helpers on the field</Form.Header> */}
                {/* <Space style={{display: 'flex', justifyContent: 'center', alignContent: 'center', marginTop: '30px'}}>
                    <Button color='primary' fill='outline' >
                        <CameraOutline /> Take A picture
                    </Button>
                    <Button color='primary' fill='outline' >
                        <UploadOutline /> Upload from your phone
                    </Button>
                </Space> */}
                
                <Space style={{display: 'flex', alignContent: 'center', justifyContent: 'center', margin: '30px'}}>
                    <Webcam 
                        videoConstraints={{
                            facingMode: "user",
                            height:320
                        }}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        audio={false}
                        width={'90%'}
                        style={{borderRadius: 40, marginRight: '5%', marginLeft: '5%'}}
                    />
                </Space>
                <Space block style={{justifyContent: 'center'}}>
                    <Button color='primary' fill='outline' style={{margin: '20px'}} size="large" onClick={capture}>
                        <CameraOutline /> Take A Premobilization Photo
                    </Button>
                </Space>
                <DatePicker />
            </Form>

            </Space>
            
        </>
    )
}

export default Arrivals;