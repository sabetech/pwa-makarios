//page src/pages/Leaders/Index.tsx
import { useState } from "react";
import { Avatar, List, Button, SwipeAction, Dialog, SpinLoading, ActionSheet } from "antd-mobile";
import MyNavBar from "../../components/Nav/NavBar";
import { useGetUsers } from "../../hooks/UserHooks";
import { TRole } from "../../types/user";
import { IoPersonAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Index = () => {
    const [pickerVisible, setPickerVisible] = useState(false);
    const {data:leaders, isLoading} = useGetUsers();
    const navigate = useNavigate();
    
    const handleLeaderClick = (id: number) => {
        // navigate(`/dashboard/regions/${id}`);
    }

    const options = [
                        {
                            text: 'Add Leader',
                            key: 'add_leader',
                        },
                        {
                            text: 'Add Role',
                            key: 'add_role',
                        }
                    ];

    return (
        <>
            <MyNavBar currentPage="Leaders" rightNode={<Button color={"default"} onClick={() => setPickerVisible(true)}><IoPersonAdd />Add New</Button>} />
            {isLoading ? <SpinLoading style={{'--size': '48px', marginTop: 50}}/> :
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
            }
            <ActionSheet 
                visible={pickerVisible} actions={options} onClose={() => setPickerVisible(false)}
                onAction={
                    (action) => {
                        switch(action.key) {
                            case 'add_leader':
                                navigate('add');
                                break;
                            case 'add_role':
                                navigate('roles/add');
                                break;
                        }
                    }
                }
            />
        </>
    );
}

export default Index;