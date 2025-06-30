// ====================================================================
// GLAVNA SKRIPTA ZA PREVOĐENJE I APLIKACIJU
// ====================================================================

/**
 * Glavna funkcija za inicijalizaciju i prevođenje.
 * Pokreće se nakon što se učita DOM.
 */
async function i18n_init() {
    // Određujemo jezik, ali ga nećemo odmah koristiti.
    const savedLang = localStorage.getItem('sft21_lang') || 'hr';

    // ===============================================================
    // #### DIJAGNOSTIČKI BLOK - SVE VEZANO ZA PRIJEVODE JE ISKLJUČENO ####
    // Sljedeći dio koda koji učitava prijevode je namjerno stavljen
    // u komentar kako bismo testirali ostatak aplikacije.
    // ===============================================================
    /*
    // Inicijaliziraj i18next instancu
    await i18next.use(i18nextHttpBackend).init({
        lng: savedLang,
        fallbackLng: 'hr',
        debug: false,
        backend: {
            loadPath: 'locales/{{lng}}.json',
        },
    });

    // Ažuriraj sadržaj na stranici s učitanim prijevodima
    updateContent(savedLang);
    */
   
    // ===============================================================
    // #### POKRETANJE APLIKACIJE - OVO MORA OSTATI AKTIVNO! ####
    // Ova linija pokreće svu ostalu logiku (menije, animacije, itd.).
    // ===============================================================
    initializeAppLogic(); 

    // ===============================================================
    // #### EVENT LISTENERI ZA JEZIK - TAKOĐER ISKLJUČENI ####
    // Gumbi za promjenu jezika se također isključuju jer ovise o i18next.
    // ===============================================================
    /*
    // Dodaj event listenere na gumbe za promjenu jezika
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = el.getAttribute('data-lang');
            i18next.changeLanguage(lang, (err, t) => {
                if (err) return console.error('i18next error:', err);
                localStorage.setItem('sft21_lang', lang);
                updateContent(lang);
            });
        });
    });
    */
}


/**
 * Funkcija koja pronalazi sve elemente s `data-i18n` atributom i prevodi ih.
 * Također ažurira atribute poput 'placeholder' i 'title'.
 * @param {string} lang - Kod trenutnog jezika (npr. 'hr' ili 'en').
 */
const updateContent = (lang) => {
    document.documentElement.lang = lang; // Postavi lang atribut na <html> element

    // Prevedi sav tekstualni sadržaj
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key && i18next.exists(key)) {
            el.innerHTML = i18next.t(key);
        }
    });

    // Funkcija za ažuriranje atributa elemenata
    const updateAttribute = (selector, attribute, key) => {
        const element = document.querySelector(selector);
        if (element && i18next.exists(key)) {
            element[attribute] = i18next.t(key);
        }
    };

    // Ažuriraj sve potrebne atribute
    updateAttribute('#name', 'placeholder', 'contact.placeholderName');
    updateAttribute('#email', 'placeholder', 'contact.placeholderEmail');
    updateAttribute('#subject', 'placeholder', 'contact.placeholderSubject');
    updateAttribute('#message', 'placeholder', 'contact.placeholderMessage');
    updateAttribute('#contact-name-popup', 'placeholder', 'placeholderFullName');
    updateAttribute('#contact-email-popup', 'placeholder', 'placeholderEmail');
    updateAttribute('#contact-phone-popup', 'placeholder', 'placeholderPhone');
    updateAttribute('#starter-package-email-input', 'placeholder', 'starterPopup.placeholderEmail');
    updateAttribute('#investor-name-details', 'placeholder', 'placeholderFullName');
    updateAttribute('#investor-email-details', 'placeholder', 'placeholderEmail');
    updateAttribute('#referrer-name-email', 'placeholder', 'placeholderReferrer');
    updateAttribute('#ip7-custom-amount-details', 'placeholder', 'ip7.placeholderMin');
    updateAttribute('#ip7-amount-input', 'placeholder', 'ip7.placeholderMinLegacy');
    updateAttribute('#user-counter-hide-btn', 'title', 'userCounter.hide');
    updateAttribute('#user-counter-close-btn', 'title', 'userCounter.close');
    updateAttribute('#user-counter-show-btn', 'title', 'userCounter.show');
    updateAttribute('#ai-chat-close-btn', 'aria-label', 'aiChat.close');
};

/**
 * Funkcija koja sadrži svu ostalu logiku aplikacije.
 * Inicijalizira sve event listenere i funkcionalnosti stranice.
 */
