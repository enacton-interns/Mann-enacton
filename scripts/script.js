const menuData = [
  {
    category: "Hot Coffee",
    items: [
      { name: "Espresso", desc: "Rich and bold espresso shot with intense aroma.", price: "₹110", img: "./assets/coffee1.jpg" },
      { name: "Cappuccino", desc: "Creamy milk foam with rich espresso blend.", price: "₹160", img: "./assets/coffee1.jpg" }
    ]
  },
  {
    category: "Cold Coffee",
    items: [
      { name: "Classic Cold Coffee", desc: "Chilled coffee blended with milk and ice cream.", price: "₹180", img: "./assets/cold_coffee.jpg" },
      { name: "Chocolate Frappe", desc: "Chocolate blended frappe topped with whipped cream.", price: "₹220", img: "./assets/cold_coffee.jpg" }
    ]
  },
  {
    category: "Signature Specials",
    items: [
      { name: "Hazelnut Latte", desc: "Smooth latte infused with roasted hazelnut flavor.", price: "₹240", img: "./assets/Coffee-header.png" },
      { name: "Mocha Delight", desc: "Espresso mixed with dark chocolate and steamed milk.", price: "₹260", img: "./assets/Coffee-header.png" }
    ]
  },
  {
    category: "Desserts",
    items: [
      { name: "Chocolate Brownie", desc: "Warm fudgy brownie served with chocolate drizzle.", price: "₹140", img: "./assets/coffee1.jpg" },
      { name: "Blueberry Cheesecake", desc: "Creamy cheesecake topped with blueberry sauce.", price: "₹210", img: "./assets/coffee1.jpg" }
    ]
  }
];

const testimonialsData = [
  {
    stars: "⭐⭐⭐⭐⭐",
    name: "Riya Sharma",
    desc: "The best coffee I've ever had! The ambiance is so peaceful and the staff is very friendly.The best coffee I've ever had! The ambiance is so peaceful and the staff is very friendly.The best coffee I've ever had! The ambiance is so peaceful and the staff is very friendly.The best coffee I've ever had!"
  },
  {
    stars: "⭐⭐⭐⭐",
    name: "Mohit Verma",
    desc: "Perfect blend of aroma and taste. Must visit!"
  },
  {
    stars: "⭐⭐⭐⭐⭐",
    name: "Ananya Singh",
    desc: "A gem for coffee lovers. Highly recommended!"
  },
  {
    stars: "⭐⭐⭐⭐",
    name: "Vikas Gupta",
    desc: "Best place for chilling out with friends. Their cold coffee is amazing."
  },
  {
    stars: "⭐⭐⭐⭐",
    name: "Sakshi Arora",
    desc: "The ambiance is perfect for long conversations. Cozy and warm."
  },
  {
    stars: "⭐⭐⭐⭐⭐",
    name: "Rohit Khanna",
    desc: "Quick service and consistently great quality. My daily spot!"
  }
]


