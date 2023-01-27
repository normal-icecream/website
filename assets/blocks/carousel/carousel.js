import {
  createEl,
  createSVG,
  toClassName,
} from '../../scripts/scripts.js';

function reorgSlides(carousel, direction) {
  const slides = carousel.querySelectorAll('.carousel-slide');
  if (direction === 'left') {
    // add last slide to front
    const lastSlide = slides[slides.length - 1];
    carousel.prepend(lastSlide);
  } else if (direction === 'right') {
    // add first slide to end
    const firstSlide = slides[0];
    carousel.append(firstSlide);
  }
}

function buildNavBtn(direction) {
  const btn = createEl('button', {
    class: `cnav cnav-${direction}`,
    title: `scroll ${direction}`,
  });
  const arrow = createSVG(`arrow-${direction}`);
  btn.append(arrow);
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const carousel = e.target.closest('.carousel > :last-child');
    const currentPosition = carousel.scrollLeft;
    const slideWidth = carousel.querySelector('.carousel-slide').offsetWidth;
    let carouselWidth = slideWidth * (carousel.childNodes.length - 2); // exclude btns
    const nextPosition = currentPosition + (direction === 'right' ? slideWidth : -slideWidth);
    // calculate width based on visible slides
    if (carousel.offsetWidth >= 898) { // hacky
      carouselWidth -= ((slideWidth * 2) + 2);
    } else if (carousel.offsetWidth >= 689) { // hacky
      carouselWidth -= (slideWidth + 2); // border?
    }
    if (nextPosition < 0 || nextPosition >= carouselWidth) {
      // no content in that direction
      reorgSlides(carousel, direction);
    }
    if (direction === 'right') {
      carousel.scrollLeft += slideWidth;
    } else {
      carousel.scrollLeft -= slideWidth;
    }
  });
  return btn;
}

export function buildCarouselNav(carousel) {
  const leftBtn = buildNavBtn('left');
  const rightBtn = buildNavBtn('right');
  carousel.prepend(leftBtn, rightBtn);
}

async function fetchCarouselImages(url) {
  const resp = await fetch(`${url}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const placeholder = createEl('div', { html });
    const imgs = placeholder.querySelectorAll('picture');
    return imgs;
  }
  return false;
}

function toggle(e) {
  let id;
  let target = e.target.closest('[id^="collapse--"]');
  if (target) {
    id = target.id;
  } else {
    target = e.target.closest('[aria-labelledby^="collapse--"]');
    id = target.getAttribute('aria-labelledby');
  }
  const expanded = document.getElementById(id).getAttribute('aria-expanded');
  if (expanded === 'true') {
    document.getElementById(id).setAttribute('aria-expanded', false);
  } else {
    document.getElementById(id).setAttribute('aria-expanded', true);
  }
}

export default async function decorateCarousel(block) {
  const children = [...block.children];
  if ([...block.classList].includes('carousel-images')) {
    // fetch carousel images
    const { pathname } = new URL(block.querySelector('a').href);
    const imgs = await fetchCarouselImages(pathname);
    if (imgs) {
      const wrapper = block.firstChild;
      wrapper.innerHTML = '';
      wrapper.classList.add('carousel-images-slides');
      imgs.forEach((img) => {
        img.classList.add('carousel-slide');
        wrapper.append(img);
      });
      // build navigation
      if (imgs.length > 1) {
        buildCarouselNav(wrapper);
      }
    }
  } else {
    block.querySelectorAll('img').forEach((img) => {
      img.setAttribute('height', 160);
    });
    // setup collapse
    if ([...block.classList].includes('carousel-collapse')) {
      const collapseText = children[0].textContent;
      children.shift();

      // build starburst wrapper
      const wrapper = createEl('aside', {
        class: 'collapse-wrapper collapse-btn',
        id: `collapse--${toClassName(collapseText)}`,
        'aria-haspopup': true,
        'aria-expanded': false,
        role: 'button',
      });
      // build starburst
      const text = createEl('p', {
        class: 'starburst-text',
        text: collapseText,
      });
      const starburst = createSVG('starburst');
      starburst.classList.add('starburst');

      // build
      wrapper.append(text, starburst);
      wrapper.addEventListener('click', toggle);
      const parent = block.parentNode;
      parent.parentElement.insertBefore(wrapper, parent);
      block.setAttribute('aria-labelledby', `collapse--${toClassName(collapseText)}`);
      block.setAttribute('role', 'menu');
      block.classList.add('collapse-menu');
    }
    // setup carousel head
    const head = children[0];
    head.classList.add('carousel-head');
    const title = toClassName(head.textContent);
    block.classList.add(`${title}-carousel`);
    // setup carousel slides
    children.shift();
    // build new carousel
    block.innerHTML = '';
    const wrapper = createEl('div', {
      class: 'carousel-slides',
    });
    children.forEach((slide) => {
      // remove deleted content
      const visibleContent = [...slide.firstElementChild.children].filter((el) => !el.querySelector('del'));
      if (visibleContent.length === 0) { // no content
        slide.remove();
      } else if (visibleContent.length === 1) {
        const isImg = visibleContent[0].querySelector('img');
        if (isImg) { // only img content
          slide.remove();
        } else {
          slide.classList.add('carousel-slide');
          wrapper.append(slide);
        }
      } else {
        slide.classList.add('carousel-slide');
        wrapper.append(slide);
      }
    });
    wrapper.classList.add(`carousel-slides-${wrapper.childNodes.length <= 3 ? wrapper.childNodes.length : 'multi'}`);
    block.append(head, wrapper);
    block.classList.add('carousel-border');
    // build navigation
    if (wrapper.childNodes.length > 1) {
      buildCarouselNav(wrapper);
    }
  }
}
