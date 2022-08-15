import {
  createEl,
  createSVG,
  buildBlock,
  buildGScriptLink,
  buildGQs,
  loadCSS,
  noScroll,
  fetchLabels,
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
  makeScreensaverError,
  removeScreensaver,
} from '../../utils/screensaver/screensaver.js';

const WHOLESALE_KEY = 'AKfycbyquwOChGVk2YA0BNkrQsBFj_W00Y2DZA721pgyQ1hVR0DNscmSHEYjdrRt7sdPF31RAw';

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
  const url = buildGScriptLink(WHOLESALE_KEY);
  const resp = await fetch(url, { cache: 'reload' });
  if (resp.ok) {
    const json = await resp.json();
    return json;
  }
  return {};
}

async function buildWholesaleForm(table) {
  const tempForm = createEl('form');
  await buildForm(tempForm, ['business']);
  setTimeout(async () => {
    [...tempForm.children].forEach(async (field) => {
      const row = createEl('tr', {
        html: `<td colspan="2" class="wholesale-input">${field.outerHTML}</td>`,
      });
      table.append(row);
    });

    const data = await fetchWholesaleData();
    Object.keys(data).forEach((key) => {
      const typeHead = createEl('tr', {
        html: `<td>${key.replace('Case', '')}</td>
          <td>Quantity</td>`,
        class: 'wholesale-type-heading',
      });
      table.append(typeHead);
      data[key].forEach((item) => {
        const row = createEl('tr', {
          html: `<td>
              <p>${item.item} ${item.type} ${item.remaining <= 10 ? '<span class="wholesale-low-stock">just a few left!</span>' : ''}</p>
              ${item.description ? `<p class="wholesale-item-desc">${item.description}</p>` : ''}
            </td>
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
  const url = buildGScriptLink(WHOLESALE_KEY);
  const resp = await fetch(`${url}?${qs}`, { method: 'POST' });
  const json = await resp.json();
  return json;
}

async function updateWholesaleAfterSubmission(form) {
  const fields = form.querySelectorAll('.wholesale-input input');
  fields.forEach((field) => {
    if (field.value <= 0) { // unordered item
      const row = field.closest('tr');
      row.remove();
    } else {
      field.disabled = true;
    }
  });
  const headers = form.querySelectorAll('tr.wholesale-type-heading');
  headers.forEach((header) => {
    const next = header.nextElementSibling;
    if (!next || [...headers].includes(next)) header.remove();
  });
  const footer = document.querySelector('.wholesale-foot');
  const footerBtn = footer.querySelector('a');
  if (footerBtn) footerBtn.remove();
  // thank you message
  const wrapper = createEl('div', {
    class: 'payment-success-message',
  });
  const labels = await fetchLabels();
  const message = labels.wholesale_thankyou.split('\n');
  message.forEach((line) => {
    const p = createEl('p', {
      text: line,
    });
    wrapper.append(p);
  });
  // contact button
  const phone = labels.store_phone;
  const contactBtn = createEl('a', {
    class: 'btn btn-rect btn-fixed',
    text: phone,
    href: `sms:+${phone.replace(/\D/g, '')}`,
  });
  wrapper.append(contactBtn);
  // new order btn
  const newOrderBtn = createEl('a', {
    class: 'btn btn-rect btn-fixed',
    text: 'submit a new wholesale order',
  });
  newOrderBtn.addEventListener('click', () => window.location.reload());
  wrapper.append(newOrderBtn);
  footer.append(wrapper);
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
    // submit order
    const order = await postWholesaleOrder(data);
    if (order.result === 'success') {
      // update wholesale form
      updateWholesaleAfterSubmission(form);
      removeScreensaver();
    } else {
      makeScreensaverError('something went wrong and your order didn\'t go through.');
    }
  }
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
    submitBtn.addEventListener('click', async (e) => {
      submitWholesaleOrder(e);
    });

    wrapper.append(wholesaleForm);
    main.append(wrapper);
    loadCSS('/assets/blocks/checkout/checkout.css');
  }
}

async function checkIfWholesaleOpen(main) {
  const now = new Date();
  const day = now.getDay(); // 0 = sunday, 1 = monday, etc
  const open = new Date();
  const close = new Date();
  // eslint-disable-next-line no-mixed-operators
  open.setDate(open.getDate() + ((7 - open.getDay()) % 7 + 6) % 7); // 6 = saturday
  if (day <= 2) open.setDate(open.getDate() - 7); // get LAST saturday
  open.setHours((12 + 3), 0, 0); // 3:00 pm
  // eslint-disable-next-line no-mixed-operators
  close.setDate(close.getDate() + ((7 - close.getDay()) % 7 + 2) % 7); // 2 = tuesday
  close.setHours((12 + 3), 5, 0); // 3:05 pm
  if (day <= 1 || (now >= open && now <= close)) { // ordering is open
    main.querySelectorAll('a[href*="#order"]').forEach((a) => setupWholesaleForm(a, main));
  } else {
    const labels = await fetchLabels();
    main.querySelectorAll('a[href*="#order"]').forEach((a) => {
      const msg = createEl('p', { text: labels.wholesale_closed });
      a.replaceWith(msg);
    });
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
      checkIfWholesaleOpen(main);
    }
    // replace title on abnormal
    if (window.location.pathname.includes('/abnormal')) {
      buildTitle(main);
    }
  }
}
