const messages = {
  MESSAGE001: (username, authCode) => `
    Hello, ${username}

** This is an automated message -- please do not reply as you will not receive a response. **

This message is in response to your request to reset your account password. 
Please click the link below and follow the instructions to change your password.
Your password is: ${authCode}

https://chgpwd.fpt.edu.vn
Thank you.
SlayMe-Team.
  `,

  MESSAGE002:(username) => `
    Hello, ${username}
Chúc mừng! Bạn đã đặt thành công dịch vụ tại SlayMe !
Thông tin chi tiết về lịch hẹn của bạn:

Dịch vụ đã đặt: Triệt lông chân
Thời gian: 19:00, 24/01/2025
Địa điểm: Trường Đại học FPT 
Địa chỉ: Khu Công Nghệ Cao Hòa Lạc, km 29 
Chúng tôi rất mong được chào đón bạn tại BeautyX. Nếu có bất kỳ thay đổi nào về lịch hẹn, bạn vui lòng liên hệ với chúng tôi để điều chỉnh.

Cảm ơn bạn đã lựa chọn sử dụng dịch vụ booking của SlayMe, hẹn gặp lại bạn sớm!`,

  MESSAGE_ERROR: "ERROR: Unknown action code.",
};

module.exports = messages;