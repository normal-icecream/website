
/*==========================================================
UNIVERSAL SETUP
==========================================================*/
const lazyLoad = () => {
  const $main = document.querySelector("main");
  const $childrenArr = [ ...$main.children ];
  $childrenArr.forEach((c, i) => {
    setTimeout(() => {
      c.classList.add("lazy-load");
    }, i * 250);
  })
}

const getPage = () => {
  const path = window.location.pathname;
  if (path.includes("order")) {
    return "order";
  } else if (path.includes("store")) {
    return "store";
  } else if (path.includes("lab")) {
    return "lab";
  } else if (path.includes("delivery")) {
    return "delivery";
  } else if (path.includes("shipping")) {
    return "shipping";
  } else if (path.includes("about")) {
    return "about";
  } else if (path.includes("pint-club")) {
    return "pint-club";
  } else if (path.includes("cone-builder")) {
    return "cone-builder";
  } else if (path.includes("merch")) {
    return "merch";
  } else if (path.includes("catering")) {
    return "catering";
  } else if (path.includes("wholesale")) {
    return "wholesale";
  } else if (path.includes("purge")) {
    return "purge";
  } else {
    return "home";
  }
}

const setPage = () => {
  const page = getPage();  
  switch (page) {
    case "order":
      hideCart();
      buildOrderPage();
      buildOrderNav();
      break;
    case "store":
      setCurrentStore();
      shopify();
      styleMenus();
      setupCarousels();
      fixCart();
      buildCustomizationTool();
      break;
    case "lab":
      setCurrentStore();
      shopify();
      styleMenus();
      setupCarousels();
      fixCart();
      buildCustomizationTool();
      break;
    case "delivery":
      setCurrentStore();
      shopify();
      styleMenus();
      setupCarousels();
      fixCart();
      buildCustomizationTool();
      break;
    case "shipping":
      setCurrentStore();
      shopify();
      styleMenus();
      setupCarousels();
      fixCart();
      buildCustomizationTool();
      break;
    case "about":
      setAboutTextClass();
      buildLocationsGrid();
      styleMenus();
      setupCarousels();
      fetchProductLocations();
      setupDownAnchors();
      break;
    case "pint-club":
      setCurrentStore();
      cart.clear();
      floatPintLogo();
      buildPintBanner();
      setupPintSubOptions();
      buildClubFAQ();
      fixCart();
      buildCustomizationTool();
      setupDownAnchors();
      break;
    case "cone-builder":
      hideCart();
      // fetchConeImages();
      break;
    case "merch":
      setCurrentStore();
      shopify();
      styleMenus();
      setupCarousels();
      fixCart();
      buildCustomizationTool();
      break;
    case "catering":
      styleMenus();
      setupCarousels();
      fixCart();
      break;
    case "wholesale":
      styleMenus();
      setupCarousels();
      fixCart();
      break;
    case "purge":
      hideCart();
      break;
    case "home":
      buildIndexCarousel();
      break;
    default:
      console.error("something went wrong!")
      break;
  }

};

const classify = () => {
  // set path as main element's id
  const path = window.location.pathname.includes(".")
    ? cleanName(window.location.pathname.split(".")[0])
    : cleanName(window.location.pathname) || "index";
  const $main = document.querySelector("main");
  $main.setAttribute("id", path);
  // add classes/ids based on inner text of headings
  const $h1s = document.querySelectorAll("h1");
  const $h2s = document.querySelectorAll("h2");
  const $headings = [$h1s, $h2s];

  $headings.forEach((headings) => {
    if (headings) {
      headings.forEach((h) => {
        const text = cleanName(h.textContent);
        h.setAttribute("class", text); // attach class to heading
        h.parentNode.classList.add(`p-${text}`); // attach class to parent
      });
    }
  });
};

const codify = () => {
  const $code = document.querySelectorAll("code");
  if ($code) {
    $code.forEach((c, i) => {
      let [key, values] = c.textContent.split(": ");
      if (values) { values = values.trim() };
      if (key === "theme") {
        setPageTheme(values); // set theme class on body
      } else if (key === "style") {
        setBlockStyle(c, values);
      } else if (key === "color") {
        setBlockTheme(c, values); // set theme class on parent
      } else if (key === "code") {
        switch (values) {
          case "search":
            return buildProductSearch(c);
          case "cone builder":
          case "cone-builder":
            return buildConeBuilder(c);
          default:
            console.log(`${values} code block hasn't been configured yet`);
            break;
        }
      }
    });
  }
};

const setPageTheme = (color) => {
  const $body = document.querySelector("body");
  const configuredColors = ["bluepink", "bluewhite", "pink", "yellow"];
  if (configuredColors.includes(color)) {
    $body.classList.add("theme", `theme-${color}`);
  } else {
    $body.classList.add("theme", `theme-white`);
  }
};

const setBlockTheme = ($el, color) => {
  const $parent = $el.parentNode.parentNode;
  const configuredColors = ["bluepink", "bluewhite", "pink", "yellow"];
  if (configuredColors.includes(color)) {
    $parent.classList.add(`theme-${color}`);
  } else {
    $parent.classList.add("theme-white");
  }
};

const setBlockStyle = ($el, style) => {
  const $parent = $el.parentNode.parentNode;
  const configuredStyles = ["outline"];
  if (configuredStyles.includes(style)) {
    $parent.classList.add(`theme-${style}`);
  }
};

const buildCollapsableStarbursts = () => {

  const $collapsableStarbursts = [ ...document.querySelectorAll("code") ].filter((c) => {
    const [key, values] = c.textContent.split(": ");
    if (key === "starburst-collapse") { return c; }
  });

  if ($collapsableStarbursts.length > 0) {

    $collapsableStarbursts.forEach((s) => {
      const [key, values] = s.textContent.split(": ");
      const $parent = s.parentNode.parentNode.parentNode.parentNode.parentNode;
      
      if ($parent) {
        $parent.classList.add("hide");
        const $closeBtn = document.createElement("div");
          $closeBtn.classList.add("starburst-close");
          $closeBtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-close">
            <use href="/icons.svg#close"></use>
          </svg>`;
          $closeBtn.onclick = (e) => {
            const $target = e.target.closest(".starburst-close");
            const $parent = $target.parentNode;
            const $sibling = $parent.previousElementSibling;
            $parent.classList.add("hide");
            $sibling.classList.remove("hide");
          }
        $parent.prepend($closeBtn);
  
        // build starburst
        const $starburst = document.createElement("aside");
          $starburst.classList.add("starburst");
          $starburst.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-starburst">
            <use href="/icons.svg#starburst"></use>
          </svg>`;
  
        const $starburstText = document.createElement("span");
          $starburstText.classList.add("starburst-text");
          $starburstText.textContent = values;
        $starburst.append($starburstText);
  
        $starburst.onclick = (e) => {
          const $target = e.target.closest("aside");
          const $sibling = $target.nextElementSibling;
          $sibling.classList.remove("hide");
          $target.classList.add("hide");
        };
  
        const $main = document.querySelector("main");
        $main.insertBefore($starburst, $parent);
      }
    })

  }
}

const buildLinkStarbursts = () => {
  const $linkStarbursts = [ ...document.querySelectorAll("code") ].filter((c) => {
    const [key, values] = c.textContent.split(": ");
    if (key === "starburst-link") { return c; }
  });

  if ($linkStarbursts.length > 0) {

    $linkStarbursts.forEach((s) => {
      const [key, values] = s.textContent.split(": ");
      const $parentEl = s.parentNode.parentNode.parentNode.parentNode.parentNode;
      const link = s.parentNode.parentNode.parentNode.nextElementSibling.textContent.trim();
      const linkArr = link.split("/");
      const location = linkArr[linkArr.length - 1];

      if ($parentEl && link) {
        // build starburst
        const $starburst = document.createElement("aside");
        $starburst.classList.add("starburst", "starburst-link");
        $starburst.setAttribute("data-link", cleanName(location));
        $starburst.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-starburst">
            <use href="/icons.svg#starburst"></use>
          </svg>`;

        const $starburstText = document.createElement("span");
          $starburstText.classList.add("starburst-text");
          $starburstText.textContent = values;
        $starburst.append($starburstText);

        $starburst.onclick = (e) => {
          window.open(link, "_self");
        };

        $parentEl.prepend($starburst);
      }
    })
  }
}

const buildStaticStarbursts = () => {
  const $staticStarbursts = [ ...document.querySelectorAll("code") ].filter((c) => {
    const [key, values] = c.textContent.split(": ");
    if (key === "starburst-static") { return c; }
  });

  if ($staticStarbursts.length > 0) {

    $staticStarbursts.forEach((s) => {
      const [key, values] = s.textContent.split(": ");
      const $parent = s.parentNode.parentNode.parentNode.parentNode.parentNode;

      if ($parent) {
        // build starburst
        const $starburst = document.createElement("aside");
        $starburst.classList.add("starburst", "starburst-static");
        $starburst.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-starburst">
            <use href="/icons.svg#starburst"></use>
          </svg>`;

        const $starburstText = document.createElement("span");
          $starburstText.classList.add("starburst-text");
          $starburstText.textContent = values;
        $starburst.append($starburstText);

        $parent.prepend($starburst);
      }
    })
  }
}

const fixCart = () => {
  const $cart = document.querySelector(".header-cart");
  if ($cart) {
    $cart.classList.add("header-cart-fixed")
  }
}

const buildBackToTopBtn = () => {
  const $btn = document.createElement("aside");
    $btn.id = "back-to-top";
    $btn.classList.add("hide");
    $btn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-up">
    <use href="/icons.svg#arrow-up"></use>
    </svg>`;
    $btn.innerHTML += "back to top";
    $btn.onclick = (e) => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      const $backToTopBtn = document.getElementById("back-to-top");
      $backToTopBtn.classList.add("hide");
    }

  const $body = document.querySelector("body");
  $body.append($btn);
}

const showBackToTopBtn = debounce(function() {
  const $btn = document.getElementById("back-to-top");
  if ($btn) {
    if (window.scrollY > 0) {
      $btn.classList.remove("hide");
    } else { 
      $btn.classList.add("hide");
    }
  }
}, 1000); // one second

/*==========================================================
LOCAL STORAGE
==========================================================*/
const setCurrentStore = () => {
  const page = getPage();
  localStorage.setItem("normal-lastVisited", page);
}

const getLastStore = () => {
  const lastStore = localStorage.getItem("normal-lastVisited");
  return lastStore || "store";
}

const saveToLocalStorage = ($form) => {
  const $fieldsToStore = $form.querySelectorAll("[data-store=true]");
  if ($fieldsToStore) {
    $fieldsToStore.forEach((f) => {
      if (f.value.trim() !== "") {
        localStorage.setItem(`normal-${f.name}`, f.value);
      }
    })
  }
}

const getContactFromLocalStorage = () => {
  const $fieldsToStore = document.querySelectorAll("[data-store=true]");
  if ($fieldsToStore) {
    $fieldsToStore.forEach((f) => {
      const thisItem = localStorage.getItem(`normal-${f.name}`);
      if (thisItem) { 
        f.value = thisItem;
      } 
    })
  }
}

const getAddressFromLocalStorage = () => {
  const $fieldsToStore = document.querySelectorAll("[data-store=true][data-fieldType=address]");
  if ($fieldsToStore) {
    $fieldsToStore.forEach((f) => {
      const thisItem = localStorage.getItem(`normal-${f.name}`);
      if (thisItem) { 
        f.value = thisItem;
      } 
    })
  }
}

/*==========================================================
FETCHING DATA
==========================================================*/
const fetchCatalog = async () => {
  if (!window.catalog) {
    const resp = await fetch("https://www.normal.club/catalog.json", { cache: "reload" });
    const json = await resp.json();
    window.catalog = json;
  }
  return window.catalog;
}

const fetchLabels = async () => {
  const resp = await fetch("/_data/labels.json", { cache: "reload" });
  let json = await resp.json();
  if (json.data) {
    json = json.data; // helix quirk, difference between live and local
  }
  window.labels = {};
  json.forEach((j) => {
    window.labels[j.key] = j.value;
  });
  return window.labels;
};

const fetchProductLocations = async () => {
  if (!window.productLocations) {
    const resp = await fetch("/_data/product-locations.json");
    let json = await resp.json();
    if (json.data) {
      json = json.data; // helix quirk, difference between live and local
    }
    window.productLocations = json;
  }
  return window.productLocations;
};

const fetchDeliveryZips = async () => {
  if (!window.deliveryZips) {
    const resp = await fetch("/_data/delivery-zips.json");
    let json = await resp.json();
    if (json.data) {
      json = json.data; // helix quirk, difference between live and local
    }
    window.deliveryZips =  json.sort((a, b) => {
      if (a.zip > b.zip) { return 1 }
      else { return -1 }
    });
  }
  return window.deliveryZips;
};

const fetchConeImages = async () => {
  const resp = await fetch("https://api.github.com/repos/davidnuescheler/n2/contents/cone-builder");
  let json = await resp.json();
  const images = json.map((j) => {
    return { name: j.name, url: `https://normal.club/${j.path}`}
  })
}

const fetchConeBuilderData = async () => {
  const resp = await fetch("/_data/cone-builder.json");
  let json = await resp.json();
  if (json.data) {
    json = json.data; // helix quirk, difference between live and local
  }
  let coneData = {
    "flavor": [],
    "dip": [],
    "topping": []
  }

  json.forEach((j) => {
    if (j.type === "soft serve") {
      if (!j.flavor.includes("twist")) {
        coneData.flavor.push(j.flavor);
      }
    } else if (j.type === "dip") {
      coneData.dip.push(j.flavor);
    } else if (j.type === "topping") {
      coneData.topping.push(j.flavor);
    }
  })

  return coneData;
}

const fetchShippingCarousel = async (type) => {
  const resp = await fetch("/shipping-menus/shipping-items.json", { cache: "reload" });
  let json = await resp.json();
  if (json.data) {
    json = json.data; // helix quirk, difference between live and local
  }

  let inStock = {};

  json.forEach((j) => {
    if (j.stock && j.type === type) {
      inStock[cleanName(j.name)] = j;
    }
  })

  return inStock;

  // const $div = document.createElement("div");
  //   $div.innerHTML = json;
  //   $returnDiv = $div.firstChild.firstChild; 
  //   return $returnDiv;
}

const fetchShippingPacks = async () => {
  const url = "https://script.google.com/macros/s/AKfycbzCP0bu1FDM6jnN4e9ybN4Z93jG2QlMpUAOLneP5rbGgJdHBNm9dLDV85_egu_ix2BE/exec";
  const resp = await fetch(url);
  const json = await resp.json();
  return json;
}

/*==========================================================
INDEX PAGE
==========================================================*/
const buildIndexCarousel = () => {
  const $carousel = document.querySelector(".embed-internal-indexcarousel");
  
  if ($carousel) {
    $carousel.onwheel = (e) => {     // set horizonal scroll on carousel
      if (e.wheelDelta < 0) {
        $carousel.scrollLeft += 468;
      } else {
        $carousel.scrollLeft -= 468;
      }
    };
  }
}

/*==========================================================
ORDER PAGE
==========================================================*/
const buildOrderPage = () => {
  const showOrderBlock = (e) => {
    const $parent = e.target.closest("p");
    if ($parent) {
      const target = $parent.getAttribute("data-target");

      const showThis = document.querySelector(`.p-${target}`);
      const thisTheme = showThis.classList[1];
      const $body = document.querySelector("body");
      $body.classList.add(thisTheme);
      showThis.classList.add("show-flex");

      const $orderDiv = document.querySelector(".p-order");
      $orderDiv.classList.add("hide");
    }
  };

  const backToOptions = (e) => {
    const $btn = e.target.closest("aside");
    if ($btn) {
      const target = $btn.getAttribute("data-target");
      const theme = $btn.getAttribute("data-theme");

      const hideThis = document.querySelector(`.${target}`);
      hideThis.classList.remove("show-flex");

      const $body = document.querySelector("body");
      $body.classList.remove(theme);

      const $orderDiv = document.querySelector(".p-order");
      $orderDiv.classList.remove("hide");
    }
  };

  const $divs = document.querySelectorAll("main div");
  $divs.forEach((d) => {
    if ([...d.classList].includes("p-order")) {
      const $children = [...d.children];
      $children.forEach((c) => {
        const elName = cleanName(c.textContent.trim());
        c.setAttribute("data-target", elName);
        c.onclick = (e) => {
          showOrderBlock(e);
        };
      });
    } else if (d.classList.length > 1) {
      const $backBtn = document.createElement("aside");
      $backBtn.classList.add("btn-back");
      $backBtn.setAttribute("data-target", d.classList[0]);
      $backBtn.setAttribute("data-theme", d.classList[1]);
      $backBtn.textContent = "back to options";
      $backBtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-left"><use href="/icons.svg#arrow-left"></use></svg>`;
      $backBtn.onclick = (e) => {
        backToOptions(e);
      };
      d.prepend($backBtn);
    }
  });
};

const buildOrderNav = () => {
  const $orderBlock = document.querySelector(".order");
  const $parent = $orderBlock.parentNode;

  const $backBtn = document.createElement("aside");
    $backBtn.classList.add("btn-back", "hide");
    $backBtn.setAttribute("data-theme", "bluepink");
    $backBtn.textContent = "back to options";
    $backBtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-left"><use href="/icons.svg#arrow-left"></use></svg>`;
    $backBtn.onclick = (e) => {
      // replace all classes on main (theme, theme-color);
      const $body = document.querySelector("body");
      $body.classList = "";
      $body.classList.add("theme", "theme-bluepink");
      // hide this nav, show order nav
      const $current = document.querySelector("[data-visible=true]");
        $current.classList.add("hide");
        $current.removeAttribute("data-visible");
      const $order = document.querySelector(".order");
        $order.classList.remove("hide");
      // hide back button
      const $btn = e.target.closest(".btn-back");
      $btn.classList.add("hide");

    };
    $parent.insertBefore($backBtn, $orderBlock);

  const orderBtnMain = (e) => {
    const $clicked = e.target.closest(".order-btn");
    const clicked = $clicked.textContent.trim().split(" ").join("");
    const $orderBlock = document.querySelector(".order");
    $orderBlock.classList.add("hide");
    const $target = document.querySelector(`.order-${clicked}`);
    const theme = $target.getAttribute("data-theme");
    $target.classList.remove("hide");
    $target.setAttribute("data-visible", true);
    const $body = document.querySelector("body");
      $body.classList.add(`theme-${theme}`);
    const $backBtn = document.querySelector(".btn-back");
      $backBtn.classList.remove("hide");
  }

  const $pickupBtn = $orderBlock.firstChild;
    $pickupBtn.classList.add("order-btn");
    $pickupBtn.onclick = orderBtnMain;
    polyfillSvg($pickupBtn);
    
  const $shippingBtn = $orderBlock.lastChild;
    $shippingBtn.classList.add("order-btn");
    $shippingBtn.onclick = orderBtnMain;
    polyfillSvg($shippingBtn);

  const $pickupBlock = document.querySelector(".order-pickup");
    $pickupBlock.classList.add("hide");
    $pickupBlock.setAttribute("data-theme", "yellow");
    $pickupBlock.firstChild.classList.add("order-btn");
    polyfillSvg($pickupBlock.firstChild, "link");
    $pickupBlock.lastChild.classList.add("order-btn");
    polyfillSvg($pickupBlock.lastChild, "link");
    
  const $shippingBlock = document.querySelector(".order-shipping");
    $shippingBlock.classList.add("hide");
    $shippingBlock.setAttribute("data-theme", "pink");
    $shippingBlock.firstChild.classList.add("order-btn");
    polyfillSvg($shippingBlock.firstChild, "link");
    $shippingBlock.lastChild.classList.add("order-btn");
    polyfillSvg($shippingBlock.lastChild, "link");
    buildShippingStarburst($shippingBlock.lastChild);
  
}

const polyfillSvg = ($el, type) => {
  const $p = $el.querySelector("p");
  const svgName = $p.textContent.substring(2, $p.textContent.length-1);

  if (type === "link") {
    const $a = $p.querySelector("a");
    $a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-${svgName}">
        <use href="/icons.svg#${svgName}"></use>
      </svg>`

  } else {
    $p.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-${svgName}">
        <use href="/icons.svg#${svgName}"></use>
      </svg>`
  }
}

