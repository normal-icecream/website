import {
  createEl,
  createSVG,
  buildBlock,
  buildGScriptLink,
  buildGQs,
  loadCSS,
  noScroll,
} from '../../scripts/scripts.js';

import {
  buildTitle,
} from '../../blocks/index/index.js';

import {
  buildOrderParams,
} from '../../utils/square/square.js';

import {
  buildForm,
  getSubmissionData,
  validateForm,
  getFromLocalStorage,
  saveToLocalStorage,
} from '../../utils/forms/forms.js';

import {
  buildScreensaver,
  // makeScreensaverError,
  // removeScreensaver,
} from '../../utils/screensaver/screensaver.js';

const WHOLESALE_KEY = 'AKfycbzrxcKi-uFAyufJw5uWdcwkj0w1aA6PKasQ2agsdAMw4m8yq9D5GLQ-3BjaU8ocexEiwg';

function buildBackBtn(menu) {
  menu.classList.add('relative');
  const btn = createEl('aside', {
    class: 'btn btn-back btn-order',
    text: 'back to options',
  });
  const arrow = createSVG('arrow-left');
  btn.append(arrow);
  btn.addEventListener('click', () => {
    menu.classList.add('order-hide');
    const html = document.querySelector('html');
    html.classList.remove('order-selected-pickup', 'order-selected-delivery');
    const mainMenu = document.querySelector('.order-menu');
    mainMenu.classList.remove('order-hide');
    btn.remove();
  });
  menu.prepend(btn);
}

function menuClick(e) {
  const target = e.target.closest('.order-menu-btn').getAttribute('data-target');
  const menu = document.querySelector('.order-menu');
  menu.classList.add('order-hide');
  const targetMenu = document.querySelector(`.order-${target}`);
  buildBackBtn(targetMenu);
  const html = document.querySelector('html');
  html.classList.add(`order-selected-${target}`);
  targetMenu.classList.remove('order-hide');
}

function buildMenu(block) {
  const pickup = block.firstChild.firstChild;
  pickup.classList.add('order-menu-btn');
  pickup.setAttribute('data-target', 'pickup');
  pickup.addEventListener('click', menuClick);
  const delivery = block.firstChild.lastChild;
  delivery.classList.add('order-menu-btn');
  delivery.setAttribute('data-target', 'delivery');
  delivery.addEventListener('click', menuClick);
}

async function fetchWholesaleData() {
  if (!window.wholesaleData) {
    const url = buildGScriptLink(WHOLESALE_KEY);
    const resp = await fetch(url);
    if (resp.ok) {
      const json = await resp.json();
      window.wholesaleData = json;
    }
  }
  return window.wholesaleData;
}

async function buildWholesaleForm(table) {
  const tempForm = createEl('form');
  await buildForm(tempForm, ['business', 'address', 'contact']);
  setTimeout(async () => {
    [...tempForm.children].forEach(async (field) => {
      const row = createEl('tr', {
        html: `<td colspan="3" class="wholesale-input">
            ${field.getAttribute('data-category') === 'address'
    ? field.outerHTML.replace('your', 'your business')
    : field.outerHTML}
          </td>`,
      });
      table.append(row);
    });

    // rearrange addr, VERY HACKY
    const city = table.querySelector('input#city').parentNode;
    const state = table.querySelector('input#state').parentNode;
    const zip = table.querySelector('input#zip').parentNode;

    const newRow = createEl('tr', {
      html: `<td class="wholesale-input">${city.innerHTML}</td>
        <td class="wholesale-input">${state.innerHTML}</td>
        <td class="wholesale-input">${zip.innerHTML}</td>`,
    });

    city.parentNode.replaceWith(newRow);
    city.remove();
    state.parentNode.remove();
    zip.parentNode.remove();

    const data = await fetchWholesaleData();
    Object.keys(data).forEach((key) => {
      const typeHead = createEl('tr', {
        html: `<td>${key.replace('Case', '')}</td>
          <td>In Stock</td>
          <td>Quantity</td>`,
        class: 'wholesale-type-heading',
      });
      table.append(typeHead);
      data[key].forEach((item) => {
        const row = createEl('tr', {
          html: `<td>${item.item} ${item.type}</td>
            <td>${item.remaining}</td>
            <td class="wholesale-input">
              <input type="number" value="0" min="0" max="${item.remaining}" step="1" id="${item.id}" name="${item.id}" data-name="${item.item}" data-type="${item.type}" class="wholesale-input-quantity" />
            </td>`,
        });
        table.append(row);
      });
    });
    getFromLocalStorage(table);
  }, 400); // VERY HACKY
}

function openWholesaleForm() {
  const wholesale = document.querySelector('.wholesale-form-container');
  if (wholesale) {
    wholesale.setAttribute('aria-expanded', true);
    document.querySelector('body').classList.add('no-scroll');
    window.addEventListener('scroll', noScroll);
    const form = wholesale.querySelector('.wholesale-form');
    if (form) {
      form.classList.remove('form-hide');
    }
  }
}

