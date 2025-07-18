// script.js
// 1. 3D Stars Background
const canvas = document.getElementById('stars-bg');
const ctx = canvas.getContext('2d');
let stars = [];
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
// Stars fill all corners (full spread)
function createStars(num) {
    stars = [];
    for (let i = 0; i < num; i++) {
        // x and y from -canvas.width/2 to +canvas.width/2 for full spread
        stars.push({
            x: (Math.random() - 0.5) * canvas.width * 1.4,
            y: (Math.random() - 0.5) * canvas.height * 1.4,
            z: Math.random() * canvas.width,
            o: Math.random() * 0.5 + 0.5
        });
    }
}
createStars(180);
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let s of stars) {
        let k = 128.0 / s.z;
        let px = s.x * k + canvas.width / 2;
        let py = s.y * k + canvas.height / 2;
        if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) continue;
        ctx.beginPath();
        ctx.arc(px, py, 1.2 * s.o, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${s.o})`;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
    }
}
function animateStars() {
    for (let s of stars) {
        s.z -= 0.7;
        if (s.z <= 1) {
            s.x = Math.random() * canvas.width;
            s.y = Math.random() * canvas.height;
            s.z = canvas.width;
        }
    }
    drawStars();
    requestAnimationFrame(animateStars);
}
animateStars();

// 2. Navbar Shrink on Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('shrink');
    } else {
        navbar.classList.remove('shrink');
    }
});

// 3. Smooth Scroll for Navbar
const navLinks = document.querySelectorAll('.nav-btn');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        // استثناء الروابط الخارجية أو التي تنتهي بـ .html من منع السلوك الافتراضي
        if (href && (href.startsWith('http') || href.endsWith('.html'))) {
            // السماح بالانتقال العادي
            return;
        }
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// 4. Section FadeIn on Scroll
const sections = document.querySelectorAll('.section');
function revealSections() {
    const trigger = window.innerHeight * 0.85;
    sections.forEach(sec => {
        const secTop = sec.getBoundingClientRect().top;
        if (secTop < trigger) {
            sec.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);

// 5. Service Cards Hover Animation (handled by CSS)

// 6. Testimonial Carousel
let testimonialIndex = 0;
const testimonials = document.querySelectorAll('.testimonial');
function showTestimonial(idx) {
    testimonials.forEach((t, i) => {
        t.classList.toggle('active', i === idx);
    });
}
function nextTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    showTestimonial(testimonialIndex);
}
setInterval(nextTestimonial, 4000);
showTestimonial(testimonialIndex);

// 7. Contact Bot Button & Popup
const contactBot = document.getElementById('contact-bot');
const contactPopup = document.getElementById('contact-popup');
contactBot.addEventListener('click', () => {
    contactPopup.classList.toggle('active');
});
window.addEventListener('click', (e) => {
    if (!contactPopup.contains(e.target) && e.target !== contactBot && !contactBot.contains(e.target)) {
        contactPopup.classList.remove('active');
    }
});

// 8. Contact Form Validation
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.boxShadow = '0 0 8px red';
            valid = false;
        } else {
            input.style.boxShadow = '';
        }
    });
    if (!valid) return;
    // Simulate sending
    contactForm.innerHTML = '<h3>تم الإرسال بنجاح! سنعاود التواصل معك قريبًا.</h3>';
});

// --- نموذج الحجز الإلكتروني إلى تيليجرام ---
const reserveForm = document.getElementById('reserve-form');
if (reserveForm) {
    reserveForm.addEventListener('submit', function(e) {
        // الكود الأصلي في reservation.html يمنع الإرسال الافتراضي، لذا نرسل للتيليجرام هنا
        const fd = new FormData(reserveForm);
        const data = {
            firstName: fd.get('firstName'),
            lastName: fd.get('lastName'),
            phone: fd.get('phone'),
            email: fd.get('email'),
            message: fd.get('message')
        };
        // نص الرسالة
        const text =
            '📝 طلب حجز جديد عبر الموقع:' + '\n' +
            'الاسم: ' + (data.firstName || '') + '\n' +
            'اللقب: ' + (data.lastName || '') + '\n' +
            'رقم الهاتف: ' + (data.phone || '') + '\n' +
            'البريد الإلكتروني: ' + (data.email || '') + '\n' +
            'الرسالة: ' + (data.message || '');
        // بيانات البوت
        const botToken = '8111306142:AAGsWpJBKTx2ys5kFQPRyT_CAFVPpH6GpQQ';
        const chatId = '5968641533';
        // إرسال الطلب إلى تيليجرام
        fetch("https://api.telegram.org/bot" + botToken + "/sendMessage", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        })
        .then(r => r.json())
        .then(resp => {
            if(resp.ok) {
                alert('✅ تم إرسال الطلب إلى تيليجرام بنجاح!');
            } else {
                alert('حدث خطأ أثناء إرسال الطلب إلى تيليجرام.');
            }
        })
        .catch(() => {
            alert('تعذر إرسال الطلب إلى تيليجرام.');
        });
    });
}
// --- نهاية كود تيليجرام ---
