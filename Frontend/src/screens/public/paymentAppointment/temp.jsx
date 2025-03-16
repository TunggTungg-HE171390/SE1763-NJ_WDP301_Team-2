import { useState, useEffect } from "react";
import { usePayOS } from "@payos/payos-checkout";
import * as API from "@/api";
// import "./App.css";

const ProductDisplay = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isCreatingLink, setIsCreatingLink] = useState(false);

    const [payOSConfig, setPayOSConfig] = useState({
        RETURN_URL: "https://tamgiao.github.io/tamgiao/", // required
        ELEMENT_ID: "embedded-payment-container", // required
        CHECKOUT_URL: null, // required
        embedded: true, // Nếu dùng giao diện nhúng
        onSuccess: () => {
            //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
            setIsOpen(false);
            setMessage("Thanh toan thanh cong");
        },
    });

    const { open, exit } = usePayOS(payOSConfig);

    const handleGetPaymentLink = async () => {
        setIsCreatingLink(true);
        exit();
        const body = {
            amount: 350000,
            description: "Thanh toan don hang",
            items: [
                {
                    name: `Buổi tư vấn với tư vấn viên`,
                    quantity: 1,
                    price: 350000,
                },
            ],
        };
        try {
            const paymentResponse = await API.createPaymentLink(body);

            setPayOSConfig((oldConfig) => ({
                ...oldConfig,
                CHECKOUT_URL: paymentResponse.data.paymentLink,
            }));
        } catch (error) {
            console.error("Error fetching payment link:", error);
        }

        setIsOpen(true);
        setIsCreatingLink(false);
    };

    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL != null) {
            open();
        }
    }, [payOSConfig, open]);
    return message ? (
        <Message message={message} />
    ) : (
        <div className="main-box">
            <div>
                <div className="checkout">
                    <div className="product">
                        <p>
                            <strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly
                        </p>
                        <p>
                            <strong>Giá tiền:</strong> 2000 VNĐ
                        </p>
                        <p>
                            <strong>Số lượng:</strong> 1
                        </p>
                    </div>
                    <div className="flex">
                        {!isOpen ? (
                            <div>
                                {isCreatingLink ? (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "10px",
                                            fontWeight: "600",
                                        }}>
                                        Creating Link...
                                    </div>
                                ) : (
                                    <button
                                        id="create-payment-link-btn"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            handleGetPaymentLink();
                                        }}>
                                        Tạo Link thanh toán Embedded
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button
                                style={{
                                    backgroundColor: "gray",
                                    color: "white",
                                    width: "100%",
                                    paddingTop: "10px",
                                    paddingBottom: "10px",
                                    fontSize: "14px",
                                    marginTop: "5px",
                                }}
                                onClick={(event) => {
                                    event.preventDefault();
                                    setIsOpen(false);
                                    exit();
                                }}>
                                Đóng Link
                            </button>
                        )}
                    </div>
                </div>
                {isOpen && (
                    <div style={{ maxWidth: "400px", padding: "2px" }}>
                        Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để hệ thống tự động cập nhật.
                    </div>
                )}
                <div
                    id="embedded-payment-container"
                    style={{
                        height: "350px",
                    }}></div>
            </div>
        </div>
    );
};

const Message = ({ message }) => (
    <div className="main-box">
        <div className="checkout">
            <div className="product" style={{ textAlign: "center", fontWeight: "500" }}>
                <p>{message}</p>
            </div>
            <form action="/">
                <button type="submit" id="create-payment-link-btn">
                    Quay lại trang thanh toán
                </button>
            </form>
        </div>
    </div>
);

export default function App() {
    return <ProductDisplay />;
}
