/* ===================================================================
   义乌贝织商贸 · 钻石画工具官网  —  交互与动效脚本
   =================================================================== */

// 导航栏移动端展开
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n =>
        n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        })
    );
}

// 导航栏滚动样式
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// 产品分类标签切换
const productTabs = document.querySelectorAll('.product-tab');
if (productTabs.length > 0) {
    productTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            productTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const offset = targetSection.offsetTop - 140;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });
}

// FAQ 展开/收起
const faqQuestions = document.querySelectorAll('.faq-question');
if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            const isActive = answer.classList.contains('active');

            faqQuestions.forEach(other => {
                other.nextElementSibling.classList.remove('active');
                const oi = other.querySelector('i');
                if (oi) oi.style.transform = 'rotate(0deg)';
            });

            if (!isActive) {
                answer.classList.add('active');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// 表单提交处理
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = this.querySelector('#name').value;
        const email = this.querySelector('#email').value;
        const phone = this.querySelector('#phone').value;
        const message = this.querySelector('#message').value;

        if (!name || !email || !phone || !message) {
            showNotification('请填写所有必填字段', 'error');
            return;
        }
        showNotification('感谢您的留言！我们会尽快与您联系。', 'success');
        this.reset();
    });
}

// 通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    const colors = { success: '#16a34a', error: '#e11d48', info: '#7c3aed' };
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 3200);
}

// 数字滚动动画
function animateNumbers(scope = document) {
    const items = scope.querySelectorAll('.stat-item h3[data-count]');
    items.forEach(item => {
        if (item.dataset.done) return;
        item.dataset.done = '1';
        const target = parseInt(item.dataset.count, 10);
        const suffix = item.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            item.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else item.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
    });
}

// 滚动进入动画（带交错延迟）
function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('visible'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || '0', 10);
                entry.target.style.transitionDelay = delay + 'ms';
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
}

// 数字区块进入时触发
function initCounters() {
    const statSections = document.querySelectorAll('.intro-stats, .team-stats, .services-intro .intro-stats, .intro-content');
    if (!('IntersectionObserver' in window)) {
        animateNumbers();
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    statSections.forEach(s => observer.observe(s));
}

// 平滑滚动到锚点
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const id = this.getAttribute('href').substring(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                const offset = target.offsetTop - 100;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });
}

// 生成 hero 钻石粒子
function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    const count = 34;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        const size = 4 + Math.random() * 9;
        p.style.left = Math.random() * 100 + '%';
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.animationDuration = (7 + Math.random() * 9) + 's';
        p.style.animationDelay = (Math.random() * 9) + 's';
        const hue = Math.random() > 0.5 ? 'linear-gradient(135deg,#fff,#f0abfc)' : 'linear-gradient(135deg,#fff,#a5f3fc)';
        p.style.background = hue;
        container.appendChild(p);
    }
}

// 全局钻石闪光粒子（轻量，纯 CSS 动画 + JS 一次性生成）
function initSparkles() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let field = document.querySelector('.sparkle-field');
    if (!field) {
        field = document.createElement('div');
        field.className = 'sparkle-field';
        field.setAttribute('aria-hidden', 'true');
        document.body.appendChild(field);
    }
    const count = 42;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle';
        const size = 3 + Math.random() * 6;
        s.style.setProperty('--size', size + 'px');
        s.style.setProperty('--left', (Math.random() * 100) + '%');
        s.style.setProperty('--top', (Math.random() * 100) + '%');
        s.style.setProperty('--dur', (2.5 + Math.random() * 4) + 's');
        s.style.setProperty('--delay', (Math.random() * 5) + 's');
        s.style.setProperty('--max-o', (0.25 + Math.random() * 0.35).toFixed(2));
        const warm = Math.random() > 0.55;
        s.style.background = warm
            ? 'linear-gradient(135deg, rgba(255,255,255,.95), rgba(219,39,119,.55))'
            : 'linear-gradient(135deg, rgba(255,255,255,.95), rgba(124,58,237,.55))';
        fragment.appendChild(s);
    }
    field.appendChild(fragment);
}

// 返回顶部按钮
function createBackToTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', '返回顶部');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 页面切换淡入
function initPageTransition() {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
        });
    });
}

// 键盘 / 触摸支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50 && navMenu && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initCounters();
    initSmoothScroll();
    initHeroParticles();
    initSparkles();
    createBackToTopButton();
    initPageTransition();

    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
