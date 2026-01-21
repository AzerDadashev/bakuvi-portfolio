gsap.registerPlugin(ScrollTrigger);

// 1. Smooth Scroll (Lenis)
const lenis = new Lenis();
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// 2. Custom Cursor (Premium Feel)
const cursor = document.getElementById('custom-cursor');
window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { 
        x: e.clientX, 
        y: e.clientY, 
        duration: 0.15,
        ease: "power2.out"
    });
});

// 3. Loading Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    tl.to(".line-child", { y: 0, duration: 1.2, stagger: 0.1, ease: "power4.out" })
      .to("#loader-bar", { width: "100%", duration: 0.8, ease: "expo.inOut" })
      .to("#loader", { y: "-100%", duration: 1, ease: "expo.inOut", delay: 0.2 })
      .from("#hero h2", { y: 100, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5")
      .set("body", { overflow: "auto" });
});

// 4. Flip Card Scroll Animation
gsap.to(".flip-card-inner", {
    scrollTrigger: {
        trigger: "#about",
        start: "top 10%",
        end: "bottom 90%",
        scrub: 1.5
    },
    rotateY: 180,
    x: window.innerWidth > 768 ? "20%" : 0,
    scale: 0.85,
    ease: "none"
});

// 5. Theme Switcher Logic
const themeBtn = document.getElementById('theme-btn');
const updateThemeUI = () => {
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
};

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    updateThemeUI();
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

// 6. Blog Hover Preview
const blogItems = document.querySelectorAll('.blog-item');
const navImg = document.querySelector('.blog-nav-img');

blogItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        navImg.src = item.getAttribute('data-img');
        gsap.to(navImg, { opacity: 1, scale: 1, duration: 0.3 });
    });
    item.addEventListener('mouseleave', () => {
        gsap.to(navImg, { opacity: 0, scale: 0.8, duration: 0.3 });
    });
    item.addEventListener('mousemove', (e) => {
        gsap.to(navImg, { x: e.clientX, y: e.clientY, duration: 0.5 });
    });
});

// 7. General Reveal Animation
gsap.utils.toArray('.reveal').forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });
});

// 8. Hero Video Parallax
gsap.to("#hero video", {
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        scrub: true
    },
    y: 150
});


const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Animasiyanı başlat
        submitBtn.classList.add('sending');
        submitBtn.querySelector('span').innerText = "Sending...";

        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Uğurlu bitəndə
                submitBtn.querySelector('span').innerText = "Sent Successfully!";
                submitBtn.classList.replace('sending', 'success-send');
                contactForm.reset();
                
                // 3 saniyə sonra köhnə halına qaytar
                setTimeout(() => {
                    submitBtn.classList.remove('success-send');
                    submitBtn.classList.remove('sending');
                    submitBtn.querySelector('span').innerText = "Send Message";
                }, 3000);
            }
        } catch (error) {
            submitBtn.querySelector('span').innerText = "Error!";
            submitBtn.classList.remove('sending');
        }
    });
}

const counters = document.querySelectorAll('.counter-num');

const runCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const count = +el.innerText;
    // Sürəti tənzimləmək üçün (rəqəm böyükdürsə daha sürətli artır)
    const increment = target / 50; 

    if (count < target) {
        el.innerText = Math.ceil(count + increment);
        setTimeout(() => runCounter(el), 30);
    } else {
        el.innerText = target;
    }
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Hər dəfə ekrana girəndə animasiyanı başlat
            runCounter(entry.target);
        } else {
            // Ekrandan çıxanda rəqəmi sıfırla ki, növbəti dəfə yenidən artsın
            entry.target.innerText = "0";
        }
    });
}, { threshold: 0.5 }); // 50% görünəndə tətiklənir

counters.forEach(counter => counterObserver.observe(counter));


window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const percentText = document.getElementById('loader-percentage');
    const progressLine = document.getElementById('loader-progress');
    const loaderTitle = document.querySelector('.loader-title');
    
    let count = 0;
    
    const counterInterval = setInterval(() => {
        if (count < 100) {
            count += Math.floor(Math.random() * 4) + 1;
            if (count > 100) count = 100;
            percentText.innerText = count < 10 ? "0" + count : count;
            progressLine.style.width = count + "%";
        } else {
            clearInterval(counterInterval);
            
            // ADDIM 1: Yazıları yavaşca itir (Fade out)
            percentText.parentElement.classList.add('loader-content-out');
            loaderTitle.classList.add('loader-content-out');

            // ADDIM 2: 300ms gözlə və pərdəni qaldır (Smooth exit)
            setTimeout(() => {
                loader.classList.add('loaded');
                
                // ADDIM 3: Pərdə yarıya çatanda ana səhifə animasiyalarını başlat
                setTimeout(() => {
                    document.body.classList.add('animation-start');
                }, 400);

                // ADDIM 4: Hər şey bitəndə loader-i sil
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 1200);
            }, 400);
        }
    }, 35);
});


async function updateVisitorCount() {
    const counterEl = document.getElementById('visitor-count');
    
    // QEYD: 'bakuvi-design-2026' sənin unikal ID-ndir. 
    // Bu API səhifə hər dəfə yüklənəndə həmin ID üzrə rəqəmi +1 edir.
    const namespace = 'bakuvidesign2026';
    const key = 'visits';

    try {
        const response = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
        const data = await response.json();
        
        // API-dən gələn real rəqəmi (məsələn: 543) mənimsədirik
        const realTotal = data.value;
        counterEl.setAttribute('data-target', realTotal);
        
        // Sayğac animasiyasını başladırıq
        if (typeof runCounter === "function") {
            runCounter(counterEl);
        }
    } catch (error) {
        // Əgər API-də problem olsa, keçən ayın təxmini rəqəmini göstərsin (boş qalmasın)
        counterEl.setAttribute('data-target', '1240');
        runCounter(counterEl);
    }
}

async function updateVisitorCount() {
    const counterEl = document.getElementById('visitor-count');
    try {
        const response = await fetch('https://api.countapi.xyz/hit/bakuvidesign2026/visits');
        const data = await response.json();
        console.log("Gələn rəqəm:", data.value); // Konsolda yoxla (F12)
        
        counterEl.setAttribute('data-target', data.value);
        if (typeof runCounter === "function") {
            runCounter(counterEl);
        }
    } catch (error) {
        console.error("API Xətası:", error);
    }
}



function changeLang(lang) {
    const elements = document.querySelectorAll('[data-az]');
    const btnAz = document.getElementById('btn-az');
    const btnEn = document.getElementById('btn-en');

    elements.forEach(el => {
        el.innerHTML = el.getAttribute(`data-${lang}`);
    });

    if (lang === 'az') {
        btnAz.style.opacity = '1';
        btnEn.style.opacity = '0.4';
        localStorage.setItem('preferredLang', 'az');
    } else {
        btnAz.style.opacity = '0.4';
        btnEn.style.opacity = '1';
        localStorage.setItem('preferredLang', 'en');
    }
}

// Səhifə yüklənəndə yadda saxlanılan dili tətbiq et
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'az';
    changeLang(savedLang);
});