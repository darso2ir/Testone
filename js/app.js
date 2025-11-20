// شبیه‌سازی API - برای تست بدون بک‌اند
const mockUsers = {
    '09121111111': 'super_admin',
    '09122222222': 'admin',
    '09123333333': 'student'
};

const landingPage = document.getElementById('landing-page');
const loginModal = document.getElementById('login-modal');
const verifyModal = document.getElementById('verify-modal');
const loginForm = document.getElementById('login-form');
const verifyForm = document.getElementById('verify-form');

// مدیریت مدال لاگین
function showLoginModal() {
    loginModal.style.display = 'block';
}

function closeLoginModal() {
    loginModal.style.display = 'none';
    clearForm(loginForm);
}

// مدیریت مدال تأیید
function showVerifyModal() {
    verifyModal.style.display = 'block';
}

function closeVerifyModal() {
    verifyModal.style.display = 'none';
    clearForm(verifyForm);
}

// پاک کردن فرم
function clearForm(form) {
    form.reset();
    removeAlerts();
}

// حذف آلرت‌ها
function removeAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => alert.remove());
}

// نمایش خطا
function showError(message, form) {
    removeAlerts();
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.textContent = message;
    form.insertBefore(alert, form.firstChild);
}

// نمایش موفقیت
function showSuccess(message, form) {
    removeAlerts();
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = message;
    form.insertBefore(alert, form.firstChild);
}

// مدیریت فرم لاگین
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const phone = document.getElementById('phone').value;
    
    if (!isValidPhone(phone)) {
        showError('شماره همراه معتبر نیست', this);
        return;
    }
    
    try {
        setLoading(true);
        
        // شبیه‌سازی ارسال کد
        setTimeout(() => {
            const verificationCode = '12345'; // کد ثابت برای تست
            
            // ذخیره در localStorage برای استفاده در مرحله تأیید
            localStorage.setItem('verification_code', verificationCode);
            localStorage.setItem('verification_phone', phone);
            
            showSuccess(`کد تأیید ارسال شد: ${verificationCode}`, this);
            setLoading(false);
            
            // بعد از 2 ثانیه بستن مدال و نمایش مدال تأیید
            setTimeout(() => {
                closeLoginModal();
                showVerifyModal();
            }, 2000);
            
        }, 1500);
        
    } catch (error) {
        showError('خطا در ارسال کد', this);
        setLoading(false);
    }
});

// مدیریت فرم تأیید
verifyForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const phone = localStorage.getItem('verification_phone');
    const code = document.getElementById('code').value;
    const savedCode = localStorage.getItem('verification_code');
    
    if (!code) {
        showError('لطفا کد تأیید را وارد کنید', this);
        return;
    }
    
    if (code !== savedCode) {
        showError('کد تأیید نامعتبر است', this);
        return;
    }
    
    try {
        setLoading(true);
        
        // شبیه‌سازی تأیید موفق
        setTimeout(() => {
            // تشخیص نقش کاربر
            const userRole = mockUsers[phone] || 'student';
            
            // ذخیره اطلاعات کاربر
            localStorage.setItem('user_phone', phone);
            localStorage.setItem('user_role', userRole);
            localStorage.setItem('is_logged_in', 'true');
            
            showSuccess('ورود موفقیت آمیز! در حال هدایت...', this);
            setLoading(false);
            
            // هدایت به داشبورد بعد از 1 ثانیه
            setTimeout(() => {
                redirectToDashboard(userRole);
            }, 1000);
            
        }, 1500);
        
    } catch (error) {
        showError('خطا در تأیید کد', this);
        setLoading(false);
    }
});

// اعتبارسنجی شماره همراه
function isValidPhone(phone) {
    const phoneRegex = /^09[0-9]{9}$/;
    return phoneRegex.test(phone);
}

// تنظیم وضعیت لودینگ
function setLoading(loading) {
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach(button => {
        button.disabled = loading;
        if (button.textContent.includes('دریافت کد')) {
            button.textContent = loading ? 'در حال ارسال...' : 'دریافت کد تأیید';
        } else {
            button.textContent = loading ? 'در حال تأیید...' : 'تأیید و ورود';
        }
    });
    
    if (loading) {
        document.body.classList.add('loading');
    } else {
        document.body.classList.remove('loading');
    }
}

// هدایت به داشبورد مناسب
function redirectToDashboard(role) {
    const dashboards = {
        'student': 'dashboard/student.html',
        'admin': 'dashboard/admin.html',
        'super_admin': 'dashboard/super-admin.html'
    };
    
    const dashboardUrl = dashboards[role] || 'dashboard/student.html';
    window.location.href = dashboardUrl;
}

// بستن مدال با کلیک خارج از آن
window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === verifyModal) {
        closeVerifyModal();
    }
});

// بررسی اگر کاربر قبلاً لاگین کرده
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('is_logged_in');
    const userRole = localStorage.getItem('user_role');
    
    if (isLoggedIn === 'true' && userRole) {
        redirectToDashboard(userRole);
    }
}

// بررسی وضعیت لاگین هنگام لود صفحه
document.addEventListener('DOMContentLoaded', checkLoginStatus);
