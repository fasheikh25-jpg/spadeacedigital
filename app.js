/* ==========================================================================
   Spade Ace Digital - Custom JavaScript Engine
   Author: Antigravity Pair Programmer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Sticky Navbar & Mobile Hamburger Menu
    // ==========================================
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile');

    // Sticky Scroll Handler
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Mobile Hamburger Menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle hamburger icon animation bars
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when clicking navigation items
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // ==========================================
    // 2. Scroll Reveal Animations (AOS Style)
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: stop observing once revealed to maintain layout
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 3. Stats Increment Counter Animation
    // ==========================================
    const resultsSection = document.querySelector('.results-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let count = 0;
            // Adjust speed based on target magnitude
            const increment = Math.ceil(target / 80);
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    stat.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    stat.textContent = count.toLocaleString();
                }
            }, 20);
        });
    };

    if (resultsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(resultsSection);
    }

    // ==========================================
    // 4. Case Studies Section Tabs & Filter
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const caseCards = document.querySelectorAll('.case-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            caseCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add fade out animation first
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });

    // ==========================================
    // 5. Testimonials Carousel
    // ==========================================
    const testimonialSlider = document.getElementById('testimonialSlider');
    const prevSlideBtn = document.getElementById('prevSlide');
    const nextSlideBtn = document.getElementById('nextSlide');
    const sliderDotsContainer = document.getElementById('sliderDots');
    
    if (testimonialSlider) {
        const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
        let currentSlideIdx = 0;
        let slideTimer;

        // Render dot elements based on slides length
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(idx));
            sliderDotsContainer.appendChild(dot);
        });

        const dots = sliderDotsContainer.querySelectorAll('.dot');

        const updateSlidePosition = () => {
            slides.forEach((slide, idx) => {
                slide.classList.remove('active');
                dots[idx].classList.remove('active');
            });
            slides[currentSlideIdx].classList.add('active');
            dots[currentSlideIdx].classList.add('active');
        };

        const nextSlide = () => {
            currentSlideIdx = (currentSlideIdx + 1) % slides.length;
            updateSlidePosition();
        };

        const prevSlide = () => {
            currentSlideIdx = (currentSlideIdx - 1 + slides.length) % slides.length;
            updateSlidePosition();
        };

        const goToSlide = (idx) => {
            currentSlideIdx = idx;
            updateSlidePosition();
            resetAutoSlide();
        };

        const startAutoSlide = () => {
            slideTimer = setInterval(nextSlide, 8000);
        };

        const resetAutoSlide = () => {
            clearInterval(slideTimer);
            startAutoSlide();
        };

        nextSlideBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevSlideBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        // Initialize Carousel
        startAutoSlide();
    }

    // ==========================================
    // 6. World Map Hotspots & Interactive Tooltips
    // ==========================================
    const hotspots = document.querySelectorAll('.hotspot');
    const mapTooltip = document.getElementById('mapTooltip');
    const tooltipCity = document.getElementById('tooltipCity');
    const tooltipDetails = document.getElementById('tooltipDetails');

    hotspots.forEach(spot => {
        spot.addEventListener('click', (e) => {
            const city = spot.getAttribute('data-city');
            const details = spot.getAttribute('data-details');
            
            // Highlight active spot details inside tooltip with animation
            mapTooltip.style.opacity = '0';
            mapTooltip.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                tooltipCity.textContent = city;
                tooltipDetails.textContent = details;
                mapTooltip.style.opacity = '1';
                mapTooltip.style.transform = 'translateY(0)';
            }, 200);

            // Add highlight visual scale
            hotspots.forEach(s => s.querySelector('.hotspot-core').style.fill = 'var(--accent-cyan)');
            spot.querySelector('.hotspot-core').style.fill = '#FFFFFF';
        });
    });

    // ==========================================
    // 7. Calendly-Style Scheduling Integration
    // ==========================================
    const dateButtons = document.querySelectorAll('.date-btn');
    const timeSlots = document.getElementById('timeSlots');
    const timeButtons = document.querySelectorAll('.time-btn');
    const bookingDateStep = document.getElementById('bookingDateStep');
    const bookingConfirmStep = document.getElementById('bookingConfirmStep');
    const bookingSuccessStep = document.getElementById('bookingSuccessStep');
    const summaryDate = document.getElementById('summaryDate');
    const summaryTime = document.getElementById('summaryTime');
    const submitBookingBtn = document.getElementById('submitBooking');
    const backToDateBtn = document.getElementById('backToDate');
    const bookingEmail = document.getElementById('bookingEmail');
    
    // Strategy Modal trigger references
    const bookingModal = document.getElementById('bookingModal');
    const closeBookingModal = document.getElementById('closeBookingModal');
    const triggerBookingBtns = document.querySelectorAll('.trigger-booking');
    const modalPlaceholder = document.getElementById('modalCalendarPlaceholder');
    const calendarOriginal = document.getElementById('calendarWidget');

    let selectedDate = '';
    let selectedTime = '';

    // Step 1: Select Date
    dateButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            dateButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedDate = btn.getAttribute('data-date');
            
            // Show Times Panel
            timeSlots.classList.remove('hidden');
        });
    });

    // Step 2: Select Time
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            timeButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedTime = btn.getAttribute('data-time');
            
            // Load confirmation step
            summaryDate.textContent = selectedDate;
            summaryTime.textContent = selectedTime;
            
            bookingDateStep.classList.add('hidden');
            bookingConfirmStep.classList.remove('hidden');
        });
    });

    // Back button
    if (backToDateBtn) {
        backToDateBtn.addEventListener('click', () => {
            bookingConfirmStep.classList.add('hidden');
            bookingDateStep.classList.remove('hidden');
            
            // Reset selectors
            timeButtons.forEach(b => b.classList.remove('selected'));
            selectedTime = '';
        });
    }

    // Booking Submission Handler
    if (submitBookingBtn) {
        submitBookingBtn.addEventListener('click', () => {
            const emailVal = bookingEmail.value.trim();
            if (!emailVal || !emailVal.includes('@')) {
                bookingEmail.style.borderColor = 'red';
                return;
            }
            bookingEmail.style.borderColor = 'var(--border-color)';
            
            // Animate Booking Success
            bookingConfirmStep.classList.add('hidden');
            bookingSuccessStep.classList.remove('hidden');
        });
    }

    // Modal Operations
    if (bookingModal && closeBookingModal) {
        triggerBookingBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                bookingModal.classList.remove('hidden');
                // Clone the active calendar widget into the modal if not already cloned
                if (modalPlaceholder.children.length === 0) {
                    const clone = calendarOriginal.cloneNode(true);
                    // Modify ID to prevent collisions
                    clone.id = 'modalCalendarWidget';
                    modalPlaceholder.appendChild(clone);
                    
                    // Attach event listeners for the cloned elements inside modal
                    setupClonedModalCalendar(clone);
                }
            });
        });

        closeBookingModal.addEventListener('click', () => {
            bookingModal.classList.add('hidden');
        });

        // Close on backdrop click
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                bookingModal.classList.add('hidden');
            }
        });
    }

    // Setup event listeners for the calendar in the popup modal
    const setupClonedModalCalendar = (modalWidget) => {
        const mDateBtns = modalWidget.querySelectorAll('.date-btn');
        const mTimeSlots = modalWidget.getElementById('timeSlots'); // Cloned IDs might conflict, select within container
        const mTimeBtns = modalWidget.querySelectorAll('.time-btn');
        const mDateStep = modalWidget.querySelector('#bookingDateStep');
        const mConfirmStep = modalWidget.querySelector('#bookingConfirmStep');
        const mSuccessStep = modalWidget.querySelector('#bookingSuccessStep');
        const mSummaryDate = modalWidget.querySelector('#summaryDate');
        const mSummaryTime = modalWidget.querySelector('#summaryTime');
        const mSubmitBtn = modalWidget.querySelector('#submitBooking');
        const mBackBtn = modalWidget.querySelector('#backToDate');
        const mEmailInput = modalWidget.querySelector('#bookingEmail');

        let mSelectedDate = '';
        let mSelectedTime = '';

        mDateBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                mDateBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                mSelectedDate = btn.getAttribute('data-date');
                modalWidget.querySelector('.calendar-times').classList.remove('hidden');
            });
        });

        mTimeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                mTimeBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                mSelectedTime = btn.getAttribute('data-time');
                
                mSummaryDate.textContent = mSelectedDate;
                mSummaryTime.textContent = mSelectedTime;
                
                mDateStep.classList.add('hidden');
                mConfirmStep.classList.remove('hidden');
            });
        });

        if (mBackBtn) {
            mBackBtn.addEventListener('click', () => {
                mConfirmStep.classList.add('hidden');
                mDateStep.classList.remove('hidden');
                mTimeBtns.forEach(b => b.classList.remove('selected'));
                mSelectedTime = '';
            });
        }

        if (mSubmitBtn) {
            mSubmitBtn.addEventListener('click', () => {
                const val = mEmailInput.value.trim();
                if (!val || !val.includes('@')) {
                    mEmailInput.style.borderColor = 'red';
                    return;
                }
                mEmailInput.style.borderColor = 'var(--border-color)';
                mConfirmStep.classList.add('hidden');
                mSuccessStep.classList.remove('hidden');
            });
        }
    };

    // ==========================================
    // 8. Lead Capture & Proposal Request Form
    // ==========================================
    const proposalForm = document.getElementById('proposalForm');
    const formFeedback = document.getElementById('formFeedback');

    if (proposalForm) {
        proposalForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple inputs verification
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const website = document.getElementById('website').value.trim();
            const service = document.getElementById('service').value;
            const budget = document.getElementById('budget').value;

            if (!name || !email || !website || !service || !budget) {
                alert('Please fill out all required fields.');
                return;
            }

            // Animate submission state (e.g. disable button and change text)
            const submitBtn = proposalForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Initiating Audit Crawl... <i class="fa-solid fa-spinner fa-spin"></i>';

            // Simulate audit crawl and submission (2 seconds)
            setTimeout(() => {
                proposalForm.classList.add('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                formFeedback.classList.remove('hidden');
            }, 2200);
        });
    }

    // ==========================================
    // 9. AI Live Chat Widget Simulation
    // ==========================================
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChat');
    const chatMessages = document.getElementById('chatMessages');
    const chatBadge = chatWidget.querySelector('.chat-badge');

    // Toggle Chat Panel visibility
    if (chatToggle && chatBox) {
        chatToggle.addEventListener('click', () => {
            chatBox.classList.toggle('hidden');
            
            // Hide badge on open
            if (!chatBox.classList.contains('hidden') && chatBadge) {
                chatBadge.classList.add('hidden');
            }

            // Toggle Icon images
            const openIcon = chatToggle.querySelector('.chat-open-icon');
            const closeIcon = chatToggle.querySelector('.chat-close-icon');
            
            openIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }

    const appendChatMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        
        const textPara = document.createElement('p');
        textPara.textContent = text;
        msgDiv.appendChild(textPara);
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return msgDiv;
    };

    const handleUserChatSubmission = () => {
        const userText = chatInput.value.trim();
        if (!userText) return;

        // Append user message
        appendChatMessage(userText, 'user');
        chatInput.value = '';

        // Generate response loading delay
        setTimeout(() => {
            const reply = getAIResponse(userText);
            appendChatMessage(reply, 'assistant');
        }, 1000);
    };

    // Quick replies hooks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-reply')) {
            const userText = e.target.getAttribute('data-reply');
            appendChatMessage(userText, 'user');
            
            // Disable original quick reply container on card
            const replyContainer = e.target.parentElement;
            if (replyContainer) {
                replyContainer.style.opacity = '0.5';
                replyContainer.style.pointerEvents = 'none';
            }

            setTimeout(() => {
                const reply = getAIResponse(userText);
                appendChatMessage(reply, 'assistant');
            }, 1000);
        }
    });

    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', handleUserChatSubmission);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserChatSubmission();
            }
        });
    }

    // Rules-engine for AI answers (Simulated agent NLP)
    const getAIResponse = (text) => {
        const query = text.toLowerCase();
        
        if (query.includes('organic') || query.includes('seo') || query.includes('traffic') || query.includes('scale')) {
            return "Spade Ace Digital specializes in enterprise SEO models that average 340% organic traffic growth in 12 months. We optimize schemas, build authoritative content clusters, and repair indexing. Would you like us to run a free audit crawl on your site? Select 'Request Audit Proposal' or leave your email.";
        }
        if (query.includes('ppc') || query.includes('ad') || query.includes('spend') || query.includes('google') || query.includes('facebook')) {
            return "Our PPC ad spend strategies focus on removing waste. We match ad search targets to Salesforce/Hubspot CRM pipelines, lowering acquisition CAC by an average of 45%. We recommend utilizing our proposal form to get an ad optimization mock map.";
        }
        if (query.includes('audit') || query.includes('proposal') || query.includes('price') || query.includes('cost') || query.includes('pricing')) {
            return "Our agency builds fully customized growth plans rather than standard packages, aligning with budgets above $5,000/mo. Please use the request form on the page, or email us at growth@spadeacedigital.com, and we will deliver a full audit outline within 2 hours.";
        }
        if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
            return "Hello! Let me know if you are exploring Global SEO channels, Paid Advertising adjustments, or want to secure a calendar slot for a strategy presentation.";
        }
        return "Thank you for reaching out! A senior growth engineer will inspect your message. For immediate strategy booking, you can click 'Get Free Strategy Call' to reserve a direct calendar slot.";
    };
});
