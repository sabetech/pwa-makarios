
import { Avatar, Image, Space } from 'antd-mobile'
import { MoreOutline } from 'antd-mobile-icons'
import { TUser } from '../../types/user'

type HeaderPanelProps = {
    setVisible: (value: boolean) => void
    loggedInUser: TUser
}
const HeaderPanel:React.FC<HeaderPanelProps> = ({setVisible, loggedInUser}) => {

    console.log("loggedUser::", loggedInUser)

    return (
        <div style={{
            width: '100%',
            height: '14vh',                
            background: "#570A22",
            // background: 'linear-gradient(47deg, rgba(214,203,251,1) 0%, rgba(236,236,250,1) 100%)',
            // backgroundImage: `url('https://t3.ftcdn.net/jpg/04/06/60/72/240_F_406607245_daS9yMQ9g8MMZz3XWf2LVXxFy5cAdLQ7.jpg')`,
            // borderBottomRightRadius: 15,
            // borderBottomLeftRadius: 15,
            boxShadow: '1px 1px 40px 1px rgba(0,0,0,0.25)',
            margin: 'auto'
        }}>
            <Space style={{ '--gap': '10px' }}>                
                <div style={{width: "35vw", height: "90%", marginTop: 20, marginLeft: 20}}>

                    <Avatar src={loggedInUser.img_url ?? 'https://via.placeholder.com/200'} style={{ borderRadius: 64, '--size': '128px', border: '2px solid #F7A840', boxShadow: '3px 3px 40px 1px rgba(0,0,0,0.25)', }} />
                </div>
                
                <Space direction='vertical'>
                    <MoreOutline fontSize={32} color={'white'} style={{float:'right'}} onClick={() => setVisible(true)} />
                    <div style={{marginTop: -30}}>
                        
                        <div style={{ height: "20%", width: "55vw", marginTop: 20}}>
                            <p style={{ fontFamily: 'Verdana, sans-serif', fontSize: 25, margin: 0, color: 'white' }}>Hello, <strong>{ loggedInUser.name.substring(0, loggedInUser.name.indexOf(" ")) }</strong></p>
                            </div>
                        <div style={{ height: "10%", width: "55vw", marginTop: 5}}>
                            <h1 style={{ fontFamily: 'Verdana, sans-serif', fontSize: 14, fontWeight: 400, margin: 0, color: 'white' }}></h1>
                        </div>
                        <div style={{ height: "10%", width: "55vw", marginTop: 5}}>
                            <h1 style={{ fontFamily: 'Verdana, sans-serif', fontSize: 14, fontWeight: 400, margin: 0, color: 'white' }}> {loggedInUser.roles.length > 0 ? loggedInUser.roles[0].name : 'No Role'} </h1>
                        </div>
                    </div>
                </Space>
                
            </Space>
        </div>
    )
}

export default HeaderPanel