const buildShippingStarburst = ($el) => {
  $el.classList.add("ship-starburst-container");

  const $starburst = document.createElement("aside");
    $starburst.classList.add("starburst", "ship-starbust");
    $starburst.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-starburst">
      <use href="/icons.svg#starburst"></use>
    </svg>`;

  const $starburstText = document.createElement("span");
    $starburstText.classList.add("starburst-text");
    $starburstText.textContent = "national shipping available now!";
  $starburst.append($starburstText);

  $el.prepend($starburst);
}

/*==========================================================
STOREFRONT PAGES
==========================================================*/
const getCurrentStore = () => {
  const page = getPage();
  const configuredStores = [ "store", "lab", "delivery", "pint club", "merch", "shipping" ];

  if (configuredStores.includes(page)) {
    return page;
  } else {
    return getLastStore();
  }
}

const shopify = () => {
  const squarePrefix = "https://squareup.com/dashboard/items/library/";
  const giftcardPrefix = "https://squareup.com/gift/";
  // <a href="B2VEJFJ1DYV7B/order">e-gift card</a>
  const $as = document.querySelectorAll("main a");
  if ($as) {
    $as.forEach((a) => {
      const href = a.getAttribute("href");
      if (href.includes(squarePrefix)) {
        const id = href.substr(squarePrefix.length);
        a.setAttribute("data-id", id);
        a.setAttribute("onclick", "addToCart(this)");
        a.removeAttribute("href");
        a.classList.add("btn-rect");
      } else if (href.includes(giftcardPrefix)) {
        a.classList.add("btn-rect");
        a.target = "_blank";
      }
    });
  }
};

const styleMenus = () => {
  const $main = document.querySelector("main");
  const $divs = [ ...$main.querySelectorAll("div")];
  $divs.forEach((d) => {
    if (d.firstElementChild) {
      if (
          d.firstElementChild.nodeName === "H2" && 
          d.firstElementChild.id !== "contact-us" && 
          d.firstElementChild.id !== "locations" &&
          d.firstElementChild.id !== "where-can-i-find-normalreg" &&
          d.firstElementChild.id !== "how-it-works"
        ) {
        d.classList.add("menu");
        const $embed = d.querySelector(".embed");
        if ($embed) {
          d.classList.add("menu-carousel", "theme-outline");
        } else {
          d.classList.add("menu-filled", "theme-filled");
        }
      }
    }
  })
}

const drinksStarburst = () => {
  const $el = document.querySelector(".p-drinksdrinksdrinks");
  if ($el) {
    $el.style.position = "relative";
    const $starburst = document.createElement("div");
    $starburst.classList.add("starburst", "starburst-unclicked");
    const $starSpin = document.createElement("div");
    $starSpin.classList.add("starburst-spin");
    const $starText = document.createElement("p");
    $starText.classList.add("starburst-text");
    $starText.textContent = "need a drink?";
    $starburst.append($starSpin);
    $starburst.append($starText);

    $starburst.onclick = (e) => {
      e.preventDefault();
      const $el = document.querySelector(".p-drinksdrinksdrinks");
      const $target = document.querySelector(".starburst");
      if ([...$target.classList].includes("starburst-unclicked")) {
        $target.classList.remove("starburst-unclicked");
        $target.classList.add("starburst-clicked");
        $el.classList.remove("hide");
      } else {
        $target.classList.remove("starburst-clicked");
        $target.classList.add("starburst-unclicked");
        $el.classList.add("hide");
      }
    };
    $el.before($starburst);
    $el.classList.add("hide");
  }
};

const customizeToolforStore = (target) => {
  // limit soft serve toppings
  const $toppingCheckboxes = document.querySelectorAll("input[name=topping]");
  if ($toppingCheckboxes) {
    $toppingCheckboxes.forEach((c) => {
      c.onchange = (e) => {
        const max = 3;
        const $cbs =  [ ...document.querySelectorAll("input[name=topping]")];
        const numChecked = $cbs.filter((c) => c.checked).length;
      
        if (numChecked === max) { // max checkboxes checked
          $cbs.forEach((c) => {
            if (!c.checked) { c.disabled = true }; // disable checkboxes
          })
        } else { 
          $cbs.forEach((c) => {
            c.disabled = false; // enable checkboxes
          })
        }
      }

    })
  }
}

const customizeCheckoutForStorefront = async () => {

  // this is setting the pickup times
  const $pickupTimeDropdown = document.getElementById("pickuptime");

  if ($pickupTimeDropdown) {
    $pickupTimeDropdown.innerHTML = ""; // clear on each customize
    const pickupTimes = getPickupTimes();
    populateDynamicOptions($pickupTimeDropdown, pickupTimes);
  }

  // this is populating the zip field 
  const $zipDropdown = document.getElementById("zip");

  if ($zipDropdown) {
    // $zipDropdown.innerHTML = ""; // clear on each customize
    if ($zipDropdown.children.length <= 1) {
      const deliveryZips = await fetchDeliveryZips();
      const zipArr = deliveryZips.map((z) => z.zip);        
      populateOptions($zipDropdown, zipArr);
    }
  }

  // decide whether or not to show checkout form
  const labels = window.labels;
  const currentStore = getCurrentStore();
  const storeOpen = labels[`${currentStore}_open`];
  let storeOpenByTime;

  if (currentStore === "pint-club" || currentStore === "delivery" || currentStore === "merch" || currentStore === "shipping") {
    storeOpenByTime = true; // pint club & delivery are always accepting orders
  } else {
    storeOpenByTime = checkIfStorefrontOpen(); 
  }

  const itemsInCart = cart.totalItems();
  
  const $checkoutFormContainer = document.querySelector(".checkoutform-container");

  if (storeOpen && storeOpenByTime && itemsInCart > 0) { // store is open, items in the cart
    $checkoutFormContainer.classList.remove("hide"); 
    const $checkoutDisabledMessage = document.querySelector(".checkout-disabled");
    if ($checkoutDisabledMessage) { $checkoutDisabledMessage.remove() };
  } else if (storeOpen && storeOpenByTime) { // store is open, but nothing in the cart
    hideCheckoutForm();
    const $checkoutDisabledMessage = document.querySelector(".checkout-disabled");
    if ($checkoutDisabledMessage) { $checkoutDisabledMessage.remove() };
  } else { // store is CLOSED
    hideCheckoutForm();

    const messageExists = document.querySelector(".checkout-disabled");
    
    if (!messageExists) {
      const $messageContainer = document.createElement("div");
        $messageContainer.classList.add("checkout-disabled");
  
      const $messageText = document.createElement("p");
        $messageText.classList.add("checkout-disabled-message");
        $messageText.textContent = labels.checkout_toolate;
  
      $messageContainer.append($messageText);
  
      const $checkoutContainer = document.querySelector(".checkout-container");
      $checkoutContainer.append($messageContainer)
    }

  }
}

const getPickupTimes = (setStore) => {
  let store;
  if (setStore) {
    store = setStore;
  } else {
    store = getCurrentStore();
  }
  const date = new Date();
  const now = parseInt(`${date.getHours()}${date.getMinutes().toString().padStart(2, "0")}`);
  
  const { open, close } = getHoursOfOp(store);

  let pickupTimes = [];
  let startTimeObj;

  if (now < (open * 100)) { // BEFORE opening
    startTimeObj = new Date(date.setHours(open, 0, 0));
  } else { // AFTER opening
    const currentMinutes = date.getMinutes();
    const startMinutes = Math.ceil(currentMinutes / 10) * 10;
    const diff = startMinutes - currentMinutes;
    startTimeObj = new Date(date.getTime() + diff * 60000);
  }

  const closeTimeObj = new Date(date.setHours(close, 0, 0));
  let currentTimeObj = new Date(startTimeObj.setSeconds(0, 0));

  while (currentTimeObj <= closeTimeObj) {
    const currentTimeHourFull = currentTimeObj.getHours(); // 24 hr time
    const currentTimeHour = currentTimeHourFull > 12 ? currentTimeHourFull - 12 : currentTimeHourFull; // 12 hr time
    const currentTimeMinutes = currentTimeObj.getMinutes().toString().padStart(2, "0");
    const currentTimePeriod = currentTimeHourFull < 12 ? "am" : "pm";
    const currentTimePrint = `${currentTimeHour}:${currentTimeMinutes}${currentTimePeriod}`;
    pickupTimes.push({ text: currentTimePrint, value: currentTimeObj.toISOString() });
    currentTimeObj = new Date(currentTimeObj.getTime() + 10 * 60000); // add ten minutes
  } 
  return pickupTimes;
}

const getISODates = (date) => {
  if (date === "today") {
    return new Date();
  }
}

/*==========================================================
CART FUNCTIONALITY
==========================================================*/
const updateCart = () => {
  setCartTotal();
  getContactFromLocalStorage();
  customizeCheckoutForStorefront();
  const $sqContainer = document.querySelector(".sq-container");
    if ($sqContainer) { $sqContainer.remove() };

  const $checkoutTable = document.querySelector(".checkout-table-body");
    $checkoutTable.innerHTML = ""; // clear on each update

  const $checkoutFoot = document.querySelector(".checkout-table-foot");
    $checkoutFoot.innerHTML = ""; // clear on each update

  if (cart.line_items.length > 0) {
    cart.line_items.forEach((i) => {
      const fp = i.fp;
      const variation = catalog.byId[i.variation];
      const variationName = variation.item_variation_data.name; // for use with mods
      const item = catalog.byId[variation.item_variation_data.item_id];
      const itemName = item.item_data.name;
      const mods = i.mods.map((m) => catalog.byId[m].modifier_data.name);

      const $row = document.createElement("tr");
        $row.setAttribute("data-id", i.fp);
  
      const $quantity = document.createElement("td");
        $quantity.classList.add("checkout-table-body-quantity");
        $quantity.innerHTML = `<span onclick="minus(this)" class="quantity quantity-minus">-</span>
          <span class="quantity-num">${i.quantity}</span>
          <span onclick="plus(this)" class="quantity quantity-plus">+</span>`;
  
      const $item = document.createElement("td");
        $item.classList.add("checkout-table-body-item");
        if (mods.length >= 1) {
          $item.textContent = `${variationName} ${removeStorefrontName(itemName)}, ${mods.join(", ")}`;
        }
        else {
          $item.textContent = itemName;
        }

      if (getCurrentStore() === "shipping") {
        const thisList = cart.shipping_quantities.find((q) => {
          if (q.fp === fp) {
            return q;
          }
        })
        $item.textContent = removeStorefrontName(itemName);
        const fullList = getReadableModList(thisList);
        fullList.forEach((l) => {
          $item.textContent += `, ${l.name} (${l.quantity})`;
        })
      }
  
      const $price = document.createElement("td");
        $price.classList.add("checkout-table-body-price");
        $price.textContent = `$${formatMoney(i.price * i.quantity)}`;
  
      $row.append($quantity, $item, $price);
      $checkoutTable.append($row);
  
    });
  } else {
    const $row = document.createElement("tr"); 

    const $quantity = document.createElement("td");
      $quantity.classList.add("checkout-table-body-quantity");

    const $item = document.createElement("td");
      $item.classList.add("checkout-table-body-item");
      $item.textContent = "your cart is empty! fill ’er up!";

    const $price = document.createElement("td");
      $price.classList.add("checkout-table-body-price");

    $row.append($quantity, $item, $price);
    $checkoutTable.append($row);
  }

  const currentStore = getCurrentStore();
  let isShipped = false;

  if (currentStore === "merch") {
    if (cart.shipping_item.price > 0) {
      isShipped = true;
    } 
  } else if (currentStore === "delivery") {
    isShipped = true;
  }

  if (isShipped) {
    // display shipping item
    const shippingItem = cart.shipping_item;
    const variation = catalog.byId[shippingItem.variation];
    // const variationName = variation.item_variation_data.name;
    const item = catalog.byId[variation.item_variation_data.item_id];
    const itemName = item.item_data.name;

    const $row = document.createElement("tr");
      $row.setAttribute("data-id", shippingItem.fp);

    const $quantity = document.createElement("td");
      $quantity.classList.add("checkout-table-body-quantity");
      $quantity.innerHTML = `<del class="quantity-num">${shippingItem.quantity}</del>`;

    const $item = document.createElement("td");
      $item.classList.add("checkout-table-body-item");
      $item.textContent = itemName;

    const $price = document.createElement("td");
      $price.classList.add("checkout-table-body-price");
      $price.textContent = `$${formatMoney(shippingItem.price * shippingItem.quantity)}`;

    $row.append($quantity, $item, $price);
    $checkoutTable.append($row);

    $checkoutFoot.innerHTML = `<tr>
      <td colspan="2">total</td>
      <td id="checkout-foot-total">$${formatMoney(cart.totalAmountWithShipping())}</td>
    </tr>`;
  } else {
    $checkoutFoot.innerHTML = `<tr>
      <td colspan="2">total</td>
      <td id="checkout-foot-total">$${formatMoney(cart.totalAmount())}</td>
    </tr>`;
  }
  // BUILD CO ITEMS DISPLAY
}

const plus = (e) => {
  const fp = e.closest("tr").getAttribute("data-id");
  const item = cart.line_items.find((i) => fp === i.fp );
  cart.setQuantity(fp, item.quantity + 1);
  updateCart();
}

const minus = (e) => {
  const fp = e.closest("tr").getAttribute("data-id");
  const item = cart.line_items.find((i) => fp === i.fp );
  cart.setQuantity(fp, item.quantity - 1);
  if (item.quantity < 1) { 
    cart.remove(fp);
    cart.removeShippingQuantity(fp);
  };
  updateCart();
}

// move to utilities
const checkIfStorefrontOpen = () => {
  const currentStore = getCurrentStore();
  const date = new Date();
  const now = parseInt(`${date.getHours()}${date.getMinutes().toString().padStart(2, "0")}`);
  const close = getHoursOfOp(currentStore, "close");
  return now < (close * 100);
}

/* TO DO
const getDaysOfOp = () => {
  // check if storefront is open today
} */

// move this to utilities
const getHoursOfOp = (store, type) => {
  const labels = window.labels;
  const date = new Date();
  const today = date.toString().substring(0,3).toLowerCase();
  let todayHours;

  if (store === "pint-club") {
    return "pint-club";
  }

  if (store === "shipping") {
    return "shipping";
  }

  if (store === "delivery") {
    return "delivery";
  }

  if (store === "merch") {
    return "merch"; // use store hours for merch
  }

  if (today.includes("sat") || today.includes("sun")) {
    todayHours = labels[`${store}_weekendhours`];
  } else {
    todayHours = labels[`${store}_weekdayhours`];
  }

  let [openHour, closeHour] = todayHours.split(" - ");

  openHour.replace(/am|AM|pm|PM/g, "");
    openHour = parseInt(openHour);
    if (openHour < 12) { openHour += 12 };

  closeHour.replace(/am|AM|pm|PM/g, "");
    closeHour = parseInt(closeHour);
    if (closeHour < 12) { closeHour += 12 };

  if (type === "open") {
    return openHour;
  } else if (type === "close") {
    return closeHour;
  } else {
    return { open: openHour, close: closeHour };
  }
  
}

/*==========================================================
CHECKOUT FUNCTIONALITY
==========================================================*/

const submitOrder = async (store, formData) => {
  let orderParams = {};

  for (prop in formData) {
    switch (prop) {
      case "name":
        orderParams.display_name = formData[prop];
        break;
      case "cell":
        orderParams.cell = formData[prop];
        break;
      case "email":
        orderParams.email_address = formData[prop];
        break;
      case "addr1":
        orderParams.address = formData[prop];
        break;
      case "city":
        orderParams.city = formData[prop];
        break;
      case "state":
        orderParams.state = formData[prop];
        break;
      case "zip":
        orderParams.zip = formData[prop];
        break;
      case "deliverydate":
        orderParams.delivery_at = formData[prop];
          break;
      case "pickuptime":
        orderParams.pickup_at = formData[prop];
        break;
      case "discount":
        orderParams.discount_name = formData[prop];
        const $discountField = document.querySelector("#discount");
        const discountId = $discountField.getAttribute("data-id");
        if (discountId) {
          orderParams.discount = discountId;
        }
        break;
      default:
        break;
    }
  }

  orderParams.reference_id = generateId();

  orderParams.line_items = [];

  cart.line_items.forEach((i) => {
    const mods = i.mods.map((m) => { return { "catalog_object_id": m }});
    const lineItem = {
      catalog_object_id: i.variation,
      quantity: i.quantity.toString()
    };
    if (mods.length) { lineItem.modifiers = mods };
    orderParams.line_items.push(lineItem); 
  });

  if (store === "merch-shipping" || store === "delivery") {
    const shippingItem = cart.shipping_item;
    orderParams.line_items.push({
      catalog_object_id: shippingItem.variation,
      quantity: shippingItem.quantity.toString()
    })
  }
  
  let qs = "";
  for (prop in orderParams) {
      if (prop === "line_items") {
        qs += prop + "=" + encodeURIComponent(JSON.stringify(orderParams[prop]));
      } else {
        qs += prop + "=" + encodeURIComponent(orderParams[prop]);
      }
      qs += "&";
  }

  const credentials = getStorefrontCheckoutCred(store);

  if (store.includes("merch")) {
    // add merch pickup/ship location
    qs += `locationId=${credentials.locationId}`;
  }

  if (store === "shipping") {
    // add quantity for all items in packs over 1
    qs += `qs=`;
    cart.shipping_quantities.forEach((q) => {
      const readable = getReadableModList(q);
      readable.forEach((r) => {
        if (r.quantity > 1) {
          let text = `${r.quantity} ${r.name}, `
          qs += encodeURIComponent(text);
        } 
      })
    })
  
  }

  const orderObj = await fetch(credentials.endpoint + "?" + qs, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  })
  .catch((error) => {
    console.error(error);
    return makeScreensaverError("something went wrong and your order didn't go through. try again?");
  })
  .then((resp) => {
    if (!resp.ok) {
      return resp.text().then((errorInfo) => { Promise.reject(errorInfo) });
    }
    return resp.text();
  }).then((data) => {
    const obj = JSON.parse(data);
    if (typeof obj.order != "undefined") {
      return obj.order;
    } else {
      console.error("errors:", data);
      return makeScreensaverError("something went wrong and your order didn't go through. try again?");
    }
  })

  return orderObj;
}

const getStorefrontCheckoutCred = (storefront) => {
  switch (storefront) {
    case "store":
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbzPFOTS5HT-Vv1mAYv3ktpZfNhGtRPdHz00Qi9Alw/exec",
        locationId: "6EXJXZ644ND0E"
      };
    case "lab":
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbyQ1tQesQanw1Dd13t0c7KLxBRwKTesCfbHJQdHMMvc02aWiLGZ/exec",
        locationId: "3HQZPV73H8BHM"
      };
    case "delivery":
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbwXsVa_i4JBUjyH7DyWVizeU3h5Rg5efYTtf4pcF4FXxy6zJOU/exec",
        locationId: "WPBKJEG0HRQ9F"
      };
    case "shipping":
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbwyNjfGbBg0MBVfmTaIx4Mi5n-b3SfZ59J8n-YAFVEEXbo84qAM2mxC8gi0d8CXq_br/exec",
        locationId: "WPBKJEG0HRQ9F"
      };
    case "pint-club":
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbwXsVa_i4JBUjyH7DyWVizeU3h5Rg5efYTtf4pcF4FXxy6zJOU/exec",
        locationId: "WPBKJEG0HRQ9F"
      };
    case "merch-pickup":
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbxzfw2T-Cx3lJMSK2TXqjhlTg1vjcGkTW5_eufayZGHzRrHkM6rUK5thYgTMbWK56ca/exec",
        locationId: "6EXJXZ644ND0E"
      };
    case "merch-shipping":
      return {
        name: storefront,
        endpoint: "https://script.google.com/macros/s/AKfycbxzfw2T-Cx3lJMSK2TXqjhlTg1vjcGkTW5_eufayZGHzRrHkM6rUK5thYgTMbWK56ca/exec",
        locationId: "WPBKJEG0HRQ9F"
      };
    default:
      console.error(`location ${storefront} is not configured`);
      return {
        name: storefront
      };
  }
}

const getShippingItem = (type) => {
  switch (type) {
    case "merch":
      return "X3E6SVSEI2JPN3HGOW3LEQVK";
    case "tier 1":
      return "KXH64DXKRNXLGJXF4VHQNUGK"; // in the neighborhood
    case "tier 2":
      return "IV37HQ6227WQAOS3HOCNTPXN"; // near
    case "tier 3":
      return "P2WZUWA7HTJ7G76QTKJ27Y5V"; // far
    case "free":
    default:
      return "GTMQCMXMAHX4X6NFKDX5AYQC"; // free
  }
}

/*==========================================================
STOREFRONT CAROUSELS
==========================================================*/
const resetCarousels = debounce(function() {
  const currentStore = getCurrentStore();
  const $carousels = document.querySelectorAll(`.embed-internal-${getPage()}menus`);
  if ($carousels) {
    $carousels.forEach((c) => {
      c.scrollLeft = 0;
    })
  }
  
}, 500); // half second

const setupCarousels = () => {

  const $carouselWrappers = document.querySelectorAll(".menu-carousel");

  if ($carouselWrappers) {
    $carouselWrappers.forEach((w) => {

      const $carousel = w.querySelector(`div.embed-internal-${getPage()}menus`);
      if ($carousel) {
        // build btns
        const $leftBtn = document.createElement("aside");
          $leftBtn.classList.add("menu-carousel-btn", "menu-carousel-btn-left");
          $leftBtn.setAttribute("data-action", "slideLeft");
          $leftBtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-left">
            <use href="/icons.svg#arrow-left"></use>
          </svg>`;
          $leftBtn.onclick = (e) => { carouselNav(e, "left"); }
                  
          const $rightBtn = document.createElement("aside");
          $rightBtn.classList.add("menu-carousel-btn", "menu-carousel-btn-right");
          $rightBtn.setAttribute("data-action", "slideRight");
          $rightBtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-right">
            <use href="/icons.svg#arrow-right"></use>
          </svg>`;
          $rightBtn.onclick = (e) => { carouselNav(e, "right"); }
        $carousel.append($leftBtn, $rightBtn);

        const numOfSlides = $carousel.querySelectorAll("div").length;

        if (numOfSlides % 2 === 0) {
          $carousel.classList.add("menu-carousel-even");
        } else {
          $carousel.classList.add("menu-carousel-odd");
        }

        if (numOfSlides === 1) {
          $carousel.classList.add("menu-carousel-one");
        } else if (numOfSlides === 2) {
          $carousel.classList.add("menu-carousel-two");
        } else if (numOfSlides === 3) {
          $carousel.classList.add("menu-carousel-three");
        } else if (numOfSlides > 3) {
          $carousel.classList.add("menu-carousel-full");
        }

      }
    })
  }
};

const carouselNav = (e, direction) => {
  const $btn = e.target.closest(".menu-carousel-btn");
  const $parent = $btn.parentNode;
  const childWidth = $parent.querySelector("div").offsetWidth;
  const numOfSlides = $parent.querySelectorAll("div").length;
  const prevPosition = $parent.scrollLeft;

  if (direction === "left") {
    const currPosition = prevPosition - childWidth;
    if (currPosition < 0) {
      reorgSlides($parent, "left");
    } else {
      $parent.scrollLeft -= childWidth;
    }
  } else if (direction === "right") {
    const currPosition = prevPosition + childWidth;
    if (currPosition >= ((numOfSlides - 2) * childWidth)) {
      reorgSlides($parent, "right");
    } else {
      $parent.scrollLeft += childWidth;
    }
  }

}

const reorgSlides = ($carousel, direction) => {
  const $slides = $carousel.querySelectorAll("div");
  if (direction === "left") {
    const $lastSlide = $slides[$slides.length - 1];
    $lastSlide.remove();
    $carousel.prepend($lastSlide);   
  } else if (direction === "right") {
    const $firstSlide = $slides[0];
    $firstSlide.remove();
    $carousel.append($firstSlide);
  }
}

/*==========================================================
ABOUT PAGE
==========================================================*/
const setAboutTextClass = () => {
  const $aboutBlock = document.querySelector(".p-about");
  if ($aboutBlock) {
    const $ps = $aboutBlock.querySelectorAll("p");
    if ($ps) {
      $ps.forEach((p) => {
        p.classList.add("about-text");
      })
    }
  }
}

const buildLocationsGrid = () => {
  const $locationsBlock = document.querySelector(".p-locations");
  const locationsChildren = [ ...$locationsBlock.children];
  const $flexContainer = document.createElement("section");
    $flexContainer.classList.add("locations-container");

  let tempObj = [];
  let flexItems = [];

  locationsChildren.forEach((c) => {
    if (c.nodeName === "H3") { // start of new block
      tempObj = [];
      tempObj.push(c);
      flexItems.push(tempObj);
    } else if (c.nodeName !== "H2") { // exclude section header
      tempObj.push(c);
    }
  });
  
  flexItems.forEach((item) => {
    const heading = item[0].id;
    const $flexItem = document.createElement("div");
    $flexItem.classList.add("location-item");
    $flexItem.classList.add(heading);
    for (let i = 0; i < item.length; i++) {
      $flexItem.append(item[i]);
    }
    $flexContainer.append($flexItem);
  });
  $locationsBlock.append($flexContainer);
};

const carouselizeTeam = () => {
  const $teamContainer = document.querySelector(".embed-internal-team").parentNode;
  if ($teamContainer) {
    $teamContainer.classList.add("menu-carousel")
  }
}

// move to setup or utilities
const setupDownAnchors = () => {
  const $downArrows = document.querySelectorAll("svg.icon-arrow-down");
  if ($downArrows) {
    $downArrows.forEach((a) => {
      const $next = a.parentNode.parentNode.parentNode.nextElementSibling;
      const $anchor = a.parentNode;
      if ($next && $anchor && $next.classList[0]) {
        const classList = $next.classList[0].split("p-")[1];
        $next.setAttribute("id", classList);
        $anchor.href = `#${classList}`;
        // setup smooth scroll
        $anchor.onclick = (e) => {
          e.preventDefault();
          const $target = document.getElementById(classList);
          $target.scrollIntoView({ behavior: "smooth" });
        };
      }
    });
  }
};

