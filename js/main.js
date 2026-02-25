const initReviewsSwiper = () => {
  const sliderEl = document.querySelector(".reviews__slider");
  const paginationEl = document.querySelector(".reviews__pagination");
  if (!sliderEl || !paginationEl) return;

  const slidesPerGroupDesktop = 2;
  const bulletCount = 4;

  const swiper = new window.Swiper(".reviews__slider", {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 20,
    grabCursor: true,
    allowTouchMove: true,
    pagination: false,
    a11y: {
      paginationBulletMessage: "Перейти к отзыву {{index}}",
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 24,
      },
    },
    on: {
      init(instance) {
        updateBullets(instance, bulletCount, slidesPerGroupDesktop);
      },
      slideChange(instance) {
        updateBullets(instance, bulletCount, slidesPerGroupDesktop);
      },
    },
  });

  paginationEl.addEventListener("click", (e) => {
    const bullet = e.target.closest(".swiper-pagination-bullet[data-index]");
    if (!bullet) return;
    const index = parseInt(bullet.getAttribute("data-index"), 10);
    const slideIndex = index * slidesPerGroupDesktop;
    swiper.slideTo(slideIndex);
  });

  paginationEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const bullet = e.target.closest(".swiper-pagination-bullet[data-index]");
    if (!bullet) return;
    e.preventDefault();
    bullet.click();
  });
};

const updateBullets = (swiper, bulletCount, slidesPerGroup) => {
  const paginationEl = document.querySelector(".reviews__pagination");
  if (!paginationEl) return;
  const activeIndex = Math.min(
    Math.floor(swiper.activeIndex / slidesPerGroup),
    bulletCount - 1
  );
  const bullets = paginationEl.querySelectorAll(".swiper-pagination-bullet");
  bullets.forEach((el, i) => {
    el.classList.toggle("swiper-pagination-bullet-active", i === activeIndex);
  });
};

const init = () => {
  initReviewsSwiper();
  initCtaForm();
  initRequestModal();
};

const handleCtaSubmit = (e) => {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input[type="email"]');
  if (!input) return;
  const email = input.value.trim();
  if (!email) return;
  console.log("CTA subscribe email:", email);
  input.value = "";
};

const initCtaForm = () => {
  const form = document.querySelector(".cta__form");
  if (!form) return;
  form.addEventListener("submit", handleCtaSubmit);
};

const handleOpenRequestModal = (event) => {
  event.preventDefault();
  openRequestModal();
};

const handleRequestModalKeydown = (event) => {
  if (event.key === "Escape") {
    closeRequestModal();
  }
};

const openRequestModal = () => {
  const modal = document.querySelector(".request-modal");
  if (!modal) return;

  modal.hidden = false;
  modal.classList.add("request-modal--open");

  const dialog = modal.querySelector(".request-modal__dialog");
  const firstInput = dialog
    ? dialog.querySelector(".request-modal__input")
    : null;

  if (firstInput) {
    firstInput.focus();
  }

  document.body.dataset.requestModalScrollLock =
    document.body.style.overflow || "";
  document.body.style.overflow = "hidden";

  document.addEventListener("keydown", handleRequestModalKeydown);
};

const closeRequestModal = () => {
  const modal = document.querySelector(".request-modal");
  if (!modal) return;

  modal.classList.remove("request-modal--open");

  const dialog = modal.querySelector(".request-modal__dialog");
  const success = modal.querySelector(".request-modal__success");
  const form = modal.querySelector(".request-modal__form");

  if (dialog) {
    dialog.removeAttribute("aria-hidden");
    dialog.classList.remove("request-modal__dialog--hidden");
  }

  if (success) {
    success.classList.remove("request-modal__success--visible");
  }

  if (form) {
    form.reset();
    resetRequestFormErrors(form);
  }

  const { requestModalScrollLock = "" } = document.body.dataset;
  document.body.style.overflow = requestModalScrollLock;

  setTimeout(() => {
    if (!modal.classList.contains("request-modal--open")) {
      modal.hidden = true;
    }
  }, 250);

  document.removeEventListener("keydown", handleRequestModalKeydown);
};

const resetRequestFormErrors = (form) => {
  const inputs = form.querySelectorAll(".request-modal__input");
  inputs.forEach((input) => {
    input.classList.remove("request-modal__input--invalid");
    input.setAttribute("aria-invalid", "false");
  });

  const errorElements = form.querySelectorAll(".request-modal__error");
  errorElements.forEach((element) => {
    element.textContent = "";
  });
};

