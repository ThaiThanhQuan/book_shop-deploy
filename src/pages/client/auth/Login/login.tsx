import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, Row } from 'antd';
import './login.scss'
import { Link, useNavigate } from 'react-router-dom';
import { App } from 'antd';
import { loginAPI } from '@/services/api';
import { useState } from 'react';
import { useCurrentApp } from 'components/context/app.context';

type FieldType = {
    username: string;
    password: string;
};


const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false)
    const { message } = App.useApp();
    const navigate = useNavigate()
    const {setIsAuthenticated, setUser } = useCurrentApp()

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { username, password } = values
        setIsSubmit(true)

        const res = await loginAPI(username, password)
        setIsSubmit(false)
        if (res?.data) {
            setIsAuthenticated(true)
            setUser(res.data.user)
            localStorage.setItem('access_token', res.data.access_token);
            message.success('Đăng nhập tài khoản thành công!')
            navigate('/')
        } else {
            message.error(res.message && Array.isArray(res.message) ? res.message[0] : res.message)
        }

    };
    return (
        <div className='auth-page'>
            <div className='main'>
                <div className='auth-heading'>
                    <h2>Đăng Nhập</h2>
                    <Divider />
                </div>
                <Form
                    onFinish={onFinish}
                >
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="username"
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

                    <Form.Item label={null}>
                        <Row justify="end">
                            <Button type="primary" htmlType="submit" loading={isSubmit}>
                                Đăng nhập
                            </Button>
                        </Row>
                    </Form.Item>
                    <Divider>Or</Divider>
                </Form>
                <div className='auth-footer'>
                    <p>Chưa có tài khoản ? <Link to="/register" className='auth-link'>Đăng ký</Link></p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage