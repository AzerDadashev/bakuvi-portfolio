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
        start: "top 45%", // Kart ekranın mərkəzinə yaxınlaşanda başlasın
        end: "bottom 55%", // Ekrandan çıxana qədər davam etsin
        scrub: 1.5, // Daha yağ kimi, axıcı keçid
        markers: false // Ehtiyac olsa true edib yoxlaya bilərsən
    },
    rotateY: 180,
    scale: 0.95, // Fırlananda xəfif içəri çəkilmə (daha premium görünür)
    ease: "sine.inOut" // Kəskin yox, yumşaq dönüş
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
// const blogItems = document.querySelectorAll('.blog-item');
// const navImg = document.querySelector('.blog-nav-img');

// blogItems.forEach(item => {
//     item.addEventListener('mouseenter', () => {
//         navImg.src = item.getAttribute('data-img');
//         gsap.to(navImg, { opacity: 1, scale: 1, duration: 0.3 });
//     });
//     item.addEventListener('mouseleave', () => {
//         gsap.to(navImg, { opacity: 0, scale: 0.8, duration: 0.3 });
//     });
//     item.addEventListener('mousemove', (e) => {
//         gsap.to(navImg, { x: e.clientX, y: e.clientY, duration: 0.5 });
//     });
// });

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
    let count = 0;
    const speed = 1500;
    const step = target / (speed / 30);

    const update = () => {
        count += step;
        if (count < target) {
            el.innerText = Math.ceil(count);
            setTimeout(update, 30);
        } else {
            // 99 üçün xüsusi qayda
            if (target === 99) {
                el.innerText = "99%";
            } else {
                el.innerText = target;
            }
        }
    };

    if (el.innerText === "0" || el.innerText === "") {
        update();
    }
};


const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            runCounter(entry.target);
        } else {
    if (!entry.target.classList.contains('visitor-count')) {
        entry.target.innerText = "0";
    }
        }
    });
}, { threshold: 0.8 });

counters.forEach(counter => counterObserver.observe(counter));

fetch('https://api.countapi.xyz/hit/bakuvi.site/visits')
  .then(res => res.json())
  .then(data => {
      const visitorEl = document.querySelector('.visitor-count');
      if (visitorEl) {
          visitorEl.innerText = data.value;
      }
  });



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


const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const clickableImgs = document.querySelectorAll('.clickable-img img');

clickableImgs.forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Scrollu bağla
    });
});

lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Scrollu aç
});



const blogItems = document.querySelectorAll('.blog-item');
const previewContainer = document.getElementById('blog-cursor-img');
const previewImg = previewContainer.querySelector('img');

blogItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const imgSrc = item.getAttribute('data-img');
        previewImg.src = imgSrc;
        gsap.to(previewContainer, { opacity: 1, scale: 1, duration: 0.3 });
    });

    item.addEventListener('mouseleave', () => {
        gsap.to(previewContainer, { opacity: 0, scale: 0.5, duration: 0.3 });
    });

    item.addEventListener('mousemove', (e) => {
        gsap.to(previewContainer, {
            x: e.clientX + 20,
            y: e.clientY - 100,
            duration: 0.6,
            ease: "power2.out"
        });
    });
});



const YT_API_KEY = 'AIzaSyApVpCaOmoUPeFqL5O6efafGjS1zpL1D0k'; 
const CHANNEL_ID = 'UCHy-rfZPIbGIOdI-zC-i8Pg';
const MAX_RESULTS = 8;

const playlistContainer = document.getElementById('playlist-container');
const mainVideoFrame = document.getElementById('main-video-frame');
const mainVideoTitle = document.getElementById('main-video-title');

// Ehtiyat siyahı (API limiti dolduqda və ya xəta olduqda bura görünəcək)
const FALLBACK_VIDEOS = [
    { 
        id: { videoId: 'yjynoxsMwco' }, 
        snippet: { title: 'Sistem Arxitekturası Analizi', thumbnails: { medium: { url: 'https://img.youtube.com/vi/yjynoxsMwco/mqdefault.jpg' } } } 
    },
     { 
        id: { videoId: 'nsGl5-XfcQk' }, 
        snippet: { title: 'Azar İntro', thumbnails: { medium: { url: 'https://img.youtube.com/vi/nsGl5-XfcQk/mqdefault.jpg' } } } 
    },
     
];

async function fetchPlaylist() {
    try {
        // API-dən videoları tarixinə görə sıralanmış çəkirik
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${AIzaSyApVpCaOmoUPeFqL5O6efafGjS1zpL1D0k}&channelId=${UCHy-rfZPIbGIOdI-zC-i8Pg}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}&type=video`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            renderPlaylist(data.items);
        } else {
            console.warn("API boş döndü, fallback istifadə olunur.");
            renderPlaylist(FALLBACK_VIDEOS);
        }
    } catch (err) {
        console.error("YouTube API Xətası:", err);
        renderPlaylist(FALLBACK_VIDEOS);
    }
}

function renderPlaylist(videos) {
    if (!playlistContainer) return;
    playlistContainer.innerHTML = ''; // Əvvəlki içindəkiləri təmizlə

    videos.forEach((video, index) => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumb = video.snippet.thumbnails.medium.url;

        // Video Item yaradılması
        const item = document.createElement('div');
        item.className = `video-item group cursor-pointer ${index === 0 ? 'active' : ''}`;
        
        item.innerHTML = `
            <div class="thumb-wrap">
                <img src="${thumb}" alt="thumbnail">
                <div class="play-hint">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
            </div>
            <div class="flex-1">
                <h6 class="text-[11px] font-bold uppercase leading-tight tracking-wide group-hover:text-white transition-colors duration-300">
                    ${title}
                </h6>
                <span class="text-[9px] opacity-30 mt-2 block font-mono">Real Analysis</span>
            </div>
        `;

        // Klikləyəndə videonu dəyişmək
        item.onclick = (e) => changeVideo(videoId, title, e);
        playlistContainer.appendChild(item);

        // İlk videonu səhifə açılanda avtomatik yüklə
        if (index === 0) {
            updateMainPlayer(videoId, title);
        }
    });
}

function updateMainPlayer(id, title) {
    mainVideoFrame.style.opacity = '0';
    setTimeout(() => {
        mainVideoFrame.src = `https://www.youtube.com/embed/${id}?autoplay=0&rel=0&mute=1`;
        mainVideoTitle.innerText = title;
        mainVideoFrame.style.opacity = '1';
    }, 500);
}

function changeVideo(id, title, event) {
    updateMainPlayer(id, title);

    // Aktivlik klassını idarə et
    document.querySelectorAll('.video-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Mobil versiyada pleyerə sürüşdür
    if (window.innerWidth < 1024) {
        document.getElementById('videos').scrollIntoView({ behavior: 'smooth' });
    }
}

fetchPlaylist();

