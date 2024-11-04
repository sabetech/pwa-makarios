import { List } from "antd-mobile";
import MyNavBar from "../../components/NavBar";
const Index = () => {

    //TODO: add regions based on the permission to add a region
    

    return (<>
        <MyNavBar prevPage="directory/churches" currentPage="Regions" />
        <List header="Regions" style={{'--header-font-size': '20px'}}>
            
        </List>
    </>)
}

export default Index;