function validate(event) {
  event.preventDefault();

  const honeypotInput = document.getElementById("website");

  const firstNameInput = document.getElementById("first_name");
  const lastNameInput = document.getElementById("last_name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  const firstNameErr = document.getElementById("first_name-err");
  const lastNameErr = document.getElementById("last_name-err");
  const emailErr = document.getElementById("email-err");
  const subjectErr = document.getElementById("subject-err");

  if (honeypotInput.value.trim() !== "") {
    const formModal = document.createElement("div");

    formModal.innerHTML = `
    <div class="order-modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <p class="modal-info">Fake Submission</p>
        <p class="modal-info">First Name: ${firstNameInput.value}</p>
        <p class="modal-info">Last Name: ${lastNameInput.value}</p>
        <p class="modal-info">Email: ${emailInput.value}</p>
        <p class="modal-info">Subject: ${subjectInput.value}</p>
        <p class="modal-info">Message: ${messageInput.value}</p>
      </div>
    </div>
    `;
    document.body.appendChild(formModal);
    document.body.style.overflow = "hidden";

    const closeBtn = document.querySelector(".close-modal");
    closeBtn.addEventListener("click", () => {
      formModal.remove();
      document.body.style.overflow = "";
    });

    window.addEventListener("click", (e) => {
      if (e.target === formModal) {
        formModal.remove();
        document.body.style.overflow = "";
      }
    });

    firstNameInput.value = "";
    lastNameInput.value = "";
    emailInput.value = "";
    messageInput.value = "";
    subjectInput.value = "";
    return;
  }

  let isValid = true;

  if (firstNameInput.value.trim() === "") {
    firstNameErr.textContent = "First Name cannot be empty.";
    firstNameErr.style.color = "var(--error-color)";
    firstNameInput.style.borderColor = "var(--error-color)";
    firstNameInput.style.borderWidth = "2px";
    firstNameInput.style.borderStyle = "solid";
    isValid = false;
  } else {
    firstNameErr.textContent = "";
    firstNameInput.style.borderColor = "";
  }

  if (lastNameInput.value.trim() === "") {
    lastNameErr.textContent = "Last Name cannot be empty.";
    lastNameErr.style.color = "var(--error-color)";
    lastNameInput.style.borderColor = "var(--error-color)";
    lastNameInput.style.borderWidth = "2px";
    lastNameInput.style.borderStyle = "solid";
    isValid = false;
  } else {
    lastNameErr.textContent = "";
    lastNameInput.style.borderColor = "";
  }

  if (emailInput.value.trim() === "") {
    emailErr.textContent = "Email cannot be empty.";
    emailErr.style.color = "var(--error-color)";
    emailInput.style.borderColor = "var(--error-color)";
    emailInput.style.borderWidth = "2px";
    emailInput.style.borderStyle = "solid";
    isValid = false;
  } else {
    emailErr.textContent = "";
    emailInput.style.borderColor = "";
  }

  if (messageInput.value.trim() === "") {
    messageInput.style.borderColor = "var(--error-color)";
    messageInput.style.borderWidth = "2px";
    messageInput.style.borderStyle = "solid";
    isValid = false;
  } else {
    messageInput.style.borderColor = "";
  }

  if (subjectInput.value.trim() === "") {
    subjectErr.textContent = "Subject cannot be empty.";
    subjectErr.style.color = "var(--error-color)";
    subjectInput.style.borderColor = "var(--error-color)";
    subjectInput.style.borderWidth = "2px";
    subjectInput.style.borderStyle = "solid";
    isValid = false;
  } else {
    subjectErr.textContent = "";
    subjectInput.style.borderColor = "";
  }

  if (isValid) {

    const formModal = document.createElement("div");

    formModal.innerHTML = `
    <div class="order-modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3 class="modal-info">Form Submitted</h3>
        <p class="modal-info">First Name: ${firstNameInput.value}</p>
        <p class="modal-info">Last Name: ${lastNameInput.value}</p>
        <p class="modal-info">Email: ${emailInput.value}</p>
        <p class="modal-info">Subject: ${subjectInput.value}</p>
        <p class="modal-info">Message: ${messageInput.value}</p>
      </div>
    </div>
    `;
    document.body.appendChild(formModal);
    document.body.style.overflow = "hidden"

    const closeBtn = document.querySelector(".close-modal");
    closeBtn.addEventListener("click", () => {
      formModal.remove();
      document.body.style.overflow = ""
    });

    window.addEventListener("click", (e) => {
      if (e.target === formModal) {
        formModal.remove();
        document.body.style.overflow = ""
      }
    });

    firstNameInput.value = "";
    lastNameInput.value = "";
    emailInput.value = "";
    messageInput.value = "";
    subjectInput.value = "";
  }
}

// Carousel Logic
function initSliders() {
  document.querySelectorAll(".carousel").forEach((carousel) => {
    if (carousel.dataset.initialized) return;
    carousel.dataset.initialized = "true";

    const track = carousel.querySelector(".track");
    const dotsContainer = carousel.querySelector(".dots-container");

    let slidesPerView;
    if (window.innerWidth > 1000) {
      slidesPerView = Number(carousel.dataset.slidesperview) || 1;
    } else {
      slidesPerView = 1;
    }

    const getSlides = () => track.querySelectorAll(".slide");
    let slides = getSlides();

    for (let i = 0; i < slidesPerView; i++) {
      const firstClone = slides[i].cloneNode(true);
      const lastClone = slides[slides.length - 1 - i].cloneNode(true);
      track.appendChild(firstClone);
      track.insertBefore(lastClone, track.firstChild);
    }

    // --- ISSUE 1 FIX: Dynamic Width & Gap Logic ---
    const previewPercent = Number(carousel.dataset.preview) || 0;
    const gapPercent = Number(carousel.dataset.gap) || 0;

    if (previewPercent > 0) {
      // Gallery Layout
      track.style.gap = `${gapPercent}%`;
      const activeAreaPercent = 100 - previewPercent - gapPercent;
      const totalGapsInsideActiveArea =
        slidesPerView > 1 ? slidesPerView - 1 : 0;

      track.querySelectorAll(".slide").forEach((slide) => {
        if (slidesPerView > 1) {
          slide.style.width = `calc((${activeAreaPercent}% - (${gapPercent}% * ${totalGapsInsideActiveArea})) / ${slidesPerView})`;
        } else {
          slide.style.width = `${activeAreaPercent}%`;
        }
      });
    } else {
      // Testimonial Layout (Completely Untouched)
      const gapSize = window.innerWidth > 700 ? "20px" : "10px";
      track.querySelectorAll(".slide").forEach((slide) => {
        if (slidesPerView > 1) {
          slide.style.width = `calc((100% - (${gapSize} * ${slidesPerView - 1})) / ${slidesPerView})`;
        } else {
          slide.style.width = `100%`;
        }
      });
    }

    let index = slidesPerView;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let autoSlide;
    let isAnimating = false;

    if (carousel.dataset.dots === "true" && dotsContainer) {
      slides.forEach((_, i) => {
        dotsContainer.insertAdjacentHTML(
          "beforeend",
          `<button class="dot ${i === 0 ? "dot-active" : ""}"></button>`,
        );
      });
    }

    // --- ISSUE 2 FIX: Sub-pixel accurate slide distance ---
    function getSlideStride() {
      const trackSlides = track.querySelectorAll(".slide");
      if (trackSlides.length > 1) {
        // getBoundingClientRect provides exact float values, completely eliminating CSS rounding drift
        return Math.abs(
          trackSlides[1].getBoundingClientRect().left - trackSlides[0].getBoundingClientRect().left,
        );
      }
      return trackSlides[0].getBoundingClientRect().width;
    }

    function updateSlider(animated = true) {
      if (animated) isAnimating = true;

      track.style.transition = animated ? "transform .4s ease" : "none";
      // Swapped old slideWidth() for the precise getSlideStride()
      track.style.transform = `translateX(-${index * getSlideStride()}px)`;

      const allSlides = track.querySelectorAll(".slide");
      index = Math.max(0, Math.min(index, allSlides.length - 1));

      let dotIndex = (index - slidesPerView) % slides.length;
      if (dotIndex < 0) dotIndex += slides.length;

      const dots = dotsContainer?.querySelectorAll(".dot");
      if (dots?.length) {
        dots.forEach((dot) => dot.classList.remove("dot-active"));
        if (dots[dotIndex]) dots[dotIndex].classList.add("dot-active");
      }
    }

    function next() {
      if (isAnimating) return;
      index++;
      updateSlider();
      restartAutoSlide();
    }

    function prev() {
      if (isAnimating) return;
      index--;
      updateSlider();
      restartAutoSlide();
    }

    track.addEventListener("transitionend", () => {
      isAnimating = false;

      if (index >= slides.length + slidesPerView) {
        track.style.transition = "none";
        index = slidesPerView;
        track.style.transform = `translateX(-${index * getSlideStride()}px)`;
        void track.offsetHeight;
        track.style.transition = "transform .4s ease";
      }

      if (index < slidesPerView) {
        track.style.transition = "none";
        index = slides.length + index;
        track.style.transform = `translateX(-${index * getSlideStride()}px)`;
        void track.offsetHeight;
        track.style.transition = "transform .4s ease";
      }
    });

    if (carousel.dataset.arrows === "true") {
      const arrowsContainer = carousel.querySelector(".arrows-container");

      const prevButton = document.createElement("button");
      prevButton.className = "prev car-btn";
      prevButton.innerHTML = "&larr;";
      prevButton.addEventListener("click", prev);
      arrowsContainer.appendChild(prevButton);

      const nextButton = document.createElement("button");
      nextButton.className = "next car-btn";
      nextButton.innerHTML = "&rarr;";
      nextButton.addEventListener("click", next);
      arrowsContainer.appendChild(nextButton);
    }

    function startAutoSlide() {
      if (carousel.dataset.autoplay === "false") return;
      autoSlide = setInterval(next, 5000);
    }

    function restartAutoSlide() {
      clearInterval(autoSlide);
      startAutoSlide();
    }

    track.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
      isDragging = true;
      carousel.style.cursor = "grabbing";
      track.style.transition = "none";
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
      const diff = currentX - startX;
      track.style.transform = `translateX(${-index * getSlideStride() + diff}px)`;
    });

    window.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = "grab";

      const diff = e.clientX - startX;
      if (diff < -100) {
        index++;
      } else if (diff > 100) {
        index--;
      }

      updateSlider();
      restartAutoSlide();
    });

    dotsContainer?.addEventListener("click", (e) => {
      if (!e.target.classList.contains("dot")) return;
      const dots = [...dotsContainer.querySelectorAll(".dot")];
      index = dots.indexOf(e.target) + slidesPerView;
      updateSlider();
      restartAutoSlide();
    });

    window.addEventListener("resize", () => {
      updateSlider(false);
    });

    updateSlider(false);
    startAutoSlide();
  });
}

