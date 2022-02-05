import {
  createEl,
  createSVG,
  // noScroll,
  readBlockConfig,
  toClassName,
} from '../../scripts/scripts.js';

export default function decorateAnchor(block) {
  const config = readBlockConfig(block);
  const targetType = config.anchor.substring(0, 1);
  let target;
  if (targetType === '#') {
    target = document.getElementById(toClassName(config.anchor.substring(1)));
  } else if (targetType === '.') {
    target = document.querySelector(`.${toClassName(config.anchor.substring(1))}`);
  }
  while (![...target.classList].includes('block') && ![...target.classList].includes('section-wrapper')) {
    target = target.parentNode; // find the block/section parent
  }
  target.classList.add('relative');
  // container holds everything
  const container = createEl('div', {
    class: 'anchor-container',
  });
  if ([...target.classList].includes('block')) {
    container.classList.add('block-anchor');
  } else if ([...target.classList].includes('section-wrapper')) {
    container.classList.add('section-anchor');
  }
  // wrapper holds svg & text
  const wrapper = createEl('aside', {
    class: `anchor-wrapper
      anchor-position-${toClassName(config.position)}
      anchor-color-${toClassName(config.color)}`,
  });
  if (config.text) {
    const text = createEl('p', {
      class: 'anchor-text',
      text: config.text,
    });
    wrapper.append(text);
  }
  const anchorSVG = createSVG(toClassName(config.logo));
  wrapper.append(anchorSVG);
  if (config.link) {
    const linked = createEl('a', {
      href: config.link,
      html: wrapper.outerHTML,
    });
    container.append(linked);
  } else {
    container.append(wrapper);
  }

  target.prepend(container);
}