const buildProductSearch = ($code) => {
  const $parent = $code.parentNode.parentNode;

  const $searchForm = document.createElement("form");
  $searchForm.classList.add("search-form");
  const $inputField = document.createElement("input");
  $inputField.type = "search";
  $inputField.id = "product-search";
  $inputField.placeholder = "enter city or zip here";
  const $searchBtn = document.createElement("button");
  $searchBtn.textContent = "search";
  $searchForm.onsubmit = (e) => {
    e.preventDefault();
    const $resultsBlock = document.getElementById("product-search-results");
    $resultsBlock.innerHTML = ""; // clear any previous results

    const inputVal = document.getElementById("product-search").value.trim();

    if (inputVal == parseInt(inputVal)) {
      searchByZip(parseInt(inputVal));
    } else if (inputVal) {
      searchByCity(inputVal.toLowerCase());
    }
  };
  const $resultsBlock = document.createElement("section");
  $resultsBlock.id = "product-search-results";

  $searchForm.append($inputField, $searchBtn);
  $parent.append($searchForm, $resultsBlock);
};

const searchByZip = (zip) => {
  const productLocations = window.productLocations;
  let matches = productLocations.filter((l) => {
    return zip === l.zip;
  });
  if (!matches.length) {
    /// fuzzier zip search
    matches = productLocations.filter((l) => {
      return l.zip >= zip - 10 && l.zip <= zip + 10;
    });
  }
  populateSearchResults(matches, "zip", zip);
};

const searchByCity = (city) => {
  // catch slc variants
  const slcVariants = ["slc", "salt lake"];
  if (slcVariants.includes(city)) {
    city = "salt lake city";
  }
  const productLocations = window.productLocations;
  const matches = productLocations.filter((l) => {
    return city === l.city.toLowerCase();
  });
  populateSearchResults(matches, "city", city);
};

const populateSearchResults = (locations, type, val) => {
  const $resultsBlock = document.getElementById("product-search-results");
  const $resultsTitle = document.createElement("h3");

  if (locations.length) {
    $resultsTitle.textContent = `results by ${type}`;
    $resultsBlock.append($resultsTitle);

    locations.forEach((l) => {
      const $block = buildLocationBlock(l);
      $resultsBlock.append($block);
    });
  } else {
    $resultsTitle.textContent = `no results for ${val}... but take a look at our other locations:`;
    $resultsBlock.append($resultsTitle);
    window.productLocations.forEach((l) => {
      const $block = buildLocationBlock(l);
      $resultsBlock.append($block);
    });
  }
};

const buildLocationBlock = (location) => {
  const $block = document.createElement("div");
  const $title = document.createElement("h4");
  const $titleA = document.createElement("a");
  $titleA.textContent = location.name.toLowerCase();
  $titleA.href = location.link;
  $titleA.setAttribute("target", "_blank");
  $title.append($titleA);
  const $location = document.createElement("h5");
  $location.textContent = location.location.toLowerCase();
  const $address = document.createElement("p");
  $address.textContent = `${location.address}, ${location.city}, ${location.state}`.toLowerCase();
  const $phone = document.createElement("p");
  $phone.textContent = location.phone;
  if (location.location) {
    $block.append($title, $location, $address, $phone);
  } else {
    $block.append($title, $address, $phone);
  }
  return $block;
};

/*==========================================================
PINT CLUB PAGE
==========================================================*/
const floatPintLogo = () => {
  const $pintLogo = document.querySelector("svg.icon-pint-club");
  if ($pintLogo) {
    const $parent = $pintLogo.parentNode;
    $parent.classList.add("pintclub-logo");
  }
}

const buildPintBanner = () => {
  const $pintbanner = document.querySelector(".embed-internal-pintbanner div p");
  if ($pintbanner) {
    // set horizonal scroll on banner
    $pintbanner.onwheel = (e) => {
      if (e.wheelDelta < 0) {
        $pintbanner.scrollLeft += 468;
      } else {
        $pintbanner.scrollLeft -= 468;
      }
    };
  }
}

const setupPintSubOptions = () => {
  const $pintclubOptions = document.querySelector(".p-options");
  if ($pintclubOptions) {
    const $options = $pintclubOptions.querySelectorAll("a");
    if ($options) {
      $options.forEach((o) => {
        const title = o.getAttribute("href")
        o.removeAttribute("href");
        o.classList.add("btn-rect");
        o.setAttribute("data-club-type", cleanName(title));
        o.onclick = (e) => {
          const $el = e.target.closest("a");
          let target = $el.getAttribute("data-club-type");
        if (target.includes("edit")) { // hacky fix for broken links
            const split = target.split("edit")[1];
            target = split;
        }
          populateCustomizationTool("pint-club", "select your subscription pack", [ "contact", "pint-club" ]);
          customizeToolforClub(target);
        }
      })
    }
  }
}

const customizeToolforClub = (target) => {
  getContactFromLocalStorage();
  // set payment option
  const $parent = document.getElementById("radio-paymentoption");
  if ($parent) {
    const $paymentOption = $parent.querySelector("div");
    const $sibling = $parent.querySelector("h3");
    const $radio = document.getElementById(target);
  
    $paymentOption.classList.remove("hide");
    $parent.setAttribute("data-open", true);
    $sibling.setAttribute("data-open", true);
    $paymentOption.setAttribute("data-open", true);
    $radio.checked = true;
    
    if ($radio.value === "prepay") {
      let allFields = getFields( ["prepay-months"] );
      allFields.forEach((f) => {
        $parent.after(buildFields("customize", f));
      });
    }
    
  }
  
  const $monthlyOpt = document.getElementById("monthly");
  const $prepayOpt = document.getElementById("prepay");

  $monthlyOpt.onclick = (e) => {
    const $prepayMonths = document.getElementById("radio-prepaymonths");
    if ($prepayMonths) {
      $prepayMonths.remove();
    }
  }

  $prepayOpt.onclick = (e) => {
    const $prepayMonths = document.getElementById("radio-prepaymonths");
    if (!$prepayMonths) {
      let allFields = getFields( ["prepay-months"] );
      const $parent = document.getElementById("radio-paymentoption");
      allFields.forEach((f) => {
        $parent.after(buildFields("customize", f));
      });
    }
  }

  const $shippingOpt = document.getElementById("shipping");
  const $pickupOpt = document.getElementById("pickup");

  // disable shipping for now
  const $shippingParent = $shippingOpt.parentNode;
    $shippingParent.prepend("coming soon! - ");
    $shippingOpt.disabled = true;
  ///////////////////////////

  $shippingOpt.onclick = async (e) => {
    const $customBody = document.querySelector(".customize-table-body");
    const $addrFields = $customBody.querySelectorAll("[data-fieldtype=address]");

    if (!$addrFields.length) {
      let fields = getFields([ "address" ]);
      fields.forEach((f) => {
        $customBody.append(buildFields("customize", f));
      });
      getAddressFromLocalStorage();

      const $zipDropdown = $customBody.querySelector("#zip");
      const deliveryZips = await fetchDeliveryZips();
      const zipArr = deliveryZips.map((z) => z.zip);        
      populateOptions($zipDropdown, zipArr);
    }
  }

  $pickupOpt.onclick = (e) => {
    const $customBody = document.querySelector(".customize-table-body");
    const $addrFields = $customBody.querySelectorAll("[data-fieldtype=address]");
    if ($addrFields.length) {
      $addrFields.forEach((f) => {
        f.remove();
      })
    }

  }

}

const addClubToCart = (formData) => {
  const paymentOption = formData["payment-option"];
  const monthsToPay = formData["prepay-months"] || "1";

  const clubObj = catalog.byId["DONYA6SLBFMWSSJIPK5YRK32"];
  const clubVars = clubObj.item_data.variations;

  const clubItem = clubVars.filter((v) => {
    if (v.item_variation_data.name.includes(monthsToPay)) {
      return v;
    }
  })[0];

  cart.clear();
  cart.add(clubItem.id);
  updateCart();
}

const addClubToCartDesc = (formData) => {
  const clubOption = findClubOption();
  const $clubRow = document.querySelector(`[data-id=${clubOption.fp}]`);
  if ($clubRow) {
    const $itemData = $clubRow.querySelector(".checkout-table-body-item");
    let packInfo = "";
    $clubRow.setAttribute("data-payment-option", formData["payment-option"]);
    if (formData["payment-option"] === "monthly") {
      packInfo += ` ${formData["payment-option"]}`;
    } else if (formData["payment-option"] === "prepay") {
      $clubRow.setAttribute("data-prepay-term", formData["prepay-months"]); // set this to num from formData
      packInfo += ` ${formData["payment-option"]} ${clubOption.term}`;
    }
    if (formData["delivery-option"]) {
      $clubRow.setAttribute("data-delivery", formData["delivery-option"]);
      packInfo += `, ${formData["delivery-option"]}`;
    }
    if (formData["customize-pints"]) {
      $clubRow.setAttribute("data-customizations", formData["customize-pints"].toString());
      formData["customize-pints"].forEach((c) => {
        packInfo += `, ${c}`;
      })
    } else {
      $clubRow.setAttribute("data-customizations", "keep it normal");
      packInfo += ", keep it normal®";
    }
    if (formData["allergies"]) {
      $clubRow.setAttribute("data-allergies", formData["allergies"]);
      packInfo += ` (allergies: ${formData["allergies"]})`;
    }

    $itemData.textContent += packInfo;

  }
}

const findClubOption = () => {
  const clubItem = cart.line_items[0];
  const variation = catalog.byId[clubItem.variation];
  const variationName = variation.item_variation_data.name; // for use with mods
  const item = catalog.byId[variation.item_variation_data.item_id];

  return {
    fp: clubItem.fp,
    variation: variation.id,
    item: item.id,
    term: variationName
  }
}

const checkRecurringClubInCart = () => {
  let clubInCart = false;
  const recurringSub = catalog.byId["DONYA6SLBFMWSSJIPK5YRK32"].item_data.variations.filter((v) => {
    if (v.item_variation_data.name === "1 month" || v.item_variation_data.name === "one month") {
      return v;
    }
  })[0];
  const recurringSubId = recurringSub.id;
  const cartItems = cart.line_items;
  cartItems.forEach((i) => {
    if (i.fp.includes(recurringSubId)) {
      clubInCart = true;
      return clubInCart;
    }
  })
  return clubInCart;
}

const buildClubFAQ = () => {
  const $faqBlock = document.querySelector(".p-normalpintclubfaq");
  if ($faqBlock) {
    const faqChildren = [ ...$faqBlock.children].splice(2); // ignore header and desc

    const $flexContainer = document.createElement("section");
      $flexContainer.classList.add("faq-container");
  
    let tempObj = [];
    let flexItems = [];
  
    faqChildren.forEach((c) => {
      if (c.nodeName === "H3") { // start of new block
        tempObj = [];
        tempObj.push(c);
        flexItems.push(tempObj);
      } else if (c.nodeName !== "H2") { // exclude section header
        tempObj.push(c);
      }
    });
    
    flexItems.forEach((item, i) => {
      const $flexItem = document.createElement("div");
      $flexItem.classList.add("faq-item");
      $flexItem.setAttribute("data-index", i + 1);
      for (let i = 0; i < item.length; i++) {
        // setup click on qs
        if (item[i].nodeName === "H3") {
          item[i].onclick = (e) => {
            const $parent = e.target.parentNode;
            const status = $parent.getAttribute("data-clicked");
            if (status === "true") { //already clicked
              $parent.classList.remove("show-block");
              $parent.setAttribute("data-clicked", false);
            } else { // not clicked
              $parent.setAttribute("data-clicked", true);
              $parent.classList.add("show-block");
            }
          }
        }
        $flexItem.append(item[i]);
      }
      $flexContainer.append($flexItem);
    });
    $faqBlock.append($flexContainer);
  }
}

/*==========================================================
MERCH PAGE
==========================================================*/

const showMerchCheckout = () => {
  populateCustomizationTool("merch", "how do you want to check out?", [ "merch" ]);
}

/*==========================================================
CONE BUILDER PAGE
==========================================================*/

const buildConeBuilder = ($code) => {
  const $parent = $code.parentNode.parentNode;
  if ($parent.nodeName === "DIV") { // TODO: cleanup after breaking changes
    const $coneBuilderContainer = document.createElement("section");
      $coneBuilderContainer.classList.add("conebuilder");

    const $customizeForm = document.createElement("div");
      $customizeForm.classList.add("conebuilder-form");
      
    const $customHead = document.createElement("h2");
      $customHead.classList.add("conebuilder-form-title");
      $customHead.textContent = "customize your soft serve";

    const $customBody = document.createElement("form");
      $customBody.classList.add("conebuilder-form-body");

      const $twistWrapper = document.createElement("div");
        $twistWrapper.classList.add("customize-table-body-checkbox-container");

      const $twistLabel = document.createElement("label");
        $twistLabel.classList.add("sq-table-body-checkbox-container-optionblock");
        $twistLabel.setAttribute("for", "twist");
        $twistLabel.textContent = "make a twist (2 flavors)";

      const $twistOption = document.createElement("input");
        $twistOption.classList.add("customize-table-body-checkbox-container-optionblock-option");
        $twistOption.type = "checkbox";
        $twistOption.id = "twist";
        $twistOption.name = "twist";
        $twistOption.value = "twist";
        $twistOption.onchange = (e) => {
          const twistOpt = e.target.checked;
          if (twistOpt) {
            // add a second flavor dropdown
            const allFields = getFields( [ "cone-builder-second-flavor" ] );

            const $customForm = document.querySelector(".conebuilder-form-body");
            const $dipRadio = document.querySelector("#radio-dip");

            allFields.forEach((f) => {
              // $customBody.append(buildFields("customize", f));
              $customForm.insertBefore(buildFields("customize", f), $dipRadio);
            });

            populateConeBuilderForm();

          } else {
            const cbDropdowns = document.querySelectorAll(".customize-table-body-selectwrapper");
            // remove second flavor dropdown if exists
            if (cbDropdowns.length > 1) {
              cbDropdowns[cbDropdowns.length - 1].remove();
            }
            const $twistDiv = document.querySelector(".conebuilder-cone-twist");
            // remove twist img if exists
            if ($twistDiv) {
              $twistDiv.remove()
            }
            
          }
        }

      const $twistCustom = document.createElement("span");
        $twistCustom.classList.add("customize-table-body-checkbox-container-optionblock-custom");

      $twistLabel.append($twistOption, $twistCustom);
      $twistWrapper.append($twistLabel);

      $customBody.append($twistWrapper);

      const allFields = getFields( [ "cone-builder" ] );

      allFields.forEach((f) => {
        $customBody.append(buildFields("customize", f));
      });

    const $customFoot = document.createElement("div");
      $customFoot.classList.add("conebuilder-form-foot");

      const $btn = document.createElement("a");
      $btn.classList.add("btn-rect");
      $btn.textContent = "submit";
      $btn.onclick = async (e) => {
        const $form = document.querySelector("form");
        const valid = validateSubmission($form);
        if (valid) {
          buildScreensaver("building your custom cone...");
          const formData = await getSubmissionData($form);
          await prepConeBuilderSubmit();
          await buildConeBuilderSubmit(formData);
          removeScreensaver();
        } else {
          console.error("please fill out all required fields!");
        }
      }

      $customFoot.append($btn);

    $customizeForm.append($customHead, $customBody, $customFoot);

    const $coneSidebar = document.createElement("div");
      $coneSidebar.id = "conebuilder-cone";
      $coneSidebar.classList.add("conebuilder-cone");

      const imgPath = `https://normal.club/cone-builder/cone-back.png`;

      const $vesselDiv = document.createElement("div");
        $vesselDiv.classList.add("conebuilder-cone-vessel");
      const $vesselImg = document.createElement("img");
        $vesselImg.setAttribute("src", imgPath);
        $vesselImg.setAttribute("alt", "cone");
    
      $vesselDiv.append($vesselImg);
      $coneSidebar.append($vesselDiv);

    $coneBuilderContainer.append($customizeForm, $coneSidebar);
    $parent.append($coneBuilderContainer);

    populateConeBuilderForm();
    
  }
}

