import MyNavBar from "../../components/NavBar";
import {
  NoticeBar,
  Button,
  List
} from "antd-mobile";
import { InformationCircleOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../hooks/AuthHooks";
import { useGetBacentas } from "../../hooks/BacentaHooks";

const Arrivals = () => {
  const { data: bacentas, isLoading } = useGetBacentas();
  console.log(bacentas);
  const loggedInUser = useAuthUser()
  const navigate = useNavigate();
  const user = loggedInUser()

  return (
    <>
      <MyNavBar prevPage="dashboard" currentPage="Arrivals" rightNode={<Button color={"default"} onClick={() => navigate("/arrivals/new")}>Add New</Button>} />
      <NoticeBar
        content="Feature in development (Testing)"
        color="alert"
        icon={<InformationCircleOutline />}
      />

      <List header={`${user.name}'s Arrival Updates`} style={{ '--header-font-size': '20px' }}>
        {isLoading ? <List.Item>Loading...</List.Item> :
          bacentas && bacentas.length > 0 && bacentas.map((bacenta) => (
            <List.Item
              key={bacenta.id}
              prefix={bacenta.id}
              description={bacenta.name}
            >
              {bacenta.name}
            </List.Item>
          ))
        }
      </List>
    </>
  );
};

export default Arrivals;
