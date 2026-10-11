
document.addEventListener("DOMContentLoaded", function () {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href").slice(1);
            const target = document.getElementById(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    document.querySelectorAll(".footer-copy").forEach(function (footerCopy) {
        footerCopy.textContent = footerCopy.textContent.replace(
            /(\u00a9\s*)\d{4}/,
            "$1" + new Date().getFullYear()
        );
    });

    const benefitCards = document.querySelectorAll(
        ".about-list2 li[id^='benefit']"
    );

    function activateBenefit(selectedCard) {
        benefitCards.forEach(function (card) {
            const isSelected = card === selectedCard;
            card.classList.toggle("selected", isSelected);
            card.setAttribute("aria-pressed", String(isSelected));
        });
    }

    benefitCards.forEach(function (card) {
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-pressed", "false");
        card.addEventListener("click", function () {
            activateBenefit(card);
        });
        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activateBenefit(card);
            }
        });
    });

    document.querySelectorAll(".faq-panel details").forEach(function (item) {
        const summary = item.querySelector("summary");

        if (!summary) {
            return;
        }

        summary.setAttribute("aria-expanded", String(item.open));
        item.addEventListener("toggle", function () {
            summary.setAttribute("aria-expanded", String(item.open));
        });
    });

    const registrationForm = document.getElementById("registrationForm");
    const formMessage = document.getElementById("formMessage");

    if (registrationForm && formMessage) {
        registrationForm.addEventListener("submit", function (event) {
            event.preventDefault();
            

            const fullName = registrationForm.elements.fullName.value.trim();
            const email = registrationForm.elements.email.value.trim();
            const interest = registrationForm.elements.interest.value;
            const socialMedia = document.getElementById("socialMedia").value.trim();
            const dateOfBirth = document.getElementById("dateOfBirth").value;
            const phone = document.getElementById("phone").value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!fullName || !email || !interest) {
                formMessage.textContent = "Please complete your name, email, and track.";
                registrationForm.reportValidity();
                return;
            }

            if (!emailPattern.test(email)) {
                formMessage.textContent = "Please enter a valid email address.";
                registrationForm.elements.email.focus();
                return;
            }

            if (!registrationForm.checkValidity()) {
                formMessage.textContent = "Please check the highlighted fields.";
                registrationForm.reportValidity();
                return;
            }

            const recipient = "brightpathskillsummit@gmail.com";
            const subject = encodeURIComponent("BrightPath Skills Summit registration");
            const body = encodeURIComponent(
                "New BrightPath Skills Summit Registration\n\n" +
                "Full Name: " + fullName + "\n" +
                "Email: " + email + "\n" +
                "Interest: " + interest + "\n" +
                "Social Media: " + socialMedia + "\n" +
                "Date of Birth: " + dateOfBirth + "\n" +
                "Phone Number: " + phone
            );

            formMessage.textContent =
                "Opening your email app with your registration addressed to " + recipient + ". Press Send there to submit it.";
            window.location.href =
                "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
        });

        registrationForm.addEventListener("input", function () {
            formMessage.textContent = "";
            
        });
    }

    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {
        const contactFormMessage = contactForm.querySelector(".contact-form-message");

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            const recipient = "brightpathskillsummit@gmail.com";
            const subject = encodeURIComponent("BrightPath Summit contact message");
            const body = encodeURIComponent(
                "Name: " + contactForm.elements.name.value.trim() + "\n" +
                "Email: " + contactForm.elements.email.value.trim() + "\n\n" +
                contactForm.elements.message.value.trim()
            );

            if (contactFormMessage) {
                contactFormMessage.textContent =
                    "Opening your email app with this message addressed to " + recipient + ". Press Send in your email app to deliver it.";
            }

            window.location.href =
                "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
        });

        contactForm.addEventListener("input", function () {
            if (contactFormMessage) {
                contactFormMessage.textContent = "";
            }
        });
    }

    const trackFilter = document.querySelector("[data-track-filter]");
    const tracks = document.querySelectorAll("[data-track]");
    const trackFilterStatus = document.getElementById("trackFilterStatus");

    if (trackFilter && tracks.length) {
        trackFilter.addEventListener("change", function () {
            const selectedTrack = trackFilter.value.toLowerCase();
            let visibleTrackCount = 0;

            tracks.forEach(function (track) {
                const matches = !selectedTrack ||
                    track.dataset.track.toLowerCase() === selectedTrack;
                const sessionTime = track.nextElementSibling;

                track.hidden = !matches;
                if (sessionTime && sessionTime.classList.contains("track-session-time")) {
                    sessionTime.hidden = !matches;
                }
                if (matches) {
                    visibleTrackCount += 1;
                }
            });

            if (trackFilterStatus) {
                trackFilterStatus.textContent = selectedTrack
                    ? "Showing " + visibleTrackCount + " of " + tracks.length + " tracks."
                    : "Showing all " + tracks.length + " tracks.";
            }
        });
    }

    const backToTop = document.createElement("button");
    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
    backToTop.hidden = true;
    document.body.appendChild(backToTop);

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    });

    window.addEventListener("scroll", function () {
        backToTop.hidden = window.scrollY < 300;
    }, { passive: true });
});
