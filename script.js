(function () {
  var header = document.querySelector(".site-header");
  var nav = document.getElementById("primary-nav");
  var navToggle = document.querySelector(".nav-toggle");
  var form = document.getElementById("quote-form");

  function setHeaderHeight() {
    if (!header) return;
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);

  if (nav && navToggle) {
    function setNav(open) {
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    }

    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNav(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1100) setNav(false);
    });
  }

  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".primary-nav a[href^='#']");

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            var active = link.getAttribute("href") === "#" + id;
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealNodes = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealNodes.forEach(function (node) {
      var rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        node.classList.add("is-in");
      } else {
        node.classList.add("reveal-wait");
        revealObserver.observe(node);
      }
    });
  } else {
    revealNodes.forEach(function (node) {
      node.classList.add("is-in");
    });
  }

  document.querySelectorAll(".faq-item").forEach(function (item) {
    var button = item.querySelector(".faq-trigger");
    var panel = item.querySelector(".faq-panel");
    if (!button || !panel) return;

    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
      item.classList.toggle("is-open", !open);
      if (open) {
        panel.setAttribute("hidden", "");
      } else {
        panel.removeAttribute("hidden");
      }
    });
  });

  document.querySelectorAll(".view-toggle").forEach(function (group) {
    var card = group.closest(".product");
    var stage = card ? card.querySelector(".stage") : null;
    if (!stage) return;

    group.querySelectorAll("[data-shot]").forEach(function (button) {
      button.addEventListener("click", function () {
        var shot = button.getAttribute("data-shot");
        group.querySelectorAll("[data-shot]").forEach(function (other) {
          other.setAttribute("aria-pressed", other === button ? "true" : "false");
        });
        stage.classList.toggle("is-life", shot === "life");
        stage.querySelectorAll("img").forEach(function (img) {
          var show = img.classList.contains("shot-life") ? shot === "life" : shot === "pack";
          if (show) img.removeAttribute("hidden");
          else img.setAttribute("hidden", "");
        });
      });
    });
  });

  if (!form) return;

  var packInputs = form.querySelectorAll('input[name="pack"]');
  var qtyInput = document.getElementById("qty");
  var qtyDec = document.getElementById("qty-dec");
  var qtyInc = document.getElementById("qty-inc");
  var qtyField = document.getElementById("pack-qty-field");
  var customField = document.getElementById("custom-qty-field");
  var customQty = document.getElementById("custom-qty");
  var nameInput = document.getElementById("buyer-name");
  var businessInput = document.getElementById("buyer-business");
  var cityInput = document.getElementById("buyer-city");
  var noteInput = document.getElementById("buyer-note");
  var letter = document.getElementById("letter-body");
  var total = document.getElementById("quote-value");
  var qtyHint = document.getElementById("qty-hint");
  var waBtn = document.getElementById("wa-btn");
  var mailBtn = document.getElementById("mail-btn");
  var errorSummary = document.getElementById("form-errors");
  var chips = form.querySelectorAll("[data-qty]");

  var inr = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function selectedPack() {
    var checked = form.querySelector('input[name="pack"]:checked');
    return checked || packInputs[0];
  }

  function packMode() {
    return selectedPack().value === "custom" ? "custom" : "pack";
  }

  function quantity() {
    var value = parseInt(qtyInput.value, 10);
    return Number.isFinite(value) ? value : NaN;
  }

  function listedValue() {
    var pack = selectedPack();
    var price = Number(pack.getAttribute("data-price"));
    var count = quantity();
    if (!price || !Number.isFinite(count) || count < 1) return null;
    return price * count;
  }

  function fieldText(input) {
    return input && input.value ? input.value.trim() : "";
  }

  function buildMessage() {
    var pack = selectedPack();
    var lines = ["Hello Master Tea Depot,", "", "I would like a wholesale quotation.", ""];
    var name = fieldText(nameInput);
    var business = fieldText(businessInput);
    var city = fieldText(cityInput);
    var note = fieldText(noteInput);

    lines.push("Name: " + (name || "(name)"));
    if (business) lines.push("Business: " + business);
    lines.push("City: " + (city || "(city)"));
    lines.push("");

    if (pack.value === "custom") {
      var amount = fieldText(customQty);
      lines.push("Order: Custom wholesale / bulk — " + (amount || "(quantity)"));
      lines.push("Listed pack value: On quotation");
    } else {
      var count = quantity();
      var countLabel = Number.isFinite(count) && count > 0 ? String(count) : "(quantity)";
      var price = Number(pack.getAttribute("data-price"));
      lines.push(
        "Order: " + countLabel + " × " + pack.getAttribute("data-label") + " at " + inr.format(price) + " each"
      );
      var value = listedValue();
      lines.push("Listed pack value: " + (value == null ? "(set a quantity)" : inr.format(value)));
    }

    if (note) {
      lines.push("");
      lines.push("Note: " + note);
    }

    lines.push("");
    lines.push("Please confirm availability, the wholesale rate, and pickup or dispatch from Borsad.");
    return lines.join("\n");
  }

  function syncLinks(message) {
    var subject = "Wholesale enquiry — Master Tea Depot";
    waBtn.href = "https://wa.me/919157766763?text=" + encodeURIComponent(message);
    mailBtn.href =
      "mailto:master.tea.depot.1999@gmail.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(message);
  }

  function syncChips() {
    var count = quantity();
    chips.forEach(function (chip) {
      var match = Number(chip.getAttribute("data-qty")) === count;
      chip.setAttribute("aria-pressed", match ? "true" : "false");
    });
  }

  function update() {
    var pack = selectedPack();
    var custom = packMode() === "custom";
    qtyField.hidden = custom;
    customField.hidden = !custom;

    if (qtyHint) {
      if (custom) {
        qtyHint.textContent = "Describe the weight, pack count, or standing order. The depot confirms the rate.";
      } else {
        qtyHint.textContent =
          "Listed counter price " +
          inr.format(Number(pack.getAttribute("data-price"))) +
          " each. Wholesale rates for larger orders are confirmed by the depot.";
      }
    }

    var value = listedValue();
    if (custom) total.textContent = "On quotation";
    else total.textContent = value == null ? "—" : inr.format(value);

    var message = buildMessage();
    letter.textContent = message;
    syncLinks(message);
    syncChips();
  }

  function showError(input, message) {
    var field = input.closest(".field");
    var slot = field ? field.querySelector(".field-error") : null;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (slot) slot.textContent = message || "";
    return message;
  }

  function validate() {
    var errors = [];
    if (fieldText(nameInput).length < 2) {
      errors.push(showError(nameInput, "Please enter your name."));
    } else {
      showError(nameInput, "");
    }

    if (fieldText(cityInput).length < 2) {
      errors.push(showError(cityInput, "Please enter your city."));
    } else {
      showError(cityInput, "");
    }

    if (packMode() === "custom") {
      if (fieldText(customQty).length < 2) {
        errors.push(showError(customQty, "Tell us the quantity or weight you need."));
      } else {
        showError(customQty, "");
      }
      showError(qtyInput, "");
    } else {
      var count = quantity();
      if (!Number.isFinite(count) || count < 1) {
        errors.push(showError(qtyInput, "Enter at least 1 pack."));
      } else if (count > 9999) {
        errors.push(showError(qtyInput, "For more than 9,999 packs, use a custom bulk enquiry."));
      } else {
        showError(qtyInput, "");
      }
      showError(customQty, "");
    }

    errors = errors.filter(Boolean);
    if (errors.length) {
      errorSummary.hidden = false;
      errorSummary.textContent = errors[0];
    } else {
      errorSummary.hidden = true;
      errorSummary.textContent = "";
    }
    return errors.length === 0;
  }

  function guard(event) {
    update();
    if (!validate()) {
      event.preventDefault();
      var invalid = form.querySelector("[aria-invalid='true']");
      if (invalid) invalid.focus();
    }
  }

  packInputs.forEach(function (input) {
    input.addEventListener("change", update);
  });

  [qtyInput, customQty, nameInput, businessInput, cityInput, noteInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validate();
      update();
    });
  });

  function step(delta) {
    var current = quantity();
    var next = (Number.isFinite(current) ? current : 0) + delta;
    if (next < 1) next = 1;
    if (next > 9999) next = 9999;
    qtyInput.value = String(next);
    update();
  }

  qtyDec.addEventListener("click", function () {
    step(-1);
  });
  qtyInc.addEventListener("click", function () {
    step(1);
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      qtyInput.value = chip.getAttribute("data-qty");
      update();
    });
  });

  document.querySelectorAll("[data-pack]").forEach(function (link) {
    link.addEventListener("click", function () {
      var value = link.getAttribute("data-pack");
      var input = form.querySelector('input[name="pack"][value="' + value + '"]');
      if (!input) return;
      input.checked = true;
      update();
    });
  });

  waBtn.addEventListener("click", guard);
  mailBtn.addEventListener("click", guard);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    update();
    if (!validate()) {
      var invalid = form.querySelector("[aria-invalid='true']");
      if (invalid) invalid.focus();
      return;
    }
    window.open(waBtn.href, "_blank", "noopener,noreferrer");
  });

  update();
})();
