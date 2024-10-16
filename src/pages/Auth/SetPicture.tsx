import { useState, useRef, useCallback, useEffect } from "react";
import { Space, Image, SafeArea, Button, Toast } from "antd-mobile";
import { useLocation } from "react-router-dom";
import { UploadOutline, CameraOutline } from 'antd-mobile-icons'
import Webcam from "react-webcam";
import { useAuthUser, useUserImageUpload } from "../../hooks/AuthHooks";
import { convertBase64ToFile } from "../../utils/helper";
import { useNavigate } from "react-router-dom";

const SetPicture = () => {
    const [showWebCam, setShowWebcam] = useState(false);
    const [pictureLoaded, setPictureLoaded] = useState(false);
    const [defaultImage, setDefaultImage] = useState('/404');
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const {mutate: upload, isLoading, isSuccess: isFinishedUpload, isError, data } = useUserImageUpload();
    const location = useLocation();
    const [file, setFile] = useState<File>();
    const navigate = useNavigate()
    const user = useAuthUser()()

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();

            setShowWebcam(false)
            if (imageSrc) {
                setDefaultImage(imageSrc);
                setPictureLoaded(true);
            }
        }
    },
    [webcamRef]
  );
  
  const showWebCamHandler = () => {

    if (showWebCam) {
        capture()
    }else {
        setShowWebcam(true)
    }
  }

  useEffect(() => {
    if (isFinishedUpload) {
    
        navigate('/dashboard', {
            state: {
                user: data.data
            }
        });
      }
  },[isFinishedUpload])

  if (isError) {
    console.log("isError", isError)
  }


  const handleUploadButton = () => {
    if (showWebCam) {
        setShowWebcam(false);
    }else{
        //upload iage here
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            setFile(file);
            setDefaultImage(imageUrl); 
            setPictureLoaded(true);

        } else {
            Toast.show("Please upload an image file");
        }
    }
  };

  const handleSubmitPicture = () => {
    
    if (pictureLoaded) {
        if (defaultImage.startsWith('blob')) {
            
            upload({
                user_id: location.state.user.id,
                image:file
            })
        }

        if (defaultImage.startsWith('data')) {
            const myfile = convertBase64ToFile(defaultImage, location.state.user.name)
           
            upload({
                user_id: location.state.user.id,
                image: myfile
            })
        }
    
        return;

        
    }else{
        Toast.show({
            icon: 'fail',
            content: 'Please take a picture or upload a picture'
        })
    }
  }
  
    return (
        <>
            <div style={{width: "100%"}}>
                <SafeArea position='top' />
                <Space direction='vertical' align='center' style={{ '--gap': '40px' }} block>

                    <h1 style={{textAlign: 'center', marginRight: 20, marginLeft: 20, color:'#570A22'}} >Almost done!</h1>
                    <h2 style={{color: '#570A22', marginLeft: 30, marginRight: 30, textAlign: 'center'}}>Hello <em>{ user.name } </em>!</h2>
                    <h2 style={{color: '#570A22', marginLeft: 30, marginRight: 30, textAlign: 'center'}}>Upload a picture or take a selfie!</h2>
                    {
                        showWebCam ? 
                        <Space style={{display: 'flex', alignContent: 'center', justifyContent: 'center', margin: '30px'}}>
                            <Webcam 
                                videoConstraints={{
                                    facingMode: "user",
                                    height:300
                                }}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                audio={false}
                                width={'90%'}
                                style={{borderRadius: 40, marginRight: '5%', marginLeft: '5%'}}
                            />
                        </Space>:
                    <Image src={defaultImage} style={{borderRadius: 40, marginRight: '5%', marginLeft: '5%'}} />
                    }
                    
                    {  
                    !pictureLoaded ?
                    <Space>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <Button size="large" color="primary" fill='outline' onClick={()=> handleUploadButton()}>
                            <UploadOutline style={{marginRight: 10}}/>{
                                showWebCam ? "Cancel" : "Upload Picture"
                            }
                        </Button>
                        <Button size="large" color="primary" fill={showWebCam? 'solid' : 'outline'}  onClick={() => showWebCamHandler()}>
                            <CameraOutline style={{marginRight: 10}} />{
                                showWebCam ? "Capture" : "Take a Selfie"}
                        </Button>
                    </Space>
                    :
                    <Space>
                    <Button size="large" color="primary" fill='outline' onClick={() => {
                        setPictureLoaded(false);
                        setDefaultImage('/404');
                    }}>
                        Cancel
                    </Button>
                    <Button size="large" color="primary" fill='solid' loading={isLoading} loadingText="Submitting" onClick={() => handleSubmitPicture()}>
                        Submit
                    </Button>
                    </Space>
                    }
                </Space>
            </div>
        </>
    );
}

export default SetPicture;