//page src/pages/Leaders/Index.tsx
import { Avatar, List, Button, SwipeAction, Dialog } from "antd-mobile";
import MyNavBar from "../../components/NavBar";
import { useGetUsers } from "../../hooks/UserHooks";
import { TRole } from "../../types/user";
import { IoPersonAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Index = () => {
    const {data:leaders} = useGetUsers();
    const navigate = useNavigate();
    
    const handleLeaderClick = (id: number) => {
        // navigate(`/dashboard/regions/${id}`);
    }

    return (
        <>
            <MyNavBar currentPage="Leaders" rightNode={<Button color={"default"} onClick={() => navigate("add")}><IoPersonAdd />Add New</Button>} />
            <List header="Leaders" style={{ '--header-font-size': '20px' }} mode={'card'}>
                {
                    leaders && leaders.map(leader => (
                        <SwipeAction
                            key={leader.id}
                            rightActions={[
                                {
                                    key: 'edit',
                                    text: 'Edit',
                                    color: 'primary',
                                    onClick: () => {
                                        navigate(`/leaders/edit/${leader.id}`);
                                    },
                                },
                                {
                                    key: 'delete',
                                    text: 'Delete',
                                    color: 'danger',
                                    onClick: () => {
                                       // Handle delete action here
                                       //prompt for confirmation and then delete
                                       console.log(`Delete leader with id: ${leader.id}`);
                                       Dialog.show({
                                            content: `Are you sure you want to delete this leader? ${leader.name}`,
                                            closeOnAction: true,
                                            actions: [
                                            {
                                                key: 'yes',
                                                text: 'Yes',
                                                bold: true,
                                                danger: true,
                                            },
                                            {
                                                key: 'no',
                                                text: 'No',
                                            },
                                            ],
                                        });
                                    },
                                },
                            ]}
                        >
                        <List.Item 
                            key={leader.id}
                            prefix={<Avatar src={leader.img_url ?? '/404'} />}
                            description={`${leader.roles.map((r: TRole) => r.name).join(', ')}`}
                            onClick={() => leader.id !== undefined && handleLeaderClick(leader.id)}
                        >
                            {leader.name}
                        </List.Item>
                        </SwipeAction>
                    ))
                }
            </List>
        </>
    );
}

export default Index;