import { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, Row } from 'antd';
import './register.scss'
import { registernAPI } from '@/services/api';
import { Link, useNavigate } from 'react-router-dom';
import { App } from 'antd';

type FieldType = {
    username: string;
    email: string;
    password: string;
    phone: string;
};

const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false)
    const { message } = App.useApp();
    const navigate = useNavigate()

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)
        const { username, email, password, phone } = values

        const res = await registernAPI(username, email, password, phone)
        if (res.data) {
            message.success("Đăng ký user thành công!")
            navigate('/login')
        } else {
            message.error(res.message)
        }
        setIsSubmit(false)
    };

    return (
        <div className='auth-page'>
            <div className='main'>
                <div className='auth-heading'>
                    <h2>Đăng Ký Tài Khoản</h2>
                    <Divider />
                </div>
                <Form
                    onFinish={onFinish}
                >
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Họ tên"
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

                    <Form.Item label={null}>
                        <Row justify="end">
                            <Button type="primary" htmlType="submit" loading={isSubmit}>
                                Đăng ký
                            </Button>
                        </Row>
                    </Form.Item>
                    <Divider>Or</Divider>
                </Form>
                <div className='auth-footer'>
                    <p>Đã có tài khoản ? <Link to="/login" className='auth-link'>Đăng nhập</Link></p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage