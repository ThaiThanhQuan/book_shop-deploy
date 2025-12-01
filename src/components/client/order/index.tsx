import { useCurrentApp } from "@/components/context/app.context"
import { DeleteTwoTone } from "@ant-design/icons"
import { App, Button, Col, Divider, Empty, InputNumber, Row } from "antd"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "styles/order.scss"

interface IProps {
    setCurrentStep: (v: number) => void
}

const OrderDetail = (props: IProps) => {
    const { setCurrentStep } = props

    const { carts, setCarts } = useCurrentApp()
    const [totalPrice, setTotalPrice] = useState(0)

    const { message } = App.useApp()


    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price
            })
            setTotalPrice(sum)
        } else {
            setTotalPrice(0)
        }
    }, [carts])

    const handleOnChangeInput = (value: number, book: IBookTable) => {
        if (!value || +value < 1) return
        if (!isNaN(+value)) {

            const cartStorage = localStorage.getItem('carts')
            if (cartStorage && book) {
                const carts = JSON.parse(cartStorage) as ICart[]

                let isExistIndex = carts.findIndex(c => c._id === book?._id)
                if (isExistIndex > -1) {
                    carts[isExistIndex].quantity = +value
                }

                localStorage.setItem("carts", JSON.stringify(carts))
                setCarts(carts)
            }
        }
    }

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem('carts')
        if (cartStorage) {
            const carts = JSON.parse(cartStorage) as ICart[]

            const newCarts = carts.filter(item => item._id !== _id)

            localStorage.setItem("carts", JSON.stringify(newCarts))

            setCarts(newCarts)
        }
    }

    const handleNextStep = () => {
        if (!carts.length) {
            message.error("Không tồn tại sản phẩm trong giỏ hàng.")
            return
        }
        setCurrentStep(1)
    }


    return (
        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div
                style={{
                    padding: "6px 10px",
                    margin: "4px 0",
                }}
            >
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "#1677ff",
                        fontSize: "15px",
                        fontWeight: 600,
                    }}
                >
                    Trang chủ
                </Link>
            </div>

            <div className="order-container" style={{ maxWidth: 1440, margin: "0 auto", overflow: 'hidden' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
                        {carts.length <= 0 ? <Empty /> :
                            carts?.map((item, index) => {
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
                                                    onChange={(value) => handleOnChangeInput(value as number, item.detail)}
                                                    value={item.quantity}
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
                            })
                        }
                    </Col>

                    <Col md={6} xs={24}>
                        <div className="order-sum">
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
                                    onClick={() => handleNextStep()}
                                >
                                    Mua hàng ({carts?.length ?? 0})
                                </Button>
                            </div>

                        </div>
                    </Col>
                </Row>
            </div>
        </div >
    )
}

export default OrderDetail