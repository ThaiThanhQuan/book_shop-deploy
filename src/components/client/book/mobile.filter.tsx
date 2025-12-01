import { Button, Checkbox, Col, Divider, Drawer, Form, InputNumber, Rate, Row } from "antd";

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    handleChangeFilter: any;
    listCategory: { label: string; value: string }[];
    onFinish: any;
}

const MobileFilter = (props: IProps) => {
    const {
        isOpen, setIsOpen,
        handleChangeFilter,
        listCategory, onFinish
    } = props;

    const [form] = Form.useForm();

    return (
        <Drawer
            title="Lọc sản phẩm"
            placement="right"
            onClose={() => setIsOpen(false)}
            open={isOpen}
        >
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
        </Drawer>
    );
};

export default MobileFilter