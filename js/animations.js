gsap.registerPlugin(ScrollTrigger);

// Maraqlı Scroll Reveal-lar
gsap.utils.toArray('h3, p').forEach(text => {
    gsap.from(text, {
        scrollTrigger: {
            trigger: text,
            start: "top 90%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});


gsap.registerPlugin(ScrollTrigger);

// Kart Flip və Sürüşmə Animasiyası
const flipAnim = gsap.timeline({
    scrollTrigger: {
        trigger: "#about",     // Bu bölmə başlayanda animasiya start götürür
        start: "top 20%",      // Bölmə ekranın yuxarısından 20% aşağıda olanda başla
        end: "bottom 80%",     // Bölmə bitməyə yaxın bitir
        scrub: 1.5,            // Sürəti skrola bağla (1.5 hamarlıq verir)
        markers: false          // Test üçün true edib baxa bilərsən harada başlayır
    }
});

flipAnim.to(".flip-card-inner", {
    rotateY: 180,              // Kartı 180 dərəcə döndər
    x: innerWidth > 768 ? "20%" : 0, // Desktopda bir az sağa sürüşdür
    scale: 0.9,                // Çönərkən bir az kiçilsin (effektli görünür)
    duration: 2
});

// Mövzu dəyişəndə (Theme Switch) rənglərin itməməsi üçün əlavə
const themeBtn = document.getElementById('theme-btn');
themeBtn.addEventListener('click', () => {
    // Əvvəlki kodun davamı...
    // Header və digər elementlərin rəngini burada bir daha kontrol edə bilərsən
});