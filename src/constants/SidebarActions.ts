import type {
    Action
} from 'antd-mobile/es/components/action-sheet';


const getActions = (role: string) => {
    let actions: Action[]
    switch(role) {
        case "Super Admin":
            actions = [...actionsByRole['General'], ...actionsByRole['Bacenta Leader'], ...actionsByRole['Super Admin']]
            break
        case "Bacenta Leader":
            actions = [...actionsByRole['General'], ...actionsByRole['Bacenta Leader']]
            break
        default:
            actions = [...actionsByRole['General']]
    }       
    return actions;
}

const actionsByRole = {
    'Super Admin': [
        {
            text: 'Admin Portal', key: 'admin',
        }
    ] as Action[],
    'General': [
        {
            text: 'Home', key: 'home',
        },
        {
            text: 'Directory', key: 'directory', 
        },
        {
            text: 'Services', key: 'services', 
        }
    ] as Action[],
    'Bacenta Leader': [
        {
            text: 'Arrivals', key: 'arrival',
        }   
    ] as Action[]
}

const ADMIN = 'admin'
const DIRECTORY = 'directory'
const SERVICES = 'services'
const ARRIVAL = 'arrival'



export { ADMIN, DIRECTORY, SERVICES, ARRIVAL, getActions }