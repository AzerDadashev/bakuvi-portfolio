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

// 3. Loading Animation (creative boot-sequence loader)
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
        start: "top 45%",
        end: "bottom 55%",
        scrub: 1.5,
        markers: false
    },
    rotateY: 180,
    scale: 0.95,
    ease: "sine.inOut"
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

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

// 6. General Reveal Animation
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

// 7. Hero Video Parallax
gsap.to("#hero video", {
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        scrub: true
    },
    y: 150
});

// 8. Contact Form
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
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
                submitBtn.querySelector('span').innerText = "Sent Successfully!";
                submitBtn.classList.replace('sending', 'success-send');
                contactForm.reset();

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

// 9. Animated Counters
const counters = document.querySelectorAll('.counter-num');

const runCounter = (el) => {
    const target = +el.getAttribute('data-target');
    let count = 0;
    const speed = 1500;
    const step = target / (speed / 30) || target;

    const update = () => {
        count += step;
        if (count < target) {
            el.innerText = Math.ceil(count);
            setTimeout(update, 30);
        } else {
            el.innerText = target === 99 ? "99%" : target;
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

/* -----------------------------------------------------------------
   10. REAL-TIME VISITOR COUNTER
   The site has no database/backend (static GitHub Pages deploy), so a
   truly shared, real-time counter can't be stored locally per-browser
   (localStorage only counts that one device). Instead we use Abacus —
   a free, keyless, persistent hit-counter API. Every real page load
   from every visitor increments one shared counter server-side, so the
   number shown is a genuine cross-visitor, real-time total rather than
   a fake per-device simulation.
------------------------------------------------------------------ */
async function updateVisitorCount() {
    const counterEl = document.getElementById('visitor-count');
    if (!counterEl) return;

    const NAMESPACE = 'bakuvi-site';
    const KEY = 'homepage-visits';

    try {
        const res = await fetch(`https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`);
        const data = await res.json();
        const total = data && typeof data.value === 'number' ? data.value : null;

        if (total !== null) {
            counterEl.setAttribute('data-target', total);
            localStorage.setItem('bakuvi_last_known_visits', total);
        } else {
            throw new Error('no value');
        }
    } catch (err) {
        const last = localStorage.getItem('bakuvi_last_known_visits');
        counterEl.setAttribute('data-target', last || 1);
    }

    if (typeof runCounter === "function") {
        runCounter(counterEl);
    }
}

window.addEventListener('DOMContentLoaded', updateVisitorCount);

// 11. Creative Boot Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const percentText = document.getElementById('loader-percentage');
    const progressLine = document.getElementById('loader-progress');
    const loaderTitle = document.querySelector('.loader-title');
    const loaderLines = document.querySelectorAll('.loader-console-line');

    let count = 0;

    if (loaderLines.length) {
        loaderLines.forEach((line, i) => {
            setTimeout(() => line.classList.add('is-visible'), i * 260);
        });
    }

    const counterInterval = setInterval(() => {
        if (count < 100) {
            count += Math.floor(Math.random() * 4) + 1;
            if (count > 100) count = 100;
            if (percentText) percentText.innerText = count < 10 ? "0" + count : count;
            if (progressLine) progressLine.style.width = count + "%";
        } else {
            clearInterval(counterInterval);
            if (percentText) percentText.parentElement.classList.add('loader-content-out');
            if (loaderTitle) loaderTitle.classList.add('loader-content-out');

            setTimeout(() => {
                loader.classList.add('loaded');
                setTimeout(() => {
                    document.body.classList.add('animation-start');
                }, 400);
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 1200);
            }, 400);
        }
    }, 35);
});

// 12. Language Switching (AZ / EN / RU)
function changeLang(lang) {
    const elements = document.querySelectorAll('[data-az]');

    elements.forEach(el => {
        const val = el.getAttribute(`data-${lang}`) || el.getAttribute('data-az');
        el.innerHTML = val;
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.id.replace('-m', '').replace('btn-', '');
        btn.style.opacity = btnLang === lang ? '1' : '0.4';
    });

    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('preferredLang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'az';
    changeLang(savedLang);
});

