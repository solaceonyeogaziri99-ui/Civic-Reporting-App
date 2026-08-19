/* ============================================
   CIVIC REPORTING APP — AUTH JS
   Handles: login form validation, show/hide
   password, and TEMPORARY frontend-only
   authentication demo logic.
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initPasswordToggles();
  initLoginForm();
  initRegisterForm();
});

/* ------------------------------------------------
   PASSWORD SHOW / HIDE TOGGLE
   Works for any .password-field on the page
   (reused later on the register page too).
------------------------------------------------- */
function initPasswordToggles() {
  const toggles = document.querySelectorAll(".toggle-password");

  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      const fieldWrapper = toggle.closest(".password-field");
      const input = fieldWrapper.querySelector("input");

      const isHidden = input.getAttribute("type") === "password";
      input.setAttribute("type", isHidden ? "text" : "password");
      toggle.textContent = isHidden ? "Hide" : "Show";
      toggle.setAttribute("aria-pressed", isHidden ? "true" : "false");
    });
  });
}

/* ------------------------------------------------
   LOGIN FORM VALIDATION + DEMO SUBMIT
------------------------------------------------- */
function initLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const banner = document.getElementById("formBanner");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    hideBanner(banner);

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    const isEmailValid = validateEmailField(emailInput, emailValue);
    const isPasswordValid = validatePasswordField(passwordInput, passwordValue);

    if (!isEmailValid || !isPasswordValid) {
      showBanner(banner, "Please fix the errors below and try again.", "banner-error");
      return;
    }

    /* --------------------------------------------------------
       TEMPORARY FRONTEND DEMONSTRATION LOGIC ONLY
       --------------------------------------------------------
       There is no backend yet, so there is no real authentication
       happening here. We are only checking the email string to
       decide which demo dashboard to redirect to.

       When a real backend is connected, this entire block should
       be replaced with an API call (e.g. POST /api/auth/login)
       that verifies credentials and returns a session token /
       user role. The redirect should then be based on the role
       returned by the server, not the raw email string.
    -------------------------------------------------------- */
    showBanner(banner, "Login successful. Redirecting...", "banner-success");

    setTimeout(function () {
      if (emailValue.toLowerCase() === "admin@example.com") {
        window.location.href = "dashboard-1.html";
      } else {
        window.location.href = "dashboard.html";
      }
    }, 700);
  });

  // Clear individual field errors as the user types
  emailInput.addEventListener("input", function () {
    clearFieldError(emailInput);
  });

  passwordInput.addEventListener("input", function () {
    clearFieldError(passwordInput);
  });
}

/* ------------------------------------------------
   REGISTER FORM VALIDATION + DEMO SUBMIT
------------------------------------------------- */
function initRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const termsCheckbox = document.getElementById("terms");
  const banner = document.getElementById("formBanner");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    hideBanner(banner);

    const fullNameValue = fullNameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const phoneValue = phoneInput.value.trim();
    const passwordValue = passwordInput.value;
    const confirmPasswordValue = confirmPasswordInput.value;

    const isFullNameValid = validateRequiredField(fullNameInput, fullNameValue, "Full name is required.");
    const isEmailValid = validateEmailField(emailInput, emailValue);
    const isPhoneValid = validatePhoneField(phoneInput, phoneValue);
    const isPasswordValid = validateRegisterPassword(passwordInput, passwordValue);
    const isConfirmValid = validateConfirmPassword(confirmPasswordInput, confirmPasswordValue, passwordValue);
    const isTermsValid = validateTermsCheckbox(termsCheckbox);

    const isFormValid =
      isFullNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isPasswordValid &&
      isConfirmValid &&
      isTermsValid;

    if (!isFormValid) {
      showBanner(banner, "Please fix the errors below and try again.", "banner-error");
      return;
    }

    /* --------------------------------------------------------
       TEMPORARY FRONTEND DEMONSTRATION LOGIC ONLY
       --------------------------------------------------------
       There is no backend yet, so this does not create a real
       account. We save only basic, non-sensitive profile info
       to LocalStorage so the app has something to demonstrate
       with (e.g. pre-filling a profile page). LocalStorage is
       NOT a database and the password is intentionally NEVER
       stored here.

       When a real backend is connected, this block should be
       replaced with an API call (e.g. POST /api/auth/register)
       and this LocalStorage write should be removed entirely.
    -------------------------------------------------------- */
    saveDemoUserToLocalStorage({
      fullName: fullNameValue,
      email: emailValue,
      phone: phoneValue,
    });

    showBanner(banner, "Registration successful. Please login.", "banner-success");
    form.reset();

    setTimeout(function () {
      window.location.href = "login-1.html";
    }, 1200);
  });

  // Clear individual field errors as the user types
  [fullNameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput].forEach(function (input) {
    input.addEventListener("input", function () {
      clearFieldError(input);
    });
  });

  termsCheckbox.addEventListener("change", function () {
    clearFieldError(termsCheckbox);
  });
}

