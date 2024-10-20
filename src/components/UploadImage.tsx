import { Image } from 'antd-mobile';
import { UploadOutline, CameraOutline } from 'antd-mobile-icons'
import Webcam from "react-webcam";
import { useRef, useState, useCallback } from "react";
import { Space,Toast, Button } from "antd-mobile";
import { useMutation } from 'react-query';
import { convertBase64ToFile } from "../../src/utils/helper";

type UploadProps = {
    onImageLoaded: (image: File) => void
    filename: string
    defaultImageUrl?: string
}
const UploadComponent:React.FC<UploadProps> = ({
    onImageLoaded, filename, defaultImageUrl
}) => {

    const [showWebCam, setShowWebcam] = useState(false);
    const [pictureLoaded, setPictureLoaded] = useState(false);
    const [defaultImage, setDefaultImage] = useState(defaultImageUrl ?? '/404');
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
   
    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();

            setShowWebcam(false)
            if (imageSrc) {
                setDefaultImage(imageSrc);
                const myfile = convertBase64ToFile(imageSrc, filename)
                if (myfile) {
                        onImageLoaded(myfile)
                    }
                setPictureLoaded(true);
            }
        }
    },
    [webcamRef]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            onImageLoaded(file)
            setDefaultImage(imageUrl); 
            setPictureLoaded(true);

        } else {
            Toast.show("Please upload an image file");
        }
    }
  };

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
  
  const showWebCamHandler = () => {

    if (showWebCam) {
        capture()
    }else {
        setShowWebcam(true)
    }
  }

    return (<>
        <Space direction='vertical' align='center' style={{ '--gap': '40px' }} block>
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
                    <Image src={defaultImage} style={{borderRadius: 40, marginRight: '5%', marginLeft: '5%'}} width={300} height={300} fit='cover' />
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
                    </Space>
                    }
        </Space>
    </>)
}

export default UploadComponent;