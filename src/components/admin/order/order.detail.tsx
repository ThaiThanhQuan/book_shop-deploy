import { Drawer } from "antd"

interface IProps {
    openViewDetail: boolean
    setOpenViewDetail: (v: boolean) => void
    dataViewDetail: IOrderTable | null
    setDataViewDetail: (v: IOrderTable | null) => void
}
const DetailOrder = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props
    return (
        <Drawer
            title="Chi tiết đơn hàng"
            onClose={() => {
                setOpenViewDetail(false)
                setDataViewDetail(null)
            }}
            open={openViewDetail}
            style={{ padding: '20px', background: '#f9f9f9' }} // nền Drawer
        >
            {dataViewDetail?.detail?.map((item, index) => {
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
    )
}

export default DetailOrder