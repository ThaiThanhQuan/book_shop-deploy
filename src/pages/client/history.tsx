import { getHistoryAPI } from "@/services/api";
import { FORMATE_DATE_VN } from "@/services/helper";
import { App, Divider, Drawer, Table, Tag, type TableProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const HistoryPage = () => {
    const columns: TableProps<IHistory>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'name',
            render: (item, record, index) => (<>{index + 1}</>),
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            render: (item, record, index) => {
                return dayjs(item).format(FORMATE_DATE_VN)
            },
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (item, record, index) => {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'createdAt',
            render: (item, record, index) => (
                <Tag color={'green'}>
                    Thành công
                </Tag>
            )
        },
        {
            title: 'Chi tiết',
            dataIndex: 'action',
            render: (_, record) => (
                <a onClick={() => {
                    setOpenDetail(true)
                    setDataDetail(record)
                }} href="#">
                    Xem chi tiết
                </a>
            )
        },
    ];

    const [dataHistory, setDataHistory] = useState<IHistory[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const [openDetail, setOpenDetail] = useState<boolean>(false)
    const [dataDetail, setDataDetail] = useState<IHistory | null>(null)

    const { notification } = App.useApp()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getHistoryAPI();
            if (res && res.data) {
                setDataHistory(res.data);
            } else {
                notification.error({
                    message: 'Đã có lỗi xảy ra',
                    description: res.message
                });
            }

            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <div style={{ margin: 50 }}>
            <div
                style={{
                    padding: "6px 0px",
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

            <div>Lịch sử mua hàng</div>
            <Divider />
            <Table
                bordered
                columns={columns}
                dataSource={dataHistory}
                rowKey={"_id"}
                loading={loading}
            />
            <Drawer
                title="Chi tiết đơn hàng"
                onClose={() => {
                    setOpenDetail(false)
                    setDataDetail(null)
                }}
                open={openDetail}
                style={{ padding: '20px', background: '#f9f9f9' }} // nền Drawer
            >
                {dataDetail?.detail?.map((item, index) => {
                    return (
                        <ul
                            key={index}
                            style={{
                                listStyle: 'none',
                                padding: '15px',
                                marginBottom: '10px',
                                borderRadius: '8px',
                                background: '#fff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                            <li style={{ fontWeight: 600, fontSize: '16px', marginBottom: '5px' }}>
                                Tên sách: {item.bookName}
                            </li>
                            <li style={{ fontSize: '14px', color: '#555' }}>
                                Số lượng: {item.quantity}
                            </li>
                        </ul>
                    )
                })}
            </Drawer>
        </div>
    )
}

export default HistoryPage