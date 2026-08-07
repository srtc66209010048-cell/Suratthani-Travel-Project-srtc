// ============================================
// ระบบ Login Surat Thani Travel (แบบใหม่)
// ============================================

// ===== 1. ข้อมูลผู้ใช้ (จำลอง) =====
const USERS = {
    'user@surat.com': {
        password: 'user123',
        role: 'user',
        name: 'ผู้ใช้ทั่วไป'
    },
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
            
            if (password === user.password) {
                // ✅ Login สำเร็จ
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userName', user.name);
                localStorage.setItem('loginTime', new Date().toISOString());

                if (document.getElementById('rememberMe').checked) {
                    localStorage.setItem('rememberMe', 'true');
                }

                errorMsg.style.display = 'none';
                showSuccessAndRedirect(user.role);
            } else {
                showError('❌ รหัสผ่านไม่ถูกต้อง');
                logFailedAttempt(email);
            }
        } else {
            showError('❌ ไม่พบอีเมลนี้ในระบบ Surat Thani Travel');
            logFailedAttempt(email);
        }
    });
}

// ===== 4. ฟังก์ชันแสดง Error =====
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== 5. ฟังก์ชัน Login สำเร็จ =====
function showSuccessAndRedirect(role) {
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ยินดีต้อนรับสู่ Surat Thani Travel!
    `;
    
    errorMsg.style.display = 'none';
    const loginForm = document.querySelector('.login-form');
    loginForm.appendChild(successMsg);

    setTimeout(() => {
        if (role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }, 1500);
}

// ===== 6. บันทึกการพยายาม Login ผิด =====
function logFailedAttempt(email) {
    let attempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
    attempts[email] = (attempts[email] || 0) + 1;
    localStorage.setItem('loginAttempts', JSON.stringify(attempts));

    if (attempts[email] >= 3) {
        showError(`⚠️ คุณพยายามเข้าสู่ระบบผิดพลาด ${attempts[email]} ครั้ง`);
    }
}

// ===== 7. ตรวจสอบสถานะ Login =====
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!isLoggedIn && (currentPage === 'dashboard.html' || currentPage === 'admin-dashboard.html')) {
        window.location.href = 'index.html';
        return false;
    }
    
    if (isLoggedIn && currentPage === 'index.html') {
        const role = localStorage.getItem('userRole');
        window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
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
    if (confirm('คุณต้องการออกจากระบบ Surat Thani Travel ใช่หรือไม่?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('loginTime');
        window.location.href = 'index.html';
    }
}

// ===== 10. ปุ่ม Social =====
document.getElementById('googleLogin')?.addEventListener('click', function() {
    alert('🔗 กำลังเชื่อมต่อกับ Google...\n(เปลี่ยน URL เป็นของจริง)');
});

document.getElementById('facebookLogin')?.addEventListener('click', function() {
    alert('🔗 กำลังเชื่อมต่อกับ Facebook...\n(เปลี่ยน URL เป็นของจริง)');
});

// ===== 11. เรียกใช้ตอนโหลดหน้า =====
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    checkAdmin();
});

console.log('✅ Surat Thani Travel - ระบบ Login พร้อมทำงาน!');
