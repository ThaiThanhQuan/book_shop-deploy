import { gteDashboardAPI } from "@/services/api"
import { Card, Col, Row, Statistic } from "antd"
import { useEffect, useState } from "react"
import CountUp from "react-countup"

const AdminDashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0,
        countBook: 0
    })

    useEffect(() => {
        const initDashboard = async () => {
            const res = await gteDashboardAPI()
            if (res && res.data) setDataDashboard(res.data)
        }
        initDashboard()
    }, [])

    // const formatter = (value: number) => {
    //     return new Intl.NumberFormat().format(value);
    // };

    return (
        <Row gutter={[40, 40]}>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Tổng Users"
                        value={dataDashboard.countUser}
                    />
                </Card>
            </Col>

            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Tổng Đơn hàng"
                        value={dataDashboard.countOrder}
                    />
                </Card>
            </Col>

            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Tổng Books"
                        value={dataDashboard.countBook}
                    // loading
                    />
                </Card>
            </Col>
        </Row>
    )
}

export default AdminDashboard