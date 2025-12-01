import { createBookAPI, getCategoryAPI, updateBookAPI, uploadFileAPI } from "@/services/api";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Modal, Form, App, Divider, InputNumber, Select, Row, Col, Upload } from "antd"
import type { FormProps, GetProp, UploadFile, UploadProps } from 'antd';
import type { RcFile, UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { v4 as uuidv4 } from 'uuid';


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = "thumbnail" | "slider";

type FieldType = {
    _id: string;
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: any;
    slider: any;
};

interface IProps {
    openUpdateBook: boolean;
    setOpenUpdateBook: (open: boolean) => void;
    refreshTable: () => void;
    dataUpdate: IBookTable | null;
    setDataUpdate: (v: IBookTable | null) => void;
}

const UpdateBook = (props: IProps) => {
    const { openUpdateBook, setOpenUpdateBook, refreshTable, dataUpdate, setDataUpdate } = props
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const { message, notification } = App.useApp();

    const [listCategory, setListCategory] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [previewThumbnail, setPreviewThumbnail] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const [previewOpen, setPreviewOpen] = useState(false);

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d);
            }
        }
        fetchCategory();
    }, [])

    useEffect(() => {
        if (dataUpdate) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`
                }
            ]

            const arrSlider = dataUpdate?.slider?.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                }
            })

            form.setFieldsValue({
                _id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                price: dataUpdate.price,
                category: dataUpdate.category,
                quantity: dataUpdate.quantity,

                thumbnail: arrThumbnail,
                slider: arrSlider,
            })
            setFileListThumbnail(arrThumbnail as any)
            setFileListSlider(arrSlider as any)
        }
    }, [dataUpdate])

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)

        const { _id, mainText, author, price, quantity, category } = values;
        const thumbnail = fileListThumbnail?.[0]?.name ?? ""
        const slider = fileListSlider.map(item => item.name) ?? [];
        const res = await updateBookAPI(_id, mainText, author, price, quantity, category, thumbnail, slider);

        if (res && res.data) {
            message.success("Cập nhật book thành công!")
            form.resetFields()
            setFileListSlider([])
            setFileListThumbnail([])
            setOpenUpdateBook(false)
            refreshTable()
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }

        setIsSubmit(false)
    };

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Hình ảnh phải nhỏ hơn ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === "thumbnail") {
            setFileListThumbnail([]);
        }
        if (type === "slider") {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    }

    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        // Khi file đang upload
        if (info.file.status === 'uploading') {
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return
        }
        // Khi upload xong
        if (info.file.status === 'done') {
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "book");

        if (res && res.data) {
            const uploadedFile: any = [{
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }]

            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }])
            } else {
                setFileListSlider((prevState) => [...prevState, { ...uploadedFile }])
            }
        }

        if (onSuccess) {
            onSuccess("ok");
        } else {
            message.error(res.message);
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <Modal
            title="Cập nhật book"
            open={openUpdateBook}
            onOk={() => {
                form.submit()
            }}
            onCancel={() => {
                form.resetFields()
                setFileListSlider([])
                setFileListThumbnail([])
                setOpenUpdateBook(false)
                setDataUpdate(null)
            }}
            destroyOnClose={true}
            okButtonProps={{ loading: isSubmit }}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
            width={"50vw"}
            maskClosable={false}
        >
            <Divider />
            <Form
                form={form}
                onFinish={onFinish}
            >
                <Row gutter={13}>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="_id"
                        name="_id"
                        hidden
                    >
                        <Input />
                    </Form.Item>

                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Tên sách"
                            name="mainText"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Tác giả"
                            name="author"
                            rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Giá tiền"
                            name="price"
                            rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter="đ"
                            />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Thể loại"
                            name="category"
                            rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                        >
                            <Select
                                showSearch
                                allowClear
                                options={listCategory}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Số lượng"
                            name="quantity"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Ảnh thumbnail"
                            name="thumbnail"
                            rules={[{ required: true, message: 'Vui lòng nhập upload thumbnail!' }]}

                            // convert value from Upload => form
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                maxCount={1}
                                multiple={false}
                                customRequest={(options) => handleUploadFile(options, "thumbnail")}
                                beforeUpload={beforeUpload}
                                onChange={(info) => handleChange(info, "thumbnail")}
                                onPreview={handlePreview}
                                onRemove={(file) => handleRemove(file, 'thumbnail')}
                                fileList={fileListThumbnail}
                            >
                                <div>
                                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>

                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Ảnh slider"
                            name="slider"
                            rules={[{ required: true, message: 'Vui lòng nhập upload slider!' }]}

                            // convert value from Upload => form
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                multiple
                                customRequest={(options) => handleUploadFile(options, "slider")}
                                beforeUpload={beforeUpload}
                                onChange={(info) => handleChange(info, "slider")}
                                onPreview={handlePreview}
                                onRemove={(file) => handleRemove(file, 'slider')}
                                fileList={fileListSlider}
                            >
                                <div>
                                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>

                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal >
    )
}

export default UpdateBook;  