const populateConeBuilderForm = async () => {
  const coneData = await fetchConeBuilderData();  

  // FLAVORS
  const $flavorDropdown = document.querySelector("#flavor");
  if ($flavorDropdown.options.length === 1) {
    populateOptions($flavorDropdown, coneData.flavor);
    setupConeBuilderFlavor();
  }
  
  const $secondFlavorDropdown = document.querySelector("#secondflavor");
  if ($secondFlavorDropdown) {
    if ($secondFlavorDropdown.options.length === 1) {
      populateOptions($secondFlavorDropdown, coneData.flavor);
      setupConeBuilderTwist();
    }
  }
  
  // DIPS
  const $dipContainer = document.querySelector("#radio-dip");
    const $dipOptions = $dipContainer.childNodes[1];

    if ($dipOptions.childNodes.length === 1) {
      
      coneData.dip.forEach((d) => {
        const $label = document.createElement("label");
          $label.classList.add(`customize-table-body-radio-container-optionblock`);
          $label.setAttribute("for", cleanName(d));
          $label.textContent = d;

        const $customEl = document.createElement("span");
          $customEl.classList.add(`customize-table-body-radio-container-optionblock-custom`);

        const $option = document.createElement("input");
          $option.classList.add(`customize-table-body-radio-container-optionblock-option`);
          $option.id = cleanName(d);
          $option.name = "dip";
          $option.type = "radio";
          $option.value = d;

        $label.append($option, $customEl);    
        $dipOptions.append($label);
      })

      const dipArr = [ ...$dipOptions.getElementsByTagName("label") ];
      dipArr.forEach((d) => {
        d.onclick = (e) => {
          const thisDip = e.target.closest("input");
          if (thisDip) {
            const value = thisDip.id;
            const imgPath = `https://normal.club/cone-builder/${cleanName(value)}-dip.png`;
            const $coneSidebar = document.querySelector("#conebuilder-cone");
            const $dipDiv = document.querySelector(".conebuilder-cone-dip");

            if (value === "nodip" && $dipDiv) {
              $dipDiv.remove();
            } else if ($dipDiv) {
              // change dip div
              const $img = $dipDiv.childNodes[0];
                $img.setAttribute("src", imgPath);
                $img.setAttribute("alt", `${value} dip`);
            } else {
              // create dip div
              const $newDipDiv = document.createElement("div");
                $newDipDiv.classList.add("conebuilder-cone-dip");
              const $dipImg = document.createElement("img");
                $dipImg.setAttribute("src", imgPath);
                $dipImg.setAttribute("alt", `${value} dip`);

              $newDipDiv.append($dipImg);
              $coneSidebar.append($newDipDiv);
            }
          }
        }
      })
    }

  // TOPPINGS
  const $toppingContainer = document.querySelector("#checkbox-toppings");
    const $toppingOptions = $toppingContainer.childNodes[1];

    if ($toppingOptions.childNodes.length < 1) {
      coneData.topping.forEach((t) => {
  
        const $label = document.createElement("label");
          $label.classList.add(`customize-table-body-checkbox-container-optionblock`);
          $label.setAttribute("for", cleanName(t));
          $label.textContent = t;
  
        const $customEl = document.createElement("span");
          $customEl.classList.add(`customize-table-body-checkbox-container-optionblock-custom`);
        
        const $option = document.createElement("input");
          $option.classList.add(`customize-table-body-checkbox-container-optionblock-option`);
          $option.id = cleanName(t);
          $option.name = "topping";
          $option.type = "checkbox";
          $option.value = t;
  
        $label.append($option, $customEl);      
        $toppingOptions.append($label);
      })      
      customizeToolforConeBuilder();
    }

}

const customizeToolforConeBuilder = () => {
  // limit soft serve toppings
  const $toppingCheckboxes = document.querySelectorAll("input[name=topping]");
  if ($toppingCheckboxes) {
    $toppingCheckboxes.forEach((c) => {
      c.onchange = (e) => {
        const max = 3;
        const $cbs =  [ ...document.querySelectorAll("input[name=topping]")];
        const numChecked = $cbs.filter((c) => c.checked).length;
        const thisTopping = e.target.closest("input");
        const checked = thisTopping.checked;
        const fullVal = thisTopping.id;
        const value = thisTopping.value;
        const valuesArr = thisTopping.value.split(" ");
          valuesArr.push("topping", fullVal);

        const imgPath = `https://normal.club/cone-builder/${cleanName(fullVal)}-topping.png`;
        const $coneSidebar = document.querySelector("#conebuilder-cone");
        const $toppingDiv = document.querySelector(`.conebuilder-cone-${fullVal}`);
      
        if (numChecked === max) { // max checkboxes checked
          $cbs.forEach((c) => {
            if (!c.checked) { c.disabled = true }; // disable checkboxes
          })
        } else { 
          $cbs.forEach((c) => {
            c.disabled = false; // enable checkboxes
          })
        }

        if (checked && !$toppingDiv) {
          // create topping
          const $newToppingDiv = document.createElement("div");

          valuesArr.forEach((v) => {
            $newToppingDiv.classList.add(`conebuilder-cone-${v}`);
          })
          const $toppingImg = document.createElement("img");
            $toppingImg.setAttribute("src", imgPath);
            $toppingImg.setAttribute("alt", `${value} topping`);

          $newToppingDiv.append($toppingImg);
          $coneSidebar.append($newToppingDiv);

        } else if (!checked && $toppingDiv) {
          $toppingDiv.remove();
        }
      }

    })
  }
}

const setupConeBuilderFlavor = () => {
  // FLAVORS
  const $flavorDropdown = document.querySelector("#flavor");
  $flavorDropdown.onchange = (e) => {
    const value = e.target.value;
    const imgPath = `https://normal.club/cone-builder/${cleanName(value)}-soft-serve.png`;
    const $coneSidebar = document.querySelector("#conebuilder-cone");

    const $flavorDiv = document.querySelector(".conebuilder-cone-flavor");

    if ($flavorDiv) {
      const $img = $flavorDiv.childNodes[0];
        $img.setAttribute("src", imgPath);
        $img.setAttribute("alt", `${value} soft serve`);
    } else {
      const $newFlavorDiv = document.createElement("div");
        $newFlavorDiv.classList.add("conebuilder-cone-flavor");
      const $flavorImg = document.createElement("img");
        $flavorImg.setAttribute("src", imgPath);
        $flavorImg.setAttribute("alt", `${value} soft serve`);

      $newFlavorDiv.append($flavorImg);
      $coneSidebar.append($newFlavorDiv);
    }
    
  }
}

const setupConeBuilderTwist = () => {
  // FLAVORS
  const $twistDropdown = document.querySelector("#secondflavor");
  $twistDropdown.onchange = (e) => {
    const value = e.target.value;
    const imgPath = `https://normal.club/cone-builder/${cleanName(value)}-twist.png`;
    const $coneSidebar = document.querySelector("#conebuilder-cone");

    const $twistDiv = document.querySelector(".conebuilder-cone-twist");

    if ($twistDiv) {
      const $img = $twistDiv.childNodes[0];
        $img.setAttribute("src", imgPath);
        $img.setAttribute("alt", `${value} twist`);
    } else {
      const $newTwistDiv = document.createElement("div");
        $newTwistDiv.classList.add("conebuilder-cone-twist");
      const $twistImg = document.createElement("img");
        $twistImg.setAttribute("src", imgPath);
        $twistImg.setAttribute("alt", `${value} twist`);

      $newTwistDiv.append($twistImg);
      $coneSidebar.append($newTwistDiv);
    }
    
  }
}

const prepConeBuilderSubmit = () => {
  const coneBuilderForm = document.querySelector(".conebuilder-form");
    coneBuilderForm.classList.add("hide");

  const coneBuilderCone = document.querySelector(".conebuilder-cone");
  const coneBuilderVessel = document.querySelector(".conebuilder-cone-vessel");
    const coneHeight = coneBuilderVessel.offsetHeight;
    coneBuilderCone.style.height = `${coneHeight}px`;
    coneBuilderCone.classList.add("conebuilder-cone-final");

  
}

const buildConeBuilderSubmit = (formData) => {

  const $coneBuilderContainer = document.querySelector(".conebuilder");

  const $coneBuilderSubmitContainer = document.createElement("div");
    $coneBuilderSubmitContainer.classList.add("conebuilder-submit");

  const $coneBuilderTitle = document.createElement("p");
    $coneBuilderTitle.classList.add("conebuilder-submit-makeup");
      const flavor = formData.twist ? `${formData.flavor} + ${formData.secondflavor} twist` : formData.flavor;
    $coneBuilderTitle.setAttribute("data-flavor", flavor);
    $coneBuilderTitle.setAttribute("data-dip", formData.dip);
      const toppings = formData.topping ? formData.topping.join(", ") : "no toppings";
    $coneBuilderTitle.setAttribute("data-topping", toppings);
    $coneBuilderTitle.textContent = generateConeMakeup(formData);

  const $coneBuilderSubmit = document.createElement("form");
    $coneBuilderSubmit.classList.add("conebuilder-submit-form");

    const fieldsArr = [ "contact", "cone-builder-title" ];
    let allFields = getFields(fieldsArr);
  
    allFields.forEach((f) => {
      $coneBuilderSubmit.append(buildFields("checkout", f));
    });

  const $coneBuilderSubmitFoot = document.createElement("div");
    $coneBuilderSubmitFoot.classList.add("conebuilder-submit-foot");

  const $btn = document.createElement("a");
    $btn.classList.add("btn-rect");
    $btn.textContent = "submit";
    $btn.onclick = async (e) => {
      const $form = document.querySelector(".conebuilder-submit-form");
      const valid = validateSubmission($form);
      if (valid) {
        buildScreensaver("submitting your custom cone...");
        const formData = await getSubmissionData($form);
        await submitCone(formData);
        await coneSubmissionConfirmation(formData.title);
        removeScreensaver();
      } else {
        console.error("please fill out all required fields!");
      }
    }

    $coneBuilderSubmitFoot.append($btn);

  $coneBuilderSubmitContainer.append($coneBuilderTitle, $coneBuilderSubmit, $coneBuilderSubmitFoot);
  $coneBuilderContainer.parentNode.insertBefore($coneBuilderSubmitContainer, $coneBuilderContainer.nextSibling);
  getContactFromLocalStorage();
}

const generateConeMakeup = (formData) => {
  let coneMakeup = "";
  if (formData.twist) {
    coneMakeup += `${formData.flavor} + ${formData.secondflavor} twist`;
  } else {
    coneMakeup += `${formData.flavor} cone`;
  }

  if (formData.dip !== "no dip") {
    coneMakeup += ` in ${formData.dip} dip`;
  }

  if (formData.topping) {
    switch (formData.topping.length) {
      case 1: 
        coneMakeup += ` with ${formData.topping[0]}`
        break;
      case 2:
        coneMakeup += ` with ${formData.topping[0]} and ${formData.topping[1]}`
        break;
      default:
        coneMakeup += ` with ${formData.topping[0]}, ${formData.topping[1]}, and ${formData.topping[2]}`
        break;
    }
  }
  return coneMakeup;
}

const submitCone = async (formData) => {
  const $makeup = document.querySelector(".conebuilder-submit-makeup");
    const flavor = $makeup.getAttribute("data-flavor");
    const dip = $makeup.getAttribute("data-dip");
    const toppings = $makeup.getAttribute("data-topping") || "none";
  formData = { ...formData, flavor, dip, toppings}

  let params = "";
  for (prop in formData) {
    params += prop + "=" + encodeURIComponent(formData[prop]);
    params += "&";
  }

  const url = `https://script.google.com/macros/s/AKfycbwqkZ641gi2WOVt6m7gFVM_biS8TowSjgQMiQaOKV0olwS6cUma5iIalVjwtA1zD5Hp/exec?${params}`;
  let resp = await fetch(url, { method: "POST", mode: "no-cors" });
  return resp;
}

const coneSubmissionConfirmation = (title) => {
  const $cone = document.getElementById("conebuilder-cone");
    $cone.classList.remove("conebuilder-cone-final");

  const $submitForm = document.querySelector(".conebuilder-submit-form");
    $submitForm.remove();
  const $submitFoot = document.querySelector(".conebuilder-submit-foot");
    $submitFoot.remove();

  const $coneBuilder = document.querySelector(".conebuilder");
  
  const $confirmation = document.createElement("div");
    $confirmation.classList.add("conebuilder-confirmation");
    $confirmation.innerHTML = 
      `<p>your <u>${title}</u> was submitted!</p>
      <p>we'll contact you if you win. good luck!`;

  const $resubmitBtn = document.createElement("button");
    $resubmitBtn.classList.add("btn-rect");
    $resubmitBtn.textContent = "submit another";
    $resubmitBtn.onclick = () => {
      location.reload();
    }

  $confirmation.append($resubmitBtn);
  $coneBuilder.append($confirmation);
}

