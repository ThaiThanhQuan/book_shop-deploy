import MobileFilter from "@/components/client/book/mobile.filter"
import { getBooksAPI, getCategoryAPI } from "@/services/api"
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons"
import { Button, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Spin, Tabs, type FormProps } from "antd"
import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import 'styles/home.scss'

type FieldType = {
    range: {
        from: number
        to: number
    }
    category: string[]
}

const HomePage = () => {
    const [searchTerm] = useOutletContext() as any

    let navigate = useNavigate();

    const [listCategory, setListCategory] = useState<{
        label: string, value: string
    }[]>([])

    const [listBook, setListBook] = useState<IBookTable[]>([])
    const [current, setCurrent] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [total, setTotal] = useState<number>(0)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>("")
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold")

    const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false)

    const [form] = Form.useForm()

    useEffect(() => {
        const initCategory = async () => {
            const res = await getCategoryAPI()
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d)
            }
        }
        initCategory()
    }, [])

    useEffect(() => {
        fetchBook()
    }, [current, pageSize, filter, sortQuery, searchTerm])

    const fetchBook = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`
        }

        if (sortQuery) {
            query += `&${sortQuery}`
        }

        if (searchTerm) {
            query += `&mainText=/${searchTerm}/i`
        }

        const res = await getBooksAPI(query)
        if (res && res.data) {
            setListBook(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleChangeFilter = (changedValues: any, values: any) => {
        if (changedValues.category) {
            const cate = values.category
            if (cate && cate.length > 0) {
                const f = cate.join(',')
                setFilter(`category=${f}`)
            } else {
                setFilter('')
            }
        }
    }

    const handleOnChangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;

            if (values?.category?.length) {
                const cate = values?.category?.join(',');
                f += `&category=${cate}`;
            }

            setFilter(f);
        }
    };

    const items = [
        {
            key: 'sort=-sold',
            label: 'Phổ biến',
            children: <></>
        },
        {
            key: 'sort=-updatedAt',
            label: 'Hàng mới',
            children: <></>
        },
        {
            key: 'sort=price',
            label: 'Giá thấp đến cao',
            children: <></>
        },
        {
            key: 'sort=-price',
            label: 'Giá cao đến thấp',
            children: <></>
        }
    ]

    return (
        <>
            <div className="container">
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0} className="product-filter">
                        <div className="product-filter-header">
                            <span><FilterTwoTone className="filter-icon" />Bộ lọc tìm kiếm</span>
                            <ReloadOutlined
                                className="reset-icon"
                                title="Reset"
                                onClick={() => {
                                    form.resetFields()
                                    setFilter('')
                                }}
                            />
                        </div>
                        <Form
                            onFinish={onFinish}
                            className="filter-form"
                            form={form}
                            onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                        >
                            <div className="product-filter-group">
                                <Form.Item
                                    name="category"
                                    label="Danh mục sản phẩm"
                                    labelCol={{ span: 24 }}
                                >
                                    <Checkbox.Group>
                                        <Row>
                                            {listCategory?.map((item, index) => {
                                                return (
                                                    <Col span={24} key={`index-${index}`}>
                                                        <Checkbox value={item.value} className="filter-checkbox">
                                                            {item.label}
                                                        </Checkbox>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                            </div>
                            <Divider className="filter-divider" />
                            <Form.Item
                                label="Khoảng giá"
                                labelCol={{ span: 24 }}
                                className="product-filter-group"
                            >
                                <div className="price-range-group">
                                    <Form.Item name={["range", "form"]}>
                                        <InputNumber
                                            name="form"
                                            min={0}
                                            placeholder="đ Từ"
                                            className="price-input"
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                    </Form.Item>

                                    <Form.Item name={["range", "to"]}>
                                        <InputNumber
                                            name="fotorm"
                                            min={0}
                                            placeholder="đ ĐẾN"
                                            className="price-input"
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                    </Form.Item>
                                </div>

                                <div>
                                    <Button onClick={() => form.submit()} className="apply-btn" type="primary">Áp dụng</Button>
                                </div>
                            </Form.Item>

                            <Divider className="filter-divider" />
                            <Form.Item
                                label="Đánh giá"
                                labelCol={{ span: 24 }}
                                className="product-filter-group"
                            >
                                <div>
                                    <Rate className="rating-item" value={5} disabled style={{ color: '#ffce3d' }}></Rate>
                                </div>
                                <div>
                                    <Rate className="rating-item" value={4} disabled style={{ color: '#ffce3d' }}></Rate>
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate className="rating-item" value={3} disabled style={{ color: '#ffce3d' }}></Rate>
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate className="rating-item" value={2} disabled style={{ color: '#ffce3d' }}></Rate>
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate className="rating-item" value={1} disabled style={{ color: '#ffce3d' }}></Rate>
                                    <span className="ant-rate-text">trở lên</span>
                                </div>

                            </Form.Item>
                        </Form>
                    </Col>

                    <Col md={20} sm={24} xs={24} >
                        <Spin spinning={isLoading} tip="Loading....">
                            <div style={{ padding: '20px', background: "#fff" }}>
                                <Row style={{ marginBottom: 20 }}>
                                    <Col xs={24} md={18}>
                                        <Tabs
                                            defaultActiveKey="sort=-sold"
                                            items={items}
                                            onChange={(value) => { setSortQuery(value) }}
                                        />
                                    </Col>

                                    <Col xs={24} md={0}>
                                        <div style={{ marginBottom: 20 }}>
                                            <span onClick={() => setShowMobileFilter(true)}>
                                                <FilterTwoTone />
                                                <span style={{ fontWeight: 500 }}>Lọc</span>
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 16]} className="customize-row">
                                    {listBook?.map((item, index) => {
                                        return (
                                            <Col
                                                xs={12}   // 2 sản phẩm / row
                                                sm={12}   // 2 sản phẩm / row
                                                md={6}    // 4 sản phẩm / row
                                                lg={6}    // Tạm set 2 sản phẩm / row, sẽ CSS lại
                                                xl={6}
                                                onClick={() => navigate(`/book/${item._id}`)}
                                                className="book-item"
                                                key={`book-${index}`}>

                                                <div className="wrapper">
                                                    <div className="thumbnail">
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                                    </div>
                                                    <div className="text" title={item.mainText}>{item.mainText}</div>
                                                    <div className="price">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                    </div>
                                                    <div className="rate_sold">
                                                        <Rate value={5} disabled style={{ color: '#ffce3d' }}></Rate>
                                                        <span>Đã bán 1k</span>
                                                    </div>
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </Row>

                                <Divider />
                                <Row style={{ display: 'flex', justifyContent: "center" }}>
                                    <Pagination
                                        current={current}
                                        total={total}
                                        pageSize={pageSize}
                                        responsive
                                        onChange={(p, s) => handleOnChangePage({ current: p, pageSize: s })}
                                    />
                                </Row>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div>

            <MobileFilter
                isOpen={showMobileFilter}
                setIsOpen={setShowMobileFilter}
                handleChangeFilter={handleChangeFilter}
                listCategory={listCategory}
                onFinish={onFinish}
            />
        </>
    )
}

export default HomePage