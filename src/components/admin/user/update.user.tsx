import { updateUsersAPI } from "@/services/api";
import { Input, Modal, Form, Divider, App } from "antd"
import { useEffect, useState } from "react"
import type { FormProps } from 'antd';


type FieldType = {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
};

interface IProps {
    openUpdateUser: boolean
    setOpenUpdateUser: (v: boolean) => void
    refreshTable: () => void
    dataUpdate: IUserTable | null
    setDataUpdate: (v: IUserTable | null) => void
}

const UpdateUser = (props: IProps) => {
    const { openUpdateUser, setOpenUpdateUser, refreshTable, dataUpdate, setDataUpdate } = props

    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                fullName: dataUpdate.fullName,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
            })
        }
    }, [dataUpdate])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, fullName, phone } = values
        setIsSubmit(true)
        const res = await updateUsersAPI(_id, fullName, phone)
        if (res && res.data) {
            message.success("Cập nhật user thành công!")
            form.resetFields()
            setOpenUpdateUser(false)
            setDataUpdate(null)
            refreshTable()
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false)
    }
    return (
        <Modal
            title="Cập nhật người dùng"
            open={openUpdateUser}
            onOk={() => {
                form.submit()
            }}
            onCancel={() => {
                setOpenUpdateUser(false)
                setDataUpdate(null)
                form.resetFields()
            }}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />
            <Form
                form={form}
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item<FieldType>
                    hidden
                    labelCol={{ span: 24 }}
                    label="Id"
                    name="_id"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng điền email!' },
                    { type: 'email', message: 'Email không đúng định dạng' }
                    ]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label="Tên hiển thị"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng điền tên!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng điền số điện thoại!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default UpdateUser;