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
            break;
        case "Zone Lead":
            actions = [...actionsByRole['General'], ...actionsByRole['Zone Lead']] 
            break;
        case "Region Lead":
            actions = [...actionsByRole['General'], ...actionsByRole['Region Lead']] 
            break;
        case "Stream Lead":
            actions = [...actionsByRole['General'], ...actionsByRole['Stream Lead']] 
            break;
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
        },
        {
            text: 'Campaigns', key: 'campaigns',
        }
    ] as Action[],
    'Zone Lead': [
        {
            text: 'Arrivals', key: 'arrival',
        }   
    ],
    'Region Lead': [
        {
            text: 'Arrivals', key: 'arrival',
        }   
    ],
    'Stream Lead': [
        {
            text: 'Arrivals', key: 'arrival',
        }   
    ],
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
const CAMPAIGNS = 'campaigns'



export { ADMIN, DIRECTORY, SERVICES, ARRIVAL,CAMPAIGNS, getActions }