import { useCurrentApp } from "@/components/context/app.context"
import { createOrderAPI } from "@/services/api"
import { DeleteTwoTone, LeftOutlined } from "@ant-design/icons"
import { App, Button, Col, Divider, Form, Input, InputNumber, message, notification, Radio, Row, Space, type FormProps } from "antd"
import { useEffect, useState } from "react"

const { TextArea } = Input

type UserMethod = "COD" | "BANKING"

type FieldType = {
    fullName: string
    phone: string
    address: string
    method: UserMethod
}

interface IProps {
    setCurrentStep: (v: number) => void
}


const Payment = (props: IProps) => {
    const { setCurrentStep } = props
    const { carts, setCarts, user } = useCurrentApp()
    const [totalPrice, setTotalPrice] = useState(0)

    const [form] = Form.useForm()

    const [isSubmit, setIsSubmit] = useState(false)
    const { message, notification } = App.useApp()

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                method: "COD"
            })
        }
    }, [user])

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0
            carts.map(item => {
                sum += item.quantity * item.detail.price
            })
            setTotalPrice(sum)
        } else {
            setTotalPrice(0)
        }
    }, [carts])

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem('carts')
        if (cartStorage) {
            const carts = JSON.parse(cartStorage) as ICart[]

            const newCarts = carts.filter(item => item._id !== _id)

            localStorage.setItem("carts", JSON.stringify(newCarts))

            setCarts(newCarts)
        }
    }
    const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (values) => {
        const { address, fullName, method, phone } = values
        const detail = carts.map(item => ({
            _id: item._id,
            quantity: item.quantity,
            bookName: item.detail.mainText
        }))

        setIsSubmit(true)
        const res = await createOrderAPI(
            fullName, address, phone, totalPrice, method, detail
        )

        if (res?.data) {
            localStorage.removeItem("carts")
            setCarts([])
            message.success('Mua hàng thành công!')
            setCurrentStep(2)
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsSubmit(false)
    }

    return (
        <div style={{ background: '#efefef' }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: "0 auto" }}>
                <div>
                    <span
                        style={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 500,
                            color: '#1677ff',
                            padding: '8px 2px',
                            transition: 'all 0.2s ease-in-out',
                        }}
                        onClick={() => setCurrentStep(0)}
                    >
                        <LeftOutlined />
                        Quay trở lại
                    </span>
                </div>
                <Row gutter={[20, 20]}>
                    <Col md={16} xs={24}>
                        {carts?.map((item, index) => {
                            const currentBookPrice = item?.detail?.price ?? 0
                            return (
                                <div className="order-book" key={`index-${index}`}>
                                    <div className="book-content">
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} />
                                        <div className="title">
                                            {item?.detail?.mainText}
                                        </div>
                                        <div className="price">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.detail?.price ?? 0)}
                                        </div>
                                    </div>
                                    <div className="action">
                                        <div className="quantity">
                                            <InputNumber
                                                // onChange={(value) => handleOnChangeInput(value as number, item.detail)}
                                                value={item.quantity}
                                                readOnly
                                            />
                                        </div>
                                        <div className="sum">
                                            Tổng: {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format((item?.detail?.price || 0) * (item?.quantity || 0))}
                                        </div>

                                        <DeleteTwoTone
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleRemoveBook(item._id)}
                                            twoToneColor="#eb2f96"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </Col>

                    <Col md={8} xs={24}>
                        <Form
                            form={form}
                            name="payment-form"
                            onFinish={handlePlaceOrder}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <div className="order-sum">
                                <Form.Item<FieldType>
                                    label="Hình thức thanh toán"
                                    name="method"
                                >
                                    <Radio.Group>
                                        <Space direction="vertical">
                                            <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
                                            <Radio value={"BANKING"}>Chuyển khoản ngân hàng</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Họ và tên"
                                    name="fullName"
                                    rules={[
                                        { required: true, message: 'Tên không được để trống' }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        { required: true, message: 'Số điện thoại không được để trống' }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Địa chỉ nhà nhận hàng"
                                    name="address"
                                    rules={[
                                        { required: true, message: 'Địa chỉ không được để trống' }
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>

                                <div className="calculate">
                                    <span>Tạm tính</span>
                                    <span>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}

                                    </span>
                                </div>
                                <Divider style={{ margin: '10px 0' }} />
                                <div className="calculate">
                                    <span>Tổng tiển</span>
                                    <span className="sum-final">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                                    </span>
                                </div>
                                <Divider style={{ margin: '10px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        color="danger"
                                        variant="solid"
                                        htmlType="submit"
                                        loading={isSubmit}
                                    >
                                        Đặt hàng ({carts?.length ?? 0})
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </Col>
                </Row>

            </div>
        </div>

    )
}

export default Payment