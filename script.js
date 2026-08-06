// ============================================
// ระบบ Login แบบรวม (User + Admin)
// ============================================

// ===== 1. ข้อมูลผู้ใช้ (จำลอง) =====
const USERS = {
    // ผู้ใช้ทั่วไป
    'user@surat.com': {
        password: 'user123',
        role: 'user',
        name: 'ผู้ใช้ทั่วไป'
    },
    // ผู้ดูแลระบบ
    'admin@surat.com': {
        password: 'admin123',
        role: 'admin',
        name: 'ผู้ดูแลระบบ'
    }
};

// ===== 2. แสดง/ซ่อนรหัสผ่าน =====
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
}

// ===== 3. ตรวจสอบการ Login =====
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMessage');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const loginType = document.querySelector('input[name="loginType"]:checked').value;

        // ตรวจสอบว่ากรอกครบหรือไม่
        if (email === '' || password === '') {
            showError('⚠️ กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
            return;
        }

        // ตรวจสอบความยาวรหัสผ่าน
        if (password.length < 6) {
            showError('⚠️ รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
            return;
        }

        // ตรวจสอบว่ามีผู้ใช้นี้อยู่ในระบบหรือไม่
        if (USERS[email]) {
            const user = USERS[email];
            
            // ตรวจสอบรหัสผ่าน
            if (password === user.password) {
                // ✅ Login สำเร็จ

                // ตรวจสอบว่าเลือกประเภทถูกต้องหรือไม่
                if (loginType === 'admin' && user.role !== 'admin') {
                    showError('⚠️ อีเมลนี้ไม่ใช่บัญชีผู้ดูแลระบบ กรุณาเลือก "ผู้ใช้ทั่วไป"');
                    return;
                }

                if (loginType === 'user' && user.role === 'admin') {
                    showError('⚠️ อีเมลนี้เป็นบัญชีผู้ดูแลระบบ กรุณาเลือก "ผู้ดูแลระบบ"');
                    return;
                }

                // บันทึก session
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userName', user.name);
                localStorage.setItem('loginTime', new Date().toISOString());

                // จำฉัน
                if (document.getElementById('rememberMe').checked) {
                    localStorage.setItem('rememberMe', 'true');
                }

                // แจ้งเตือนและเปลี่ยนหน้า
                errorMsg.style.display = 'none';
                showSuccessAndRedirect(user.role);
            } else {
                // ❌ รหัสผ่านผิด
                showError('❌ รหัสผ่านไม่ถูกต้อง');
                logFailedAttempt(email);
            }
        } else {
            // ❌ ไม่พบผู้ใช้
            showError('❌ ไม่พบอีเมลนี้ในระบบ กรุณาสมัครสมาชิก');
            logFailedAttempt(email);
        }
    });
}

// ===== 4. ฟังก์ชันแสดง Error =====
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    
    // เลื่อนไปที่ error
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== 5. ฟังก์ชัน Login สำเร็จ =====
function showSuccessAndRedirect(role) {
    // แสดงข้อความสำเร็จ
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        เข้าสู่ระบบสำเร็จ! กำลังนำคุณไปยังหน้า ${role === 'admin' ? 'ผู้ดูแลระบบ' : 'หลัก'}...
    `;
    successMsg.style.cssText = `
        background: rgba(46, 213, 115, 0.2);
        color: #2ed573;
        padding: 12px;
        border-radius: 12px;
        text-align: center;
        margin-top: 15px;
        border: 1px solid rgba(46, 213, 115, 0.3);
        animation: fadeIn 0.5s;
    `;
    
    // เพิ่ม CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // แทนที่ error ด้วย success
    errorMsg.style.display = 'none';
    const loginCard = document.querySelector('.login-card');
    loginCard.appendChild(successMsg);

    // เปลี่ยนหน้าตาม role
    setTimeout(() => {
        if (role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }, 2000);
}

// ===== 6. บันทึกการพยายาม Login ผิด =====
function logFailedAttempt(email) {
    let attempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
    
    if (!attempts[email]) {
        attempts[email] = 0;
    }
    attempts[email]++;
    localStorage.setItem('loginAttempts', JSON.stringify(attempts));

    if (attempts[email] >= 3) {
        showError(`⚠️ คุณพยายามเข้าสู่ระบบผิดพลาด ${attempts[email]} ครั้ง กรุณาติดต่อผู้ดูแลระบบ`);
    }
}

// ===== 7. ตรวจสอบสถานะ Login (ป้องกันการเข้าหน้าโดยตรง) =====
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    // ถ้ายังไม่ login และกำลังจะเข้าหน้า dashboard
    if (!isLoggedIn && (currentPage === 'dashboard.html' || currentPage === 'admin-dashboard.html')) {
        window.location.href = 'index.html';
        return false;
    }
    
    // ถ้า login แล้ว และอยู่หน้า login
    if (isLoggedIn && currentPage === 'index.html') {
        const role = localStorage.getItem('userRole');
        if (role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        return false;
    }
    
    return true;
}

// ===== 8. ตรวจสอบสิทธิ์ Admin =====
function checkAdmin() {
    const role = localStorage.getItem('userRole');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'admin-dashboard.html' && role !== 'admin') {
        alert('⚠️ คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

// ===== 9. ฟังก์ชัน Logout =====
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('loginTime');
    window.location.href = 'index.html';
}

// ===== 10. ปุ่ม GitHub =====
const githubBtn = document.getElementById('githubLogin');
if (githubBtn) {
    githubBtn.addEventListener('click', function() {
        alert('🔗 กำลังเชื่อมต่อกับ GitHub...\n(เปลี่ยน URL เป็นของจริง)');
        // window.location.href = 'https://github.com/login/oauth/authorize?client_id=YOUR_ID';
    });
}

// ===== 11. เรียกใช้ตอนโหลดหน้า =====
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    checkAdmin();
    
    // ถ้า login แล้ว แสดงชื่อผู้ใช้
    const userName = localStorage.getItem('userName');
    if (userName && document.getElementById('userDisplay')) {
        document.getElementById('userDisplay').textContent = userName;
    }
});

console.log('✅ ระบบ Login พร้อมทำงาน!');
