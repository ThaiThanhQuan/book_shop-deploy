import { useCurrentApp } from "@/components/context/app.context"
import { updateUserPasswordAPI } from "@/services/api"
import { App, Button, Col, Form, Input, Row, type FormProps } from "antd"
import { useEffect, useState } from "react"

type FieldType = {
    email: string,
    oldpass: string,
    newpass: string
}

const ChangePassword = () => {
    const [form] = Form.useForm()
    const { user } = useCurrentApp()

    const [isSubmit, setIsSubmit] = useState(false)
    const { message, notification } = App.useApp()

    useEffect(() => {
        if (user) {
            form.setFieldValue('email', user.email)
        }
    }, [user])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { email, oldpass, newpass } = values;
        setIsSubmit(true)
        const res = await updateUserPasswordAPI(email, oldpass, newpass)

        if (res && res.data) {
            message.success("Cập nhật mật khẩu thành công")
            form.setFieldValue('oldpass', "")
            form.setFieldValue('newpass', "")
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }

        setIsSubmit(false)
    };
    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col span={1}></Col>

                <Col sm={24} md={12}>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        name="change-password"
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Email không được để trống' }]}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Mật khẩu hiện tại"
                            name="oldpass"
                            rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Mật khẩu mới"
                            name="newpass"
                            rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Button
                            htmlType="submit"
                            loading={isSubmit}
                            color="primary"
                            variant="solid"
                        >
                            Xác nhận
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ChangePassword