const validateRequestName = (value) => {
  if (!value) {
    return "Введите имя.";
  }

  const namePattern = /^[A-Za-zА-Яа-яЁё\s'-]+$/u;
  if (!namePattern.test(value)) {
    return "Имя может содержать только буквы, пробелы, тире и апостроф.";
  }

  return "";
};

const validateRequestPhone = (value) => {
  if (!value) {
    return "Введите номер телефона.";
  }

  const phonePattern = /^\+7\d{10}$/;
  if (!phonePattern.test(value)) {
    return "Телефон должен быть в формате +7999999999.";
  }

  return "";
};

const validateRequestEmail = (value) => {
  if (!value) {
    return "Введите email.";
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailPattern.test(value)) {
    return "Введите корректный email.";
  }

  return "";
};

const validateRequestPrivacy = (checked) => {
  if (!checked) {
    return "Необходимо согласиться с политикой конфиденциальности.";
  }

  return "";
};

const validateRequestForm = (form) => {
  const nameInput = form.querySelector("#request-name");
  const phoneInput = form.querySelector("#request-phone");
  const emailInput = form.querySelector("#request-email");
  const privacyInput = form.querySelector("#request-privacy");

  if (!nameInput || !phoneInput || !emailInput || !privacyInput) {
    return false;
  }

  resetRequestFormErrors(form);

  const nameValue = nameInput.value.trim();
  const phoneValue = phoneInput.value.trim();
  const emailValue = emailInput.value.trim();
  const privacyChecked = privacyInput.checked;

  const nameError = validateRequestName(nameValue);
  const phoneError = validateRequestPhone(phoneValue);
  const emailError = validateRequestEmail(emailValue);
  const privacyError = validateRequestPrivacy(privacyChecked);

  const errors = {
    name: nameError,
    phone: phoneError,
    email: emailError,
    privacy: privacyError,
  };

  if (nameError) {
    applyRequestFieldError(
      nameInput,
      form.querySelector("#request-name-error"),
      nameError
    );
  }

  if (phoneError) {
    applyRequestFieldError(
      phoneInput,
      form.querySelector("#request-phone-error"),
      phoneError
    );
  }

  if (emailError) {
    applyRequestFieldError(
      emailInput,
      form.querySelector("#request-email-error"),
      emailError
    );
  }

  if (privacyError) {
    const privacyErrorElement = form.querySelector("#request-privacy-error");
    if (privacyErrorElement) {
      privacyErrorElement.textContent = privacyError;
    }
  }

  return !Object.values(errors).some(Boolean);
};

const applyRequestFieldError = (input, errorElement, message) => {
  if (!input || !errorElement) return;
  input.classList.add("request-modal__input--invalid");
  input.setAttribute("aria-invalid", "true");
  errorElement.textContent = message;
};

const handleRequestFormSubmit = (event) => {
  event.preventDefault();
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  const isValid = validateRequestForm(form);
  if (!isValid) return;

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    dealType: formData.get("dealType"),
    privacy: formData.get("privacy") === "agree",
  };

  // Имитируем отправку данных
  console.log("Request form payload:", payload);

  showRequestSuccess();
};

const showRequestSuccess = () => {
  const modal = document.querySelector(".request-modal");
  if (!modal) return;

  const dialog = modal.querySelector(".request-modal__dialog");
  const success = modal.querySelector(".request-modal__success");

  if (dialog) {
    dialog.setAttribute("aria-hidden", "true");
    dialog.classList.add("request-modal__dialog--hidden");
  }

  if (success) {
    success.classList.add("request-modal__success--visible");
  }
};

const initRequestModal = () => {
  const modal = document.querySelector(".request-modal");
  if (!modal) return;

  const form = modal.querySelector(".request-modal__form");
  const closeTargets = modal.querySelectorAll("[data-request-modal-close]");

  const triggerSelectors = [
    ".profile-header__button",
    ".hero__button",
    ".property-card__button",
  ];

  triggerSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((button) => {
      button.addEventListener("click", handleOpenRequestModal);
    });
  });

  closeTargets.forEach((element) => {
    element.addEventListener("click", () => {
      closeRequestModal();
    });
  });

  modal.addEventListener("click", (event) => {
    const dialog = modal.querySelector(".request-modal__dialog");
    if (!dialog) return;
    if (!dialog.contains(event.target)) {
      closeRequestModal();
    }
  });

  if (form) {
    form.addEventListener("submit", handleRequestFormSubmit);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