// 13. Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const clickableImgs = document.querySelectorAll('.clickable-img img');

clickableImgs.forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// 14. Blog Hover Preview
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

/* -----------------------------------------------------------------
   15. DYNAMIC YOUTUBE PLAYLIST — no API key, no backend.
   Uses the channel's public RSS feed (always free, no quota) proxied
   through rss2json so it can be fetched client-side (CORS-safe), and
   falls back to a static list only if the network call fails.
------------------------------------------------------------------ */
const CHANNEL_ID = 'UCHy-rfZPIbGIOdI-zC-i8Pg';
const MAX_RESULTS = 8;

const playlistContainer = document.getElementById('playlist-container');
const mainVideoFrame = document.getElementById('main-video-frame');
const mainVideoTitle = document.getElementById('main-video-title');

const FALLBACK_VIDEOS = [
    { videoId: 'yjynoxsMwco', title: 'Sistem Arxitekturası Analizi', thumb: 'https://img.youtube.com/vi/yjynoxsMwco/mqdefault.jpg' },
    { videoId: 'nsGl5-XfcQk', title: 'Azar İntro', thumb: 'https://img.youtube.com/vi/nsGl5-XfcQk/mqdefault.jpg' }
];

async function fetchPlaylist() {
    try {
        const feedUrl = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`);
        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
            const videos = data.items.slice(0, MAX_RESULTS).map(item => {
                const idMatch = item.guid && item.guid.match(/video:([\w-]+)/);
                const videoId = idMatch ? idMatch[1] : (item.link.match(/v=([\w-]+)/) || [])[1];
                const thumb = (item.thumbnail) || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                return { videoId, title: item.title, thumb };
            }).filter(v => v.videoId);

            if (videos.length) {
                renderPlaylist(videos);
                return;
            }
        }
        renderPlaylist(FALLBACK_VIDEOS);
    } catch (err) {
        console.warn("YouTube RSS fetch failed, using fallback list.", err);
        renderPlaylist(FALLBACK_VIDEOS);
    }
}

function renderPlaylist(videos) {
    if (!playlistContainer) return;
    playlistContainer.innerHTML = '';

    videos.forEach((video, index) => {
        const { videoId, title, thumb } = video;

        const item = document.createElement('div');
        item.className = `video-item group cursor-pointer ${index === 0 ? 'active' : ''}`;

        item.innerHTML = `
            <div class="thumb-wrap">
                <img src="${thumb}" alt="thumbnail" loading="lazy">
                <div class="play-hint">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
            </div>
            <div class="flex-1">
                <h6 class="text-[11px] font-bold uppercase leading-tight tracking-wide group-hover:text-white transition-colors duration-300">
                    ${title}
                </h6>
                <span class="text-[9px] opacity-30 mt-2 block font-mono">Bakuvi · Live Feed</span>
            </div>
        `;

        item.onclick = (e) => changeVideo(videoId, title, e);
        playlistContainer.appendChild(item);

        if (index === 0) {
            updateMainPlayer(videoId, title);
        }
    });
}

function updateMainPlayer(id, title) {
    if (!mainVideoFrame) return;
    mainVideoFrame.style.opacity = '0';
    setTimeout(() => {
        mainVideoFrame.src = `https://www.youtube.com/embed/${id}?autoplay=0&rel=0&mute=1`;
        if (mainVideoTitle) mainVideoTitle.innerText = title;
        mainVideoFrame.style.opacity = '1';
    }, 500);
}

function changeVideo(id, title, event) {
    updateMainPlayer(id, title);
    document.querySelectorAll('.video-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (window.innerWidth < 1024) {
        document.getElementById('videos').scrollIntoView({ behavior: 'smooth' });
    }
}

fetchPlaylist();

/* -----------------------------------------------------------------
   16. 3D MAGNETIC TILT — bento cards & ecosystem tiles
------------------------------------------------------------------ */
function initTilt(selector, intensity = 10) {
    document.querySelectorAll(selector).forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
                rotateY: x * intensity,
                rotateX: -y * intensity,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 900
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
        });
    });
}

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    initTilt('.bento-item', 8);
    initTilt('.tilt-card', 10);
}