function initializeAppLogic() {
    console.log("DOM spreman, pokrećem skripte...");
    const body = document.body;

    // --- Deklaracija svih varijabli ---
    const desktopLangTrigger = document.getElementById('desktop-lang-trigger');
    const desktopLangDropdown = document.getElementById('desktop-lang-dropdown');
    const mobileLangTrigger = document.getElementById('mobile-lang-trigger');
    const mobileLangDropdown = document.getElementById('mobile-lang-dropdown');
    const mobileLangIcon = mobileLangTrigger?.querySelector('i.fas.fa-chevron-down');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const mobileDropdownToggles = document.querySelectorAll('.nav-menu .mobile-dropdown-toggle:not(.mobile-language-trigger)');
    const fixedNav = document.querySelector('nav.fixed');
    const navHeight = fixedNav ? fixedNav.offsetHeight : 80;
    const accordionItems = document.querySelectorAll('.accordion-item');
    const extraScrollMarginAccordion = 10;
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav .nav-link:not(.mobile-dropdown-toggle)');
    const cursor = document.querySelector('.custom-cursor');
    const popupOverlay = document.getElementById('popup-overlay');
    const validationPopup = document.getElementById('validation-popup');
    const contactFormPopup = document.getElementById('contact-form-popup');
    const starterPackageInfoPopup = document.getElementById('starter-package-info-popup');
    const starterInfoCloseLink = document.getElementById('starter-info-close-link');
    const starterPackageSelectBtns = document.querySelectorAll('.starter-package-select-btn');
    const starterPackageEmailForm = document.getElementById('starter-package-email-form');
    const starterPackageEmailInput = document.getElementById('starter-package-email-input');
    const ip7AmountInputContainer = document.getElementById('ip7-amount-input-container');
    const ip7AmountInput = document.getElementById('ip7-amount-input');
    const ip7Do10kBtn = document.getElementById('ip7-do-10k');
    const ip7VećiIznosBtn = document.getElementById('ip7-veci-iznos');
    const ip7AmountConfirmBtn = ip7AmountInputContainer?.querySelector('#ip7-amount-confirm');
    const ip7AmountCancelBtn = ip7AmountInputContainer?.querySelector('#ip7-amount-cancel');
    const minAmountDo10k = 2200;
    const maxAmountDo10k = 10000;
    const contactForm = document.querySelector('#contact-form-popup form');
    const contactNameInput = document.getElementById('contact-name-popup');
    const contactEmailInput = document.getElementById('contact-email-popup');
    const contactPhoneInput = document.getElementById('contact-phone-popup');
    const aiChatIcon = document.getElementById('ai-chat-float-icon');
    const aiChatPopup = document.getElementById('ai-chat-popup');
    const aiChatCloseBtn = document.getElementById('ai-chat-close-btn');
    const userCounterWidget = document.getElementById('user-counter-widget');
    const userCounterHeader = document.getElementById('user-counter-header');
    const userCounterList = document.getElementById('user-counter-list');
    const userCounterNumberEl = document.getElementById('user-counter-number');
    const userCounterHideBtn = document.getElementById('user-counter-hide-btn');
    const userCounterCloseBtn = document.getElementById('user-counter-close-btn');
    const userCounterShowBtn = document.getElementById('user-counter-show-btn');
    const chooseInvestorTypePopup = document.getElementById('choose-investor-type-popup');
    const investmentDetailsPopup = document.getElementById('investment-details-popup');
    const triggerChooseInvestorTypeBtns = document.querySelectorAll('.trigger-choose-investor-type-popup');
    const openInvestmentDetailsFromCardBtns = document.querySelectorAll('.open-investment-details-popup');
    const btnRegistriraniKorisnikChoice = document.getElementById('btn-registrirani-korisnik-choice');
    const btnNoviInvestitorChoice = document.getElementById('btn-novi-investitor-choice');
    const investmentDetailsForm = document.getElementById('investment-details-form');
    const investorNameDetailsInput = document.getElementById('investor-name-details');
    const investorEmailDetailsInput = document.getElementById('investor-email-details');
    const investmentPackageDetailsCheckboxes = document.querySelectorAll('#investment-package-selection input[name="ip_package_details"]');
    const ip7CheckboxDetails = document.getElementById('ip7-checkbox-details');
    const ip7CustomAmountDetailsInput = document.getElementById('ip7-custom-amount-details');
    const totalInvestmentAmountDetailsSpan = document.getElementById('total-investment-amount-details');
    const referrerYesRadio = document.getElementById('referrer-yes');
    const referrerNoRadio = document.getElementById('referrer-no');
    const referrerInputContainer = document.getElementById('referrer-input-container');
    const referrerNameEmailInput = document.getElementById('referrer-name-email');

    let isDraggingCounter = false;
    let dragCounterOffsetX = 0;
    let dragCounterOffsetY = 0;
    let counterWidgetVisible = true;
    let submittedEmails = new Set();
    let submittedInvestmentEmails = new Set();
    
    // --- FUNKCIJE ---

    const closeAllLanguageDropdowns = () => {
        if (desktopLangDropdown?.classList.contains('active')) { desktopLangDropdown.classList.remove('active'); }
        if (mobileLangDropdown?.classList.contains('active')) { 
            mobileLangDropdown.classList.remove('active'); 
            if (mobileLangIcon) { 
                mobileLangIcon.classList.remove('fa-chevron-up'); 
                mobileLangIcon.classList.add('fa-chevron-down'); 
            } 
        }
    };
    
    const toggleLanguageDropdown = (dropdownElement, otherDropdownElement, triggerIcon = null) => {
        if (!dropdownElement) return;
        const isActive = dropdownElement.classList.contains('active');
        if (otherDropdownElement?.classList.contains('active')) {
            otherDropdownElement.classList.remove('active');
            const otherMobileIcon = document.getElementById('mobile-lang-trigger')?.querySelector('i.fas');
            if (otherDropdownElement.id === 'mobile-lang-dropdown' && otherMobileIcon?.classList.contains('fa-chevron-up')) {
                otherMobileIcon.classList.replace('fa-chevron-up', 'fa-chevron-down');
            }
        }
        dropdownElement.classList.toggle('active', !isActive);
        if (triggerIcon && dropdownElement.id === 'mobile-lang-dropdown') {
            triggerIcon.classList.toggle('fa-chevron-down', !isActive);
            triggerIcon.classList.toggle('fa-chevron-up', isActive);
        }
    };

    const resetInvestmentDetailsForm = () => {
        if (investmentDetailsForm) investmentDetailsForm.reset();
        investmentPackageDetailsCheckboxes.forEach(cb => cb.checked = false);
        if (ip7CheckboxDetails) ip7CheckboxDetails.checked = false;
        if (ip7CustomAmountDetailsInput) {
            ip7CustomAmountDetailsInput.value = '';
            ip7CustomAmountDetailsInput.disabled = true;
        }
        if (totalInvestmentAmountDetailsSpan) totalInvestmentAmountDetailsSpan.textContent = '0';
    };

    window.closeAllPopups = () => {
        if (validationPopup) validationPopup.style.display = 'none';
        if (contactFormPopup) contactFormPopup.style.display = 'none';
        if (starterPackageInfoPopup) starterPackageInfoPopup.style.display = 'none';
        if (chooseInvestorTypePopup) chooseInvestorTypePopup.style.display = 'none';
        if (investmentDetailsPopup) investmentDetailsPopup.style.display = 'none';
        if (popupOverlay) popupOverlay.style.display = 'none';
        if (body) body.classList.remove('overflow-hidden');
        if (ip7AmountInputContainer) ip7AmountInputContainer.style.display = 'none';
        if (ip7AmountInput) ip7AmountInput.value = '';
        if(starterPackageEmailInput) starterPackageEmailInput.value = '';
        resetInvestmentDetailsForm();
    };

    window.showPopup = (popupContentElement, isErrorPopup = false, returnToPopupId = null) => {
        closeAllPopups();
        if (popupContentElement && popupOverlay && body) {
            popupOverlay.style.display = 'flex';
            popupContentElement.style.display = 'block';
            body.classList.add('overflow-hidden');

            setTimeout(() => {
                popupContentElement.scrollTop = 0;
                const emailInput = popupContentElement.querySelector('input[type="email"]');
                if (emailInput) emailInput.blur();
                popupContentElement.focus();
            }, 50);

            popupContentElement.querySelectorAll('button.popup-close, button[data-action]').forEach(clickable => {
                const newClickable = clickable.cloneNode(true);
                clickable.parentNode.replaceChild(newClickable, clickable);

                if (newClickable.classList.contains('popup-close')) {
                    newClickable.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        closeAllPopups();
                    }, { once: true });
                } else if (newClickable.hasAttribute('data-action')) {
                    newClickable.addEventListener('click', (e) => {
                        e.preventDefault(); e.stopPropagation();
                        let targetPopupForReturn = null;
                        const action = newClickable.getAttribute('data-action');
                        
                        if (returnToPopupId) {
                            targetPopupForReturn = document.getElementById(returnToPopupId);
                        } else if (action === 'return-to-starter-info') {
                            targetPopupForReturn = starterPackageInfoPopup;
                        } else if (action === 'return-to-contact') {
                            targetPopupForReturn = contactFormPopup;
                        } else if (action === 'return-to-investment-details') {
                            targetPopupForReturn = investmentDetailsPopup;
                        }
                        
                        if(validationPopup) validationPopup.style.display = 'none';

                        if (targetPopupForReturn) {
                            showPopup(targetPopupForReturn);
                        } else {
                            closeAllPopups();
                        }
                    }, { once: true });
                }
            });

        } else {
            console.warn(i18next.t('errorPopupNotFound'), popupContentElement);
        }
    };
    
    // --- EVENT LISTENERS I INICIJALIZACIJA ---

    // Navigacija - Hamburger i dropdownovi
    if (desktopLangTrigger && desktopLangDropdown) {
        desktopLangTrigger.addEventListener('click', (event) => { event.stopPropagation(); toggleLanguageDropdown(desktopLangDropdown, mobileLangDropdown); });
        desktopLangDropdown.querySelectorAll('.language-item').forEach(item => { item.addEventListener('click', (event) => { event.stopPropagation(); closeAllLanguageDropdowns(); }); });
        desktopLangDropdown.addEventListener('click', (event) => { event.stopPropagation(); });
    }
    if (mobileLangTrigger && mobileLangDropdown) {
        mobileLangTrigger.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); toggleLanguageDropdown(mobileLangDropdown, desktopLangDropdown, mobileLangIcon); });
        mobileLangDropdown.querySelectorAll('.language-item').forEach(item => { item.addEventListener('click', (event) => { event.stopPropagation(); closeAllLanguageDropdowns(); }); });
        mobileLangDropdown.addEventListener('click', (event) => { event.stopPropagation(); });
    }
    
    if (hamburger && navMenu && body) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active', isActive);
            body.classList.toggle('overflow-hidden', isActive);
            closeAllLanguageDropdowns();
            document.querySelectorAll('.nav-menu .sft21-nav-item.dropdown.open:not(.mobile-language-selector)').forEach(openDropdown => {
                openDropdown.classList.remove('open');
                const icon = openDropdown.querySelector('.mobile-dropdown-toggle i');
                if (icon) icon.style.transform = 'rotate(0deg)';
                const menu = openDropdown.querySelector('.dropdown-menu');
                if (menu) menu.style.display = 'none';
            });
        });
        document.querySelectorAll('.nav-menu a:not([id*="lang-trigger"]):not(.mobile-dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.classList.remove('overflow-hidden');
                }
            });
        });
    }
    
    mobileDropdownToggles.forEach(toggle => {
        if (toggle.id === 'mobile-lang-trigger') return;
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownItem = toggle.closest('.sft21-nav-item.dropdown');
            const dropdownMenu = dropdownItem?.querySelector('.dropdown-menu');
            if (dropdownItem && dropdownMenu) {
                document.querySelectorAll('.nav-menu .sft21-nav-item.dropdown.open:not(.mobile-language-selector)').forEach(openDropdown => {
                    if (openDropdown !== dropdownItem) {
                        openDropdown.classList.remove('open');
                        const otherIcon = openDropdown.querySelector('.mobile-dropdown-toggle i');
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                        const otherMenu = openDropdown.querySelector('.dropdown-menu');
                        if (otherMenu) otherMenu.style.display = 'none';
                    }
                });
                dropdownItem.classList.toggle('open');
                dropdownMenu.style.display = dropdownItem.classList.contains('open') ? 'block' : 'none';
                const icon = toggle.querySelector('i.fas');
                if (icon) {
                    icon.style.transform = dropdownItem.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
                closeAllLanguageDropdowns();
            }
        });
    });

    // Accordion
    if (accordionItems.length > 0) {
        const getAbsoluteOffsetTop = (el) => el.offsetTop + (el.offsetParent ? getAbsoluteOffsetTop(el.offsetParent) : 0);
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            const icon = header?.querySelector('i');
            if (!header || !content || !icon) return;
            
            content.style.transition = 'max-height 0.5s ease-in-out, padding 0.5s ease-in-out';
            content.style.maxHeight = '0'; content.style.paddingTop = '0'; content.style.paddingBottom = '0'; icon.style.transform = 'rotate(0deg)';
            
            header.addEventListener('click', (event) => {
                const clickedItem = event.currentTarget.closest('.accordion-item');
                if (!clickedItem) return;
                const wasActive = clickedItem.classList.contains('active');
                let closingHappened = false;
                
                accordionItems.forEach(otherItem => {
                    if (otherItem !== clickedItem && otherItem.classList.contains('active')) {
                        closingHappened = true;
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.accordion-content');
                        const otherIcon = otherItem.querySelector('.accordion-header i');
                        if (otherContent) { otherContent.style.maxHeight = '0'; otherContent.style.paddingTop = '0'; otherContent.style.paddingBottom = '0'; }
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    }
                });

                const openAndScroll = () => {
                    clickedItem.classList.add('active');
                    const currentIcon = header.querySelector('i');
                    const currentContent = clickedItem.querySelector('.accordion-content');
                    if (currentContent) {
                        currentContent.style.display = 'block';
                        const scrollHeight = currentContent.scrollHeight;
                        currentContent.style.display = '';
                        currentContent.style.maxHeight = scrollHeight + "px";
                        currentContent.style.paddingTop = '0.5rem';
                        currentContent.style.paddingBottom = '1.5rem';
                    }
                    if (currentIcon) currentIcon.style.transform = 'rotate(180deg)';
                    setTimeout(() => {
                        const finalHeaderOffsetTop = getAbsoluteOffsetTop(header);
                        const finalScrollTargetY = finalHeaderOffsetTop - navHeight - extraScrollMarginAccordion;
                        window.scrollTo({ top: Math.max(0, finalScrollTargetY), behavior: 'smooth' });
                    }, 100);
                };
                
                const closeClicked = () => {
                    clickedItem.classList.remove('active');
                    const currentIcon = header.querySelector('i');
                    const currentContent = clickedItem.querySelector('.accordion-content');
                    if (currentContent) { currentContent.style.maxHeight = '0'; currentContent.style.paddingTop = '0'; currentContent.style.paddingBottom = '0'; }
                    if (currentIcon) currentIcon.style.transform = 'rotate(0deg)';
                };

                if (wasActive) {
                    closeClicked();
                } else {
                    const delayTime = closingHappened ? 550 : 0;
                    setTimeout(openAndScroll, delayTime);
                }
            });
        });
    }

    // Smooth scroll i aktivni linkovi u navigaciji
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            const targetElement = document.querySelector(hrefAttribute);
            if (targetElement) {
                e.preventDefault();
                const getAbsoluteOffsetTop = (el) => el.offsetTop + (el.offsetParent ? getAbsoluteOffsetTop(el.offsetParent) : 0);
                const targetAbsOffsetTop = getAbsoluteOffsetTop(targetElement);
                const targetPosition = targetAbsOffsetTop - navHeight - 10;
                window.scrollTo({ top: Math.max(0, targetPosition), behavior: 'smooth' });
                if (hamburger?.classList.contains('active')) { hamburger.classList.remove('active'); navMenu.classList.remove('active'); body?.classList.remove('overflow-hidden'); }
            }
        });
    });

    if (sections.length > 0 && navLinks.length > 0) {
        const updateActiveNavLink = () => {
            let currentSectionId = null;
            const scrollY = window.scrollY + navHeight + 50;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                currentSectionId = sections[sections.length - 1]?.getAttribute('id') || currentSectionId;
            } else if (window.scrollY < (sections[0]?.offsetTop || 0) - navHeight - 50) {
                currentSectionId = 'pocetna';
            }
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                if (linkHref === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', updateActiveNavLink, { passive: true });
        updateActiveNavLink();
    }
    
    // Zatvaranje popup-a i dropdowna klikom izvan ili Esc tipkom
    document.addEventListener('click', (event) => {
        const isClickInsideLangDesktop = desktopLangDropdown?.contains(event.target);
        const isClickInsideLangMobile = mobileLangDropdown?.contains(event.target);
        const isClickOnLangDesktopTrigger = desktopLangTrigger?.contains(event.target);
        const isClickOnLangMobileTrigger = mobileLangTrigger?.contains(event.target);
        const isClickInsideAIChat = aiChatPopup?.contains(event.target);
        const isClickOnAIIcon = aiChatIcon?.contains(event.target);
        if (!isClickInsideLangDesktop && !isClickInsideLangMobile && !isClickOnLangDesktopTrigger && !isClickOnLangMobileTrigger) {
            closeAllLanguageDropdowns();
        }
        if (aiChatPopup?.classList.contains('active') && !isClickInsideAIChat && !isClickOnAIIcon) {
            aiChatPopup.classList.remove('active');
            if (aiChatIcon) aiChatIcon.style.display = 'flex';
            if (body) body.classList.remove('overflow-hidden');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (hamburger?.classList.contains('active')) { hamburger.classList.remove('active'); navMenu.classList.remove('active'); body?.classList.remove('overflow-hidden'); }
            closeAllLanguageDropdowns();
            if (aiChatPopup?.classList.contains('active')) { aiChatPopup.classList.remove('active'); if (aiChatIcon) aiChatIcon.style.display = 'flex'; if (body) body.classList.remove('overflow-hidden'); }
            closeAllPopups();
        }
    });
    
    if (popupOverlay) {
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) closeAllPopups();
        });
    }
    document.querySelectorAll('.popup-content').forEach(content => {
        if (content) content.addEventListener('click', (e) => e.stopPropagation());
    });
    
    if (starterInfoCloseLink) {
        starterInfoCloseLink.addEventListener('click', (event) => {
            event.preventDefault(); 
            closeAllPopups();
        });
    }

    // Forma za Starter Package Email
    if (starterPackageEmailForm && starterPackageEmailInput && validationPopup) {
        starterPackageEmailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = starterPackageEmailInput.value.trim().toLowerCase();
            let messagePopupContent = '';
            let isError = false;
            let returnToPopup = 'starter-package-info-popup';

            if (starterPackageInfoPopup) starterPackageInfoPopup.style.display = 'none';

            if (email === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                isError = true;
                messagePopupContent = `<button class="popup-close" data-action="return-to-starter-info">×</button><h4>${i18next.t('errorTitle')}</h4><p>${i18next.t('errorEnterValidEmail')}</p>`;
            } else if (submittedEmails.has(email)) {
                isError = false; // Nije greška, samo informacija
                messagePopupContent = `<button class="popup-close" data-action="return-to-starter-info">×</button><h4>${i18next.t('infoTitle')}</h4><p>${i18next.t('starterPopup.emailRegistered', { email })}</p>`;
            } else {
                submittedEmails.add(email);
                console.log("Email za Starter Package obavijest:", email);
                messagePopupContent = `<button class="popup-close" aria-label="Close popup">×</button><h4>${i18next.t('thankYouTitle')}</h4><p>${i18next.t('starterPopup.emailSuccess', { email })}</p>`;
                starterPackageEmailInput.value = '';
                returnToPopup = null;
                setTimeout(closeAllPopups, 4000);
            }
            
            if (validationPopup) {
                validationPopup.innerHTML = messagePopupContent;
                showPopup(validationPopup, isError, returnToPopup);
            }
        });
    }

    // Logika za Investicijske popupe
    if (chooseInvestorTypePopup && investmentDetailsPopup && validationPopup && investmentDetailsForm) {
        
        const updateTotalInvestmentDetails = () => {
            let currentTotal = 0;
            investmentPackageDetailsCheckboxes.forEach(cb => {
                if (cb.checked) {
                    currentTotal += parseFloat(cb.value);
                }
            });
            if (ip7CheckboxDetails && ip7CustomAmountDetailsInput) {
                ip7CustomAmountDetailsInput.disabled = !ip7CheckboxDetails.checked;
                if (ip7CheckboxDetails.checked) {
                    const ip7Value = parseFloat(ip7CustomAmountDetailsInput.value);
                    if (!isNaN(ip7Value)) {
                        currentTotal += ip7Value;
                    }
                } else {
                    ip7CustomAmountDetailsInput.value = '';
                }
            }
            if (totalInvestmentAmountDetailsSpan) {
                totalInvestmentAmountDetailsSpan.textContent = currentTotal.toString();
            }
        };
        
        const allPackageCheckboxes = [...investmentPackageDetailsCheckboxes];
        if (ip7CheckboxDetails) {
            allPackageCheckboxes.push(ip7CheckboxDetails);
        }
        allPackageCheckboxes.forEach(cb => {
            if (cb && !cb.hasAttribute('data-listener-attached')) {
                cb.addEventListener('change', updateTotalInvestmentDetails);
                cb.setAttribute('data-listener-attached', 'true');
            }
        });
        if (ip7CustomAmountDetailsInput && !ip7CustomAmountDetailsInput.hasAttribute('data-listener-attached')) {
            ip7CustomAmountDetailsInput.addEventListener('input', updateTotalInvestmentDetails);
            ip7CustomAmountDetailsInput.setAttribute('data-listener-attached', 'true');
        }

        triggerChooseInvestorTypeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('preselectedPackageName');
                resetInvestmentDetailsForm();
                showPopup(chooseInvestorTypePopup);
            });
        });
        
        openInvestmentDetailsFromCardBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.setItem('preselectedPackageName', btn.dataset.packageName);
                resetInvestmentDetailsForm();
                showPopup(chooseInvestorTypePopup);
            });
        });

        if (btnNoviInvestitorChoice) {
            btnNoviInvestitorChoice.addEventListener('click', () => {
                if(chooseInvestorTypePopup) chooseInvestorTypePopup.style.display = 'none';
                const preselectedNameFromStorage = sessionStorage.getItem('preselectedPackageName');
                
                resetInvestmentDetailsForm();
                if (preselectedNameFromStorage) {
                    const targetCheckbox = document.getElementById(preselectedNameFromStorage.toLowerCase() + "-details");
                    if (targetCheckbox) {
                        targetCheckbox.checked = true;
                    }
                }
                updateTotalInvestmentDetails();

                showPopup(investmentDetailsPopup);
                if (investorNameDetailsInput) investorNameDetailsInput.focus();
                
                if (preselectedNameFromStorage) {
                    sessionStorage.removeItem('preselectedPackageName');
                }
            });
        }
        
        if (investmentDetailsForm) {
            investmentDetailsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = investorNameDetailsInput.value.trim();
                const email = investorEmailDetailsInput.value.trim().toLowerCase();
                let errorMessageKey = null;

                if (name.split(' ').filter(p => p).length < 2) {
                    errorMessageKey = 'errorEnterFullName';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    errorMessageKey = 'errorEnterValidEmail';
                }
                
                let selectedPackagesData = [];
                investmentPackageDetailsCheckboxes.forEach(cb => {
                    if (cb.checked) selectedPackagesData.push({ name: cb.dataset.packageName, value: cb.value });
                });

                let finalTotal = parseFloat(totalInvestmentAmountDetailsSpan.textContent || '0');
                
                if (ip7CheckboxDetails?.checked) {
                    const customAmount = parseFloat(ip7CustomAmountDetailsInput.value);
                    if (finalTotal < 5000) {
                        if (!errorMessageKey) errorMessageKey = 'investmentPopup.ip7minAmount';
                    }
                    if (ip7CustomAmountDetailsInput.value !== '' && (isNaN(customAmount) || customAmount < 5000)) {
                         if (!errorMessageKey) errorMessageKey = 'investmentPopup.ip7wrongAmount';
                    }
                }
                
                if (finalTotal === 0 && !errorMessageKey) {
                    errorMessageKey = 'investmentPopup.selectPackage';
                }

                if (errorMessageKey) {
                    validationPopup.innerHTML = `<button class="popup-close" data-action="return-to-investment-details">×</button><h4>${i18next.t('errorValidationTitle')}</h4><p>${i18next.t(errorMessageKey)}</p>`;
                    showPopup(validationPopup, true, 'investment-details-popup');
                    return;
                }

                if (submittedInvestmentEmails.has(email)) {
                    validationPopup.innerHTML = `<button class="popup-close" data-action="return-to-investment-details">×</button><h4>${i18next.t('infoTitle')}</h4><p>${i18next.t('investmentPopup.alreadyRegistered', { email })}</p>`;
                    showPopup(validationPopup, false, 'investment-details-popup');
                    return;
                }
                
                submittedInvestmentEmails.add(email);
                console.log("Prijava za investiciju:", { name, email, totalAmount: finalTotal });

                closeAllPopups();
                validationPopup.innerHTML = `<button class="popup-close" aria-label="Zatvori popup">×</button><h4>${i18next.t('thankYouTitle')}</h4><p>${i18next.t('investmentPopup.success', { email, amount: finalTotal })}</p>`;
                showPopup(validationPopup);
                setTimeout(closeAllPopups, 5000);
            });
        }
    }

    // AI Chat
    if (aiChatIcon && aiChatPopup && aiChatCloseBtn && body) {
        aiChatIcon.addEventListener('click', (event) => { event.stopPropagation(); aiChatPopup.classList.add('active'); aiChatIcon.style.display = 'none'; body.classList.add('overflow-hidden'); });
        aiChatCloseBtn.addEventListener('click', (event) => { event.stopPropagation(); aiChatPopup.classList.remove('active'); aiChatIcon.style.display = 'flex'; body.classList.remove('overflow-hidden'); });
    }

    // User Counter Widget
    if (userCounterWidget && userCounterHeader) {
        // ... (cijela logika za user counter widget ide ovdje)
    }

    // Canvas Animacija
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const mouse = { x: null, y: null };
        const options = { particleColor: "rgba(128, 255, 0, 0.85)", lineColor: "rgba(170, 0, 255, 0.8)", particleAmount: 120, defaultRadius: 1.3, linkRadius: 150, lineWidth: 0.4, mouseInteractionRadius: 150, mouseEffectStrength: 2, particleSpeed: 0.25 };

        const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 2 - 1;
                this.radius = options.defaultRadius * (1 + this.z * 0.5);
                this.vx = (Math.random() - 0.5) * options.particleSpeed;
                this.vy = (Math.random() - 0.5) * options.particleSpeed;
            }
            draw() {
                let finalRadius = this.radius; let opacity = 1;
                if (mouse.x !== null) {
                    const dx = this.x - mouse.x; const dy = this.y - mouse.y; const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < options.mouseInteractionRadius) {
                        const effect = (1 - dist / options.mouseInteractionRadius);
                        finalRadius += effect * options.mouseEffectStrength;
                        opacity += effect * 0.5;
                    }
                }
                ctx.beginPath(); ctx.arc(this.x, this.y, finalRadius, 0, Math.PI * 2); ctx.fillStyle = `rgba(128, 255, 0, ${opacity * 0.85})`; ctx.fill();
            }
            update() {
                this.x += this.vx * (1 + this.z * 0.5); this.y += this.vy * (1 + this.z * 0.5);
                if (this.x > canvas.width + 5) this.x = -5; else if (this.x < -5) this.x = canvas.width + 5;
                if (this.y > canvas.height + 5) this.y = -5; else if (this.y < -5) this.y = canvas.height + 5;
            }
        }

        const initParticles = () => { particles = []; for (let i = 0; i < options.particleAmount; i++) { particles.push(new Particle()); } };
        const drawLines = () => {
            let pulse = Math.sin(Date.now() * 0.001) * 0.2 + 0.8;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i]; const p2 = particles[j]; const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                    if (dist < options.linkRadius) {
                        let opacity = 1 - (dist / options.linkRadius); opacity *= pulse;
                        if (mouse.x !== null) {
                            const distToMouse1 = Math.sqrt(Math.pow(p1.x - mouse.x, 2) + Math.pow(p1.y - mouse.y, 2));
                            const distToMouse2 = Math.sqrt(Math.pow(p2.x - mouse.x, 2) + Math.pow(p2.y - mouse.y, 2));
                            if(distToMouse1 < options.mouseInteractionRadius || distToMouse2 < options.mouseInteractionRadius) { opacity = Math.min(1, opacity + 0.5); }
                        }
                        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.strokeStyle = `rgba(170, 0, 255, ${opacity * 0.5})`; ctx.lineWidth = options.lineWidth; ctx.stroke();
                    }
                }
            }
        };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
            drawLines();
            particles.forEach(p => p.draw());
            requestAnimationFrame(animate);
        };

        initParticles();
        animate();
    }
    
    // Desktop platforme dropdown menu
    const desktopTrigger = document.getElementById('desktop-platform-trigger');
    const desktopMenu = document.getElementById('desktop-platform-menu');
    if (desktopTrigger && desktopMenu) {
        desktopTrigger.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            desktopMenu.classList.toggle('hidden');
            desktopMenu.classList.toggle('active');
        });
        document.addEventListener('click', function(event) {
            if (desktopMenu.classList.contains('active') && !desktopMenu.contains(event.target) && !desktopTrigger.contains(event.target)) {
                desktopMenu.classList.remove('active');
            }
        });
    }

    console.log("Sve JS skripte unutar initializeAppLogic su postavljene.");
}

// --- POKRENI APLIKACIJU ---
// Listener koji čeka da se cijeli HTML dokument učita prije pokretanja i18n_init funkcije.
document.addEventListener('DOMContentLoaded', i18n_init);