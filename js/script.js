document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables ---
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const totalSlides = slides.length;
    const mobileInput = document.getElementById('mobile-number');
    const sliderWrapper = document.querySelector('.slider-wrapper'); // New reference for click listener

    // --- Mobile Menu Toggle ---
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Hero Slider Logic ---

    function updateSlider() {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        document.querySelectorAll('.slider-dot').forEach(dot => dot.classList.remove('active'));

        // Add active class to the current slide and dot
        slides[currentSlide].classList.add('active');
        dotsContainer.children[currentSlide].classList.add('active');
    }

    function moveToNextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function moveToPrevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    function createDots() {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            dot.setAttribute('data-slide-index', i);
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop the dot click from triggering the main slide click
                currentSlide = i;
                updateSlider();
                clearInterval(autoSlideInterval); // Reset interval on manual interaction
                autoSlideInterval = setInterval(moveToNextSlide, 6000);
            });
            dotsContainer.appendChild(dot);
        }
        updateSlider(); // Initialize the first slide/dot
    }
    
    // NEW LOGIC: Click on slide to navigate
    sliderWrapper.addEventListener('click', (e) => {
        // Prevent navigation if clicking on a button or a dot within the slide
        if (e.target.closest('.cta-button') || e.target.closest('.slider-dot')) {
            return; 
        }

        const rect = sliderWrapper.getBoundingClientRect();
        // Calculate X position relative to the slider wrapper element
        const clickX = e.clientX - rect.left; 
        const elementWidth = rect.width;

        clearInterval(autoSlideInterval); // Stop auto slide on manual interaction

        if (clickX < elementWidth / 2) {
            // Clicked on the left half -> Previous slide
            moveToPrevSlide();
        } else {
            // Clicked on the right half -> Next slide
            moveToNextSlide();
        }
        
        // Reset interval
        autoSlideInterval = setInterval(moveToNextSlide, 6000);
    });

    createDots();
    let autoSlideInterval = setInterval(moveToNextSlide, 6000);


    // --- OTP Verification Modal Logic ---
    const bookingForm = document.getElementById('booking-form');
    const otpModal = document.getElementById('otp-modal');
    const closeModalButton = document.getElementById('close-modal');
    const verifyOtpButton = document.getElementById('verify-otp-button');
    const resendOtpLink = document.getElementById('resend-otp');
    const modalMessage = document.getElementById('modal-message');
    const displayMobileNumber = document.getElementById('display-mobile-number');
    const otpInput = document.getElementById('otp-input');

    // 1. Show Modal on Form Submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the mobile number to display in the modal
        const mobileNumber = mobileInput.value;
        displayMobileNumber.textContent = mobileNumber;

        // Reset and show the modal
        modalMessage.textContent = ""; // Clear previous messages
        otpInput.value = ""; // Clear previous OTP attempts
        verifyOtpButton.disabled = false;
        otpModal.classList.add('active');
    });

    // 2. Hide Modal
    function closeModal() {
        otpModal.classList.remove('active');
    }

    closeModalButton.addEventListener('click', closeModal);
    // Also close when clicking outside the modal content
    otpModal.addEventListener('click', function(e) {
        if (e.target === otpModal) {
            closeModal();
        }
    });

    // 3. OTP Verification Placeholder Logic
    verifyOtpButton.addEventListener('click', function() {
        const otp = otpInput.value;
        const expectedOtp = "123456"; // Placeholder correct OTP for testing

        if (otp.length === 6 && /^\d+$/.test(otp)) {
            if (otp === expectedOtp) {
                modalMessage.textContent = "Success! Your reservation is confirmed. We look forward to seeing you!";
                modalMessage.style.color = '#28a745'; // Green for success
                verifyOtpButton.disabled = true;
                // In a real application, you would send the booking data to the server here.
                setTimeout(closeModal, 3000);
            } else {
                modalMessage.textContent = "Error: Invalid OTP. Please try again. (Hint: Use 123456)";
                modalMessage.style.color = '#cc0000'; // Red for error
            }
        } else {
            modalMessage.textContent = "Please enter a valid 6-digit code.";
            modalMessage.style.color = '#cc0000';
        }
    });

    // 4. Resend OTP Placeholder Logic
    resendOtpLink.addEventListener('click', function(e) {
        e.preventDefault();
        modalMessage.textContent = "New OTP has been sent. Check your mobile. (Placeholder logic)";
        modalMessage.style.color = '#d4a373'; // Gold for informational message
    });

    // 5. Input filtering for OTP (only numbers)
    otpInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 6);
    });

});