/**
 * TEMPORARY DEMO HELPER — writes basic (non-sensitive) profile
 * fields to LocalStorage under a single "civicReportingUser" key.
 * This simulates "having an account" for the rest of the frontend
 * demo (e.g. the citizen profile page) until a real backend and
 * database exist.
 */
function saveDemoUserToLocalStorage(userData) {
  const demoUser = {
    fullName: userData.fullName,
    email: userData.email,
    phone: userData.phone,
    // password intentionally NOT stored
  };

  localStorage.setItem("civicReportingUser", JSON.stringify(demoUser));
}

/* ------------------------------------------------
   VALIDATION HELPERS
   (shared patterns reused by register.html too)
------------------------------------------------- */
function validateEmailField(inputEl, value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    setFieldError(inputEl, "Email address is required.");
    return false;
  }

  if (!emailPattern.test(value)) {
    setFieldError(inputEl, "Please enter a valid email address.");
    return false;
  }

  clearFieldError(inputEl);
  return true;
}

function validatePasswordField(inputEl, value) {
  if (value === "") {
    setFieldError(inputEl, "Password is required.");
    return false;
  }

  clearFieldError(inputEl);
  return true;
}

function validateRequiredField(inputEl, value, message) {
  if (value === "") {
    setFieldError(inputEl, message);
    return false;
  }

  clearFieldError(inputEl);
  return true;
}

function validatePhoneField(inputEl, value) {
  // Accepts digits, spaces, dashes, parentheses, and an optional leading +
  // Requires at least 7 digits total, which covers most local/international formats.
  const phonePattern = /^\+?[0-9\s\-()]{7,}$/;

  if (value === "") {
    setFieldError(inputEl, "Phone number is required.");
    return false;
  }

  if (!phonePattern.test(value)) {
    setFieldError(inputEl, "Please enter a valid phone number.");
    return false;
  }

  clearFieldError(inputEl);
  return true;
}

function validateRegisterPassword(inputEl, value) {
  if (value === "") {
    setFieldError(inputEl, "Password is required.");
    return false;
  }

  if (value.length < 6) {
    setFieldError(inputEl, "Password must be at least 6 characters.");
    return false;
  }

  clearFieldError(inputEl);
  return true;
}

function validateConfirmPassword(inputEl, value, passwordValue) {
  if (value === "") {
    setFieldError(inputEl, "Please confirm your password.");
    return false;
  }

  if (value !== passwordValue) {
    setFieldError(inputEl, "Passwords do not match.");
    return false;
  }

  clearFieldError(inputEl);
  return true;
}

function validateTermsCheckbox(checkboxEl) {
  if (!checkboxEl.checked) {
    setFieldError(checkboxEl, "You must agree to the Terms and Conditions.");
    return false;
  }

  clearFieldError(checkboxEl);
  return true;
}

function setFieldError(inputEl, message) {
  inputEl.classList.add("has-error");
  inputEl.setAttribute("aria-invalid", "true");

  const errorEl = document.getElementById(inputEl.id + "Error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("is-visible");
  }
}

function clearFieldError(inputEl) {
  inputEl.classList.remove("has-error");
  inputEl.removeAttribute("aria-invalid");

  const errorEl = document.getElementById(inputEl.id + "Error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove("is-visible");
  }
}

function showBanner(bannerEl, message, typeClass) {
  if (!bannerEl) return;
  bannerEl.textContent = message;
  bannerEl.classList.remove("banner-error", "banner-success");
  bannerEl.classList.add(typeClass, "is-visible");
}

function hideBanner(bannerEl) {
  if (!bannerEl) return;
  bannerEl.classList.remove("is-visible", "banner-error", "banner-success");
  bannerEl.textContent = "";
}
