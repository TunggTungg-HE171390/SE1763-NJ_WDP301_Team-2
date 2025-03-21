import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

const PaymentInformation = ({ paymentInfo = null }) => {
    if (!paymentInfo) return null;

    const paymentStatusMappings = {
        PENDING: {
            style: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-200",
            label: "Đang xử lý",
        },
        PAID: {
            style: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-200",
            label: "Thành công",
        },
        EXPIRED: {
            style: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-800 hover:border-red-200",
            label: "Đã hết hạn",
        },
        CANCELLED: {
            style: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-800 hover:border-red-200",
            label: "Đã hủy",
        },
    };

    const getPaymentStatusVariant = (status) =>
        paymentStatusMappings[status]?.style || paymentStatusMappings.Default.style;

    const getPaymentStatusLabel = (status) =>
        paymentStatusMappings[status]?.label || paymentStatusMappings.Default.label;

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">
                    <div className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Thông tin thanh toán
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="font-medium">Mã đơn hàng:</span>
                        <span>{paymentInfo.orderCode}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Mô tả:</span>
                        <span>{paymentInfo.description}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Số tiền:</span>
                        <span>{paymentInfo.amount.toLocaleString("vi-VN")} VND</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Trạng thái:</span>
                        <Badge className={getPaymentStatusVariant(paymentInfo.status)}>
                            {getPaymentStatusLabel(paymentInfo.status)}
                        </Badge>
                    </div>
                    {paymentInfo.status === "PENDING" && (
                        <Button
                            className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-800 hover:text-white"
                            onClick={() => window.open(paymentInfo.checkoutUrl, "_blank")}>
                            Đi đến thanh toán
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

PaymentInformation.propTypes = {
    paymentInfo: PropTypes.shape({
        orderCode: PropTypes.string,
        description: PropTypes.string,
        amount: PropTypes.number,
        status: PropTypes.string,
        checkoutUrl: PropTypes.string,
    }),
};

export default PaymentInformation;
