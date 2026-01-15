export default {
    // Các text dùng chung
    common: {
        welcome: "Chào mừng",
        or: "hoặc",
        loading: "Đang tải...",
    },

    // Các text cho nút bấm
    buttons: {
        login: "Đăng nhập",
        logout: "Đăng xuất",
        register: "Đăng ký",
        submit: "Gửi",
        cancel: "Hủy",
        back: "Quay lại",
        send: "Gửi",
        create_account: "Tạo tài khoản",
        send_reset_link: "Gửi liên kết đặt lại",
    },

    // Nhãn và placeholder cho form
    form: {
        email: "Địa chỉ Email",
        password: "Mật khẩu",
        confirm_password: "Xác nhận mật khẩu",
        full_name: "Họ và tên",
        phone: "Số điện thoại (Không bắt buộc)",
    },

    // Tiêu đề trang
    page_titles: {
        home: "Trang chủ",
        login: "Đăng nhập",
        register: "Tạo tài khoản",
        forgot_password: "Quên mật khẩu",
    },

    // Các trang xác thực
    auth: {
        // Trang đăng nhập
        login: {
            title: "Đăng nhập",
            new_user: "Người dùng mới?",
            create_account: "Tạo tài khoản",
            forgot_password: "Quên mật khẩu?",
            social_title: "Đăng nhập bằng tài khoản mạng xã hội yêu thích của bạn",
            terms_text: "Bằng việc đăng nhập, bạn đồng ý với",
            terms_of_service: "Điều khoản dịch vụ",
            privacy_policy: "Chính sách bảo mật",
            and: "và",
        },

        // Trang đăng ký
        register: {
            title: "Tạo tài khoản",
            already_have_account: "Đã có tài khoản?",
            sign_in: "Đăng nhập",
            social_title: "Đăng ký bằng tài khoản mạng xã hội yêu thích của bạn",
            terms_text: "Bằng việc tạo tài khoản, bạn đồng ý với",
            terms_of_service: "Điều khoản dịch vụ",
            privacy_policy: "Chính sách bảo mật",
            and: "và",
            password_mismatch: "Mật khẩu không khớp",
        },

        // Trang quên mật khẩu
        forgot_password: {
            title: "Quên mật khẩu?",
            description: "Đừng lo lắng! Nhập địa chỉ email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu.",
            back_to_login: "Quay lại đăng nhập",
            remember_password: "Nhớ mật khẩu của bạn?",
            sign_in: "Đăng nhập",
            send_different_email: "Gửi đến email khác",
            // Trạng thái thành công
            success: {
                title: "Đã gửi Email!",
                message_start: "Chúng tôi đã gửi liên kết đặt lại mật khẩu đến",
                message_end: "Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn.",
            },
        },
    },

    // Thông báo xác thực
    validation: {
        required: "Trường này là bắt buộc",
        invalid_email: "Vui lòng nhập địa chỉ email hợp lệ",
        password_min_length: "Mật khẩu phải có ít nhất 8 ký tự",
        password_mismatch: "Mật khẩu không khớp",
    },

    // Thông báo lỗi
    errors: {
        generic: "Đã xảy ra lỗi. Vui lòng thử lại.",
        network: "Lỗi mạng. Vui lòng kiểm tra kết nối của bạn.",
        login_failed: "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.",
        register_failed: "Đăng ký thất bại. Vui lòng thử lại.",
    },

    // Thông báo thành công
    success: {
        login: "Đăng nhập thành công!",
        register: "Tạo tài khoản thành công!",
        password_reset_sent: "Đã gửi email đặt lại mật khẩu!",
    },
}