// Mobile Menu
const menuBtn = document.getElementById("link-btn");
const links = document.getElementById("links");

menuBtn.addEventListener("click", () => {
  links.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (
    !links.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    links.classList.remove("show");
  }

});

// Render Functions
function renderMenu() {
  const menuContainer = document.getElementById("menu-main-cont");
  menuContainer.innerHTML = "";
  menuData.forEach(cat => {
    const catDiv = document.createElement("div");
    catDiv.className = "menu-category fade-up";

    const title = document.createElement("h2");
    title.className = "category-title";
    title.textContent = cat.category;
    catDiv.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "category-grid";

    cat.items.forEach(item => {
      const itemHTML = `
      <div class="fade-up">
        <div class="item-cont">
          <img class="item-img" src="${item.img}" alt="${item.name}" />
          <div class="content">
            <p class="item-name">${item.name}</p>
            <p class="item-desc">${item.desc}</p>
            <div class="bottom-row">
              <p class="price">${item.price}</p>
              <button class="order-btn">Order</button>
            </div>
          </div>
        </div>
      </div>
      `;
      grid.insertAdjacentHTML('beforeend', itemHTML);
    });
    catDiv.appendChild(grid);
    menuContainer.appendChild(catDiv);
  });
}

function openLightbox(startIndex) {
  let currentIndex = startIndex;
  const totalCount = document.getElementById("gal-grid").getElementsByTagName("img").length;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";

  const container = document.createElement("div");
  container.className = "lightbox-container";

  const topRow = document.createElement("div");
  topRow.className = "lightbox-header";

  const counter = document.createElement("div");
  counter.className = "lightbox-counter";

  const closeBtn = document.createElement("span");
  closeBtn.innerHTML = "&times;";
  closeBtn.className = "lightbox-close";

  topRow.appendChild(counter);
  topRow.appendChild(closeBtn);
  container.appendChild(topRow);

  const imgWrapper = document.createElement("div");
  imgWrapper.className = "lightbox-img-wrapper";

  const mainImg = document.createElement("img");
  mainImg.className = "lightbox-img";
  imgWrapper.appendChild(mainImg);
  container.appendChild(imgWrapper);

  const thumbsContainer = document.createElement("div");
  thumbsContainer.className = "lightbox-thumbnails";
  container.appendChild(thumbsContainer);

  lightbox.appendChild(container);
  document.body.appendChild(lightbox);
  document.body.style.overflow = "hidden";

  function updateLightbox() {
    mainImg.src = document.getElementById("gal-grid").getElementsByTagName("img")[currentIndex].src;
    counter.textContent = `${currentIndex + 1} / ${totalCount}`;

    const thumbnails = thumbsContainer.querySelectorAll(".lightbox-thumb");
    thumbnails.forEach((thumb, i) => {
      if (i === currentIndex) {
        thumb.classList.add("active-thumb");
      } else {
        thumb.classList.remove("active-thumb");
      }
    });
  }
  const gridImages = [...document.getElementById("gal-grid").getElementsByTagName("img")];

  gridImages.forEach((img, i) => {
    const thumb = document.createElement("img");
    thumb.src = img.src;
    thumb.className = "lightbox-thumb";
    thumb.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = i;
      updateLightbox();
    });
    thumbsContainer.appendChild(thumb);
  });

  updateLightbox();

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    lightbox.remove();
  });

  lightbox.addEventListener("click", (e) => {
    if (!container.contains(e.target) || e.target === lightbox) {
      lightbox.remove();
      document.body.style.overflow = "";
    }
  });

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      lightbox.remove();
      document.body.style.overflow = "";
    } else if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % totalCount;
      updateLightbox();
    } else if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + totalCount) % totalCount;
      updateLightbox();
    }
  }
  document.addEventListener("keydown", handleKeyDown);

  const originalRemove = lightbox.remove;
  lightbox.remove = function () {
    document.removeEventListener("keydown", handleKeyDown);
    originalRemove.call(lightbox);
    document.body.style.overflow = "";
  };
}

