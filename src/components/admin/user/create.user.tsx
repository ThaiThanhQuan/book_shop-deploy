import { createUsersAPI } from "@/services/api";
import { Input, Modal, Form, App, Divider } from "antd"
import type { FormProps } from 'antd';
import { useState } from "react";

type FieldType = {
    username: string;
    email: string;
    password: string;
    phone: string;
};

interface IProps {
    openCreateUser: boolean
    setOpenCreateUser: (v: boolean) => void
    refreshTable: () => void
}

const CreateUser = (props: IProps) => {
    const { openCreateUser, setOpenCreateUser, refreshTable } = props
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { username, email, password, phone } = values
        setIsSubmit(true)
        const res = await createUsersAPI(username, email, password, phone)
        if (res && res.data) {
            message.success("Tạo mới user thành công!")
            form.resetFields()
            setOpenCreateUser(false)
            refreshTable()
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false)
    };

    return (
        <Modal
            title="Thêm người dùng mới"
            open={openCreateUser}
            onOk={() => {
                form.submit()
            }}
            onCancel={() => {
                setOpenCreateUser(false)
                form.resetFields()
            }}
            okText="Tạo mới"
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
                    labelCol={{ span: 24 }}
                    label="Tên hiển thị"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng điền tên!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng điền email!' },
                    { type: 'email', message: 'Email không đúng định dạng' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng điền mật khẩu!' }]}
                >
                    <Input.Password />
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
    )
}

export default CreateUser;  