// ============================================
// HEALING HANDS MASSAGE - SCRIPT.JS
// ============================================

// 1. INITIALIZE EMAILJS (Using your provided Public Key)
(function() {
    emailjs.init("CnfdhiG2gFgREz8fB");
})();

// 2. FORM SUBMISSION LOGIC
// ─────────────────────────────────────────────────────────────
// FIX A: Accept `event` so we can block the browser's default
//        form-submit reload — that reload was killing the
//        EmailJS request before it could finish, leaving the
//        button stuck at "Sending..." forever.
// ─────────────────────────────────────────────────────────────
function submitReservation(event) {

    // FIX A: Stop the page from reloading if this button sits
    //        inside a <form> tag.
    if (event) event.preventDefault();

    // Get form values from index.html (IDs unchanged)
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('date').value;
    const timeInput = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;
    const requests = document.getElementById('requests').value.trim();

    // Get Massage Type from dropdown (assumes id is 'massageType')
    const massageTypeSelect = document.getElementById('massageType');
    const massageType = massageTypeSelect ? massageTypeSelect.value : "Standard";

    // Basic Validation
    if (!name || !email || !date || !timeInput) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    // UI - Update button to "Sending..." state
    const btn = document.querySelector('.submit-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    // 3. PREPARE PARAMETERS (Mapped to your EmailJS Template)
    // Your template uses: {{name}}, {{time}}, and {{message}}
    const templateParams = {
        name: name,
        email: email,
        time: `${formatDate(date)} at ${formatTime(timeInput)}`,
        message: `Massage: ${massageType}\nGuests: ${guests}\nPhone: ${phone}\nRequests: ${requests}`
    };

    // 4. SEND TO EMAILJS
    const serviceID = 'service_qe25d34';
    const templateID = 'template_l3nrcxn';

    // FIX B: Replaced the two-argument .then(onSuccess, onError) pattern
    //        with .then().catch(). The old pattern can silently swallow
    //        certain EmailJS errors, making failures invisible.
    emailjs.send(serviceID, templateID, templateParams)
        .then(function() {
            console.log('SUCCESS! Email sent.');
            // Redirect to success page after successful delivery
            window.location.href = "successmodal.html";
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            alert("Send failed: " + JSON.stringify(error));
            // Reset button so the user can retry
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
}

// 5. UI HELPERS (untouched)
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        window.scrollTo({
            top: section.offsetTop - navbarHeight,
            behavior: 'smooth'
        });
    }
}

// Formatters for the Email Template (untouched)
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Set min date to today (untouched)
window.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
});

// Helper for Alerts (untouched)
function showAlert(message, type) {
    alert(message);
}