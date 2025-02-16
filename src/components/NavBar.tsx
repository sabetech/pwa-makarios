import { NavBar } from "antd-mobile"
import { useNavigate } from 'react-router-dom';

type Navprops = {
    prevPage?: string
    currentPage: string
    rightNode?: React.ReactNode
}

const MyNavBar:React.FC<Navprops> = ({prevPage, currentPage, rightNode}) => {

    const navigate = useNavigate();

    return (
        <NavBar 
            onBack={() =>{
                if (prevPage) navigate(prevPage)
                else navigate(-1)}   
            } 
            style={{'--height': '60px', backgroundColor: '#570A22', color:'white'}}
            right={rightNode}
            > {currentPage} </NavBar>
    )
}

export default MyNavBar