function renderTestimonials() {
  const container = document.getElementById("testimonial-container");

  testimonialsData.forEach(testimonial => {
    const testimonialHTML = `
      <div class="slide testimonial">
        <div class="stars">${testimonial.stars}</div>
        <p class="desc">${testimonial.desc}</p>
        <div class="name">${testimonial.name}</div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", testimonialHTML);
  });

}

function attachDynamicEventListeners() {
  const faqContainer = document.querySelector(".faq-container");

  faqContainer.addEventListener("click", (e) => {
    const item = e.target.closest(".faq-item");
    if (!item) return;
    item.classList.toggle("active-faq");
  });

  const galleryGrid = document.querySelector(".gal-grid");

  galleryGrid.addEventListener("click", (e) => {
    const img = e.target.closest(".grid-imgs");
    if (!img) return;
    const startIndex = parseInt(img.dataset.index || "0", 10);
    openLightbox(startIndex);
  });

  const menuCategory = document.querySelectorAll(".menu-category");

  menuCategory.forEach((menuCat) => {
    menuCat.addEventListener("click", (e) => {
      const item = e.target.closest(".order-btn");
      if (!item) return;
      const itemCont = e.target.closest(".item-cont");
      modalDisplay(itemCont);
    });
  });

  function modalDisplay(itemCont) {
    const imgSrc = itemCont.querySelector(".item-img").src;
    const name = itemCont.querySelector(".item-name").textContent;
    const desc = itemCont.querySelector(".item-desc").textContent;
    const price = itemCont.querySelector(".price").textContent;

    const modal = document.createElement("div");
    modal.classList.add("order-modal");

    modal.innerHTML = `
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${imgSrc}" alt="${name}" />
            <div class="modal-info">
              <h3>${name}</h3>
              <p>${desc}</p>
              <p class="modal-price">${price}</p>
              <button class="confirm-order-btn">Order Now</button>
            </div>
          </div>
        `;
    document.body.appendChild(modal);
    document.body.style.overflow = "hidden"

    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.remove();
      document.body.style.overflow = ""
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modal.remove();
        document.body.style.overflow = ""
      }
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
        document.body.style.overflow = ""
      }
    });

    modal.querySelector(".confirm-order-btn").addEventListener("click", () => {
      alert("Order placed for " + name);
      modal.remove();
      document.body.style.overflow = ""
    });
  }
}


function checkAnimations() {
  const animatedElements = document.querySelectorAll(".fade-up, .fade-left, .fade-right");

  animatedElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      element.classList.add("show-animate");
    }
  });
}

window.addEventListener("scroll", checkAnimations)

window.addEventListener(
  "load",
  checkAnimations
);

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderTestimonials();
  checkAnimations();
  attachDynamicEventListeners();
  initSliders();
});
