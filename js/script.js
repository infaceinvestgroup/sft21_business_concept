// Helper funkcija za dobivanje apsolutne pozicije od vrha dokumenta
function getAbsoluteOffsetTop(element) {
    let top = 0;
    let el = element;
    while (el && el.nodeType === 1 && !isNaN(el.offsetTop)) {
        top += el.offsetTop;
        el = el.offsetParent;
    }
    return top;
}

// Glavni listener koji čeka da se HTML učita
document.addEventListener('DOMContentLoaded', () => {
    // <<< ISPRAVNA POZICIJA LOGA >>>
    console.log("!!! DOMContentLoaded START - Glavna skripta se učitava !!!");

    console.log("DOM spreman, pokrećem skripte...");

    const body = document.body; // Dohvati body samo jednom

    // ==========================================================
    // === POČETAK KODA ZA VALIDACIJU LOZINKE (UMETNUT OVDJE) ===
    // ==========================================================
    console.log("Postavljam kod za validaciju lozinke...");

    // **VAŽNO: Zamijenite ove ID-jeve stvarnim ID-jevima iz vašeg HTML-a!**
    const passwordForm = document.getElementById('forma-za-lozinku');           // <<< ID VAŠE FORME za lozinku
    const passwordInput = document.getElementById('prva-lozinka');              // <<< ID VAŠEG PRVOG POLJA za lozinku
    const confirmPasswordInput = document.getElementById('druga-lozinka');       // <<< ID VAŠEG DRUGOG POLJA za lozinku (potvrda)
    const passwordErrorDiv = document.getElementById('div-za-greske-lozinke'); // <<< ID DIV-a/P elementa gdje će se prikazati greška

    // Provjeravamo jesu li svi elementi pronađeni prije dodavanja listenera
    if (passwordForm && passwordInput && confirmPasswordInput && passwordErrorDiv) {
        console.log("Elementi za validaciju lozinke pronađeni. Dodajem 'submit' listener.");

        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault(); // UVIJEK spriječi stvarno slanje forme dok ne potvrdimo validnost
            console.log("--- Forma za lozinku SUBMIT ---");

            // Dohvati vrijednosti iz polja
            const passwordValue = passwordInput.value; // Ne koristimo trim() da uhvatimo razmake bilo gdje
            const confirmPasswordValue = confirmPasswordInput.value;

            let errorMessage = null; // Resetiraj poruku o grešci

            // --- Validacijske provjere ---
            console.log(`Provjeravam lozinku: "${passwordValue}"`);

            // 1. Provjera za BILO KOJI razmak
            if (/\s/.test(passwordValue)) {
                errorMessage = "Lozinka ne smije sadržavati razmake.";
                console.log("GREŠKA: Sadrži razmak.");
            }
            // 2. Provjera minimalne dužine (npr. 8 znakova) - Prilagodite ako treba
            else if (passwordValue.length < 8) {
                errorMessage = "Lozinka mora imati najmanje 8 znakova.";
                 console.log("GREŠKA: Prekratka.");
            }
            // 3. Provjera podudaranja lozinki
            else if (passwordValue !== confirmPasswordValue) {
                errorMessage = "Lozinke se ne podudaraju.";
                 console.log("GREŠKA: Ne podudaraju se.");
            }
            // 4. Ovdje dodajte druge provjere ako trebate...

            // --- Prikaz rezultata ---

            // Prvo očisti prethodne greške (stilove i tekst)
            passwordErrorDiv.textContent = '';
            passwordErrorDiv.style.display = 'none';
            passwordInput.classList.remove('border-red-500'); // Ukloni crveni okvir
            confirmPasswordInput.classList.remove('border-red-500'); // Ukloni crveni okvir

            if (errorMessage) {
                // Ako postoji greška, prikaži je
                passwordErrorDiv.textContent = errorMessage;
                passwordErrorDiv.style.display = 'block'; // Pokaži div za greške

                // Označi relevantna polja crvenom bojom
                if (errorMessage.includes("razmake") || errorMessage.includes("znakova")) {
                    passwordInput.classList.add('border-red-500');
                } else if (errorMessage.includes("podudaraju")) {
                    passwordInput.classList.add('border-red-500');
                    confirmPasswordInput.classList.add('border-red-500');
                }
                 console.log("Prikazana greška za lozinku.");
                // NE IDEMO DALJE
                return; // Prekini izvršavanje funkcije listenera

            } else {
                // Ako NEMA greške - Lozinka je validna!
                console.log("Lozinka je validna!");
                passwordErrorDiv.style.display = 'none'; // Sakrij div za greške za svaki slučaj
                alert("TEST: Lozinka je OK! Ovdje bi išao stvarni nastavak.");
                // OVDJE IDE KOD ZA STVARNI NASTAVAK
                // Npr., slanje podataka serveru ili preusmjeravanje:
                // passwordForm.submit(); // Ako želite standardno slanje forme
                // ili
                // window.location.href = 'sljedeca_stranica.html';
            }
             console.log("--- Submit listener za lozinku završio ---");
        }); // Kraj submit listenera

    } else {
        // Ispiši upozorenje ako neki element nije pronađen
        console.warn("Nije moguće postaviti validaciju lozinke jer neki elementi nedostaju:");
        if (!passwordForm) console.warn("- Forma (ID: forma-za-lozinku) nije pronađena.");
        if (!passwordInput) console.warn("- Prvo polje za lozinku (ID: prva-lozinka) nije pronađeno.");
        if (!confirmPasswordInput) console.warn("- Drugo polje za lozinku (ID: druga-lozinka) nije pronađeno.");
        if (!passwordErrorDiv) console.warn("- Element za prikaz greške (ID: div-za-greske-lozinke) nije pronađen.");
    }
    // ========================================================
    // === KRAJ KODA ZA VALIDACIJU LOZINKE (UMETNUT OVDJE) ===
    // ========================================================


    // --- Mobile menu toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const desktopBreakpoint = 768; // Širina do koje vrijedi mobilni prikaz

    if (hamburger && navMenu && body) {
        const isMobileView = () => window.innerWidth <= desktopBreakpoint;

        // Centralizirana funkcija za otvaranje/zatvaranje menija
        const toggleMenu = (forceClose = false) => {
            const shouldBeActive = forceClose ? false : !navMenu.classList.contains('active');

            hamburger.classList.toggle('active', shouldBeActive);
            navMenu.classList.toggle('active', shouldBeActive);
            body.classList.toggle('overflow-hidden', shouldBeActive); // <<< ISPRAVLJENA LOGIKA

            // Zatvori sve otvorene mobilne dropdown menije (npr. Platforme) ako se glavni meni zatvara
            if (!shouldBeActive) {
                navMenu.querySelectorAll('.sft21-nav-item.dropdown.open:not(.mobile-language-selector)').forEach(openDropdown => {
                    openDropdown.classList.remove('open');
                    // Vrati strelicu ako postoji
                    const icon = openDropdown.querySelector('.mobile-dropdown-toggle i.fa-chevron-up');
                    if (icon) {
                        icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
                    }
                     // Sakrij podmeni (ako koristite display block/none za mobilne podmenije)
                     const submenu = openDropdown.querySelector('.dropdown-menu');
                     if (submenu) submenu.style.display = 'none';
                });
                // Također zatvori jezični dropdown ako je otvoren
                const mobileLangDropdown = document.getElementById('mobile-lang-dropdown');
                const mobileLangTrigger = document.getElementById('mobile-lang-trigger');
                if (mobileLangDropdown && mobileLangDropdown.classList.contains('active')) {
                     mobileLangDropdown.classList.remove('active');
                      const langIcon = mobileLangTrigger?.querySelector('i.fa-chevron-up');
                     if (langIcon) langIcon.classList.replace('fa-chevron-up','fa-chevron-down');
                }
            }
        }; // Kraj funkcije toggleMenu

        // Ostatak koda za mobilni meni (listeneri za hamburger, linkove, resize itd.) ide OVDJE...
        // ... (Nisam kopirao ostatak koda za mobilni meni da ne bude predugo,
        //     ali on ide odmah nakon definicije funkcije toggleMenu) ...

    } else { // Ovaj else se odnosi na if (hamburger && navMenu && body)
        console.warn("Elementi za mobilni meni (hamburger, navMenu ili body) nisu pronađeni.");
        if (body) body.classList.remove('overflow-hidden');
    }
    // --- Kraj Mobile Menu ---

    // Ovdje ide ostatak vašeg koda unutar DOMContentLoaded...
    // (AI Chat, Brojač korisnika, GSAP, Custom Cursor, Kontakt forma itd.)

