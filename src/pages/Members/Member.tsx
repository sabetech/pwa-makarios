import { useState, useRef } from "react";
import MemberProfileCard from "../../components/Profile/MemberProfileCard";
import { useLocation } from "react-router-dom";
import { List, DatePicker, Input, InputRef } from "antd-mobile";
import dayjs from "dayjs";


const Member= () => {
    const location = useLocation();
    const memberDetail = location.state?.member || {}
    const [showEmailTextInput, setShowEmailTextInput] = useState(false);
    const emailInput = useRef<InputRef>(null);
    
    const existingDate: Date = new Date( memberDetail.date_of_birth ?? "1995-01-01" );

    const [showDateSelector, setShowDateSelector] = useState(false);
    const [date, setDate] = useState<Date>(existingDate);

    const highlightText = () => {
        const nativeInput = emailInput.current?.nativeElement as HTMLInputElement; 
        console.log("emailInput::", emailInput?.current)
        console.log("native imput::", nativeInput)

        if (nativeInput) {
            nativeInput.focus(); 
            nativeInput.setSelectionRange(0, nativeInput.value.length); // Highlight the entire text
          }
    };

    return (
        <>
            <MemberProfileCard 
                member={memberDetail}
            />
            <List header={'Personal Information'}>
                <List.Item
                    description={"Date of Birth"}
                    clickable={false}
                    onClick={() => {
                        setShowDateSelector(true)
                    }}
                >
                    {memberDetail.date_of_birth}
                    
                </List.Item>

                <List.Item
                    description={"Email"}
                    onClick={() => {
                        setShowEmailTextInput((prev) => {
                            if (!prev) {
                                console.log("focus and highlight!!!")
                                highlightText();
                            }
                            return !prev
                        })
                    }}
                    clickable={false}
                    style={{backgroundColor: showEmailTextInput ? "rgba(0,0,0,0.1)" : "transparent"}}
                >
                    {
                        
                        !showEmailTextInput ?
                        memberDetail.email ?? "N/A"
                        :
                        <Input ref={emailInput} placeholder="Email" value={memberDetail.email ?? "N/A"} style={{display: showEmailTextInput ? "block" : "none"}} />
                        
                    }
                </List.Item>

                <List.Item
                    description={"Gender"}
                >
                    {memberDetail.gender}
                </List.Item>

                <List.Item
                    
                    description={"Marital Status"}
                >
                    {memberDetail.marital_status}
                    
                </List.Item>

                <List.Item
                    
                    description={"Occupation"}
                >
                    {memberDetail.occupation}
                    
                </List.Item>
            </List>

            <List header={'Church Information'}>
                <List.Item
                    description={"Bacenta"}
                >
                    {memberDetail.bacenta?.name ?? "N/A"}
                    
                </List.Item>
                <List.Item
                    description={"Zone"}
                >
                    {memberDetail.zone?.name ?? "N/A"}
                    
                </List.Item>

                <List.Item
                    description={"Region"}
                >
                    {memberDetail.region?.name ?? "N/A"}
                    
                </List.Item>
                <List.Item
                    description={"Stream"}
                >
                    {memberDetail.stream?.name ?? "N/A"}
                    
                </List.Item>
            </List>
            <DatePicker
                title='Choose Date (Year-Month-Day)'
                style={{zIndex: 20}}
                visible={showDateSelector}
                onClose={() => {
                    setShowDateSelector(false)
                }}
                precision='day'
                onConfirm={val => {
                    setDate(val as Date)
                }}
                defaultValue={date}
                max={(dayjs().subtract(5, 'year')).toDate()}
                min={(dayjs().subtract(80, 'year')).toDate()}
            />
        </>
    )
}

export default Member;