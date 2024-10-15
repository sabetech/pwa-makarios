import { NavBar } from "antd-mobile"
import { useNavigate } from 'react-router-dom';

type Navprops = {
    prevPage: string
    currentPage: string
}

const MyNavBar:React.FC<Navprops> = ({prevPage, currentPage}) => {

    const navigate = useNavigate();

    return (
        <NavBar onBack={() => navigate(-1)} style={{'--height': '60px', backgroundColor: '#570A22', color:'white'}} > {currentPage} </NavBar>
    )
}

export default MyNavBar