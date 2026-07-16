"use strict";

/*
    Wait until the page HTML is ready before running the code.
*/
document.addEventListener("DOMContentLoaded", () => {
    initialiseNavigation();
    initialiseTheme();
    highlightCurrentPage();
    initialiseScrollAnimations();
    initialiseProjectModal();
    initialiseContactForm();
    initialiseBackToTopButton();
});


/* ==================================================
   MOBILE NAVIGATION
================================================== */

function initialiseNavigation() {
    const menuButton = document.querySelector("#menu-button");
    const navLinks = document.querySelector("#nav-links");

    if (!menuButton || !navLinks) {
        return;
    }

    menuButton.addEventListener("click", () => {
        const menuIsOpen = navLinks.classList.toggle("open");

        menuButton.classList.toggle("open", menuIsOpen);
        menuButton.setAttribute("aria-expanded", String(menuIsOpen));
    });

    /*
        Close the mobile menu after selecting a link.
    */
    const navigationLinks = navLinks.querySelectorAll("a");

    navigationLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuButton.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}


/* ==================================================
   AUTOMATIC ACTIVE PAGE
================================================== */

function highlightCurrentPage() {
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const links = document.querySelectorAll(".nav-links a");

    links.forEach((link) => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
}


/* ==================================================
   LIGHT AND DARK THEME
================================================== */

function initialiseTheme() {
    const themeButton = document.querySelector("#theme-button");

    if (!themeButton) {
        return;
    }

    const savedTheme = localStorage.getItem("website-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }

    updateThemeButton(themeButton);

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");

        const currentTheme = document.body.classList.contains("dark-theme")
            ? "dark"
            : "light";

        localStorage.setItem("website-theme", currentTheme);
        updateThemeButton(themeButton);
    });
}

function updateThemeButton(themeButton) {
    const darkThemeIsActive =
        document.body.classList.contains("dark-theme");

    themeButton.textContent = darkThemeIsActive ? "☀️" : "🌙";

    themeButton.setAttribute(
        "aria-label",
        darkThemeIsActive
            ? "Activate light theme"
            : "Activate dark theme"
    );
}


/* ==================================================
   SCROLL ANIMATIONS
================================================== */

function initialiseScrollAnimations() {
    const animatedElements = document.querySelectorAll(".reveal");

    if (animatedElements.length === 0) {
        return;
    }

    /*
        Show elements when they enter the visible area.
    */
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    animatedElements.forEach((element) => {
        observer.observe(element);
    });
}


/* ==================================================
   PROJECT MODAL
================================================== */

function initialiseProjectModal() {
    const modal = document.querySelector("#project-modal");
    const modalTitle = document.querySelector("#modal-title");
    const modalDescription = document.querySelector("#modal-description");
    const modalTechnology = document.querySelector("#modal-technology");
    const closeButton = document.querySelector("#close-modal");
    const projectButtons = document.querySelectorAll(".project-details-button");

    if (
        !modal ||
        !modalTitle ||
        !modalDescription ||
        !modalTechnology ||
        !closeButton
    ) {
        return;
    }

    projectButtons.forEach((button) => {
        button.addEventListener("click", () => {
            modalTitle.textContent =
                button.dataset.title || "Project";

            modalDescription.textContent =
                button.dataset.description || "No description available.";

            modalTechnology.textContent =
                button.dataset.technology || "Technology not specified.";

            modal.classList.add("open");
            modal.setAttribute("aria-hidden", "false");

            document.body.classList.add("modal-is-open");
            closeButton.focus();
        });
    });

    closeButton.addEventListener("click", closeProjectModal);

    /*
        Close when clicking the dark area outside the modal.
    */
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeProjectModal();
        }
    });

    /*
        Close with the Escape key.
    */
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("open")) {
            closeProjectModal();
        }
    });

    function closeProjectModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-is-open");
    }
}


/* ==================================================
   CONTACT FORM
================================================== */

function initialiseContactForm() {
    const contactForm = document.querySelector("#contact-form");

    if (!contactForm) {
        return;
    }

    const formMessage = document.querySelector("#form-message");

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        clearFieldErrors();

        const nameInput = document.querySelector("#name");
        const emailInput = document.querySelector("#email");
        const subjectInput = document.querySelector("#subject");
        const messageInput = document.querySelector("#message");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        let formIsValid = true;

        if (name.length < 2) {
            showFieldError(
                nameInput,
                "Please enter at least two characters."
            );

            formIsValid = false;
        }

        if (!isValidEmail(email)) {
            showFieldError(
                emailInput,
                "Please enter a valid email address."
            );

            formIsValid = false;
        }

        if (subject.length < 3) {
            showFieldError(
                subjectInput,
                "Please enter a subject."
            );

            formIsValid = false;
        }

        if (message.length < 10) {
            showFieldError(
                messageInput,
                "Your message must contain at least ten characters."
            );

            formIsValid = false;
        }

        if (!formIsValid) {
            showFormMessage(
                formMessage,
                "Please correct the highlighted fields.",
                "error"
            );

            return;
        }

        /*
            Replace this email address with your real address.
        */
        const destinationEmail = "antekwyskwar@email.com";

        const emailSubject = encodeURIComponent(
            `${subject} — message from ${name}`
        );

        const emailBody = encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}`
        );

        showFormMessage(
            formMessage,
            "Your email application is opening.",
            "success"
        );

        window.location.href =
            `mailto:${destinationEmail}` +
            `?subject=${emailSubject}` +
            `&body=${emailBody}`;
    });
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}

function showFieldError(input, message) {
    input.classList.add("input-error");

    const errorElement = document.createElement("small");

    errorElement.className = "field-error";
    errorElement.textContent = message;

    input.parentElement.appendChild(errorElement);
}

function clearFieldErrors() {
    const invalidInputs = document.querySelectorAll(".input-error");
    const errorMessages = document.querySelectorAll(".field-error");

    invalidInputs.forEach((input) => {
        input.classList.remove("input-error");
    });

    errorMessages.forEach((message) => {
        message.remove();
    });
}

function showFormMessage(element, message, type) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = `form-message ${type}`;
}


/* ==================================================
   BACK TO TOP BUTTON
================================================== */

function initialiseBackToTopButton() {
    const button = document.querySelector("#back-to-top");

    if (!button) {
        return;
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 350) {
            button.classList.add("visible");
        } else {
            button.classList.remove("visible");
        }
    });

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}