import { AiOutlineHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Button } from 'antd-mobile';
const HomeButtonIcon = () => {
    const navigate = useNavigate();
    return <Button onClick={() => navigate('/dashboard')} size='large' fill={'none'}><AiOutlineHome color={'white'} size={30}/></Button>
}
export default HomeButtonIcon;