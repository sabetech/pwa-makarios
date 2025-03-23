import { useState } from "react";
import MyNavBar from "../../components/NavBar";
import {
  NoticeBar,
  Space,
  Form,
  DatePicker,
  Button,
  Picker,
  Stepper,
  Toast,
} from "antd-mobile";
import { InformationCircleOutline } from "antd-mobile-icons";
import dayjs from "dayjs";
import { useGetBacentas } from "../../hooks/BacentaHooks";
import { PickerColumnItem, PickerValue } from "antd-mobile/es/components/picker-view";
import { TBacenta } from "../../types/bacenta";
import UploadComponent from "../../components/UploadImage";
import { useAddArrivalReport } from "../../hooks/ArrivalHooks";



const FillArrivalsForm = () => {
  const [form] = Form.useForm();

  const todaysDate = dayjs().toDate();
  const { data: bacentas } = useGetBacentas();
  const [selectedBacentaId, setSelectedBacentaId] = useState<PickerValue[]>([])
  const {mutate: addArrivalReport, isLoading: isSubmitting, isSuccess} = useAddArrivalReport();

  const onSubmit = (_values: any) => {
   
    addArrivalReport(_values)

  };

  if (isSuccess) {
    Toast.show({
      content: 'Arrival added successfully',
  });
  }

  return (
    <>
      <MyNavBar currentPage="New Arrivals Form" />
      <NoticeBar
        content="Feature in Development (Testing)"
        color="alert"
        icon={<InformationCircleOutline />}
      />

      <Space block direction="vertical" style={{ marginTop: 20, width: "100%" }}>
        <Form
          form={form}
          onFinish={onSubmit}
          footer={
            <Button block color="primary" type='submit' size="large" loading={isSubmitting}>
              Submit
            </Button>
          }
        >
          <Space
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "left"
            }}
          >
            <Form.Item initialValue={todaysDate} label={todaysDate.toDateString()} name="date">
              <DatePicker defaultValue={todaysDate} />
            </Form.Item>
          </Space>
          <Space style={{ display: "flex" }}>
            <Form.Item
              name='attendance'
              label='Attendance'
              rules={[{ required: true, message: 'Please enter attendance' }]}
            >
              <Stepper
                min={0}
              />
            </Form.Item>
          </Space>
          <Space style={{ display: "flex" }}>
            <Form.Item
              name='bacenta_id'
              label='Select Bacenta'
              rules={[{ required: true, message: 'Please select Bacenta' }]}
            >
              <Button
                onClick={async () => {
                  const value = await Picker.prompt({
                    confirmText: 'OK',
                    cancelText: 'Cancel',
                    columns: [(bacentas && bacentas?.map((bacenta: TBacenta) => (
                      {
                        label: `${bacenta.name} (${bacenta.region.name})`,
                        value: bacenta.id
                      } as PickerColumnItem
                    )
                    )) ?? []
                    ]
                  });

                  setSelectedBacentaId(value ?? [])
                  form.setFieldValue('bacenta_id', value)

                }}
                fill='outline'
                color='primary'
              >
                {selectedBacentaId.length > 0 ? bacentas?.find((bc) => bc.id === selectedBacentaId[0])?.name : 'Select Your Bacenta'}
              </Button>
            </Form.Item>
          </Space>
          <Space style={{ display: "flex" }}>
            <Form.Item
              name='arrival_picture'
              label='Upload Arrival Picture'
            >
              <UploadComponent
                onImageLoaded={(file) => {
                  form.setFieldValue('arrival_picture', file)
                }}
                filename='arrival_picture'
                defaultImageUrl='/404'
              />
            </Form.Item>
          </Space>
          <Space block style={{ justifyContent: "center" }}></Space>
        </Form>
      </Space>
    </>
  );
};

export default FillArrivalsForm;
