import { useState } from "react"
import { Form, Input, Picker, Button } from "antd-mobile"
import MyNavBar from "../../components/NavBar"
import { PickerColumn } from "antd-mobile/es/components/picker-view"


const AddStream = () => {

    const [visible, setVisible] = useState(false);
    const [timeVisible, setTimeVisible] = useState(false);
    const [value, setValue] = useState<(string | null)>()
    const dayColumn: PickerColumn[] = [[
        {label: 'Monday', value: 'Monday'},
        {label: 'Tuesday', value: 'Tuesday'},
        {label: 'Wednesday', value: 'Wednesday'},
        {label: 'Thursday', value: 'Thursday'},
        {label: 'Friday', value: 'Friday'},
        {label: 'Saturday', value: 'Saturday'},
        {label: 'Sunday', value: 'Sunday'},
        ]
    ];
    const timeColumn: PickerColumn[] = [
        [
            {label: 1, value: 1},
            {label: 2, value: 2},
            {label: 3, value: 3},
            {label: 4, value: 4},
            {label: 5, value: 5},
            {label: 6, value: 6},
            {label: 7, value: 7},
            {label: 8, value: 8},
            {label: 9, value: 9},
            {label: 10, value: 10},
            {label: 11, value: 11},
            {label: 12, value: 12}
        ],
        [
            {label: "00", value: "00"},
            {label: "10", value: "10"},
            {label: "20", value: "20"},
            {label: "30", value: "30"},
            {label: "40", value: "40"},
            {label: "50", value: "50"}
        ],
        [
            {label: "AM", value: "AM"},
            {label: "PM", value: "PM"},
        ]
    ]; 

    return (
        <>
            <MyNavBar prevPage="streams" currentPage="Add Stream" />
            <Form
                name="add-stream-form"
                footer={
                    <Button block type="submit" color="primary" size="large">
                        Add Stream
                    </Button>
                }
            >
                <Form.Item name="stream_name" label="Stream Name">
                    <Input placeholder="Stream Name" />
                </Form.Item>
           
                <Form.Item name="meeting_day" label="Meeting Day" onClick={() => {
                            setVisible(true)
                        }}>
                    <Picker
                        columns={dayColumn}
                        visible={visible}
                        onClose={() => {
                        setVisible(false)
                        }}
                        onConfirm={v => {
                        console.log("Confirim Meeting Day", v)
                        }}
                    />
                </Form.Item>
           
                <Form.Item name="meeting_time" label="Meeting Time"
                    onClick={() => {
                        setTimeVisible(true)
                    }}
                >       
                    <Picker
                        columns={timeColumn}
                        visible={timeVisible}
                        onClose={() => {
                            setTimeVisible(false)
                        }}
                        onConfirm={v => {
                            console.log("Confirim Time", v)
                        }}
                    />
                </Form.Item>
            </Form>
        </>
    )
}

export default AddStream