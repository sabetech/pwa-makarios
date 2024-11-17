
import { Avatar, Image, Space } from 'antd-mobile'
import { MoreOutline } from 'antd-mobile-icons'

type HeaderProps = {
    title: string
}

const HeaderPanel:React.FC<HeaderProps> = ({title}) => {


    return (
        <>
        <div style={{
            width: '100%',
            height: '14vh',                
            background: "#570A22",
            backgroundImage: `url('https://yt3.googleusercontent.com/fkFesM3bJAfBWqtWc4tLsdrrJtHaJfbXUrUR22hQs4FBJTSNUSc3owKxqn0ImgCkZVpbUSrbKw=s900-c-k-c0x00ffffff-no-rj')`,
            boxShadow: '1px 1px 40px 1px rgba(0,0,0,0.25)',
            filter: 'brightness(0.5)',
            backgroundSize: 'contain no-repeat',
            resize: 'both',
        }}></div>
            <Space style={{ '--gap': '10px' }}>                
                <Space direction='vertical'>
                    
                    <div style={{marginTop: -10, marginLeft: 20}}>
                        
                        <div style={{ height: "20%", width: "90%", marginTop: 20}}>
                            <p style={{ fontFamily: 'Verdana, sans-serif', fontSize: 25, margin: 0, color: 'black' }}><strong>{title}</strong></p>
                            </div>
                        <div style={{ height: "10%", width: "55vw", marginTop: 5}}>
                            {/* <h1 style={{ fontFamily: 'Verdana, sans-serif', fontSize: 14, fontWeight: 400, margin: 0, color: 'white' }}> The Word of Life Cathedral </h1> */}
                        </div>
                    </div>
                </Space>
            </Space>
            </>
    )
}

export default HeaderPanel