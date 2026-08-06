// 1. แสดง/ซ่อนรหัสผ่าน
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

togglePassword.addEventListener('click', function() {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

// 2. ตรวจสอบฟอร์ม login
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMessage');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); // ป้องกันการ refresh หน้า

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

    // ถ้าผ่านการตรวจสอบทั้งหมด
    errorMsg.style.display = 'none';
    alert('✅ เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับสู่ Surat Thani Explorer');
    
    // ถ้าต้องการไปหน้าถัดไป
    // window.location.href = 'dashboard.html';
});

// ฟังก์ชันแสดง error
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}

// 3. ปุ่ม GitHub
document.getElementById('githubLogin').addEventListener('click', function() {
    alert('🔗 กำลังเชื่อมต่อกับ GitHub...\n(เปลี่ยน URL เป็นของจริง)');
    // window.location.href = 'https://github.com/login/oauth/authorize?client_id=YOUR_ID';
});

// 4. ทดสอบว่า JavaScript โหลดแล้ว
console.log('✅ JavaScript ทำงานแล้ว!');