function closeWholesaleForm() {
  const wholesale = document.querySelector('.wholesale-form-container');
  if (wholesale) {
    wholesale.setAttribute('aria-expanded', false);
    document.querySelector('body').classList.remove('no-scroll');
    window.removeEventListener('scroll', noScroll);
    const form = wholesale.querySelector('.wholesale-form');
    if (form) {
      form.classList.add('form-hide');
    }
  }
}

async function postWholesaleOrder(data) {
  const params = await buildOrderParams(data);
  const qs = buildGQs(params);
  // const url = buildGScriptLink(WHOLESALE_KEY);
  console.log('qs:', qs);
  // const orderConfirmation = await fetch(`${url}?${qs}`, {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //   },
  // })
  //   .catch((error) => {
  //     // eslint-disable-next-line no-console
  //     console.error(error);
      // return makeScreensaverError('something went wrong and your order didn\'t go through. try again?');
  //   })
  //   .then((resp) => {
  //     if (!resp.ok) {
  //       return resp.text().then((errorInfo) => { Promise.reject(errorInfo); });
  //     }
  //     return resp.text();
  //   }).then((text) => {
  //     const obj = JSON.parse(text);
  //     console.log('obj:', obj);
  //     // if (typeof obj.order !== 'undefined') {
  //     //   return obj.order;
  //     // }
  //     // eslint-disable-next-line no-console
  //     console.error('errors:', data);
      return makeScreensaverError('something went wrong and your order didn\'t go through. try again?');
  //   });
  // return orderConfirmation;
}

async function submitWholesaleOrder() {
  // validate submission
  const form = document.querySelector('table.wholesale-table');
  const valid = validateForm(form);
  if (valid) {
    // show screensaver
    buildScreensaver('placing your wholesale order...');
    // get submission data
    const data = getSubmissionData(form);
    saveToLocalStorage(form);
    console.log('form data:', data);
    // submit order
    const order = await postWholesaleOrder(data);
    console.log('order:', order);
  }
  // update wholesale form
}

function setupWholesaleForm(a, main) {
  a.removeAttribute('href');
  a.classList.add('btn', 'btn-rect', 'btn-cart');
  a.addEventListener('click', openWholesaleForm);
  // build block
  if (!main.querySelector('.checkout')) {
    const wholesaleForm = buildBlock('checkout', {
      elems: [
        '<aside class="btn btn-back">back to wholesale',
        '<div class="checkout-head wholesale-head"><h2>your wholesale order',
        '<table class="checkout-table wholesale-table"><tbody class="checkout-table-body wholesale-table-body"><tfoot class="checkout-table-foot wholesale-table-foot">',
        '<div class="checkout-foot wholesale-foot"><a class="btn btn-rect">',
      ],
    });
    wholesaleForm.classList.add('wholesale-checkout');
    // populate form
    const table = wholesaleForm.querySelector('table.wholesale-table > tbody');
    buildWholesaleForm(table);
    // setup close btn
    const closeBtn = wholesaleForm.querySelector('aside.btn');
    closeBtn.addEventListener('click', closeWholesaleForm);
    const wrapper = createEl('div', {
      class: 'section-wrapper checkout-container wholesale-form-container',
    });
    // setup place order btn
    const submitBtn = wholesaleForm.querySelector('.wholesale-foot a.btn');
    submitBtn.textContent = 'submit wholesale order';
    submitBtn.addEventListener('click', async(e) => {
      submitWholesaleOrder(e);
    });

    wrapper.append(wholesaleForm);
    main.append(wrapper);
    loadCSS('/assets/blocks/checkout/checkout.css');
  }
}

export default async function decorateOrder(main) {
  const paths = window.location.pathname.split('/').filter((i) => i);
  if (paths.length === 1) {
    // order landing page
    document.querySelector('html').classList.add('order-index');
    const blocks = main.querySelectorAll('.columns');
    const menu = blocks[0];
    menu.classList.add('order-menu');
    buildMenu(menu);
    const pickup = blocks[1];
    pickup.classList.add('order-pickup', 'order-hide');
    const delivery = blocks[2];
    delivery.classList.add('order-delivery', 'order-hide');
  } else {
    // order store pages
    main.querySelectorAll('.section-wrapper').forEach((wrapper) => {
      const firstEl = wrapper.firstChild.querySelector(':scope > *:first-child');
      const lastEl = wrapper.firstChild.querySelector(':scope > *:last-child');
      if (firstEl.nodeName === 'H2' && lastEl.nodeName === 'P') {
        wrapper.classList.add('section-wrapper-filled');
      }
    });
    main.querySelectorAll('em').forEach((em) => {
      if (em.textContent.trim().startsWith('sold out')) {
        em.classList.add('btn', 'btn-rect', 'btn-cart', 'btn-disable');
      }
    });
    // setup wholesale order form
    if (window.location.pathname.includes('/wholesale')) {
      main.querySelectorAll('a[href*="order"]').forEach((a) => setupWholesaleForm(a, main));
    }
    // replace title on abnormal
    if (window.location.pathname.includes('/abnormal')) {
      buildTitle(main);
    }
  }
}
