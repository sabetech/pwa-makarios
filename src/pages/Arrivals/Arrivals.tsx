import { useState } from "react";
import MyNavBar from "../../components/NavBar";
import {
  Selector,
  Button,
  DatePicker,
  Collapse
} from "antd-mobile";
import { TStream } from '../../types/stream';
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../hooks/AuthHooks";
import { useGetStreams } from '../../hooks/StreamHooks';
import dayjs from "dayjs";

const Arrivals = () => {

  const { data: streams } = useGetStreams();
  const [filterOption, setFilterOption] = useState<{label: string, value: number}>({label: "All", value: 0});
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateFilterValue, setDateFilterValue] = useState(dayjs().format('DD-MMM-YYYY'));

  const loggedInUser = useAuthUser()
  const navigate = useNavigate();
  const user = loggedInUser()

   const filters = streams?.map((stream: TStream) => {
          return {
              label: stream.name,
              value: stream.id ?? 0
          }
      }) ?? [];

  return (
    <>
      <MyNavBar prevPage="/dashboard" currentPage="Arrivals" rightNode={<Button color={"default"} onClick={() => navigate("/arrivals/new")}>Add New</Button>} />
      <Collapse style={{marginTop: '7vh'}}>
          <Collapse.Panel key='1' title={`Filters - ${filterOption.label}`} >
            <Button onClick={() => setDatePickerVisible(true)}>{`Date: ${dateFilterValue}`}</Button>
            <DatePicker
              title={dateFilterValue}
              visible={datePickerVisible}
              onClose={() => {
                setDatePickerVisible(false)
              }}
              onConfirm={val => {
                setDateFilterValue(val.toDateString()  )   
              }}
            />
            <hr />
            <Selector
                style={{
                  '--border-radius': '100px',
                  '--border': 'solid transparent 1px',
                  '--checked-border': 'solid var(--adm-color-primary) 1px',
                  '--padding': '8px 24px',
                }}
                showCheckMark={false}
                options={[...filters, { label: "All", value: 0 }]}
                onChange={(_, extend) => {
                    setFilterOption(extend.items[0] as { label: string, value: number })
                }}
            />
          </Collapse.Panel>
      </Collapse>
        
      {/* <List header={`${user.name}'s Arrival data for ${bacentas?.length} Bacentas`} style={{ '--header-font-size': '20px', marginTop: 20 }}> */}
        {/* {isLoading ? <List.Item>Loading...</List.Item> :
          bacentas && bacentas.length > 0 && bacentas.map((bacenta) => (
            <List.Item
              key={bacenta.id}
              prefix={bacenta.region.name}
              description={bacenta?.leader?.name}
            >
              {bacenta.name}
            </List.Item>
          ))
        } */}
      {/* </List> */}
    </>
  );
};

export default Arrivals;