/*==========================================================
CUSTOMIZATION TOOL
==========================================================*/
const buildCustomizationTool = () => {

  const $main = document.querySelector("main");
  const mainTheme = getMainTheme();

  const $customSection = document.createElement("section");
    $customSection.classList.add("customize", mainTheme, "hide");

  const $customClose = document.createElement("div");
    $customClose.classList.add("customize-close");
    $customClose.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-close">
      <use href="/icons.svg#close"></use>
    </svg>`;
    $customClose.onclick = (e) => {
      const $customScreen = document.querySelector(".customize");
      $customScreen.classList.add("hide");
    }

  const $customTable = document.createElement("div");
    $customTable.classList.add("customize-table");

  const $customHead = document.createElement("h2");
    $customHead.classList.add("customize-table-head");
    $customHead.textContent = "customize your ...";
  const $customBody = document.createElement("form");
    $customBody.classList.add("customize-table-body", "customize-form");
  
  const $customFoot = document.createElement("div");
    $customFoot.classList.add("customize-foot");

  $customTable.append($customHead, $customBody);

  $customSection.append($customClose, $customTable, $customFoot);

  $main.append($customSection);
}

const clearCustomizationTool = () => {
  const $customTool = document.querySelector(".customize-table");
  if ($customTool) {
    const $customBody = $customTool.querySelector(".customize-table-body");
      $customBody.innerHTML = ""; 
  
    const $customFoot = document.querySelector(".customize-foot");
      $customFoot.innerHTML = ""; 
  }
}

const populateCustomizationTool = (store, title, fields) => {

  clearCustomizationTool();

  const $customTool = document.querySelector(".customize-table");

  const $customHead = $customTool.querySelector(".customize-table-head");
    $customHead.textContent = title;
  
  const $customBody = $customTool.querySelector(".customize-table-body");

  let allFields = getFields(fields);

  allFields.forEach((f) => {
    $customBody.append(buildFields("customize", f));
  })

  const $customFoot = document.querySelector(".customize-foot");
  
  const $btn = document.createElement("a");
    $btn.classList.add("btn-rect");

  if (store === "pint-club") {
    $btn.textContent = "join the club";
    $btn.onclick = async (e) => {
      const $form = document.querySelector("form");
      const valid = validateSubmission($form);
      if (valid) {
        buildScreensaver("sending in your subscription...");
        await saveToLocalStorage($form);
        const formData = await getSubmissionData($form);
        await addClubToCart(formData);
        await addClubToCartDesc(formData);
        await clearCustomizationTool();
        await hideCustomizationTool();
        await showCheckoutTool();
        removeScreensaver();
      } else {
        console.error("please fill out all required fields!");
      }
    }
  } else if (store === "merch") {
    $btn.textContent = "check out";
    $btn.onclick = async (e) => {
      const $form = document.querySelector("form");
      const valid = validateSubmission($form);
      if (valid) {
        buildScreensaver("getting ready for check out...");
        await saveToLocalStorage($form);
        const formData = await getSubmissionData($form);
        await clearCustomizationTool();
        await hideCustomizationTool();
        if (formData["merch-checkout"] === "ship in the mail") {
          const type = cleanName(formData["merch-checkout"]);
          const $checkoutTable = document.querySelector(".checkout-table-body");
            $checkoutTable.setAttribute("data-type", type);
          const $checkoutForm = document.querySelector(".checkout-form");
            $checkoutForm.innerHTML = ``; // clear form
          // ADD SHIPPING ITEM
          const shipping = getShippingItem("merch");
          cart.addShipping(shipping);
          updateCart();
          // ADD DELIVERY ADDRESS
          const fields = getFields([ "contact", "address-national", "discount-code" ]);
          fields.forEach((f) => {
            $checkoutForm.append(buildFields("checkout", f));
          });
          getContactFromLocalStorage();
          getAddressFromLocalStorage();
        } else if (formData["merch-checkout"] === "in store pick up") {
          const type = cleanName(formData["merch-checkout"]);
          const $checkoutTable = document.querySelector(".checkout-table-body");
            $checkoutTable.setAttribute("data-type", type);
          const $checkoutForm = document.querySelector(".checkout-form");
            $checkoutForm.innerHTML = ``; // clear form
          // REMOVE SHIPPING ITEM
          cart.removeShipping();
          updateCart();
          // ADD PICKUP TIMES
          const fields = getFields([ "contact", "pick-up", "discount-code" ]);
          fields.forEach((f) => {
            $checkoutForm.append(buildFields("checkout", f));
          });
          // this is setting the pickup times
          const $pickupTimeDropdown = document.getElementById("pickuptime");
          if ($pickupTimeDropdown) {
            $pickupTimeDropdown.innerHTML = ""; // clear on each customize
            const pickupTimes = getPickupTimes("store");
            populateDynamicOptions($pickupTimeDropdown, pickupTimes);
          }
          getContactFromLocalStorage();
        }
        await showCheckoutTool();
        removeScreensaver();
      } else {
        console.error("please fill out all required fields!");
      }
    }
  }
  
  $customFoot.append($btn);

  showCustomizationTool();
}

const populateCustomizationToolShipping = async (title, item) => {
  buildScreensaver("populating your pack options...");
  const itemData = item.item_data;
  const itemId = item.id;
  const itemVariations = itemData.variations;
  const itemModifiers = itemData.modifier_list_info;
  const shippingData = await fetchShippingPacks();
  const packLimit = shippingData[itemId];

  const $customTool = document.querySelector(".customize-table");

  const $customHead = $customTool.querySelector(".customize-table-head");
  $customHead.textContent = title;

  const $customBody = $customTool.querySelector(".customize-table-body");
  $customBody.innerHTML = ""; // clear on each populate

  // MODIFIERS STUFF
  if (itemModifiers) { 

    for (m of itemModifiers) {
      const modCat = catalog.byId[m.modifier_list_id]; // this is a single modifier category (obj)
      const modCatData = modCat.modifier_list_data; // this is a single modifer category WITH DATA I CARE ABOUT (obj)
      const modId = modCat.id; // this is the id for the ENTIRE modifier category (str)
      const modCatName = modCatData.name.split(" ")[1].slice(0, -1); // this is the single modifier category NAME (str)
      const modCatModifiers = modCatData.modifiers; // these are all the modifiers in a category (arr);

      const modQuantity = packLimit.quantities[modCatName + "s"];

      const $carouselContainer = document.createElement("div");
        $carouselContainer.setAttribute("data-item-id", itemId);
        $carouselContainer.setAttribute("data-type", modCatName);
        $carouselContainer.classList.add("customize-table-body-carousel");

      const $heading = document.createElement("h3");
        $heading.classList.add("customize-table-body-carousel-head");
        $heading.innerHTML = `choose <span data-limit-id="${modId}" data-limit=${modQuantity} data-limit-type="${modCatName}">${modQuantity}</span> ${modCatName}s`;

      const $carousel = document.createElement("div");
        $carousel.classList.add("menu", "menu-carousel", "theme-outline");

      const carouselData = await fetchShippingCarousel(modCatName);
      const $carouselItems = buildShippingCarousel(modId, modCatName, modCatModifiers, carouselData);

      $carousel.append($carouselItems);
      $carouselContainer.append($heading, $carousel);
      $customBody.append($carouselContainer);

    }

    setupCarousels();
    removeScreensaver();

  }

  const $customFoot = document.querySelector(".customize-foot");
    $customFoot.innerHTML = ""; // clear on each populate

  const $btn = document.createElement("a");
    $btn.classList.add("btn-rect");
    $btn.id = "customize-form";
    $btn.textContent = "add to cart";
    $btn.onclick = async (e) => {
      const targetClass =  e.target.closest("a").id;
      const $form = document.querySelector(`.${targetClass}`);
      const valid = validateShippingSubmission($form);
      if (valid) {
        buildScreensaver("customizing your pack...");
        await addShipConfigToCart();
        await clearCustomizationTool();
        await hideCustomizationTool();
        removeScreensaver();
      } else {
        console.error("please fill out all required fields!");
      }
    };

  $customFoot.append($btn);
  showCustomizationTool();

}

const buildShippingCarousel = (id, type, modifiers, inStock) => {

  let $container = document.createElement("div");
    $container.classList.add("embed", "embed-internal", `embed-internal-shipping${type}s`,"embed-internal-shippingmenus");

    const numInStock = Object.keys(inStock).length;

    if (numInStock === 1) {
      $container.classList.add("menu-carousel-one");
    } else if (numInStock === 2) {
      $container.classList.add("menu-carousel-two");
    } else if (numInStock === 3) {
      $container.classList.add("menu-carousel-three");
    } else if (numInStock > 3) {
      $container.classList.add("menu-carousel-full");
    }

  modifiers.forEach((m) => { 
    const mId = m.id;
    const mData = m.modifier_data;
    const cleanMod = cleanName(mData.name);

    if (inStock[cleanMod]) {
      const thisItem = inStock[cleanMod];

      const $menuItem = document.createElement("div");
        $menuItem.classList.add("menu-item");

      const $img = document.createElement("img");
        $img.setAttribute("src", `/assets/images/${type}-${cleanName(thisItem.name)}.webp`);
        $img.setAttribute("alt", `${thisItem.name} ${type}`);
        console.log($img);

      const $src = document.createElement("source");
        $src.setAttribute("srcset", `/assets/images/${type}-${cleanName(thisItem.name)}.webp`);

      const $picture = document.createElement("picture");
        $picture.append($src, $img);

      const $p = document.createElement("p");
        $p.append($picture);

      const $title = document.createElement("h4");
        $title.textContent = thisItem.name;

      if (thisItem.allergy) {
        const allergies = makeArr(thisItem.allergy);
        allergies.forEach((a) => {
          $title.innerHTML += ` <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-${a}">
          <use href="/icons.svg#${a}"></use>
        </svg>`;
        })
      }
      $menuItem.append($p, $title);
      
      let $desc = document.createElement("p");
      if (thisItem.description) {
        $desc.textContent = thisItem.description;
        $menuItem.append($desc);
      }

      const $menuFooter = document.createElement("aside");
        
        $menuFooter.innerHTML = `<span onclick="minusShip(this)" class="quantity quantity-minus">-</span>
        <span class="quantity-num" data-item-type="${type}" data-mod-id="${mId}">0</span>
        <span onclick="plusShip(this)" class="quantity quantity-plus">+</span>`;
        $menuFooter.classList.add("menu-footer", cleanName(thisItem.name));
        $menuFooter.setAttribute(`data-quantity-type`, type);

      $menuItem.append($menuFooter);
      $container.append($menuItem);

    }
  })

  return $container;
}

const plusShip = (e) => {
  const $footer = e.closest(".menu-footer");
  const $quantity = $footer.querySelector(".quantity-num");
  const type = $quantity.getAttribute("data-item-type");
  const quantity = $quantity.textContent;
  const num = parseInt(quantity);
  const catQuantity = checkShipCatQuantity(type);
  const catLimit = checkShipCatLimit(type);
  if (catQuantity < catLimit) {
    $quantity.textContent = num + 1;
    const newQuantity = checkShipCatQuantity(type);
    if (newQuantity >= catLimit) {
      disableShipPlus(type);
    }
  } else {
    disableShipPlus(type);
  }
}

const minusShip = (e) => {
  const $footer = e.closest(".menu-footer");
  const $quantity = $footer.querySelector(".quantity-num");
  const type = $quantity.getAttribute("data-item-type");
  const quantity = $quantity.textContent;
  const num = parseInt(quantity);
  if (num > 0) {
    $quantity.textContent = num - 1;
    enableShipPlus(type);
  }
}

const checkShipCatQuantity = (type) => {
  const $allQuantities = document.querySelectorAll(`[data-item-type=${type}`);
  const $allQuantitiesArr = [ ...$allQuantities ];
  const catQuantity = $allQuantitiesArr.reduce((a, b) => {
    return a + parseInt(b.textContent);
  }, 0)
  return catQuantity;
}

const checkShipCatLimit = (type) => {
  const $limit = document.querySelector(`[data-limit-type=${type}]`);
  const limit = $limit.getAttribute("data-limit");
  const num = parseInt(limit);
  return num;
}

const disableShipPlus = (type) => {
  const $menuFooters = document.querySelectorAll(`[data-quantity-type=${type}]`);
  const $menuFootersArr = [ ...$menuFooters ];
  $menuFootersArr.forEach((f) => {
    const $plus = f.querySelector(".quantity-plus");
    $plus.classList.add("quantity-disabled");
  })
}

const enableShipPlus = (type) => { 
  const $menuFooters = document.querySelectorAll(`[data-quantity-type=${type}]`);
  const $menuFootersArr = [ ...$menuFooters ];
  $menuFootersArr.forEach((f) => {
    const $plus = f.querySelector(".quantity-plus");
    $plus.classList.remove("quantity-disabled");
  })
}

const addShipConfigToCart = () => {
  const $itemId = document.querySelector("[data-item-id]");
  const itemId = $itemId.getAttribute("data-item-id");
  const $modIds = document.querySelectorAll("[data-mod-id]");
  const $modIdsArr = [ ...$modIds ];
  let selectedMods = [];
  const $selectedMods = $modIdsArr.filter((m) => {
    const quantity = m.textContent;
    const num = parseInt(quantity);
    if (num > 0) { 
      const modId = m.getAttribute("data-mod-id");
      selectedMods.push({ id: modId, quantity: num});
      return m;
    };
  });
  const mods = selectedMods.map((m) => {
    return m.id;
  })
  
  const obj = catalog.byId[itemId];
  const varId = obj.item_data.variations[0].id;
  const fp = [ varId, ...mods ].join("-");
  
  cart.addShippingQuantities({
    fp: fp,
    mods: selectedMods
  });
  cart.add(varId, mods);

  updateCart();
}

const getReadableModList = (item) => {
  const readableModList = [];
  if (item) {
    item.mods.forEach((i) => {
      const mod = catalog.byId[i.id];
      const modName = mod.modifier_data.name;
      const quantity = i.quantity;
      readableModList.push({
        id: i.id,
        name: modName,
        quantity: quantity
      })
    })
    return readableModList;
  }
}

const populateCustomizationToolSquare = (title, item) => {
  const itemData = item.item_data;
  const itemVariations = itemData.variations;
  const itemModifiers = itemData.modifier_list_info;

  const $customTool = document.querySelector(".customize-table");

  const $customHead = $customTool.querySelector(".customize-table-head");
  $customHead.textContent = title;

  const $customBody = $customTool.querySelector(".customize-table-body");
  $customBody.innerHTML = ""; // clear on each populate

  if (itemVariations && // this is ALWAYS a radio, only one choice!
    itemData.category_id !== "5AIFY5WMTNJLS5RBZAPWL4YJ") { // don't display shipping variations

    const $field = document.createElement("div");
    $field.classList.add(`customize-table-body-radio`);
    $field.id = `radio-variation`;

    const $title = document.createElement("h3");
    $title.onclick = (e) => {
      const $parent = e.target.parentNode;
      const $sibling = e.target.nextElementSibling;
      const open = $sibling.getAttribute("data-open");

      if (open === "true") {
        $sibling.classList.add("hide");
        $parent.setAttribute("data-open", false);
        $sibling.setAttribute("data-open", false);
        e.target.setAttribute("data-open", false);
      } else {
        $sibling.classList.remove("hide");
        $parent.setAttribute("data-open", true);
        $sibling.setAttribute("data-open", true);
        e.target.setAttribute("data-open", true);
      }
    };

    if (itemData.name.includes("soft serve")) {
      if (itemVariations[0].item_variation_data.name.includes("size")) {
        $title.textContent = "select your size"; 
      } else {
        $title.textContent = "flavor (select 1)"; 
      }
    } else if (itemVariations[0].item_variation_data.name.includes("oz") || itemVariations[0].item_variation_data.name.includes("size")) {
      $title.textContent = "select your size";
    } else if (itemVariations[0].item_variation_data.name.includes("shot")) {
      $title.textContent = "shots";
    } else if (itemVariations[0].item_variation_data.name.includes("varietal")) {
      $title.textContent = "select your varietal";
    } else if (itemVariations[0].item_variation_data.name.includes("gift card")) {
      $title.textContent = "select your amount";
    } else {
      $title.textContent = "make a selection";
      console.log("hey normal, here's a new scenario:");
      console.log(" >", itemData.name, itemVariations);
    }

    $field.append($title);

    //setup options
    const $optionsContainer = document.createElement("div");
    $optionsContainer.classList.add(
      `customize-table-body-radio-container`,
      "hide"
    );

    itemVariations.forEach((v) => {

      if (
        v.item_variation_data.name.includes("select topping") || 
        v.item_variation_data.name.includes("select a") || 
        v.item_variation_data.name.includes("select an") ||
        v.item_variation_data.name.includes("select your") ||
        v.item_variation_data.name.includes("choose topping") || 
        v.item_variation_data.name.includes("choose a") || 
        v.item_variation_data.name.includes("choose an") ||
        v.item_variation_data.name.includes("choose your") ||
        v.item_variation_data.name.includes("make it")
      ) {
        return; // do not display "make..." or "select..." or "choose..." options
      }
      
      const $label = document.createElement("label");
      $label.classList.add(`customize-table-body-radio-container-optionblock`);
      $label.setAttribute("for", cleanName(v.item_variation_data.name));
      $label.textContent = v.item_variation_data.name;

      const $customEl = document.createElement("span");
      $customEl.classList.add(
        `customize-table-body-radio-container-optionblock-custom`
      );

      const $option = document.createElement("input");
      $option.classList.add(
        `customize-table-body-radio-container-optionblock-option`
      );
      $option.id = cleanName(v.item_variation_data.name);
      $option.name = cleanName(itemData.name);
      $option.type = "radio";
      $option.value = v.id;

      $label.append($option, $customEl);
      $optionsContainer.append($label);
    });
    $field.append($optionsContainer);
    $customBody.append($field);
  }

  if (itemModifiers) { // except for soft serve toppings, these are ALL RADIOS!
    itemModifiers.forEach((m) => {
      const modCat = catalog.byId[m.modifier_list_id]; // this is a single modifier category (obj)
      const modCatData = modCat.modifier_list_data; // this is a single modifer category WITH DATA I CARE ABOUT (obj)
      const modCatName = modCatData.name; // this is the single modifier category NAME (str)
      const modCatModifiers = modCatData.modifiers; // these are all the modifiers in a category (arr);

      if (
        modCatName.includes("topping 2") ||
        modCatName.includes("topping 3")
      ) {
        return; // only show ONE topping group
      }

      //setup options
      const $field = document.createElement("div");
      $field.classList.add(`customize-table-body-radio`);
      // $field.id = `radio-modifer-${cleanName(modCatName)}`;

      const $title = document.createElement("h3");
      $title.textContent = removeStorefrontName(modCatName);

      // do something special for soft serve toppings
      if (
        itemData.name.includes("soft serve") &&
        modCatName.includes("topping")
      ) {
        // ONLY for soft serve toppings
        const noNumberName = modCatName.replace(/[0-9]/g, "");
        $title.textContent = removeStorefrontName(noNumberName).trim(); // remove numbers
        $title.textContent += "s (select up to 3)";
        $field.id = `radio-modifer-${removeStorefrontName(
          cleanName(noNumberName)
        )}`;
      // all other mod categories (not soft serve toppings)
      } else {
        $title.textContent = removeStorefrontName(modCatName);
      }

      $title.onclick = (e) => {
        const $parent = e.target.parentNode;
        const $sibling = e.target.nextElementSibling;
        const open = $sibling.getAttribute("data-open");

        if (open === "true") {
          $sibling.classList.add("hide");
          $parent.setAttribute("data-open", false);
          $sibling.setAttribute("data-open", false);
          e.target.setAttribute("data-open", false);
        } else {
          $sibling.classList.remove("hide");
          $parent.setAttribute("data-open", true);
          $sibling.setAttribute("data-open", true);
          e.target.setAttribute("data-open", true);
        }
      };

      $field.append($title);

      const $optionsContainer = document.createElement("div");
      $optionsContainer.classList.add(
        `customize-table-body-radio-container`,
        "hide"
      );

      modCatModifiers.forEach((mod) => {
        const modId = mod.id;
        const modData = mod.modifier_data;
        const modName = modData.name;
        const modPrice = formatMoney(modData.price_money.amount);

        if (
          modName.includes("select topping") || 
          modName.includes("select a") || 
          modName.includes("select an") ||
          modName.includes("select your") ||
          modName.includes("choose topping") || 
          modName.includes("choose a") || 
          modName.includes("choose an") ||
          modName.includes("choose your") ||
          modName.includes("make it")
        ) {
          return; // do not display "make..." or "select..." or "choose..." options
        }

        // do something special for soft serve toppings
        if (
          itemData.name.includes("soft serve") &&
          modCatName.includes("topping")
        ) {
          const noNumberName = modCatName.replace(/[0-9]/g, "");

          const $label = document.createElement("label");
          $label.classList.add(
            `customize-table-body-checkbox-container-optionblock`
          );
          $label.setAttribute("for", cleanName(modName)); // item specific
          $label.textContent = modName; // item specific
          if (modPrice > 0) {
            $label.textContent += ` (+$${modPrice})`;
          }

          const $customEl = document.createElement("span");
          $customEl.classList.add(
            `customize-table-body-checkbox-container-optionblock-custom`
          );

          const $option = document.createElement("input");
          $option.classList.add(
            `customize-table-body-checkbox-container-optionblock-option`,
            `topping-option`
          );
          $option.id = cleanName(modName); // item specific
          $option.name = removeStorefrontName(cleanName(noNumberName)); // name of ENTIRE category
          $option.type = "checkbox";
          $option.value = modId; // item specific id

          $label.append($option, $customEl); // add input el and custom radio btn to label el
          $optionsContainer.append($label); // add label el to options container el
        } else {
          const $label = document.createElement("label");
          $label.classList.add(
            `customize-table-body-radio-container-optionblock`
          );
          $label.setAttribute("for", cleanName(modName)); // item specific
          $label.textContent = modName; // item specific
          if (modPrice > 0) {
            $label.textContent += ` (+$${modPrice})`;
          }

          const $customEl = document.createElement("span");
          $customEl.classList.add(
            `customize-table-body-radio-container-optionblock-custom`
          );

          const $option = document.createElement("input");
          $option.classList.add(
            `customize-table-body-radio-container-optionblock-option`
          );
          $option.id = cleanName(modName); // item specific
          $option.name = cleanName(modCatName); // name of ENTIRE category
          $option.type = "radio";
          $option.value = modId; // item specific id

          $label.append($option, $customEl); // add input el and custom radio btn to label el
          $optionsContainer.append($label); // add label el to options container el
        }
      });

      $field.append($optionsContainer); // add options container el to field el
      $customBody.append($field); // add entire field to custom body el
    });
  }

  const $customFoot = document.querySelector(".customize-foot");
    $customFoot.innerHTML = ""; // clear on each populate

  const $btn = document.createElement("a");
    $btn.classList.add("btn-rect");
    $btn.id = "customize-form";
    $btn.textContent = "add to cart";
    $btn.onclick = async (e) => {
      const targetClass =  e.target.closest("a").id;
      const $form = document.querySelector(`.${targetClass}`);
      const valid = validateSubmission($form);
      if (valid) {
        buildScreensaver("customizing your item...");
        const formData = await getSubmissionData($form);
        await addConfigToCart(formData);
        await clearCustomizationTool();
        await hideCustomizationTool();
        removeScreensaver();
      } else {
        console.error("please fill out all required fields!");
      }
    };

  $customFoot.append($btn);
  showCustomizationTool();
};

const showCustomizationTool = () => {
  const $customTool = document.querySelector(".customize");
  if ($customTool) {
    $customTool.classList.remove("hide");
  }
}

const hideCustomizationTool = () => {
  const $customTool = document.querySelector(".customize");
  if ($customTool) {
    $customTool.classList.add("hide");
  }
}

const validateSubmission = ($form) => {
  const $requiredFields = $form.querySelectorAll("[required]");
  const $radios = $form.querySelectorAll("[type=radio]");
  const $selects = $form.querySelectorAll("select");

  let invalidFieldsById = []; // inputs and selects go here
  let invalidRadiosByName = [];

  if ($requiredFields) {
    $requiredFields.forEach((f) => {
      if (f.type === "tel" && f.value !== "") {
        f.value = cleanName(f.value);
      }
      if (!f.value.trim() || !f.checkValidity()) {
        invalidFieldsById.push(f.id);
      }
    });
  }

  if ($selects) {
    $selects.forEach((s) => {
      if (s.value === "") {
        invalidFieldsById.push(s.id);
      }
    });
  }

  if ($radios) {
    let radiosByName = {};

    $radios.forEach((r) => {
      if (radiosByName[r.name]) { // if property exists
        radiosByName[r.name].push(r.checked);
      } else { // if property does not exist
        radiosByName[r.name] = [r.checked];
      }
    });

    for (prop in radiosByName) {
      if (!radiosByName[prop].includes(true)) {
        invalidRadiosByName.push(prop);
      }
    }
  }

  const allInvalidFields = [...invalidFieldsById, ...invalidRadiosByName];

  if (allInvalidFields.length === 0) {
    return true;
  } else {
    invalidFieldsById.forEach((i) => { // attach error mssg on these fields
      const $field = document.getElementById(i);
      $field.classList.add("invalid-field");
    });

    invalidRadiosByName.forEach((n) => { // pop open dropdown with errors
      const $radioGroup = document.querySelector(`[name=${n}]`).parentNode
        .parentNode;
      $radioGroup.classList.add("invalid-field");
      const $parent = $radioGroup.parentNode;
      const $child = $parent.querySelector("h3");
      const open = $parent.getAttribute("data-open");
      if (open !== "true") {
        $radioGroup.classList.remove("hide");
        $parent.setAttribute("data-open", true);
        $child.setAttribute("data-open", true);
        $radioGroup.setAttribute("data-open", true);
      }
    });

    setTimeout(() => {
      const $invalidFields = document.querySelectorAll(".invalid-field");
      if ($invalidFields) {
        $invalidFields.forEach((f) => {
          f.classList.remove("invalid-field");
        });
      }
    }, 1000); //remove this class after the animation runs

    return false;
  }
};

const validateShippingSubmission = ($form) => {
  const $carousels = $form.querySelectorAll(".customize-table-body-carousel");
  let allInvalidIds = [];

  if ($carousels) {
    $carousels.forEach((c) => {
      const type = c.getAttribute("data-type");
      const catQuantity = checkShipCatQuantity(type);
      const catLimit = checkShipCatLimit(type);
      
      if (catQuantity < catLimit) {
        const $head = c.querySelector("h3 > span");
          const invalidId = $head.getAttribute("data-limit-id");
        allInvalidIds.push(invalidId);
      }      
    });
  }

  if (allInvalidIds.length === 0) {
    return true;
  } else {
    allInvalidIds.forEach((i) => {
      const $field = $form.querySelector(`[data-limit-id="${i}"]`).parentNode.parentNode;
      $field.classList.add("invalid-field");
    });
  }

  setTimeout(() => {
    const $invalidFields = document.querySelectorAll(".invalid-field");
    if ($invalidFields) {
      $invalidFields.forEach((f) => {
        f.classList.remove("invalid-field");
      });
    }
  }, 1000);

  return false;
};

const getSubmissionData = ($form) => {
  const $fields = $form.querySelectorAll("[name]"); // all named fields
  let data = {};

  if ($fields) {
    $fields.forEach((f) => {
      if (f.nodeName === "SELECT") {
        data[f.name] = f.value;
      } else if (f.type === "checkbox") {
        if (f.checked) { // only check checked checkbox (wow) options
          if (data[f.name]) { // if prop exists
            data[f.name].push(f.value)
          } else { // if prop DOES NOT exist
            data[f.name] = [ f.value ];
          }
        }
      } else if (f.type === "radio") {
        if (f.checked) { // only add selected radio option
          data[f.name] = f.value;
        }
      } else {
        if (f.value) { // exclude empty fields
          data[f.name] = f.value;
        }
      }
    })
  }

  return data;
}

const getFields = (fields) => {

  let allFields = [];
  fields.forEach((f) => {
    switch (f) {
      case "contact":
        allFields.push(
          { data: { store: true }, title: "name", type: "text", placeholder: "your name", required: true },
          { data: { store: true }, title: "cell", type: "tel", placeholder: "your cell", required: true },
          { data: { store: true }, title: "email", type: "email", placeholder: "your email", required: true }
        );
        break;
      case "address":
        allFields.push(
          { data: { fieldtype: "address", store: true }, title: "addr1", type: "text", placeholder: "your address", required: true },
          { data: { fieldtype: "address", store: true }, title: "addr2", type: "text", placeholder: "apt # or building code? add here!" },
          { data: { fieldtype: "address", store: true }, title: "city", type: "text", placeholder: "your city", required: true },
          { data: { fieldtype: "address", store: true }, title: "state", type: "text", value: "utah", readonly: true },
          { data: { fieldtype: "address" }, title: "zip", type: "select", placeholder: "your zip code", src: "deliveryZips", required: true }          
        );
        break;
      case "address-national": 
        allFields.push(
          { data: { fieldtype: "address", store: true }, title: "addr1", type: "text", placeholder: "your address", required: true },
          { data: { fieldtype: "address", store: true }, title: "addr2", type: "text", placeholder: "apt # or building code? add here!" },
          { data: { fieldtype: "address", store: true }, title: "city", type: "text", placeholder: "your city", required: true },
          { data: { fieldtype: "address", store: true }, title: "state", type: "text", placeholder: "your state", required: true },
          { data: { fieldtype: "address", store: true }, title: "zip", type: "text", placeholder: "your zip code", required: true }
        )
        break;
      case "pint-club":
        allFields.push(
          { title: "payment-option", type: "radio", label: "select payment option", options: [ "prepay", "monthly" ], required: true },
          { title: "customize-pints", type: "checkbox", label: "customize your pints (select any that apply)", src: "packs", options: [ "keep it normal®", "vegan", "half-vegan", "nut free", "gluten free" ] },
          { title: "allergies", type: "text", placeholder: "any allergies? even shellfish, seriously! ya never know!" },
          { title: "delivery-option", type: "radio", label: "how do you want to get your pints?", options: [ "pickup", "shipping" ], required: true }
        );
        break;
      case "prepay-months": 
        allFields.push(
          { title: "prepay-months", type: "radio", label: "how many months?", options: [ "3", "6", "12" ], required: true }
        );
        break;
      case "merch":
        allFields.push(
          { title: "merch-checkout", type: "radio", label: "pick up/shipping", options: [ "in store pick up", "ship in the mail" ], required: true }
        );
        break;
      case "pick-up":
        allFields.push(
          { title: "pickup-date", type: "text", value: "today", readonly: true },
          { title: "pickup-time", type: "select", placeholder: "select your pickup time", src: "hoursOfOp", required: true }
        )
        break;
      case "discount-code":
        allFields.push(
          { title: "discount", type: "text", placeholder: "discount code" }
        )
        break;
      case "tip":
        allFields.push(
          { title: "tip", type: "select", placeholder: "no tip", src: "tipPercentages" }
        )
        break;
      case "payment-option":
        allFields.push(
          { title: "payment-option", type: "checkbox", label: "pay with gift card?", options: [ "pay with gift card?" ]}
        )
        break;
      case "cone-builder":
        allFields.push(
          { title: "flavor", type: "select", placeholder: "select your flavor", src: "coneBuilderFlavors" },
          { title: "dip", type: "radio", label: "dip", options: [ "no dip" ] },
          { title: "toppings", type: "checkbox", label: "select topping (up to 3)", options: [], src: "coneBuilderTopping" }
        )
        break;
      case "cone-builder-second-flavor":
        allFields.push(
          { title: "second-flavor", type: "select", placeholder: "select your second flavor", src: "coneBuilderFlavors" }
        )
        break;
      case "cone-builder-title":
        allFields.push(
          { title: "title", type: "text", placeholder: "name your creation", required: true }
        )
        break;
      default:
        console.error("hey normal, you tried to build a form with an invalid field:", f);
        break;
    }
  })
  return allFields;
}

const buildFields = (formType, field) => {
  let $field;

  if (field.type === "radio" || field.type === "checkbox") {
    //setup options
    $field = document.createElement("div");
      $field.classList.add(`${formType}-table-body-${field.type}`);
      $field.id = `${field.type}-${cleanName(field.title)}`;

    const $title = document.createElement("h3");
      $title.textContent = field.label;
      $title.onclick = (e) => {
        const $parent = e.target.parentNode;
        const $sibling = e.target.nextElementSibling;
        const open = $sibling.getAttribute("data-open");

        if (open === "true") {
          $sibling.classList.add("hide");
          $parent.setAttribute("data-open", false);
          $sibling.setAttribute("data-open", false);
          e.target.setAttribute("data-open", false)
        } else {
          $sibling.classList.remove("hide");
          $parent.setAttribute("data-open", true);
          $sibling.setAttribute("data-open", true);
          e.target.setAttribute("data-open", true);
        }

      }
    $field.append($title); 

    const $optionsContainer = document.createElement("div");
      $optionsContainer.classList.add(`${formType}-table-body-${field.type}-container`, "hide");
    
    field.options.forEach((o) => {
      
      const $label = document.createElement("label");
        $label.classList.add(`${formType}-table-body-${field.type}-container-optionblock`);
        $label.setAttribute("for", cleanName(o));
        $label.textContent = o;

      const $customEl = document.createElement("span");
        $customEl.classList.add(`${formType}-table-body-${field.type}-container-optionblock-custom`);
      
      const $option = document.createElement("input");
        $option.classList.add(`${formType}-table-body-${field.type}-container-optionblock-option`);
        $option.id = cleanName(o);
        $option.name = field.title;
        $option.type = field.type;
        $option.value = o;

      $label.append($option, $customEl);      

      $optionsContainer.append($label);
    })
    $field.append($optionsContainer);

  } 
  else if (field.type === "select") {

    $field = document.createElement("div"); // wrapper
      $field.classList.add(`${formType}-table-body-selectwrapper`);
    if (field.data) {
      for (dataType in field.data) {
        $field.setAttribute(`data-${dataType}`, field.data[dataType]);
      }
    }
    $select = document.createElement(field.type);
      $select.classList.add(`${formType}-table-body-selectwrapper-select`);
      $select.id = cleanName(field.title);
      $select.name = cleanName(field.title);
    
    const $option = document.createElement("option");
      $option.value = "";
      $option.textContent = field.placeholder;
      $option.disabled = true;
      $option.selected = true;
      $option.hidden = true;
    $select.append($option);
    $field.append($select);
  } else {
    $field = document.createElement("input");
      $field.classList.add(`${formType}-table-body-field`);
      $field.id = cleanName(field.title);
      $field.name = cleanName(field.title);
      $field.type = field.type || "text";

      if (field.type === "tel") {
        // tel pattern
        $field.pattern = "[0-9]{10,11}";
      } else if (field.type === "email") {
        $field.pattern = "[a-zA-Z0-9\\.]+@[a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)+";
      } else if (field.title === "zip") {
        $field.pattern = "[0-9]{5}(?:-[0-9]{4})?";
      }

      if (field.placeholder) {
        $field.placeholder = field.placeholder;
      }
      if (field.value) {
        $field.value = field.value;
      }
      if (field.data) {
        for (dataType in field.data) {
          $field.setAttribute(`data-${dataType}`, field.data[dataType]);
        }
      }
      if (field.required) {
        $field.required = field.required;
      }
      if (field.readonly) {
        $field.readOnly = field.readonly;
      }
  }

  return $field;
}

const populateOptions = ($el, data) => {
  data.forEach((d) => {
    const $option = document.createElement("option");
      $option.value = d;
      $option.textContent = d;
    $el.append($option);
  })
}

const populateDynamicOptions = ($el, data) => {
  data.forEach((d) => {
    const $option = document.createElement("option");
      $option.value = d.value;
      $option.textContent = d.text;
    $el.append($option);
  })
}

/*==========================================================
CHECKOUT TOOL
==========================================================*/

const buildCheckoutTool = () => {

  const $main = document.querySelector("main");
    const mainTheme = getMainTheme();

  // this is the background
  const $checkoutSection = document.createElement("section");
    $checkoutSection.classList.add("checkout", mainTheme, "hide");

  // this is the container to hold all the checkout stuff
  const $checkoutContainer = document.createElement("div");
    $checkoutContainer.classList.add("checkout-container");

  // this is the back btn
  const $checkoutBack = document.createElement("aside");
    $checkoutBack.classList.add("checkout-back", "btn-back");
    $checkoutBack.innerHTML = `<p>back to ${getLastStore().split("-").join(" ")}</p>`;
    $checkoutBack.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-arrow-left">
      <use href="/icons.svg#arrow-left"></use>
    </svg>`;
    $checkoutBack.onclick = (e) => {
      hideCheckoutTool();
    }

  // this is the CHECKOUT CART (all the items)
  const $checkoutTable = document.createElement("table");
    $checkoutTable.classList.add("checkout-table");

    // this is the HEAD of the checkout cart (the title)
  const $checkoutHead = document.createElement("thead");
  $checkoutHead.classList.add("checkout-table-head");
  $checkoutHead.innerHTML = `<tr>
    <th colspan="3">
      <h2>your ${getCurrentStore().split("-").join(" ")} order</h2>
    </th>
  </tr>`;

  // this is the BODY of the checkout cart (all the items)
  const $checkoutBody = document.createElement("tbody");
    $checkoutBody.classList.add("checkout-table-body");
  
  // this is the FOOTER of the checkout cart (total amount)
  const $checkoutFoot = document.createElement("tfoot");
    $checkoutFoot.classList.add("checkout-table-foot");
    $checkoutFoot.innerHTML = `<tr>
      <td colspan="2">total</td>
      <td id="checkout-foot-total"></td>
    </tr>`;

  $checkoutTable.append($checkoutHead, $checkoutBody, $checkoutFoot);

  // this is the CHECKOUT FORM CONTAINER
  const $checkoutFormContainer = document.createElement("div");
    $checkoutFormContainer.classList.add("checkoutform-container", "hide");

  // this is the CHECKOUT FORM
  const $checkoutForm = document.createElement("form");
    $checkoutForm.classList.add("checkout-form");

  let fieldsArr = [ "contact" ];
  const currentStore = getCurrentStore();

  if (currentStore === "store" || currentStore === "lab") {
    fieldsArr.push("pick-up");
  } else if (currentStore === "delivery") {
    fieldsArr.push("address");
  } else if (currentStore === "shipping") {
    fieldsArr.push("address-national");
  }
  
  fieldsArr.push("discount-code");

  let allFields = getFields(fieldsArr);

  allFields.forEach((f) => {
    $checkoutForm.append(buildFields("checkout", f));
  });

  const $discountField = $checkoutForm.querySelector("#discount");
  if ($discountField) {
    $discountField.onkeyup = (e) => {
      const value = e.target.value.toLowerCase().trim();
      if (catalog.discounts[value]) {
        $discountField.setAttribute("data-id", catalog.discounts[value].id);
      } 
    }
  }

  getContactFromLocalStorage();

  // this is the CHECKOUT BTN
  const $checkoutBtn = document.createElement("a");
    $checkoutBtn.classList.add("btn-rect");
    $checkoutBtn.id = "checkout-form";
    $checkoutBtn.textContent = "place order";
    $checkoutBtn.onclick = async (e) => {
      const $form = document.querySelector(".checkout-form");
      const valid = validateSubmission($form);
      if (valid) {

        const currentStore = getCurrentStore();
        buildScreensaver(`submitting your ${currentStore.split("-").join(" ")} order...`);
        await saveToLocalStorage($form);
        const formData = await getSubmissionData($form);
        let pintMonthlySub = false;
        // PINT CLUB SETUP
        if (currentStore === "pint-club") {
          const clubOption = await findClubOption();
          if (clubOption.term.includes("1 month") || clubOption.term.includes("one month")) {
            pintMonthlySub = true;
          }
        }
        // MERCH
        if (currentStore === "merch") {
          const $checkoutTable = document.querySelector(".checkout-table-body");
          const type = $checkoutTable.getAttribute("data-type");
          if (type.includes("ship")) {
            orderObj = await submitOrder("merch-shipping", formData);
          } else if (type.includes("pickup")) {
            orderObj = await submitOrder("merch-pickup", formData);
          }

          if (orderObj) {
            await disableCartEdits();
            await displayOrderObjInfo(orderObj, formData);
            await hideCheckoutForm();
            await buildSquarePaymentForm();
            removeScreensaver();
          } 
          else {
            console.error("something went wrong and your order didn't go through. try again?");
            makeScreensaverError("something went wrong and your order didn't go through. try again?")
          }

        } else if (!pintMonthlySub) { // store, lab, merch, prepay pint-club
          //////////////////////////////////////////////////////
          orderObj = await submitOrder(currentStore, formData);

          if (orderObj) {
            await disableCartEdits();
            await displayOrderObjInfo(orderObj, formData);
            await hideCheckoutForm();
            await buildSquarePaymentForm();
            removeScreensaver();
          } else {
            console.error("something went wrong and your order didn't go through. try again?");
            makeScreensaverError("something went wrong and your order didn't go through. try again?")
          }
          /////////////////////////////////////////////////////
        } else if (pintMonthlySub) { // monthly pint-club

          // create customer
          const customerData = await createCustomer(formData);
          if (customerData.customer) {
            // create card nonce
            localStorage.setItem("normal-id", customerData.customer.id);
            const $name = document.querySelector("#name");
              $name.setAttribute("data-id", customerData.customer.id);
            await disableCartEdits();
            await hideCheckoutForm();
            await buildSquarePaymentForm();
            removeScreensaver();
          } else {
            console.error(customerData);
            makeScreensaverError("something went wrong. try again?")
          }
        }
      } else {
        console.error("please fill out all required fields!");
      }
    };

  $checkoutFormContainer.append($checkoutForm, $checkoutBtn);

  //////////////////////////////////////////////////////////
  $checkoutContainer.append($checkoutBack, $checkoutTable, $checkoutFormContainer);
  $checkoutSection.append($checkoutContainer);

  $main.append($checkoutSection);

}

const showCheckoutTool = () => {
  const $checkoutTool = document.querySelector(".checkout");
  if ($checkoutTool) {
    $checkoutTool.classList.remove("hide");
  }
}

const hideCheckoutTool = () => {
  const $checkoutTool = document.querySelector(".checkout");
  if ($checkoutTool) {
    $checkoutTool.classList.add("hide");
  }
}

const hideCheckoutForm = () => {
  const $checkoutFormContainer = document.querySelector(".checkoutform-container");
  if ($checkoutFormContainer) {
    $checkoutFormContainer.classList.add("hide");
  }
}

const disableCartEdits = () => {
  const $quantityBtns = document.querySelectorAll(".quantity");
  if ($quantityBtns) {
    $quantityBtns.forEach((b) => {
      b.remove();
    })
  }
}

const displayOrderObjInfo = (orderObj, formData) => {  
  const $checkoutTableFooter = document.querySelector(".checkout-table-foot");
    $checkoutTableFooter.innerHTML = ""; // clear on display

  // DISCOUNT INFO
  const discountName = document.querySelector("#discount").value;
  const $discountRow = document.createElement("tr");

  if (discountName && orderObj.total_discount_money.amount > 0) {

    const $discountTitle = document.createElement("td");
      $discountTitle.colSpan = 2;
      $discountTitle.textContent = `${discountName.split("-").join(" ")} (discount)`;

    const $discountAmount = document.createElement("td");
      $discountAmount.id = "checkout-foot-discount";
      $discountAmount.textContent = `- $${formatMoney(orderObj.total_discount_money.amount)}`;

    $discountRow.append($discountTitle, $discountAmount);

  }

  // TAX INFO
  const $taxRow = document.createElement("tr");

  const $taxTitle = document.createElement("td");
    $taxTitle.colSpan = 2;
    $taxTitle.textContent = "prepared food tax (included)";

  const $taxAmount = document.createElement("td");
    $taxAmount.id = "checkout-foot-tax";
    $taxAmount.textContent = `$${formatMoney(orderObj.total_tax_money.amount)}`;

  $taxRow.append($taxTitle, $taxAmount);

  // TIP INFO
  const $tipRow = document.createElement("tr");

  const $tipTitle = document.createElement("td");
    $tipTitle.colSpan = 2;
    $tipTitle.textContent = "tip";

  const $tipAmount = document.createElement("td");
    $tipAmount.id = "checkout-foot-tip";
    $tipAmount.textContent = `$${formatMoney(0)}`;

  $tipRow.append($tipTitle, $tipAmount);  

  // TOTAL ROW
  const $totalRow = document.createElement("tr");
    $totalRow.classList.add("highlight");

  const $totalTitle = document.createElement("td");
    $totalTitle.colSpan = 2;
    $totalTitle.textContent = "total";

  const $totalAmount = document.createElement("td");
    $totalAmount.id = "checkout-foot-total";
    $totalAmount.setAttribute("data-total", orderObj.total_money.amount);
    $totalAmount.textContent = `$${formatMoney(orderObj.total_money.amount)}`;

  $totalRow.append($totalTitle, $totalAmount);

  //////////////////////////////////////////////////////////////
  $checkoutTableFooter.prepend($taxRow, $tipRow, $totalRow);
  
  if (discountName && orderObj.total_discount_money.amount > 0) {
    $checkoutTableFooter.prepend($discountRow);
  }
}

const buildSquarePaymentForm = () => {
  const $checkoutContainer = document.querySelector(".checkout-container");
  if ($checkoutContainer) {

    const $sqContainer = document.createElement("div");
      $sqContainer.classList.add("sq-container");

    // TIP FIELD
    const fields = getFields( [ "tip" ] );

    fields.forEach((f) => {
      $sqContainer.append(buildFields("sq", f));
    })

    const $tipDropdown = $sqContainer.querySelector("#tip");
    const tipArr = [ 
      { text: "no tip", value: 0 },
      { text: "10% tip", value: 10 },
      { text: "15% tip", value: 15 },
      { text: "20% tip", value: 20 },
      { text: "25% tip", value: 25 }
    ];
      $tipDropdown.onchange = (e) => {
        const currentTotal = parseInt(document.querySelector("#checkout-foot-total").getAttribute("data-total"));
        const tipPercentage = parseInt(e.target.value);
        const tipAmount = Math.round(currentTotal * (tipPercentage / 100));
        const tipValue = formatMoney(tipAmount);
        // update tip field
        const $tipField = document.querySelector("#checkout-foot-tip");
          $tipField.setAttribute("data-value", tipAmount);
          $tipField.textContent = `$${tipValue}`;
        // update total field
        const $totalField = document.querySelector("#checkout-foot-total");
          $totalField.setAttribute("data-value", (currentTotal + tipAmount));
          $totalField.textContent = `$${formatMoney(currentTotal + tipAmount)}`;
      }

    populateDynamicOptions($tipDropdown, tipArr);

    const $tipWrapper = $sqContainer.querySelector(".sq-table-body-selectwrapper");
      $tipWrapper.append($tipDropdown);

    // GIFT CARD FIELD
    const $giftcardWrapper = document.createElement("div");
      $giftcardWrapper.classList.add("sq-table-body-checkbox-container");
    
    const $giftcardLabel = document.createElement("label");
      $giftcardLabel.classList.add("sq-table-body-checkbox-container-optionblock");
      $giftcardLabel.setAttribute("for", "payment-option");
      $giftcardLabel.textContent = "pay with giftcard";
      
    const $giftcardOption = document.createElement("input");
      $giftcardOption.classList.add("sq-table-body-checkbox-container-optionblock-option");
      $giftcardOption.type = "checkbox";
      $giftcardOption.id = "payment-option";
      $giftcardOption.name = "payment-option";
      $giftcardOption.value = "giftcard";
      $giftcardOption.onchange = (e) => {
        const payWithGiftcard = e.target.checked;
        const $sqForm = document.querySelector(".sq-form");
        const sqFormType = $sqForm.getAttribute("data-card-type");

        if (payWithGiftcard && sqFormType === "sq-creditcard") {
          const $sqForm = document.querySelector(".sq-form");
            $sqForm.remove();
            let currentStore = getCurrentStore();
            const recurring = checkRecurringClubInCart();

            if (currentStore === "merch") {
              const $checkoutTable = document.querySelector(".checkout-table-body");
              const type = $checkoutTable.getAttribute("data-type");
              if (type.includes("ship")) {
                currentStore = "merch-shipping";
              } else if (type.includes("pickup")) {
                currentStore = "merch-pickup";
              }
            }
        
            resetSqForm("giftcard", currentStore, recurring);
        } else if (!payWithGiftcard && sqFormType === "sq-giftcard") {
          const $sqForm = document.querySelector(".sq-form");
            $sqForm.remove();
            let currentStore = getCurrentStore();
            const recurring = checkRecurringClubInCart();

            if (currentStore === "merch") {
              const $checkoutTable = document.querySelector(".checkout-table-body");
              const type = $checkoutTable.getAttribute("data-type");
              if (type.includes("ship")) {
                currentStore = "merch-shipping";
              } else if (type.includes("pickup")) {
                currentStore = "merch-pickup";
              }
            }

            $sqForm.setAttribute("data-card-type", "sq-creditcard");
            resetSqForm("creditcard", currentStore, recurring);
        } 
      }

    const $giftcardCustom = document.createElement("span");
      $giftcardCustom.classList.add("sq-table-body-checkbox-container-optionblock-custom");

    $giftcardLabel.append($giftcardOption, $giftcardCustom);
    $giftcardWrapper.append($giftcardLabel);

    const $sqForm = buildSqForm("creditcard");

    $sqContainer.append($tipWrapper, $giftcardWrapper, $sqForm);
    $checkoutContainer.append($sqContainer);

    let currentStore = getCurrentStore();
    const recurring = checkRecurringClubInCart();
    
    if (currentStore !== "shipping") {
      setDefaultTip();
    }

    if (currentStore === "merch") {
      const $checkoutTable = document.querySelector(".checkout-table-body");
      const type = $checkoutTable.getAttribute("data-type");
      if (type.includes("ship")) {
        currentStore = "merch-shipping";
      } else if (type.includes("pickup")) {
        currentStore = "merch-pickup";
      }
    }

    initPaymentForm("creditcard", currentStore, recurring);

  }
}

const setDefaultTip = () => {
  const $tipDropdown = document.querySelector("#tip");
  if ($tipDropdown) {
    $tipDropdown.value = "20";
    const currentTotal = parseInt(document.querySelector("#checkout-foot-total").getAttribute("data-total"));
    const tipPercentage = 20;
    const tipAmount = Math.round(currentTotal * (tipPercentage / 100));
    const tipValue = formatMoney(tipAmount);
    // update tip field
    const $tipField = document.querySelector("#checkout-foot-tip");
      $tipField.setAttribute("data-value", tipAmount);
      $tipField.textContent = `$${tipValue}`;
    // update total field
    const $totalField = document.querySelector("#checkout-foot-total");
      $totalField.setAttribute("data-value", (currentTotal + tipAmount));
      $totalField.textContent = `$${formatMoney(currentTotal + tipAmount)}`;
  }
}

const buildSqForm = (type) => {
  const $sqForm = document.createElement("div");
      $sqForm.id = "form-container";
      $sqForm.classList.add("sq-form");
      $sqForm.setAttribute("data-card-type", `sq-${type}`);
      
  if (type === "creditcard") {
    const $sqCard = document.createElement("div");
      $sqCard.id = "sq-card-number";
      $sqCard.classList.add("sq-form-field");
  
    const $sqExp = document.createElement("div");
      $sqExp.id = "sq-expiration-date";
      $sqExp.classList.add("sq-form-field", "sq-form-field-third");
  
    const $sqCVV = document.createElement("div");
      $sqCVV.id = "sq-cvv";
      $sqCVV.classList.add("sq-form-field", "sq-form-field-third");
  
    const $sqZip = document.createElement("div");
      $sqZip.id = "sq-postal-code";
      $sqZip.classList.add("sq-form-field", "sq-form-field-third");

    $sqForm.append($sqCard, $sqExp, $sqCVV, $sqZip);

  } else if (type === "giftcard") {
    const $sqGiftcard = document.createElement("div");
      $sqGiftcard.id = "sq-giftcard";
      $sqGiftcard.classList.add("sq-form-field");

    $sqForm.append($sqGiftcard);

  }

  const $sqBtn = document.createElement("button");
    $sqBtn.id = `sq-${type}-btn`;
    $sqBtn.classList.add("sq-form-btn");
    $sqBtn.textContent = "pay";
    $sqBtn.onclick = (e) => {
      onGetCardNonce(e);
    }

  $sqForm.append($sqBtn);
  return $sqForm;
}

const resetSqForm = (type, currentStore, recurring) => {
  const $sqContainer = document.querySelector(".sq-container");
  const $newSqForm = buildSqForm(type);
  $sqContainer.append($newSqForm);
  initPaymentForm(type, currentStore, recurring);
}

const removeSqContainer = () => {
  const $sqContainer = document.querySelector(".sq-container");
  if ($sqContainer) {
    $sqContainer.remove();
  }
}

const onGetCardNonce = (e) => {
  e.preventDefault();
  paymentForm.requestCardNonce();
  buildScreensaver("submitting your payment...");
}

const successfulOrderConfirmation = async (orderInfo) => {

  if (orderInfo.receipt_url) {
    let currentStore = getCurrentStore();

    if (currentStore === "merch") {
      const $checkoutTable = document.querySelector(".checkout-table-body");
      const type = $checkoutTable.getAttribute("data-type");
      if (type.includes("ship")) {
        currentStore = "merchshipping";
      } else if (type.includes("pickup")) {
        currentStore = "merchpickup";
      }
    }

    if (currentStore === "pint-club") {
      // add to club sheet
      await addClubToSheet();
      await removeSqContainer();
      await cart.clear();
      // display thank you message
      const $confirmationMsg = await createConfirmationMsg(currentStore, orderInfo.receipt_url);
      const $checkoutContainer = document.querySelector(".checkout-container");
      $checkoutContainer.append($confirmationMsg);
      // remove screensaver
      removeScreensaver();
    } else {
      // send confirmation email
      const $form = document.querySelector(".checkout-form");
      const formData = await getSubmissionData($form);
      if (formData.addr1) { // form data has address
        const formAddr = `${formData.addr1}, ${formData.city}, ${formData.state}, ${formData.zip}`;
        const formAddr2 = formData.addr2 || null;
        // TODO: collect delivery date on delivery orders
        await sendConfirmationEmail(
          encodeURIComponent(currentStore), // store 
          encodeURIComponent(formData.name), // name
          encodeURIComponent(formData.email), // email
          encodeURIComponent(formAddr), // addr
          encodeURIComponent(formAddr2), // comments
          null, // date
          encodeURIComponent(orderInfo.receipt_url) // receipt
        ); 
        if (currentStore === "shipping") {
          // add to vndr sheet
          await addShippingToSheet();
        }
      } else { // form data does not have address
        // TODO: add pickup date to pickup orders
        let formDate;

        if (currentStore === "delivery") {
          // TODO: get delivery date
          formDate = null;
        } else {
          formDate = prettyPrintDate(formData.pickuptime);
        }
        if (currentStore === "store") {
          await sendStoreText(formData.cell);
        }
        await sendConfirmationEmail(
          encodeURIComponent(currentStore), // store
          encodeURIComponent(formData.name), // name
          encodeURIComponent(formData.email), // email
          null, // addr
          null, // comments
          encodeURIComponent(formDate), // date
          encodeURIComponent(orderInfo.receipt_url) // receipt
        ); 
      }
      // remove sq form
      await removeSqContainer();
      // clear cart
      await cart.clear();
      // display thank you message
      const $confirmationMsg = await createConfirmationMsg(currentStore, orderInfo.receipt_url);
      const $checkoutContainer = document.querySelector(".checkout-container");
      $checkoutContainer.append($confirmationMsg);
      // remove screensaver
      return removeScreensaver();
    }
  } else {
    console.error(orderInfo);
    return makeScreensaverError("something went wrong and your payment was not submitted. try again?");
  }

}

const successfulClubSubscription = async () => {
  // add to club sheet
  await addClubToSheet();
  await removeSqContainer();
  await cart.clear();
  // display thank you message
  const $confirmationMsg = await createSubscriptionMsg();
  const $checkoutContainer = document.querySelector(".checkout-container");
  $checkoutContainer.append($confirmationMsg);
  // remove screensaver
  removeScreensaver();
}

const createCustomer = async (formData) => {
  let params = "";
  for (prop in formData) {
    params += prop + "=" + encodeURIComponent(formData[prop]);
    params += "&";
  }
  const url = `https://script.google.com/macros/s/AKfycbzkPtpjiyo-AQcSTqSs1kj2kF83Pv5NdQvAZk4fd5g_hM2WSnlY3XFkXA/exec?${params}`;
  let resp = await fetch(url);
  let data = await resp.json();
  return data;
}

const sendConfirmationEmail = async (store, name, email, address, comments, date, receipt) => {
  let params = `type=${store}&name=${name}&email=${email}&address=${address}&date=${date}&receipt=${receipt}`;
  if (comments) { params += `&comments=${comments}` };
  const url = `https://script.google.com/macros/s/AKfycbyKNrADv1OBA3jNhu_aqz_zXFxu2CLPpy3FCr6YHhb86C1luHNH7i2d8d97W3jD8dHL4A/exec?${params}`;
  let resp = await fetch(url);
  let data = await resp.json();
  if (!data.sent) {
    console.error(`Email confirmation was NOT sent`);  
  }
  return data.sent;
}

const sendStoreText = async (num) => {
  let params = `num=${num}`;
  // const url = `https://script.google.com/macros/s/AKfycbwvdbl4tEvebI02L5FOnbDhkV1x6n6nAu6QHQO1ZSEJoRA6Z-DTDUAF7vvRWlqV3kUV/exec?${params}`;
  const url = `https://script.google.com/macros/s/AKfycbxI-wm0auSXrNwYMXcuUdFFqHvkeGr9qbpX5YORrLO_ZaoKGoWpF3HrnpOKKNXfo8PF/exec?${params}`;
  let resp = await fetch(url);
  let data = await resp.json();
  if (!data) {
    console.error(`Message was not sent to ${num}`);
  } else if (data.status === "failure") {
    console.error(data.res);
  } else {
    return data.status;
  }
}

const addClubToSheet = async () => {
  const $checkoutForm = document.querySelector(".checkout-form");
  const formData = getSubmissionData($checkoutForm);
  const clubOption = findClubOption();
  const $clubRow = document.querySelector(`[data-id=${clubOption.fp}]`);
  let packData = {}; 
    packData.paymentOption = $clubRow.getAttribute("data-payment-option");
    packData.prepayTerm = $clubRow.getAttribute("data-prepay-term");
    packData.delivery = $clubRow.getAttribute("data-delivery");
    packData.packType = $clubRow.getAttribute("data-customizations");
    packData.allergies = $clubRow.getAttribute("data-allergies");

  const allData = { ...formData, ...packData };
  let params = "?";
  for (prop in allData) {
    if (allData[prop]) {
      params += `${prop}=${encodeURIComponent(allData[prop])}&`;
    }
  }
  const url = `https://script.google.com/macros/s/AKfycbzkPtpjiyo-AQcSTqSs1kj2kF83Pv5NdQvAZk4fd5g_hM2WSnlY3XFkXA/exec${params}`;
  let resp = await fetch(url, { method: "POST", mode: "no-cors" });
  // let data = await resp.json();
  // console.log(data);
  return resp;
}

const addShippingToSheet = async () => {
  const $checkoutForm = document.querySelector(".checkout-form");
  let formData = getSubmissionData($checkoutForm);
  let packInfo = "";
  cart.shipping_quantities.forEach((q) => {
    const readable = getReadableModList(q);
    readable.forEach((r) => {
      packInfo += `${r.quantity} ${r.name}, `; 
    })
  });
  formData.packInfo = packInfo.slice(0, -2);
  formData.quantity = cart.totalItems();

  let params = "?";
  for (prop in formData) {
    if (formData[prop]) {
      params += `${prop}=${encodeURIComponent(formData[prop])}&`;
    }
  }
  const url = `https://script.google.com/macros/s/AKfycbw2hxnOxw7J5oCwnRYDK2zSJVZRKlEed279NtfflnArDCcQmZHvMJ3rJh3Biwa6VHxu/exec${params}`;
  let resp = await fetch(url, { method: "POST", mode: "no-cors" });
  // let data = await resp.json();
  // console.log(data);
  return resp;
}

const createConfirmationMsg = (store, receiptUrl) => {
  const $thankYouContainer = document.createElement("div");
    $thankYouContainer.classList.add("checkout-confirmed");

  const $thankYouMsg = document.createElement("p");
    $thankYouMsg.classList.add("checkout-confirmed-message");
    $thankYouMsg.textContent = window.labels[`${store}_thankyou`] || "thank you for placing an order! (:";

  const $btnContainer = document.createElement("div");
    $btnContainer.classList.add("checkout-confirmed-btnContainer");

  const $phoneBtn = document.createElement("a");
    $phoneBtn.id = "phone-btn";
    $phoneBtn.classList.add("checkout-confirmed-btnContainer-btn", "btn-rect");
    $phoneBtn.textContent = window.labels.phone || "(801)244-1991";
    $phoneBtn.href = `sms://+1${cleanName(window.labels.phone)}/`;

  const $receiptBtn = document.createElement("a");
    $receiptBtn.id = "receipt-btn";
    $receiptBtn.classList.add("checkout-confirmed-btnContainer-btn", "btn-rect");
    $receiptBtn.textContent = "show receipt";
    $receiptBtn.href = receiptUrl;
    $receiptBtn.target = "_blank";

  $btnContainer.append($phoneBtn, $receiptBtn);
  $thankYouContainer.append($thankYouMsg, $btnContainer);

  return $thankYouContainer;

}

const createSubscriptionMsg = () => {
  const $thankYouContainer = document.createElement("div");
    $thankYouContainer.classList.add("checkout-confirmed");

  const $thankYouMsg = document.createElement("p");
    $thankYouMsg.classList.add("checkout-confirmed-message");
    $thankYouMsg.textContent = window.labels[`pint-club_thankyou`] || "thank you for placing an order! (:";

  const $monthlyMsg = document.createElement("p");
    $monthlyMsg.classList.add("checkout-confirmed-message");
    $monthlyMsg.textContent = window.labels[`pint-club_monthlysub`] || 
    "you'll also be receiving your first invoice via email! after you pay the first one, your card on file will be auto-charged monthly. let us know if you have questions!";

  const $btnContainer = document.createElement("div");
    $btnContainer.classList.add("checkout-confirmed-btnContainer");

  const $phoneBtn = document.createElement("a");
    $phoneBtn.id = "phone-btn";
    $phoneBtn.classList.add("checkout-confirmed-btnContainer-btn", "btn-rect");
    $phoneBtn.textContent = window.labels.phone || "(801)244-1991";
    $phoneBtn.href = `sms://+1${cleanName(window.labels.phone)}/`;

  const $emailBtn = document.createElement("a");
    $emailBtn.id = "email-btn";
    $emailBtn.classList.add("checkout-confirmed-btnContainer-btn", "btn-rect");
    $emailBtn.textContent = window.labels.email || "hi@normal.club";
    $emailBtn.href = `mailto:${window.labels.email}?subject=so about monthly pint club...` || "mailto:hi@normal.club?subject=so about monthly pint club...";

  $btnContainer.append($phoneBtn, $emailBtn);
  $thankYouContainer.append($thankYouMsg, $monthlyMsg, $btnContainer);

  return $thankYouContainer;
}

/*==========================================================
SCREENSAVER
==========================================================*/
const buildScreensaver = (message) => {
  const $main = document.querySelector("main");
  const mainTheme = getMainTheme();

  const $screensaver = document.createElement("section");
    $screensaver.classList.add("screensaver", mainTheme);

  const $message = document.createElement("h2");
    $message.classList.add("screensaver-message");
    $message.textContent = message;
  
  const $logoContainer = document.createElement("div");
    $logoContainer.classList.add("screensaver-logocontainer")
    $logoContainer.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-normal">
    <use href="/icons.svg#normal"></use>
  </svg>`;
    
  $screensaver.append($message, $logoContainer);

  $main.append($screensaver);
}

const removeScreensaver = () => {
  const $screensaver = document.querySelector(".screensaver");
  if ($screensaver) {
    $screensaver.remove();
  }
}

const makeScreensaverError = (error) => {
  const $screensaver = document.querySelector(".screensaver");
  if ($screensaver) {
    $screensaver.classList.add("theme-error");
    const $message = document.querySelector(".screensaver-message");
      $message.textContent = error;
    const $refreshBtn = document.createElement("button");
      $refreshBtn.classList.add("screensaver-btn");
      $refreshBtn.textContent = "refresh the page";
      $refreshBtn.onclick = (e) => {
        location.reload();
      }
    $screensaver.append($refreshBtn);
  }
}

/*==========================================================
HEADER
==========================================================*/
const makeCartClickable = () => {
  const $headerCart = document.querySelector(".header-cart");
  if ($headerCart) {
    $headerCart.onclick = (e) => {
      const currentStore = getCurrentStore();
      updateCart();
      if (currentStore === "merch") {
        showMerchCheckout();
      } else {
        showCheckoutTool();
      }
      const $sqContainer = document.querySelector(".sq-container");
      if ($sqContainer) { $sqContainer.remove() };
      const $checkoutConfirmed = document.querySelector(".checkout-confirmed");
      if ($checkoutConfirmed) { $checkoutConfirmed.remove() };
    }
  }

}

const hideCart = () => {
  const $headerCart = document.querySelector(".header-cart");
  if ($headerCart) {
    $headerCart.classList.add("hide");
  }
}

const setCartTotal = () => {
  const $headerText = document.querySelector(".header-cart-text");
  if ($headerText) { 
    cart.load();
    const totalItems = cart.totalItems();
    if (totalItems == parseInt(totalItems)) {
      $headerText.textContent = cart.totalItems() || 0;
    } else {
      cart.clear();
      $headerText.textContent = 0;
    }
  }
};

/*==========================================================
FOOTER
==========================================================*/
const updateCopyright = () => {
  // update copyright year in footer
  const date = new Date();
  const year = date.getFullYear();
  const $footer = document.querySelector("footer > div");
  if (year > 2021) {
    $footer.textContent += ` - ${year}`;
  }
};

/*==========================================================
UTILITIES
==========================================================*/
const cleanName = (str) => {
  if (str) {
    const clean = str
      .split(" ").join("") // remove spaces
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, ""); // replace non alpha-numeric
      return clean;
  }
};

const makeArr = (str) => {
  if (str) {
    if (str.includes(",")) {
      return str.split(",");
    } else {
      return [ str ];
    }
  }
}

const removeStorefrontName = (str) => {
  if (str) {
    const clean = str.toLowerCase().replace(/store|lab|delivery|merch/g, "");
    return clean;
  }
}

const getMainTheme = () => {
  const $body = document.querySelector("body");
  const classList = [ ...$body.classList ];
  if (classList.includes("theme")) {
    if (classList[classList.length - 1].includes("theme-")) {
      return classList[classList.length - 1];
    } else {
      return "theme-white"
    }
  }
  return "theme-white";
}

const getComplementHex = () => {
  const mainColor = getMainTheme().split("theme-")[1];
  let complement;
  switch (mainColor) {
    case "white":
      complement = "blue";
      break;
    case "yellow":
      complement = "green";
      break;
    case "pink":
      complement = "red";
      break;
    case "bluepink":
      complement = "white";
      break;
    case "bluewhite":
      complement = "pink";
      break;
    default:
      complement = "blue";
      break;
  }
  return getComputedStyle(document.documentElement).getPropertyValue(`--${complement}`).trim();
}

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const formatMoney = (num) => {
  return Number(num / 100).toFixed(2);
}

const prettyPrintDate = (date) => {
  const dateObj = new Date(date);
  const months = [ 
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" 
  ];
  const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];

  const day = days[dateObj.getDay()];
  const month = months[dateObj.getMonth()];
  const dayNum = dateObj.getDate();

  const hour = dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const period = dateObj.getHours() < 12 ? "am" : "pm";

  return `${day}, ${month} ${dayNum} @ ${hour}:${minutes}${period}`;
}

/* from underscore.js */
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) { func.apply(context, args) };
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) { func.apply(context, args) };
  };
}

/*==========================================================
LEGACY
==========================================================*/

var cart = {
  line_items: [],
  shipping_quantities: [],
  shipping_item: {},
  remove: (fp) => {
    var index = cart.line_items.findIndex((li) => fp == li.fp);
    cart.line_items.splice(index, 1);
    cart.store();
  },
  removeShipping: () => {
    cart.shipping_item = {};
  },
  removeShippingQuantity: (fp) => {
    var index = cart.shipping_quantities.findIndex((sq) => fp === sq.fp);
    cart.shipping_quantities.splice(index, 1);
    cart.store();
  },
  add: (variation, mods) => {
    if (!mods) { mods = []; }
    var li = cart.find(variation, mods);
    if (li) {
      li.quantity++;
    } else {
      var fp = variation;
      var price =
        catalog.byId[variation].item_variation_data.price_money.amount;
      mods.forEach((m) => {
        fp += "-" + m;
        price += catalog.byId[m].modifier_data.price_money.amount;
      });
      cart.line_items.push({
        fp: fp,
        variation: variation,
        mods: mods,
        quantity: 1,
        price: price,
      });
    }
    cart.store();
  },
  addShipping: (variation) => {
    var fp = variation;
    var price = catalog.byId[variation].item_variation_data.price_money.amount;
    cart.shipping_item = {
      fp: fp,
      variation: variation,
      mods: [],
      quantity: 1,
      price: price,
    };
  },
  addShippingQuantities: (obj) => {
    cart.shipping_quantities.push(obj);
    cart.store();
  },
  find: (variation, mods) => {
    var fp = variation;
    mods.forEach((m) => {
      fp += "-" + m;
    });
    return cart.line_items.find((li) => fp === li.fp);
  },
  setQuantity: (fp, q) => {
    var index = cart.line_items.findIndex((li) => fp == li.fp);
    cart.line_items[index].quantity = q;
    cart.store();
  },
  totalAmount: () => {
    const currentStore = getCurrentStore();
    var total = 0;
    cart.line_items.forEach((li) => {
      if (li.quantity > 0) {
        total += li.price * li.quantity;
      }
    });
    return total;
  },
  totalAmountWithShipping: () => {
    let total = cart.totalAmount();
    if (cart.shipping_item.price) {
      total += cart.shipping_item.price;
    }
    return total;
  },
  totalItems: () => {
    var total = 0;
    cart.line_items.forEach((li) => {
      // don't count out-of-stock
      if (li.quantity) {
        total += li.quantity;
      }
    });
    return total;
  },
  clear: () => {
    cart.line_items = [];
    cart.shipping_quantities = [];
    cart.shipping_item = {};
    cart.store();
  },
  store: () => {
    const currentStore = getCurrentStore();
    let cartObj = {
      lastUpdate: new Date(),
      line_items: cart.line_items
    };
    if (cart.shipping_quantities && currentStore === "shipping") {
      cartObj.shipping_quantities = cart.shipping_quantities
    }
    localStorage.setItem("cart-" + currentStore, JSON.stringify(cartObj));
  },
  load: () => {
    
    var cartObj = JSON.parse(localStorage.getItem("cart-" + getLastStore()));
    cart.line_items = [];
    cart.shipping_quantities = [];

    if (cartObj && cartObj.line_items) {
      // validate
      cartObj.line_items.forEach((li) => {
        if (catalog.byId[li.variation]) {
          var push = true;
          li.mods.forEach((m) => {
            if (!catalog.byId[m]) { push = false };
          });
          if (push) { cart.line_items.push(li) };
        }
      });
    }

    if (cartObj && cartObj.shipping_quantities) {
      cartObj.shipping_quantities.forEach((sq) => {
        cart.shipping_quantities.push(sq);
      })
    }

  }
};

function indexCatalog(sqCatalog) {
  catalog = {
    byId: {},
    items: [],
    categories: [],
    discounts: {},
  };

  sqCatalog.forEach((e) => {
    if (!catalog.byId[e.id]) catalog.byId[e.id] = e;

    if (e.type == "ITEM") {
      catalog.items.push(e);
      if (e.item_data.variations)
        e.item_data.variations.forEach((v) => {
          catalog.byId[v.id] = v;
        });
    }
    if (e.type == "MODIFIER_LIST") {
      if (e.modifier_list_data.modifiers)
        e.modifier_list_data.modifiers.forEach((m) => {
          m.modifier_data.modifier_list_id = e.id;
          catalog.byId[m.id] = m;
        });
    }
    if (e.type == "DISCOUNT") {
      if (e.discount_data.name) {
        catalog.discounts[e.discount_data.name.toLowerCase()] = { id: e.id };
      }
    }
    if (e.type == "CATEGORY") {
      catalog.categories.push(e);
    }
  });
} 

function addToCart(e) {
  var id = e.getAttribute("data-id");
  if (id) {
    var obj = catalog.byId[id];
    if (obj.type === "ITEM") {
      if (
        obj.item_data.modifier_list_info ||
        obj.item_data.variations.length > 1
      ) {
        configItem(obj);
      } else {
        cart.add(obj.item_data.variations[0].id);
        updateCart();
      }
    } else {
      cart.add(obj.id);
      updateCart();
    }
  }
}

const addShippingToCart = (id) => {
  const obj = catalog.byId[id];
  cart.addShipping(obj.id);
  updateCart();
}

function addConfigToCart(formData) {
  let variation;
  let mods = [];

  for (const key in formData) {
    if (!variation) {
      variation = formData[key];
    } else if (typeof formData[key] === "object") {
      // push all checkboxes
      formData[key].forEach((k) => {
        mods.push(k);
      });
    } else {
      mods.push(formData[key]);
    }
  }
  cart.add(variation, mods);
  updateCart();
}

function configItem(item) {
  const itemName = item.item_data.name;
  const store = getCurrentStore();

  if (store === "shipping") {
    populateCustomizationToolShipping(`build your ${itemName.trim()} pack`, item);
  } else {
    populateCustomizationToolSquare(`customize your ${removeStorefrontName(itemName).trim()}`, item);
    customizeToolforStore();
  }
}

function generateId() {
  var id = "";
  var chars = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = 0; i < 4; i++) {
    id += chars[randomNum(0, chars.length - 1)];
  }
  return id;
}

let paymentForm; // TODO: find a way to NOT globalize these
let orderObj; // TODO: find a way to NOT globalize these

function initPaymentForm(paymentType, currentStore, recurring) {
  const credentials = getStorefrontCheckoutCred(currentStore);

  if (paymentType === "creditcard" && !recurring) { //submit order with credit card
    // console.log(`creating PAYMENT form for credit card`);

    // Create and initialize a payment form object for CREDITCARD
    paymentForm = new SqPaymentForm({
      // Initialize the payment form elements

      applicationId: "sq0idp-q-NmavFwDX6MRLzzd5q-sg", // production
      // applicationId: "sandbox-sq0idb-507QVzPRaOnfhedziBERcg", // sandbox
      locationId: credentials.locationId,
      inputClass: "sq-input",
      autoBuild: false,
      // Customize the CSS for SqPaymentForm iframe elements
      inputStyles: [
        {
          fontFamily: "monospace",
          fontSize: "20px",
          lineHeight: "40px",
          padding: "10px 40px",
          placeholderColor: getComplementHex(),
          color: getComplementHex(),
          backgroundColor: "transparent",
        },
      ],
      // Initialize the credit card placeholders
      cardNumber: {
        elementId: "sq-card-number",
        placeholder: "card number",
      },
      cvv: {
        elementId: "sq-cvv",
        placeholder: "cvv",
      },
      expirationDate: {
        elementId: "sq-expiration-date",
        placeholder: "mm/yy",
      },
      postalCode: {
        elementId: "sq-postal-code",
        placeholder: "zip",
      },
      // SqPaymentForm callback functions
      callbacks: {
        /*
        * callback function: cardNonceResponseReceived
        * Triggered when: SqPaymentForm completes a card nonce request
        */
        cardNonceResponseReceived: function (errors, nonce, cardData) {

          if (errors) {
            // Log errors from nonce generation to the browser developer console.
            console.error("Encountered errors:");
            errors.forEach(function (error) {
              alert(error.message);
              console.error("> " + error.message);
            });
            // submittingPayment = false;
            return;
          }

          const tipAmount = document.querySelector("#checkout-foot-tip").getAttribute("data-value") || 0;

          const qs = `nonce=${encodeURIComponent(nonce)}` + 
            `&order_id=${encodeURIComponent(orderObj.id)}` + 
            `&reference_id=${encodeURIComponent(orderObj.reference_id)}` + 
            `&order_amount=${orderObj.total_money.amount}` + 
            `&tip_amount=${tipAmount}` + 
            `&locationId=${credentials.locationId}`;

          const thisFetch = fetch(credentials.endpoint + "?" + qs, {
            method: "GET",
            headers: {
              Accept: "application/json"
            }
          })
          .catch((error) => {
            console.error(error);
            return makeScreensaverError("something went wrong and your payment didn't go through. try again?")
          })
          .then((resp) => {
            if (!resp.ok) {
              return resp.text().then((errorInfo) => { Promise.reject(errorInfo) });
            }
            return resp.text();
          })
          .then((data) => {
            const obj = JSON.parse(data);

            if (typeof obj.errors != "undefined") { // failure of any kind
              makeScreensaverError("payment declined");
              console.error(obj.errors);
              switch (obj.errors[0]) {
                case "PAYMENT_METHOD_ERROR":
                  alert("payment declined. please check your info.");
                  break;
                case "PAN_FAILURE":
                  alert("payment declined. please check your card number.");
                  break;
                case "CVV_FAILURE":
                  alert("payment declined. please check your cvv.");
                  break;
                case "VOICE_FAILURE":
                  alert("payment declined because issuer requires voice authorization. please try a different card.");
                  break;
                case "TRANSACTION_LIMIT":
                  alert("payment declined because issuer limit has been exceeded. please try a different card.");
                  break;
                default:
                  alert("payment declined. please try a different card.");
                  break;
              }
              removeScreensaver();
            } else {
              successfulOrderConfirmation(obj.payment);
            }
          })
        }
      }
    });

  } else if (paymentType === "giftcard" && !recurring) { // submit order with gift card
    // console.log(`creating PAYMENT form for gift card`);

    // Create and initialize a payment form object for GIFTCARD
    paymentForm = new SqPaymentForm({
      // Initialize the payment form elements
      applicationId: "sq0idp-q-NmavFwDX6MRLzzd5q-sg", // production
      // applicationId: "sandbox-sq0idb-507QVzPRaOnfhedziBERcg", // sandbox
      locationId: credentials.locationId,
      inputClass: "sq-input",
      // Initialize the gift card placeholders
      giftCard: {
        elementId: "sq-giftcard",
        placeholder: "**** **** **** ****"
      },
      // Customize the CSS for SqPaymentForm iframe elements
      inputStyles: [
        {
          fontFamily: "monospace",
          fontSize: "20px",
          lineHeight: "40px",
          padding: "10px 40px",
          placeholderColor: getComplementHex(),
          color: getComplementHex(),
          backgroundColor: "transparent",
        },
      ],
      // SqPaymentForm callback functions
      callbacks: {
        /*
        * callback function: cardNonceResponseReceived
        * Triggered when: SqPaymentForm completes a card nonce request
        */
        cardNonceResponseReceived: function (errors, nonce, paymentData, contacts) {

          if (errors) {
            // Log errors from nonce generation to the browser developer console.
            console.error("Encountered errors:");
            errors.forEach(function (error) {
              alert(error.message);
              console.error("> " + error.message);
            });
            removeScreensaver();
            return;
          }

          const tipAmount = document.querySelector("#checkout-foot-tip").getAttribute("data-value") || 0;

          const qs = `nonce=${encodeURIComponent(nonce)}` + 
            `&order_id=${encodeURIComponent(orderObj.id)}` + 
            `&reference_id=${encodeURIComponent(orderObj.reference_id)}` + 
            `&order_amount=${orderObj.total_money.amount}` + 
            `&tip_amount=${tipAmount}` + 
            `&locationId=${credentials.locationId}`;

          const thisFetch = fetch(credentials.endpoint + "?" + qs, {
            method: "GET",
            headers: {
              Accept: "application/json"
            }
          })
          .catch((error) => {
            console.error(error);
            return makeScreensaverError("something went wrong and your payment didn't go through. try again?")
          })
          .then((resp) => {
            if (!resp.ok) {
              return resp.text().then((errorInfo) => { Promise.reject(errorInfo) });
            }
            return resp.text();
            // TODO: handle incomplete gift card payments, collect additional card info
          })
          .then((data) => {
            const obj = JSON.parse(data);

            if (typeof obj.errors != "undefined") { // failure of any kind
              makeScreensaverError("payment declined");
              console.error(obj.errors);
              alert("gift card declined. please try a different card.");
              removeScreensaver();
            } else {
              successfulOrderConfirmation(obj.payment);
            }
          })


        }
      }
    });

  } else if (paymentType === "creditcard" && recurring) { // submit card to customer with credit card
    // console.log(`creating CARD NONCE form for credit card`);

    // Create and initialize a payment form object for CREDITCARD
    paymentForm = new SqPaymentForm({
      // Initialize the payment form elements

      applicationId: "sq0idp-q-NmavFwDX6MRLzzd5q-sg", // production
      // applicationId: "sandbox-sq0idb-507QVzPRaOnfhedziBERcg", // sandbox
      locationId: credentials.locationId,
      inputClass: "sq-input",
      autoBuild: false,
      // Customize the CSS for SqPaymentForm iframe elements
      inputStyles: [
        {
          fontFamily: "monospace",
          fontSize: "20px",
          lineHeight: "40px",
          padding: "10px 40px",
          placeholderColor: getComplementHex(),
          color: getComplementHex(),
          backgroundColor: "transparent",
        },
      ],
      // Initialize the credit card placeholders
      cardNumber: {
        elementId: "sq-card-number",
        placeholder: "card number",
      },
      cvv: {
        elementId: "sq-cvv",
        placeholder: "cvv",
      },
      expirationDate: {
        elementId: "sq-expiration-date",
        placeholder: "mm/yy",
      },
      postalCode: {
        elementId: "sq-postal-code",
        placeholder: "zip",
      },
      // SqPaymentForm callback functions
      callbacks: {
        /*
        * callback function: cardNonceResponseReceived
        * Triggered when: SqPaymentForm completes a card nonce request
        */
        cardNonceResponseReceived: function (errors, nonce, cardData) {

          if (errors) {
            // Log errors from nonce generation to the browser developer console.
            console.error("Encountered errors:");
            errors.forEach(function (error) {
              alert(error.message);
              console.error("> " + error.message);
            });
            // submittingPayment = false;
            return;
          }

          const url = `https://script.google.com/macros/s/AKfycbzkPtpjiyo-AQcSTqSs1kj2kF83Pv5NdQvAZk4fd5g_hM2WSnlY3XFkXA/exec`
          const customerId = document.querySelector("#name").getAttribute("data-id");

          const qs = `nonce=${nonce}` + 
            `&id=${encodeURIComponent(customerId)}`;

          const thisFetch = fetch(url + "?" + qs, {
            method: "GET",
            headers: {
              Accept: "application/json"
            }
          })
          .catch((error) => {
            console.error(error);
            return makeScreensaverError("something went wrong and your payment didn't go through. try again?")
          })
          .then((resp) => {
            if (!resp.ok) {
              return resp.text().then((errorInfo) => { Promise.reject(errorInfo) });
            }
            return resp.text();
          })
          .then((data) => {
            const obj = JSON.parse(data);

            if (typeof obj.errors != "undefined") { // failure of any kind
              makeScreensaverError("payment declined");
              console.error(obj.errors);
              switch (obj.errors[0]) {
                case "PAYMENT_METHOD_ERROR":
                  alert("payment declined. please check your info.");
                  break;
                case "PAN_FAILURE":
                  alert("payment declined. please check your card number.");
                  break;
                case "CVV_FAILURE":
                  alert("payment declined. please check your cvv.");
                  break;
                case "VOICE_FAILURE":
                  alert("payment declined because issuer requires voice authorization. please try a different card.");
                  break;
                case "TRANSACTION_LIMIT":
                  alert("payment declined because issuer limit has been exceeded. please try a different card.");
                  break;
                default:
                  alert("payment declined. please try a different card.");
                  break;
              }
              removeScreensaver();
            } else {
              addClubToSheet();
              successfulClubSubscription();
            }
          })
        }
      }
    });
    
  } else if (paymentType === "giftcard" && recurring) {
    // console.log(`creating CARD NONCE form for gift card`);

    // Create and initialize a payment form object for GIFTCARD
    paymentForm = new SqPaymentForm({
      // Initialize the payment form elements
      applicationId: "sq0idp-q-NmavFwDX6MRLzzd5q-sg", // production
      // applicationId: "sandbox-sq0idb-507QVzPRaOnfhedziBERcg", // sandbox
      locationId: credentials.locationId,
      inputClass: "sq-input",
      // Initialize the gift card placeholders
      giftCard: {
        elementId: "sq-giftcard",
        placeholder: "**** **** **** ****"
      },
      // Customize the CSS for SqPaymentForm iframe elements
      inputStyles: [
        {
          fontFamily: "monospace",
          fontSize: "20px",
          lineHeight: "40px",
          padding: "10px 40px",
          placeholderColor: getComplementHex(),
          color: getComplementHex(),
          backgroundColor: "transparent",
        },
      ],
      // SqPaymentForm callback functions
      callbacks: {
        /*
        * callback function: cardNonceResponseReceived
        * Triggered when: SqPaymentForm completes a card nonce request
        */
        cardNonceResponseReceived: function (errors, nonce, paymentData, contacts) {

          if (errors) {
            // Log errors from nonce generation to the browser developer console.
            console.error("Encountered errors:");
            errors.forEach(function (error) {
              alert(error.message);
              console.error("> " + error.message);
            });
            removeScreensaver();
            return;
          }

          const url = `https://script.google.com/macros/s/AKfycbzkPtpjiyo-AQcSTqSs1kj2kF83Pv5NdQvAZk4fd5g_hM2WSnlY3XFkXA/exec`
          const customerId = document.querySelector("#name").getAttribute("data-id");

          const qs = `nonce=${nonce}` + 
            `&id=${encodeURIComponent(customerId)}`;

          const thisFetch = fetch(url + "?" + qs, {
            method: "GET",
            headers: {
              Accept: "application/json"
            }
          })
          .catch((error) => {
            console.error(error);
            return makeScreensaverError("something went wrong and your payment didn't go through. try again?")
          })
          .then((resp) => {
            if (!resp.ok) {
              return resp.text().then((errorInfo) => { Promise.reject(errorInfo) });
            }
            return resp.text();
            // TODO: handle incomplete gift card payments, collect additional card info
          })
          .then((data) => {
            const obj = JSON.parse(data);

            if (typeof obj.errors != "undefined") { // failure of any kind
              makeScreensaverError("payment declined");
              console.error(obj.errors);
              alert("gift card declined. please try a different card.");
              removeScreensaver();
            } else {
              addClubToSheet();
              successfulClubSubscription();
            }
          })
        }
      }
    });
  }

  return paymentForm.build();
}

/*==========================================================
INIT
==========================================================*/

window.onload = async (e) => {

  await fetchLabels();
  const sqCatalog = await fetchCatalog();
  await indexCatalog(sqCatalog); // legacy

  // make page useable
  await classify();
  await codify();

  lazyLoad();

  setPage();  
  buildCollapsableStarbursts();
  buildLinkStarbursts();
  buildStaticStarbursts();
  buildCheckoutTool(); // needs to be on all the pages
  
  // setup header
  setCartTotal();
  makeCartClickable();
  
  buildBackToTopBtn();
  updateCopyright();
};

window.onscroll = showBackToTopBtn;
window.onresize = resetCarousels;
