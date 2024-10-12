import MyNavBar from "../../components/NavBar";
import { List, FloatingBubble } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons'
import { useNavigate } from "react-router-dom";
import { useGetChurches } from '../../hooks/ChurchHooks';
import { TChurchInfo } from "../../types/church";

const Index = () => {
    const navigate = useNavigate();

    const {data: churches} = useGetChurches()
    
    const showAddChurchForm = () => {
        navigate('add')
    }

    const handleChurchClick = (church: TChurchInfo) => {
        navigate(`${church.id}`, {state: {
            church
        }});
    }



    return (
        <>
            <MyNavBar prevPage="admin/portal" currentPage="Churches" />
            <List header="Churches" style={{'--header-font-size': '20px'}}>
            {
                churches && churches.data.map((church: TChurchInfo) => (
                    <List.Item key={church.name} onClick={() => {
                        handleChurchClick(church)
                    }}
                        // prefix={<TeamOutline />}
                        style={listStyle}
                        description={church.description}
                    >
                        {church.name}
                    </List.Item>
                ))
            }            
      </List>
      <FloatingBubble
        style={{
          '--initial-position-bottom': '24px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
        }}
        onClick={showAddChurchForm}
      >
        <AddOutline fontSize={32} />
      </FloatingBubble>

        </>
    )
}

const listStyle = {fontFamily: 'Verdana, sans-serif', fontSize: 20, fontWeight: 400, color: 'black'}

export default Index;