// }); // <<< KRAJ GLAVNOG DOMContentLoaded LISTENER-a (ne zaboravite ga na kraju cijele skripte)

        // Funkcija za dodavanje/uklanjanje glavnog listenera na hamburger
        const setupHamburgerListener = () => {
            // Ukloni stari listener da izbjegnemo duplikate ako se resize pozove više puta
            hamburger.removeEventListener('click', toggleMenu);
            // Dodaj listener samo ako smo u mobilnom prikazu
            if (isMobileView()) {
                hamburger.addEventListener('click', toggleMenu);
            }
        };

        // Početno postavljanje listenera
        setupHamburgerListener();

        // Zatvaranje menija klikom na BILO KOJI link unutar menija (koji nije toggle za podmeni)
        navMenu.querySelectorAll('a').forEach(link => {
             // Provjeri je li link toggle za neki podmeni (Platforme ili Jezik)
            const isDropdownToggle = link.classList.contains('mobile-dropdown-toggle');

            if (!isDropdownToggle) { // Ako NIJE toggle za podmeni
                 link.addEventListener('click', () => {
                     if (isMobileView() && navMenu.classList.contains('active')) {
                         toggleMenu(true); // Forsiraj zatvaranje menija
                     }
                 });
             }
             // Napomena: Logika za otvaranje/zatvaranje podmenija (Platforme, Jezik)
             // treba biti odvojena i već ste je vjerojatno implementirali.
             // Ovaj dio samo osigurava da klik na konačni link zatvori glavni meni.
        });

        // Zatvaranje menija klikom izvan njega
        document.addEventListener('click', function(event) {
            if (isMobileView() && navMenu.classList.contains('active')) {
                const isClickInsideNav = navMenu.contains(event.target);
                const isClickOnHamburger = hamburger.contains(event.target);
                if (!isClickInsideNav && !isClickOnHamburger) {
                    toggleMenu(true); // Forsiraj zatvaranje
                }
            }
        });

        // Zatvaranje menija pritiskom na Escape tipku
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && isMobileView() && navMenu.classList.contains('active')) {
                 toggleMenu(true); // Forsiraj zatvaranje
             }
         });

         // Listener za promjenu veličine prozora (s debouncingom)
         let resizeTimer;
         window.addEventListener('resize', () => {
             clearTimeout(resizeTimer);
             resizeTimer = setTimeout(() => {
                setupHamburgerListener(); // Ponovno provjeri treba li listener biti aktivan

                 // Ako više nismo u mobilnom prikazu, a meni je ostao otvoren, zatvori ga
                 if (!isMobileView() && navMenu.classList.contains('active')) {
                     toggleMenu(true); // Forsiraj zatvaranje
                 }
                 // Osiguraj da je overflow-hidden uklonjen ako pređemo na desktop
                 if (!isMobileView()) {
                    body.classList.remove('overflow-hidden');
                 }

             }, 150); // Malo duži timeout za resize
         });

    } else {
        console.warn("Elementi za mobilni meni (hamburger, navMenu ili body) nisu pronađeni.");
        // Ukloni overflow za svaki slučaj ako body postoji
        if (body) body.classList.remove('overflow-hidden');
    }
    // --- Kraj Mobile Menu ---

    // Ovdje ide ostatak vašeg koda unutar DOMContentLoaded...
    // Npr. dohvaćanje elemenata za kontakt formu, AI chat, brojač, itd.
    // const contactForm = ...
    // const aiChatIcon = ...
    // const userCounterWidget = ...
    // ...

}); // <<< KRAJ GLAVNOG DOMContentLoaded LISTENER-a

    // --- Mobile Dropdown Toggle ---
    const mobileDropdownToggles = document.querySelectorAll('.nav-menu .mobile-dropdown-toggle');

    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (event) => {
            event.preventDefault(); // Spriječi defaultno ponašanje linka #
            const dropdownItem = toggle.closest('.sft21-nav-item.dropdown');
            if (dropdownItem) {
                // Zatvori sve druge otvorene dropdown menije u mobilnom prikazu
                document.querySelectorAll('.nav-menu .sft21-nav-item.dropdown.open').forEach(openDropdown => {
                    if (openDropdown !== dropdownItem) {
                        openDropdown.classList.remove('open');
                        const otherIcon = openDropdown.querySelector('.mobile-dropdown-toggle i');
                        if(otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                // Otvori/zatvori kliknuti dropdown
                dropdownItem.classList.toggle('open');
                const icon = toggle.querySelector('i');
                if(icon) icon.style.transform = dropdownItem.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    });
    // --- Kraj Mobile Dropdown Toggle ---

// --- Mobile Language Selector Toggle ---
const mobileLangToggle = document.querySelector('.nav-menu .mobile-language-selector .mobile-dropdown-toggle');
const mobileLangDropdownContainer = document.querySelector('.nav-menu .mobile-language-selector'); // Cilja roditeljski div

if (mobileLangToggle && mobileLangDropdownContainer) {
    mobileLangToggle.addEventListener('click', (event) => {
        event.preventDefault();
        mobileLangDropdownContainer.classList.toggle('open'); // Toggle 'open' na roditeljskom divu
        const icon = mobileLangToggle.querySelector('i.fa-chevron-down');
        if(icon) icon.style.transform = mobileLangDropdownContainer.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';

         // Opcionalno: Zatvori drugi dropdown (Platforme) ako je otvoren
         document.querySelectorAll('.nav-menu .sft21-nav-item.dropdown.open').forEach(openDropdown => {
            if (openDropdown !== mobileLangDropdownContainer) { // Ne zatvaraj sam sebe
                openDropdown.classList.remove('open');
                const otherIcon = openDropdown.querySelector('.mobile-dropdown-toggle i');
                if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
            }
        });
    });
}
// --- Kraj Mobile Language Selector Toggle ---

        // --- FAQ accordion ---
        const accordionItems = document.querySelectorAll('.accordion-item');
        const fixedNavAccordion = document.querySelector('nav.fixed');
        const navHeightAccordion = fixedNavAccordion ? fixedNavAccordion.offsetHeight : 80;
        const extraScrollMarginAccordion = 20; // Malo razmaka ispod headera
    
        // Funkcija za dobivanje apsolutne pozicije od vrha dokumenta
        function getAbsoluteOffsetTop(element) {
            let top = 0;
            let el = element;
            while (el) {
                top += el.offsetTop;
                el = el.offsetParent;
            }
            return top;
        }
    
        if (accordionItems.length > 0) {
            accordionItems.forEach(item => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');
                const icon = header ? header.querySelector('i') : null;
    
                if (!header || !content || !icon) {
                    console.warn("Nedostaju elementi za accordion item:", item);
                    return;
                }
    
                // Inicijalno postavi stilove
                content.style.transition = 'max-height 0.5s ease-in-out, padding 0.5s ease-in-out'; // Malo brža tranzicija za test
                content.style.maxHeight = '0';
                content.style.paddingTop = '0';
                content.style.paddingBottom = '0';
                icon.style.transform = 'rotate(0deg)';
    
                header.addEventListener('click', (event) => {
                    const clickedItem = event.currentTarget.closest('.accordion-item');
                    if (!clickedItem) return;
    
                    const wasActive = clickedItem.classList.contains('active');
                    let shouldScroll = !wasActive; // Scrollaj samo ako otvaraš novi item
    
                    // Prvo zatvori sve ostale iteme ODMAH (bez čekanja timeouta)
                    let closingHappened = false;
                    accordionItems.forEach(otherItem => {
                        if (otherItem !== clickedItem && otherItem.classList.contains('active')) {
                            closingHappened = true; // Zabilježi da se nešto zatvara
                            otherItem.classList.remove('active');
                            const otherContent = otherItem.querySelector('.accordion-content');
                            const otherIcon = otherItem.querySelector('.accordion-header i');
                            if (otherContent) { otherContent.style.maxHeight = '0'; otherContent.style.paddingTop = '0'; otherContent.style.paddingBottom = '0'; }
                            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                        }
                    });
    
                    // Funkcija za otvaranje i scrollanje (bit će pozvana s odgodom ako se nešto zatvaralo)
                    const openAndScroll = () => {
                         clickedItem.classList.add('active');
                         const currentIcon = header.querySelector('i');
                         const currentContent = clickedItem.querySelector('.accordion-content');
    
                         if (currentContent) {
                             // Force reflow prije postavljanja visine
                             currentContent.style.display = 'block'; // Osiguraj da je vidljiv za scrollHeight
                             const scrollHeight = currentContent.scrollHeight;
                             currentContent.style.display = ''; // Vrati default display
                             currentContent.style.maxHeight = scrollHeight + "px";
                             currentContent.style.paddingTop = '0.5rem';
                             currentContent.style.paddingBottom = '1.5rem';
                         }
                         if (currentIcon) currentIcon.style.transform = 'rotate(180deg)';
    
                         // Scroll tek nakon što je animacija otvaranja (barem) počela
                         setTimeout(() => {
                             const headerAbsOffsetTop = getAbsoluteOffsetTop(header);
                             const scrollTargetY = headerAbsOffsetTop - navHeightAccordion - extraScrollMarginAccordion;
                             window.scrollTo({
                                 top: Math.max(0, scrollTargetY),
                                 behavior: 'smooth'
                             });
                         }, 50); // Vrlo kratka odgoda za scroll, samo da se pokrene otvaranje
                    };
    
                    // Funkcija za zatvaranje kliknutog itema
                    const closeClicked = () => {
                         clickedItem.classList.remove('active');
                         const currentIcon = header.querySelector('i');
                         const currentContent = clickedItem.querySelector('.accordion-content');
                         if (currentContent) {
                             currentContent.style.maxHeight = '0';
                             currentContent.style.paddingTop = '0';
                             currentContent.style.paddingBottom = '0';
                         }
                         if (currentIcon) currentIcon.style.transform = 'rotate(0deg)';
                    };
    
                    // Odluči što napraviti
                    if (wasActive) {
                        // Ako je bio aktivan, samo ga zatvori
                        closeClicked();
                    } else {
                        // Ako nije bio aktivan, otvori ga i scrollaj.
                        // Ako se neki drugi item zatvarao, pričekaj malo prije otvaranja/scrollanja.
                        const delayTime = closingHappened ? 550 : 0; // Čekaj 550ms (malo duže od tranzicije zatvaranja) ako se nešto zatvaralo
                        setTimeout(openAndScroll, delayTime);
                    }
                });
            });
        } else {
            console.warn("Nisu pronađeni elementi za FAQ accordion.");
        }
        // --- Kraj Accordion ---

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId.length > 1 && !anchor.classList.contains('popup-trigger') && !anchor.closest('.dropdown')) { // Dodan uvjet da nije u dropdownu
             anchor.addEventListener('click', function(e) {
                const currentTargetId = this.getAttribute('href');
                const fixedNavSmooth = document.querySelector('nav.fixed');
                const navHeightSmooth = fixedNavSmooth ? fixedNavSmooth.offsetHeight : 80;
                try {
                    const targetElement = document.querySelector(currentTargetId);
                    if (targetElement) {
                        e.preventDefault();
                        const targetAbsOffsetTop = getAbsoluteOffsetTop(targetElement);
                        const targetPosition = targetAbsOffsetTop - navHeightSmooth - 10;
                        window.scrollTo({ top: Math.max(0, targetPosition), behavior: 'smooth' });
                    } else { console.warn(`Smooth scroll target not found: ${currentTargetId}`); }
                } catch (error) { console.error(`Error finding/scrolling: ${currentTargetId}`, error); }
             });
        } else if (targetId === '#') {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });
    // --- Kraj Smooth Scroll ---

    // --- Active Navigation Link based on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav .nav-link:not(.mobile-dropdown-toggle)'); // Izuzmi dropdown toggle iz ovoga
    const navHeightScroll = navHeightAccordion;

    if (sections.length > 0 && navLinks.length > 0) {
        const updateActiveNavLink = () => {
            let currentSectionId = null;
            const scrollY = window.scrollY + navHeightScroll + 50;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) { currentSectionId = section.getAttribute('id'); }
            });
             if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) { currentSectionId = sections[sections.length - 1]?.getAttribute('id') || currentSectionId; }
             else if (window.scrollY < sections[0].offsetTop - navHeightScroll - 50) { currentSectionId = 'pocetna'; }

            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                if (linkHref && linkHref.substring(1) === currentSectionId) { link.classList.add('active'); }
            });
        };
        window.addEventListener('scroll', updateActiveNavLink, { passive: true });
        updateActiveNavLink();
    }
    // --- Kraj Active Nav Link ---

    // --- GSAP Animations Initialization ---
    function initializeGsapAnimations() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            try {
                gsap.registerPlugin(ScrollTrigger);
                gsap.utils.toArray('.fade-in').forEach((element) => {
                    const delay = parseFloat(element.style.animationDelay) || 0;
                    element.style.opacity = 0; element.style.transform = 'translateY(30px)';
                    ScrollTrigger.create({ trigger: element, start: 'top 90%', once: true, onEnter: () => gsap.to(element, { opacity: 1, y: 0, duration: 0.8, delay: delay }) });
                    element.style.animationDelay = '';
                });
                const animatedBgs = document.querySelectorAll('.animated-background');
                if (animatedBgs.length > 0) {
                    function debounce(func, wait) { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; };
                    const handleMouseMove = debounce(e => {
                        const mouseX = e.clientX / window.innerWidth; const mouseY = e.clientY / window.innerHeight;
                         animatedBgs.forEach(bg => {
                            const glowElements = bg.querySelectorAll('.glow');
                             glowElements.forEach((glow, index) => {
                                const intensity = 15 + (index * 5); const offsetX = (mouseX - 0.5) * intensity; const offsetY = (mouseY - 0.5) * intensity;
                                 gsap.to(glow, { x: offsetX, y: offsetY, duration: 1, ease: 'power2.out' });
                            }); });
                    }, 16);
                    document.addEventListener('mousemove', handleMouseMove);
                }
             } catch (error) { console.error("GSAP Error:", error); }
        } else {
            console.warn("GSAP or ScrollTrigger library not loaded.");
            document.querySelectorAll('.fade-in').forEach(el => { el.style.opacity = 1; el.style.transform = 'translateY(0)';});
        }
    }
    initializeGsapAnimations();
    // --- Kraj GSAP ---

    // --- Custom Cursor Logic ---
    const cursor = document.querySelector('.custom-cursor');
    const trailPoints = [];
    if (cursor && body) {
        const numTrailPoints = 5; const pointSizeStart = 12; const pointOpacityStart = 0.3; const baseDelay = 30; const lightPurpleRGBA = 'rgba(206, 147, 216,';
        for (let i = 0; i < numTrailPoints; i++) {
            const point = document.createElement('div'); point.className = 'cursor-trail-point';
            point.style.cssText = `position: fixed; width: ${pointSizeStart - i * 1.5}px; height: ${pointSizeStart - i * 1.5}px; background-color: ${lightPurpleRGBA}${pointOpacityStart - i * 0.05}); border-radius: 50%; pointer-events: none; left: -50px; top: -50px; z-index: 9998; transition: transform ${baseDelay + i * 15}ms cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease; transform: translate(-50%, -50%); opacity: 1;`;
            body.appendChild(point); trailPoints.push({ element: point, x: -50, y: -50 });
        }
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX; const y = e.clientY;
            if (typeof gsap !== 'undefined') { gsap.to(cursor, { duration: 0.1, left: x, top: y }); }
            else { cursor.style.left = `${x}px`; cursor.style.top = `${y}px`; }
            trailPoints.forEach((p, i) => {
                const targetX = i === 0 ? x : trailPoints[i - 1].x; const targetY = i === 0 ? y : trailPoints[i - 1].y;
                p.x = targetX; p.y = targetY; p.element.style.left = `${p.x}px`; p.element.style.top = `${p.y}px`;
            });
        });
        document.addEventListener('mouseleave', () => { if(cursor) cursor.style.opacity = '0'; trailPoints.forEach(p => p.element.style.opacity = '0'); });
        document.addEventListener('mouseenter', () => { if(cursor) cursor.style.opacity = '1'; trailPoints.forEach(p => p.element.style.opacity = '1'); });
        document.querySelectorAll('a, button, .accordion-header, .hamburger, input, textarea, select').forEach(el => {
            el.addEventListener('mouseenter', () => { if(cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1.5)'; });
            el.addEventListener('mouseleave', () => { if(cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)'; });
        });
    } else { console.warn("Custom cursor element not found."); }
    // --- Kraj Custom Cursor Logic ---

    // --- Popup Globalne Funkcije ---
    const popupOverlay = document.getElementById('popup-overlay');
    const validationPopup = document.getElementById('validation-popup');
    const contactFormPopup = document.getElementById('contact-form-popup');

    function closeAllPopups() {
        if (validationPopup) validationPopup.style.display = 'none';
        if (contactFormPopup) contactFormPopup.style.display = 'none';
        if (popupOverlay) popupOverlay.style.display = 'none';
        if (body) body.classList.remove('overflow-hidden');
        const ip7InputCont = document.getElementById('ip7-amount-input-container');
        const ip7Input = document.getElementById('ip7-amount-input');
        if(ip7InputCont) ip7InputCont.style.display = 'none';
        if(ip7Input) ip7Input.value = '';
    }

    function showPopup(popupContentElement, isErrorPopup = false, returnToElementId = null) {
        closeAllPopups();
        if (popupContentElement && popupOverlay && body) {
            popupOverlay.style.display = 'flex'; popupContentElement.style.display = 'block'; body.classList.add('overflow-hidden');
            popupContentElement.querySelectorAll('.popup-close').forEach(button => {
                const newButton = button.cloneNode(true); button.parentNode.replaceChild(newButton, button);
                const action = newButton.getAttribute('data-action'); // Pročitaj data-action
                if(action === 'return-to-contact' || action === 'return-to-ip7-input') {
                    newButton.addEventListener('click', (e) => {
                         e.stopPropagation();
                         if (validationPopup) validationPopup.style.display = 'none';
                         const returnToElement = document.getElementById(action === 'return-to-contact' ? 'contact-form-popup' : 'ip7-amount-input-container');
                         if (returnToElement) { returnToElement.style.display = 'block'; }
                         else { closeAllPopups(); }
                    });
                } else {
                    newButton.addEventListener('click', closeAllPopups); // Standardno zatvaranje
                }
            });
        } else { console.warn("Could not show popup."); }
    }

    if (popupOverlay) { popupOverlay.addEventListener('click', (e) => { if (e.target === popupOverlay) closeAllPopups(); }); }
    document.querySelectorAll('.popup-content').forEach(content => { if(content) content.addEventListener('click', (e) => e.stopPropagation()); });
    // --- Kraj Popup Globalnih Funkcija ---

          // --- Individual Package (IP7) Logic ---
      // Dohvaćanje elemenata
      const ip7Do10kBtn = document.getElementById('ip7-do-10k');
      const ip7VećiIznosBtn = document.getElementById('ip7-veci-iznos');
      const ip7AmountInputContainer = document.getElementById('ip7-amount-input-container');
      const ip7AmountInput = document.getElementById('ip7-amount-input');
      // Osiguravamo da dohvaćamo gumbe tek kad znamo da kontejner postoji
      const ip7AmountConfirmBtn = ip7AmountInputContainer ? ip7AmountInputContainer.querySelector('#ip7-amount-confirm') : null;
      const ip7AmountCancelBtn = ip7AmountInputContainer ? ip7AmountInputContainer.querySelector('#ip7-amount-cancel') : null;
      const minAmountDo10k = 2200;
      const maxAmountDo10k = 10000;
      // Dohvaćamo popupe OVDJE da budu dostupni unutar IF bloka
      const validationPopup = document.getElementById('validation-popup');
      const contactFormPopup = document.getElementById('contact-form-popup'); // Treba za ip7VećiIznosBtn

      // Provjeravamo postojanje SVIH potrebnih elemenata prije dodavanja listenera
      // VAŽNO: Provjeri SVE elemente koji se koriste unutar ovog bloka
      if (ip7Do10kBtn && ip7VećiIznosBtn && ip7AmountInputContainer && validationPopup && contactFormPopup && ip7AmountInput && ip7AmountConfirmBtn && ip7AmountCancelBtn && popupOverlay && body) {
          console.log("IP7 Logic: Svi elementi pronađeni, dodajem listenere.");

          ip7Do10kBtn.addEventListener('click', (e) => {
              e.preventDefault();
              closeAllPopups(); // Zatvori sve ostale popupe
              ip7AmountInputContainer.style.display = 'block';
              setTimeout(() => ip7AmountInput.focus(), 10); // Fokusiraj input
          });

          ip7VećiIznosBtn.addEventListener('click', (e) => {
              e.preventDefault();
              showPopup(contactFormPopup); // Pokaži kontakt formu za veće iznose
          });

          ip7AmountConfirmBtn.addEventListener('click', (e) => {
              e.preventDefault();
              const value = parseFloat(ip7AmountInput.value);
              const inputValue = ip7AmountInput.value.trim();

              if (inputValue === '' || isNaN(value) || value < minAmountDo10k || value > maxAmountDo10k) {
                  // Prikaz greške
                  if (validationPopup) {
                      validationPopup.innerHTML = `<button class="popup-close" data-action="return-to-ip7-input">×</button><h4>Neispravan iznos</h4><p>Molimo unesite iznos između ${minAmountDo10k} € i ${maxAmountDo10k} €.</p>`;
                      showPopup(validationPopup, true, 'ip7-amount-input-container');
                  }
                  ip7AmountInput.value = '';
              } else {
                  // Validno - prikaži uspjeh
                  console.log(`Valid IP7 amount: ${value} €`);
                  closeAllPopups();
                  if (validationPopup) {
                    validationPopup.innerHTML = `<button class="popup-close" aria-label="Close popup">×</button><h4>Uspješno uneseno!</h4><p>Iznos ${value} € je potvrđen.</p>`; // Gumb Zatvori UKLONJEN
                    showPopup(validationPopup);
                  }
              } // Kraj else bloka za validaciju
          }); // Kraj listenera za ip7AmountConfirmBtn

          ip7AmountCancelBtn.addEventListener('click', (e) => {
              e.preventDefault();
              closeAllPopups(); // Samo zatvori sve popupe i input
          }); // Kraj listenera za ip7AmountCancelBtn

          // Listeneri za validaciju unosa u IP7 polje (keypress)
          // (Ovaj dio koda je bio izvor greške - provjeri zagrade)
          if (ip7AmountInput) { // Otvara se if blok za ip7AmountInput
              ip7AmountInput.addEventListener('keypress', (e) => { // Otvara se listener za keypress
                  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
                  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
                  if (e.key === '.') {
                      if (ip7AmountInput.value.includes('.')) e.preventDefault();
                  }
                  else if (!/\d/.test(e.key)) { // Dozvoli samo brojeve
                      e.preventDefault();
                  }
              }); // <<<--- ZATVARA se addEventListener za 'keypress'

              // Ovdje možete dodati i 'blur' listener ako ga trebate
              // ip7AmountInput.addEventListener('blur', () => { /* ... kod ... */ });

          } // <<<--- ISPRAVNO ZATVARANJE bloka "if (ip7AmountInput)"

      } else { // Kraj glavnog if bloka (provjera svih elemenata)
          console.warn("Neki elementi za IP7 paket (gumbi, input, popupi...) nisu pronađeni u DOM-u.");
      }
      // --- Kraj Individual Package (IP7) Logic ---

            // --- POČETAK KODA ZA KONTAKT FORMU ---

            // Dohvaćanje elemenata za kontakt formu
            const contactForm = document.querySelector('#contact-form-popup form');
            console.log("Pokušavam dohvatiti contactForm:", contactForm); // Log za provjeru dohvaćanja forme

            // >>> ISPRAVLJENO DOHVAĆANJE INPUT POLJA (sa -popup sufiksom) <<<
            const contactNameInput = document.getElementById('contact-name-popup');
            const contactEmailInput = document.getElementById('contact-email-popup');
            const contactPhoneInput = document.getElementById('contact-phone-popup');
            // Dohvaćanje ostalih potrebnih elemenata (ako već nisu dohvaćeni globalnije)
            const validationPopup = document.getElementById('validation-popup');
            const popupOverlay = document.getElementById('popup-overlay');
            const contactFormPopup = document.getElementById('contact-form-popup'); // Sam popup div
            const body = document.body; // Ako već nije dohvaćen

            console.log("Dohvaćen contactNameInput:", contactNameInput); // Log za provjeru
            console.log("Dohvaćen contactEmailInput:", contactEmailInput); // Log za provjeru
            console.log("Dohvaćen contactPhoneInput:", contactPhoneInput); // Log za provjeru

            // Filtriranje unosa za Ime i Prezime (Uklanja brojeve i nedozvoljene znakove)
            if (contactNameInput) {
                console.log("Povezujem INPUT listener (verzija 3) za:", contactNameInput);

                contactNameInput.addEventListener('input', function(e) {
                    const inputElement = e.target;
                    const originalValue = inputElement.value;
                    // Ukloni sve što nije slovo (uklj. HR), razmak ili crtica
                    const cleanedValue = originalValue.replace(/[^ \p{L}\s\-]/gu, '');

                    if (originalValue !== cleanedValue) {
                        console.log(`[Input Event] Nedozvoljeni znak uklonjen. Original: "${originalValue}", Očišćeno: "${cleanedValue}"`);
                        // Postavi očišćenu vrijednost i pomakni kursor
                        const currentCursorPosition = inputElement.selectionStart;
                        const diff = originalValue.length - cleanedValue.length;
                        inputElement.value = cleanedValue;
                        const newCursorPosition = Math.max(0, currentCursorPosition - diff);
                        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
                    }
                });

                 // Filtriranje kod lijepljenja (paste)
                 contactNameInput.addEventListener('paste', function(event) {
                    setTimeout(() => {
                        const inputElement = event.target;
                         const originalValue = inputElement.value;
                         const cleanedValue = originalValue.replace(/[^ \p{L}\s\-]/gu, ''); // Koristimo isti regex
                         if (originalValue !== cleanedValue) {
                             console.log(`[Paste Event] Nedozvoljeni znakovi uklonjeni nakon paste. Original: "${originalValue}", Očišćeno: "${cleanedValue}"`);
                             inputElement.value = cleanedValue;
                         }
                    }, 0);
                 });

            } else {
                console.warn("Element contactNameInput nije pronađen za INPUT listener.");
            }

// --- MINIMALNI TESTNI KOD ZA KONTAKT FORMU ---

// Dohvaćanje elemenata
const contactFormTest = document.querySelector('#contact-form-popup form');
const contactNameInputTest = document.getElementById('contact-name-popup');
const validationPopupTest = document.getElementById('validation-popup'); // Treba nam za prikaz greške

console.log("Testni kod - Dohvaćena forma:", contactFormTest);
console.log("Testni kod - Dohvaćen input imena:", contactNameInputTest);

// 1. Listener za AKTIVNO sprječavanje unosa BROJEVA
if (contactNameInputTest) {
    contactNameInputTest.addEventListener('beforeinput', function(event) {
        // 'beforeinput' se aktivira prije nego se znak upiše
        // event.data sadrži znak koji se pokušava unijeti
        if (event.data && /\d/.test(event.data)) {
            console.log(`[BeforeInput] Pokušaj unosa broja "${event.data}" - SPRJEČAVAM!`);
            event.preventDefault(); // Spriječi unos broja
        }
    });

    // Dodatno za paste - koristi input jer beforeinput ne radi dobro za paste
     contactNameInputTest.addEventListener('input', function(e) {
         const inputElement = e.target;
         const originalValue = inputElement.value;
         const cleanedValue = originalValue.replace(/\d/g, ''); // Ukloni samo brojeve
         if(originalValue !== cleanedValue) {
             console.log("[Input/Paste] Uklanjam brojeve nakon paste/unosa.");
             inputElement.value = cleanedValue;
         }
     });

} else {
     console.warn("Testni kod - contactNameInputTest NIJE pronađen!");
}

// 2. Listener za SUBMIT - samo provjera brojeva
if (contactFormTest && contactNameInputTest && validationPopupTest) {
    contactFormTest.addEventListener('submit', function(event) {
        event.preventDefault(); // Uvijek spriječi slanje forme
        console.log("--- TESTNI SUBMIT LISTENER AKTIVIRAN ---");
        const nameValue = contactNameInputTest.value.trim();
        const containsNumber = /\d/.test(nameValue);

        console.log(`[Test Submit] Vrijednost Imena: "${nameValue}"`);
        console.log(`[Test Submit] Sadrži broj: ${containsNumber}`);

        if (containsNumber || nameValue === '') { // Provjeri i prazno polje
            let testErrorMessage = containsNumber ? "TEST GREŠKA: Ime sadrži brojeve!" : "TEST GREŠKA: Ime je prazno!";
            console.error(testErrorMessage); // Ispiši kao grešku u konzoli
             if (validationPopupTest) {
                 // Koristi validationPopup za prikaz greške
                 validationPopupTest.innerHTML = `<button class="popup-close" data-action="return-to-contact">×</button><h4>Greška</h4><p>${testErrorMessage}</p>`;
                  // Pretpostavljamo da funkcija showPopup postoji i radi
                  // Ako showPopup nije definirana globalno, ovaj dio će baciti grešku
                  try {
                      showPopup(validationPopupTest, true, 'contact-form-popup');
                  } catch (e) {
                      console.error("Greška pri pozivu showPopup:", e);
                      // Alternativno, samo prikaži popup direktno ako showPopup ne radi
                       const overlayTest = document.getElementById('popup-overlay');
                       if (overlayTest) overlayTest.style.display = 'flex';
                       validationPopupTest.style.display = 'block';
                  }
             }
        } else {
            console.log("[Test Submit] VALIDACIJA PROŠLA (nema brojeva). NE prikazujem 'Poslano!' namjerno.");
            // Namjerno NE prikazujemo "Poslano" da vidimo hoće li se svejedno pojaviti
            alert("TEST: Validacija prošla (nema brojeva). Kliknite OK."); // Koristimo običan alert za test
        }
         console.log("--- TESTNI SUBMIT LISTENER ZAVRŠIO ---");
    });
} else {
    console.warn("Testni kod - Neki elementi (forma, input imena, popup) nisu pronađeni za submit listener.");
}
// --- KRAJ MINIMALNOG TESTNOG KODA ---            
                                   // --- POČETAK KODA ZA FILTRIRANJE UNOSA IMENA ---
            // Koristimo 'input' event listener (verzija 2)
                        // --- Kontakt Forma Popup Validacija (POJEDNOSTAVLJENO ZA TESTIRANJE) ---
                        if (contactForm && contactNameInput && contactEmailInput && contactPhoneInput && validationPopup && popupOverlay && contactFormPopup && body) {
                            contactForm.addEventListener('submit', function(event) {
                                event.preventDefault(); // UVIJEK spriječi defaultno slanje forme za sad
                                console.log("--- SUBMIT LISTENER AKTIVIRAN ---");
           
                                const nameValue = contactNameInput.value.trim();
                                const emailValue = contactEmailInput.value.trim(); // Ostaje radi potpunosti
                                const phoneValue = contactPhoneInput.value.trim(); // Ostaje radi potpunosti
                                let errorMessage = null;
           
                                console.log(`[Submit] Vrijednost Imena: "${nameValue}"`);
           
                                // <<< === KLJUČNA PROVJERA ZA BROJEVE === >>>
                                const containsNumber = /\d/.test(nameValue);
                                console.log(`[Submit] Rezultat containsNumber (/\d/.test): ${containsNumber}`);
           
                                if (containsNumber) {
                                    errorMessage = "Ime i prezime NE SMIJU sadržavati brojeve.";
                                    console.log("[Submit] GREŠKA: Ime sadrži broj!");
                                }
                                // <<< ==================================== >>>
           
                                // Ovdje možemo dodati i ostale provjere ako želimo, ali fokus je na brojevima
                                else if (nameValue === '') { // Dodatna provjera za prazno polje
                                    errorMessage = "Molimo unesite vaše ime i prezime.";
                                    console.log("[Submit] GREŠKA: Ime je prazno!");
                                }
                                // else if (provjera za email...) { ... }
                                // else if (provjera za telefon...) { ... }
           
           
                                // Prikaz greške ILI uspjeha
                                if (errorMessage) {
                                   console.log(`[Submit] Prikazujem grešku: ${errorMessage}`);
                                    if (validationPopup) {
                                        validationPopup.innerHTML = `<button class="popup-close" data-action="return-to-contact">×</button><h4>Greška u unosu</h4><p>${errorMessage}</p>`;
                                        showPopup(validationPopup, true, 'contact-form-popup');
                                    }
                                    // NE radimo return; da vidimo što se dalje događa
                                } else {
                                    // AKO NEMA GREŠKE (NEMA BROJEVA, NIJE PRAZNO...)
                                    console.log('[Submit] Validacija prošla (nema brojeva). Prikazujem "Poslano!"');
                                    if (validationPopup) {
                                        validationPopup.innerHTML = `<button class="popup-close" aria-label="Close popup">×</button><h4>Poslano!</h4><p>Hvala Vam na interesu. Kontaktirat ćemo Vas uskoro.</p>`;
                                        showPopup(validationPopup);
                                    }
                                    // contactForm.reset(); // Resetiraj formu tek ako je SVE OK
                                }
                                console.log("--- SUBMIT LISTENER ZAVRŠIO ---");
           
                            }); // Kraj submit listenera
                       } else {
                            console.warn("Neki elementi za validaciju kontakt forme nisu pronađeni.");
                       }
                       // --- Kraj Contact Form Popup Validation ---
            // --- Kraj Contact Form Popup Validation ---
        
        // --- AI Chat Float Icon & Popup Logic ---
        const aiChatIcon = document.getElementById('ai-chat-float-icon');
        const aiChatPopup = document.getElementById('ai-chat-popup');
        const aiChatCloseBtn = document.getElementById('ai-chat-close-btn');
        // Premješteno: Dohvat jezičnih elemenata za globalne listenere
        const desktopLangDropdown = document.getElementById('desktop-lang-dropdown');
        const mobileLangTrigger = document.getElementById('mobile-lang-trigger'); // Treba za ikonu
        const mobileLangDropdown = document.getElementById('mobile-lang-dropdown');
        const desktopLangTrigger = document.getElementById('desktop-lang-trigger'); // Treba za provjeru klika
        
        if (aiChatIcon && aiChatPopup && aiChatCloseBtn && body) {
            aiChatIcon.addEventListener('click', (event) => {
                event.stopPropagation(); // Spriječi da globalni listener odmah zatvori popup
                const isActive = aiChatPopup.classList.toggle('active');
                aiChatIcon.style.display = isActive ? 'none' : 'flex'; // Sakrij ikonu kad je popup aktivan
                body.classList.toggle('overflow-hidden', isActive); // Onemogući skrolanje tijela
                // Zatvori jezične menije ako su otvoreni
                closeAllLanguageDropdowns(); // closeAllLanguageDropdowns treba biti definirana globalno ili unutar DOMContentLoaded
            });
        
            aiChatCloseBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                aiChatPopup.classList.remove('active');
                aiChatIcon.style.display = 'flex'; // Pokaži ikonu
                body.classList.remove('overflow-hidden'); // Omogući skrolanje tijela
            });
        
            // Globalni listeneri (click i keydown) su premješteni IZVAN ovog if bloka
            // da se ne bi duplicirali i da budu na jednom mjestu.
        
        } else {
            console.warn("Elementi za AI Chat nisu pronađeni.");
        }
        // --- Kraj AI Chat Logic ---
        
        // --- Plutajući Brojač Korisnika Logic ---
        const userCounterWidget = document.getElementById('user-counter-widget');
        const userCounterHeader = document.getElementById('user-counter-header');
        const userCounterList = document.getElementById('user-counter-list');
        const userCounterNumberEl = document.getElementById('user-counter-number');
        const userCounterHideBtn = document.getElementById('user-counter-hide-btn');
        const userCounterCloseBtn = document.getElementById('user-counter-close-btn');
        const userCounterShowBtn = document.getElementById('user-counter-show-btn');
        
        let isDragging = false; let dragOffsetX = 0; let dragOffsetY = 0; let widgetVisible = true;
        
        if (userCounterWidget && userCounterHeader && userCounterList && userCounterNumberEl && userCounterHideBtn && userCounterCloseBtn && userCounterShowBtn && body) { // Provjeri i body
            userCounterHeader.addEventListener('mousedown', (e) => {
                if (e.target === userCounterHeader || userCounterHeader.contains(e.target) && !e.target.closest('button')) {
                    isDragging = true; userCounterWidget.classList.add('dragging');
                    dragOffsetX = e.clientX - userCounterWidget.offsetLeft; dragOffsetY = e.clientY - userCounterWidget.offsetTop;
                    e.preventDefault();
                }
            });
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                let newLeft = e.clientX - dragOffsetX; let newTop = e.clientY - dragOffsetY;
                const widgetRect = userCounterWidget.getBoundingClientRect(); const maxX = window.innerWidth - widgetRect.width; const maxY = window.innerHeight - widgetRect.height;
                newLeft = Math.max(0, Math.min(newLeft, maxX)); newTop = Math.max(0, Math.min(newTop, maxY));
                userCounterWidget.style.left = `${newLeft}px`; userCounterWidget.style.top = `${newTop}px`;
            });
            document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; userCounterWidget.classList.remove('dragging'); } });
        
            const hideWidget = () => {
                userCounterWidget.classList.add('hidden'); userCounterShowBtn.classList.add('visible'); widgetVisible = false;
            };
            userCounterHideBtn.addEventListener('click', hideWidget);
            userCounterCloseBtn.addEventListener('click', hideWidget); // Oba gumba rade isto
        
            userCounterShowBtn.addEventListener('click', () => {
                userCounterWidget.classList.remove('hidden'); userCounterShowBtn.classList.remove('visible'); widgetVisible = true;
                // Vrati na default poziciju (desno gore)
                userCounterWidget.style.top = '100px'; userCounterWidget.style.left = ''; userCounterWidget.style.right = '30px';
            });
        
            let currentUsers = parseInt(userCounterNumberEl.textContent.replace(/,/g, '')) || 12345;
            function simulateNewUser() {
                if (!widgetVisible) { setTimeout(simulateNewUser, 20000 + Math.random() * 15000); return; }
                const countries = [ { code: 'hr', name: 'Croatia' }, { code: 'rs', name: 'Serbia' }, { code: 'ba', name: 'Bosnia' }, { code: 'si', name: 'Slovenia' }, { code: 'de', name: 'Germany' }, { code: 'at', name: 'Austria' }, { code: 'it', name: 'Italy' }, { code: 'hu', name: 'Hungary' }, { code: 'cz', name: 'Czech Republic' }, { code: 'sk', name: 'Slovakia' } ];
                const firstNames = ['Ivan', 'Marko', 'Ana', 'Petra', 'Nikola', 'Luka', 'Maja', 'Sara', 'Josip', 'Tomislav', 'Milan', 'Stefan', 'Amina', 'Jan', 'Matej', 'Zoran', 'Goran'];
                const lastNames = ['Horvat', 'Novak', 'Kovačević', 'Petrović', 'Jurić', 'Marić', 'Pavlović', 'Knežević', 'Babić', 'Vuković', 'Marković', 'Popović'];
                const randomCountry = countries[Math.floor(Math.random() * countries.length)]; const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]; const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)]; const username = `${randomFirstName}_${randomLastName.substring(0,3)}`.toLowerCase();
                const placeholder = userCounterList.querySelector('.user-counter-placeholder'); if (placeholder) placeholder.remove();
                const newUserItem = document.createElement('div'); newUserItem.className = 'user-counter-item';
                newUserItem.innerHTML = `<img src="https://flagcdn.com/w40/${randomCountry.code}.png" alt="${randomCountry.name}" class="user-counter-flag"><div class="user-counter-name">${username}</div><div class="user-counter-time">upravo sada</div>`;
                userCounterList.insertBefore(newUserItem, userCounterList.firstChild);
                const times = userCounterList.querySelectorAll('.user-counter-time');
                times.forEach((time, index) => {
                    if (index > 0) {
                        if (time.textContent === 'upravo sada') { time.textContent = 'prije 1 min'; }
                        else if (time.textContent.includes('min')) { const minutes = parseInt(time.textContent.match(/\d+/)[0]); if (minutes < 59) { time.textContent = `prije ${minutes + 1} min`; } }
                    }
                });
                while (userCounterList.children.length > 6) { userCounterList.removeChild(userCounterList.lastChild); }
                currentUsers++; userCounterNumberEl.textContent = currentUsers.toLocaleString();
                setTimeout(simulateNewUser, 10000 + Math.random() * 25000);
            }
            setTimeout(simulateNewUser, 5000);
        } else { console.warn("Elementi za User Counter Widget nisu pronađeni."); }
        // --- Kraj Plutajućeg Brojača Korisnika ---
        
        // --- KOD ZA IZBORNIK JEZIKA (Bez globalnih listenera - oni idu ispod) ---
        // Desktop Language Selector
        // const desktopLangTrigger = document.getElementById('desktop-lang-trigger'); // Već dohvaćen gore
        // const desktopLangDropdown = document.getElementById('desktop-lang-dropdown'); // Već dohvaćen gore
        
        if (desktopLangTrigger && desktopLangDropdown) {
            desktopLangTrigger.addEventListener('click', (event) => {
                event.stopPropagation(); // Spriječi da klik odmah zatvori meni
                desktopLangDropdown.classList.toggle('active');
                // Zatvori mobilni meni ako je otvoren
                if (mobileLangDropdown && mobileLangDropdown.classList.contains('active')) {
                    mobileLangDropdown.classList.remove('active');
                    // Vrati ikonu na dole
                    const mobileIcon = mobileLangTrigger?.querySelector('i.fas');
                     if (mobileIcon) {
                        mobileIcon.classList.add('fa-chevron-down');
                        mobileIcon.classList.remove('fa-chevron-up');
                     }
                }
            });
        
            // Zatvori meni klikom na zastavicu
            desktopLangDropdown.querySelectorAll('.language-item').forEach(item => {
                item.addEventListener('click', () => {
                    desktopLangDropdown.classList.remove('active');
                    console.log('Odabran jezik (desktop):', item.querySelector('span:not(.flag-icon)')?.textContent);
                });
            });
        
            // Spriječi zatvaranje menija klikom unutar njega
            desktopLangDropdown.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        }
        
        // Mobile Language Selector
        // const mobileLangTrigger = document.getElementById('mobile-lang-trigger'); // Već dohvaćen gore
        // const mobileLangDropdown = document.getElementById('mobile-lang-dropdown'); // Već dohvaćen gore
        
        if (mobileLangTrigger && mobileLangDropdown) {
            mobileLangTrigger.addEventListener('click', (event) => {
                event.preventDefault(); // Spriječi defaultno ponašanje linka
                event.stopPropagation(); // Spriječi da klik odmah zatvori meni
                const isActive = mobileLangDropdown.classList.toggle('active');
                 // Pronađi ikonu unutar triggera i promijeni je
                 const icon = mobileLangTrigger.querySelector('i.fas');
                 if (icon) {
                    icon.classList.toggle('fa-chevron-down', !isActive);
                    icon.classList.toggle('fa-chevron-up', isActive);
                 }
                // Zatvori desktop meni ako je otvoren
                if (desktopLangDropdown && desktopLangDropdown.classList.contains('active')) {
                    desktopLangDropdown.classList.remove('active');
                }
            });
        
            // Zatvori meni klikom na zastavicu
            mobileLangDropdown.querySelectorAll('.language-item').forEach(item => {
                item.addEventListener('click', () => {
                    mobileLangDropdown.classList.remove('active');
                    // Vrati ikonu na dole
                    const icon = mobileLangTrigger.querySelector('i.fas');
                     if (icon) {
                        icon.classList.add('fa-chevron-down');
                        icon.classList.remove('fa-chevron-up');
                     }
                     console.log('Odabran jezik (mobile):', item.querySelector('span:not(.flag-icon)')?.textContent);
                });
            });
        
            // Spriječi zatvaranje menija klikom unutar njega
            mobileLangDropdown.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        }
        // --- KRAJ KODA ZA IZBORNIK JEZIKA ---
        
        // --- KONSOLIDIRANI GLOBALNI EVENT LISTENER-I ---
        // Funkcija za zatvaranje oba jezična menija (ako već ne postoji)
        function closeAllLanguageDropdowns() {
            if (desktopLangDropdown && desktopLangDropdown.classList.contains('active')) {
                desktopLangDropdown.classList.remove('active');
            }
            if (mobileLangDropdown && mobileLangDropdown.classList.contains('active')) {
                mobileLangDropdown.classList.remove('active');
                const mobileIcon = mobileLangTrigger?.querySelector('i.fas');
                if (mobileIcon) {
                   mobileIcon.classList.add('fa-chevron-down');
                   mobileIcon.classList.remove('fa-chevron-up');
                }
            }
        }
        
        // Jedan globalni listener za klik izvan elemenata
        document.addEventListener('click', (event) => {
            // Provjere za jezične menije
            const isClickInsideLangDesktop = desktopLangDropdown && desktopLangDropdown.contains(event.target);
            const isClickInsideLangMobile = mobileLangDropdown && mobileLangDropdown.contains(event.target);
            const isClickOnLangDesktopTrigger = desktopLangTrigger && desktopLangTrigger.contains(event.target);
            const isClickOnLangMobileTrigger = mobileLangTrigger && mobileLangTrigger.contains(event.target);
        
            if (!isClickInsideLangDesktop && !isClickInsideLangMobile && !isClickOnLangDesktopTrigger && !isClickOnLangMobileTrigger) {
                closeAllLanguageDropdowns();
            }
        
            // Provjere za AI Chat popup
            const isClickInsideAIChat = aiChatPopup && aiChatPopup.contains(event.target);
            const isClickOnAIIcon = aiChatIcon && aiChatIcon.contains(event.target);
        
            if (aiChatPopup && aiChatPopup.classList.contains('active') && !isClickInsideAIChat && !isClickOnAIIcon) {
                aiChatPopup.classList.remove('active');
                if(aiChatIcon) aiChatIcon.style.display = 'flex'; // Pokaži ikonu
                if(body) body.classList.remove('overflow-hidden'); // Omogući skrolanje
            }
        });
        
        // Jedan globalni listener za Escape tipku
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                // Zatvori AI Chat
                if (aiChatPopup && aiChatPopup.classList.contains('active')) {
                    aiChatPopup.classList.remove('active');
                    if(aiChatIcon) aiChatIcon.style.display = 'flex';
                    if(body) body.classList.remove('overflow-hidden');
                }
                // Zatvori Jezične menije
                closeAllLanguageDropdowns();
        
                // Ovdje možete dodati i zatvaranje drugih elemenata ako je potrebno (npr. općeniti popup)
                // closeAllPopups(); // Ako imate ovu funkciju definiranu globalno
            }
        });
        // --- KRAJ KONSOLIDIRANIH GLOBALNIH LISTENER-A ---
        
        
        console.log("Sve JS skripte unutar DOMContentLoaded su postavljene.");
        
        // --- OBRISAN DIO: POSTOJEĆI JavaScript KOD ---
        // (Pod pretpostavkom da je Hamburger, Accordion, Scroll, GSAP, Cursor logika definirana drugdje)
        
        }); // <<< KRAJ GLAVNOG DOMContentLoaded LISTENER-a