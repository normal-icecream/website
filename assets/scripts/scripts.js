/*==========================================================
HLX3 SETUP
==========================================================*/

/**
 * Builds an HTML DOM element.
 * @param {string} tag The type of element
 * @param {object} params Additional parameters for element
 * @returns {Element} The block element
 */
 export function createEl(tag, params) {
  const el = document.createElement(tag);
  if (params) {
    for (const param in params) {
      el.setAttribute(param, params[param]);
    }
  }
  return el;
}

export function buildPath(path) {
  const { origin } = new URL(window.location);
  return `${origin}/assets/${path}`;
}

/**
 * Sanitizes a name for use as class name.
 * @param {*} name The unsanitized name
 * @returns {string} The class name
 */
export function toClassName(name) {
  return name && typeof name === 'string' ?
    name.toLowerCase().replace(/[^0-9a-z]/gi, '-') :
    '';
}

/**
 * Extracts the config from a block.
 * @param {Element} block The block element
 * @returns {object} The block config
 */
export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const valueEl = cols[1];
        const name = toClassName(cols[0].textContent);
        let value = '';
        if (valueEl.querySelector('a')) {
          const as = [...valueEl.querySelectorAll('a')];
          if (as.length === 1) {
            value = as[0].href;
          } else {
            value = as.map((a) => a.href);
          }
        } else if (valueEl.querySelector('p')) {
          const ps = [...valueEl.querySelectorAll('p')];
          if (ps.length === 1) {
            value = ps[0].textContent;
          } else {
            value = ps.map((p) => p.textContent);
          }
        } else value = row.children[1].textContent;
        config[name] = value;
      }
    }
  });
  return config;
}

/**
 * Decorates all blocks.
 */
 function decorateBlocks() {
  document
    .querySelectorAll('main > div > div[class]')
    .forEach((block) => {
      decorateBlock(block);
    });
}

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
 export function loadCSS(href) {
  const path = buildPath(href);
  if (!document.querySelector(`head > link[href="${path}"]`)) {
    const stylesheet = createEl('link', {
      rel: 'stylesheet',
      href: `${path}`
    });
    document.head.appendChild(stylesheet);
  }
}

/**
 * Loads JS and CSS for all blocks.
 */
 async function loadBlocks() {
  document
    .querySelectorAll('div.block')
    .forEach(async(block) => {
      if (
        [...block.classList].includes('popup') ||
        [...block.classList].includes('columns')
      ) {
        loadBlock(block);
      }
    });
}

/**
 * Loads JS and CSS for a single block.
 * @param {Element} block The block element
 */
 async function loadBlock(block) {
  if (!block.getAttribute('data-block-loaded')) {
    block.setAttribute('data-block-loaded', true);
    const name = block.getAttribute('data-block-name');
    loadCSS(`blocks/${name}/${name}.css`);
    try {
      const mod = await
      import(buildPath(`blocks/${name}/${name}.js`));
      if (mod.default) {
        await mod.default(block, name, document);
      }
    } catch (err) {
      console.error(`failed to load module for ${name}`, err);
    }
  }
}

/**
 * Decorates single block
 * @param {Element} block Block element to be decorated
 */
function decorateBlock(block) {
  const name = block.classList[0];
  if (name === 'popup' || name === 'columns') {
    block.classList.add('block');
    block.setAttribute('data-block-name', name);
    const clone = block.cloneNode(true)
    const parent = createEl('div', {
      class: `${name}-container`.replace(/--/g, '-')
    });
    parent.append(clone);
    block.replaceWith(parent);
  }
}

async function init() {
  const main = document.querySelector('main');
  if (main) {
    decorateBlocks(main);
  }
  await loadBlocks();
};

init();
