import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Divider, message, Rate, Row } from "antd";
import { useEffect, useRef, useState } from "react"
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import "styles/book.css"
import ModalGallery from "./modal.gallery";
import { useCurrentApp } from "@/components/context/app.context";
import { useNavigate } from "react-router-dom";

interface IProps {
    currentBook: IBookTable | null
}

type UserAction = "MINUS" | "PLUS"

const BookDetail = (props: IProps) => {
    const { currentBook } = props

    const [imageGallery, setImageGallery] = useState<{
        original: string
        thumbnail: string
        originalClass: string
        thumbnailClass: string
    }[]>([])

    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const refGallery = useRef<ImageGallery>(null)
    const [currentQuantity, setCurrentQuantity] = useState<number>(1)

    const { carts, setCarts, user } = useCurrentApp()

    const navigate = useNavigate();

    const { message } = App.useApp()

    // const images = [
    //     {
    //         original: "https://picsum.photos/id/1018/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1018/250/150/",
    //         originalClass: "original-image",
    //         thumbnailClass: 'thumbnail-image'
    //     },
    //     {
    //         original: "https://picsum.photos/id/1015/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1015/250/150/",
    //         originalClass: "original-image",
    //         thumbnailClass: 'thumbnail-image'
    //     },
    //     {
    //         original: "https://picsum.photos/id/1019/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1019/250/150/",
    //         originalClass: "original-image",
    //         thumbnailClass: 'thumbnail-image'
    //     },
    //     {
    //         original: "https://picsum.photos/id/1018/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1018/250/150/",
    //         originalClass: "original-image",
    //         thumbnailClass: 'thumbnail-image'
    //     },
    //     {
    //         original: "https://picsum.photos/id/1015/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1015/250/150/",
    //         originalClass: "original-image",
    //         thumbnailClass: 'thumbnail-image'
    //     },
    //     {
    //         original: "https://picsum.photos/id/1019/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1019/250/150/",
    //         originalClass: "original-image",
    //         thumbnailClass: 'thumbnail-image'
    //     },
    // ];

    useEffect(() => {
        if (currentBook) {
            const images = []
            if (currentBook.thumbnail) {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image"
                })
            }
            if (currentBook.slider) {
                currentBook.slider?.map(item => {
                    images.push(
                        {
                            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.slider}`,
                            thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.slider}`,
                            originalClass: "original-image",
                            thumbnailClass: "thumbnail-image"
                        }
                    )
                })
            }
            setImageGallery(images)
        }
    }, [currentBook])

    const handleOnClickImage = () => {
        setIsOpenModalGallery(true)
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }

    const handleChangeButton = (type: UserAction) => {
        if (type === "MINUS") {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1)
        }
        if (type === "PLUS" && currentBook) {
            if (currentQuantity === +currentBook.quantity) return;
            setCurrentQuantity(currentQuantity + 1)
        }
    }

    const handleChangeInput = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && currentBook && +value < +currentBook.quantity) {
                setCurrentQuantity(+value)
            }
        }
    }

    const handleAddToCart = (isBuyNow = false) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để thực hiện tính năng này.")
            return
        }

        // update localstorage
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && currentBook) {
            // update
            const carts = JSON.parse(cartStorage) as ICart[]


            // check exist
            let isExistIndex = carts.findIndex(c => c._id === currentBook?._id)
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = carts[isExistIndex].quantity + currentQuantity
            } else {
                carts.push({
                    quantity: currentQuantity,
                    _id: currentBook._id,
                    detail: currentBook
                })
            }

            localStorage.setItem("carts", JSON.stringify(carts))

            setCarts(carts)

        } else {
            // create
            const data = [{
                _id: currentBook?._id!,
                quantity: currentQuantity,
                detail: currentBook!
            }]
            localStorage.setItem("carts", JSON.stringify(data))

            setCarts(data)
        }

        if (isBuyNow) {
            navigate("/order")
        } else {
            message.success("Thêm sản phẩm vào giỏ hàng thành công.")
        }
    }


    return (
        <>
            <div style={{ background: "#efefef", padding: "20px 0" }}>
                <div
                    className="view-detail-book"
                    style={{
                        maxWidth: 1300,
                        margin: "0 auto",
                    }}
                >
                    <div
                        style={{
                            padding: "20px",
                            background: "#fff",
                            borderRadius: 5,
                        }}
                    >
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    slideOnThumbnailOver={true}
                                    onClick={() => handleOnClickImage()}
                                    thumbnailPosition="bottom"
                                    showNav={false}
                                />
                            </Col>
                            <Col md={14} sm={24} >
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={imageGallery}
                                        showPlayButton={false}          // hide play button
                                        showFullscreenButton={false}    // hide fullscreen button
                                        renderLeftNav={() => <></>}     // hide left arrow
                                        renderRightNav={() => <></>}    // hide right arrow
                                        slideOnThumbnailOver={true}     // hover -> auto scroll
                                        onClick={() => handleOnClickImage()}
                                    />
                                </Col>

                                <Col span={24}>
                                    <div className="author">
                                        Tác giả: <a href="#">{currentBook?.author}</a>
                                    </div>

                                    <div className="title">
                                        {currentBook?.mainText}
                                    </div>

                                    <div className="rating">
                                        <Rate
                                            value={5}
                                            disabled
                                            style={{ color: "#ffce3d", fontSize: "16px" }}
                                        />
                                        <span className="sold">
                                            <Divider type="vertical" />
                                            Đã bán {currentBook?.sold ?? 0}
                                        </span>
                                    </div>

                                    <div className="price">
                                        <span className="currency">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(currentBook?.price ?? 0)}
                                        </span>
                                    </div>

                                    <div className="delivery">
                                        <div>
                                            <span className="left">Vận chuyển</span>
                                            <span className="right">Miễn phí vận chuyển</span>
                                        </div>
                                    </div>

                                    <div className="quantity">
                                        <span className="left">Số lượng</span>
                                        <span className="right">
                                            <button onClick={() => handleChangeButton("MINUS")}>
                                                <MinusOutlined />
                                            </button>
                                            <input onChange={(e) => handleChangeInput(e.target.value)} value={currentQuantity} />
                                            <button onClick={() => handleChangeButton("PLUS")}>
                                                <PlusOutlined />
                                            </button>
                                        </span>
                                    </div>

                                    <div className="buy">
                                        <button className="cart" onClick={() => handleAddToCart()} >
                                            <BsCartPlus className="icon-cart" /> Thêm vào giỏ hàng
                                        </button>
                                        <button className="now" onClick={() => handleAddToCart(true)} >Mua ngay</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div >
            </div >

            <ModalGallery
                isOpenModalGallery={isOpenModalGallery}
                setIsOpenModalGallery={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={imageGallery}
                title={currentBook?.mainText ?? ""}
            />
        </>
    )
}

export default BookDetail