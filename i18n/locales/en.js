export default {
    // Common/Shared texts
    common: {
        welcome: "Welcome",
        or: "or",
        loading: "Loading...",
    },

    // Button texts
    buttons: {
        login: "Login",
        logout: "Logout",
        register: "Register",
        submit: "Submit",
        cancel: "Cancel",
        back: "Back",
        send: "Send",
        create_account: "Create Account",
        send_reset_link: "Send Reset Link",
    },

    // Form labels & placeholders
    form: {
        email: "Email Address",
        password: "Password",
        confirm_password: "Confirm Password",
        full_name: "Full Name",
        phone: "Phone Number (Optional)",
    },

    // Page titles
    page_titles: {
        home: "Home",
        login: "Sign In",
        register: "Create Account",
        forgot_password: "Forgot Password",
    },

    // Auth pages
    auth: {
        // Login page
        login: {
            title: "Sign in",
            new_user: "New user?",
            create_account: "Create an account",
            forgot_password: "Forgot password?",
            social_title: "Join With Your Favourite Social Media Account",
            terms_text: "By signing in with an account, you agree to SO's",
            terms_of_service: "Terms of Service",
            privacy_policy: "Privacy Policy",
            and: "and",
        },

        // Register page
        register: {
            title: "Create Account",
            already_have_account: "Already have an account?",
            sign_in: "Sign in",
            social_title: "Join With Your Favourite Social Media Account",
            terms_text: "By creating an account, you agree to SO's",
            terms_of_service: "Terms of Service",
            privacy_policy: "Privacy Policy",
            and: "and",
            password_mismatch: "Passwords do not match",
        },

        // Forgot password page
        forgot_password: {
            title: "Forgot Password?",
            description: "No worries! Enter your email address and we'll send you a link to reset your password.",
            back_to_login: "Back to Login",
            remember_password: "Remember your password?",
            sign_in: "Sign in",
            send_different_email: "Send to different email",
            // Success state
            success: {
                title: "Email Sent!",
                message_start: "We've sent a password reset link to",
                message_end: "Please check your inbox and follow the instructions.",
            },
        },
    },

    // Validation messages
    validation: {
        required: "This field is required",
        invalid_email: "Please enter a valid email address",
        password_min_length: "Password must be at least 8 characters",
        password_mismatch: "Passwords do not match",
    },

    // Error messages
    errors: {
        generic: "Something went wrong. Please try again.",
        network: "Network error. Please check your connection.",
        login_failed: "Login failed. Please check your credentials.",
        register_failed: "Registration failed. Please try again.",
    },

    // Success messages
    success: {
        login: "Login successful!",
        register: "Account created successfully!",
        password_reset_sent: "Password reset email sent!",
    },
}
