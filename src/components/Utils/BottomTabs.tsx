import { AiOutlineHome } from "react-icons/ai";
import { TabBar } from "antd-mobile";
import {
  Route,
  useLocation,
  MemoryRouter as Router,
} from 'react-router-dom'
const BottomTabs = () => {
    
    const location = useLocation()
    const { pathname } = location

    const tabs = [
    {
      key: '/dashboard',
      title: 'Home',
      icon: <AiOutlineHome /> 
    }
  ]
    return <>
        <TabBar activeKey={pathname} onChange={value => {
            console.log("Navigating to:", value)
        }}>
            {tabs.map(item => (
                <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
            ))}
        </TabBar>
    </>
}

export default BottomTabs