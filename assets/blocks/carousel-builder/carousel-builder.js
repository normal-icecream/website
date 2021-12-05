import { 
  createEl
} from '../../scripts/scripts.js';

async function fetchFeed(url, cursor) {
  url += '?type=feed';
  if (cursor) {
    url += `&cursor=${encodeURIComponent(cursor)}`;
  }
  const resp = await fetch(url, { method: 'GET' });
  const json = await resp.json();
  return json;
}

async function fetchCarousel() {
  const resp = await fetch('/_admin/carousel-builder.json', { cache: 'no-cache' });
  const json = await resp.json();
  const data = json.data.sort((a, b) => (a.order > b.order) ? 1 : -1)
  window.carousel = data;
  return data;
}

function buildMedia(media) {
  let postMedia;
  if (media.media_type === 'VIDEO' || media.type === 'VIDEO') {
    postMedia = createEl('video', {
      class: 'post-media',
      type: 'video/mp4'
    });
    postMedia.playsinline = true;
    postMedia.autoplay = true;
    postMedia.loop = true;
    postMedia.muted = true;
    const postSrc = createEl('source', {
      src: media.media_url || media.url
    });
    postMedia.append(postSrc);
  } else {
    postMedia = createEl('picture', { 
      class: 'post-media'
    });
    const postSrc = createEl('img', {
      src: media.media_url || media.url
    });
    postMedia.append(postSrc);
  }
  return postMedia;
}

async function addToCarousel(e, url) {
  if (![...e.target.classList].includes('post-added')) {
    const id = e.target.getAttribute('data-id');
    const target = document.querySelector(`figure[data-id='${id}']`);
    if (target) {
      // link to post
      const { pathname } = new URL(target.getAttribute('data-link'));
      url += '?type=add';
      url += `&id=${encodeURIComponent(target.getAttribute('data-id'))}`;
      url += `&media=${encodeURIComponent(target.getAttribute('data-type'))}`;
      url += `&link=${encodeURIComponent(pathname)}`;
      url += `&url=${encodeURIComponent(target.getAttribute('data-url'))}`;
      e.target.textContent = 'adding to carousel';
      const resp = await fetch(url, { method: 'POST', mode: 'no-cors' });
      await fetchCarousel();
      e.target.classList.add('post-added');
      e.target.textContent = 'added to carousel'
    }
  }
}

async function removeFromCarousel(e, url) {
  const id = e.target.getAttribute('data-id');
  if (id) {
    url += '?type=remove';
    url += `&id=${encodeURIComponent(id)}`;
    e.target.textContent = 'removing from carousel';
    const resp = await fetch(url, { method: 'POST', mode: 'no-cors' });
    const figure = document.querySelector(`figure[data-id='${id}']`);
    if (figure) {
      figure.remove();
    }
  }
}

async function updateCarouselOrder(e, url) {
  const id = e.target.getAttribute('data-id');
  const value = document.querySelector(`input[data-id="${id}"]`).value;
  if (value) {
    let newUrl = url += '?type=order';
    newUrl += `&id=${encodeURIComponent(id)}`;
    newUrl += `&order=${encodeURIComponent(value)}`;
    const resp = await fetch(newUrl, { method: 'POST', mode: 'no-cors' });
    await populateCarousel(url.replace('?type=order', ''));
  }
}

async function populateFeed(url, cursor) {  
  const feedContainer = document.querySelector('.post-feed');
  if (!feedContainer.hasChildNodes() || cursor) {
    let feed; 
    if (cursor) {
      feed = await fetchFeed(url, cursor);
    } else {
      feed = await fetchFeed(url);
    }
    feed.data.forEach((post) => {
      const postFig = createEl('figure', { 
        class: 'post',
        'data-id': post.id,
        'data-type': post.media_type,
        'data-link': post.permalink,
        'data-url': post.media_url,
        'data-time': post.timestamp
      });
      const postA = createEl('a', {
        href: post.permalink,
        target: '_blank'
      });
      const postMedia = buildMedia(post);
      postA.append(postMedia);
      const postCap = createEl('figcaption', { 
        class: 'post-caption'
      });
      postCap.innerHTML = post.caption;
      const btn = createEl('a', {
        class: 'btn post-btn post-add',
        'data-id': post.id 
      });
      const match = window.carousel.find((i) => {
        return i.id === post.id;
      });
      if (match) {
        btn.classList.add('post-added');
        btn.textContent = 'added to carousel';
      } else {
        btn.textContent = 'add to carousel';
        btn.addEventListener('click', async (e) => {
          await addToCarousel(e, url);
        });
      }
      postFig.append(postA, postCap, btn);
      feedContainer.append(postFig);
    });
    if (feed.paging && feed.paging.cursors && feed.paging.cursors.after) {
      // load more button
      const loadMore = createEl('div', {
        class: 'post-load-container'
      });
      const loadMoreBtn = createEl('a', {
        class: 'btn post-btn post-load-more',
        'data-cursor': feed.paging.cursors.after
      });
      loadMoreBtn.textContent = 'load more posts';
      loadMoreBtn.addEventListener('click', (e) => {
        loadMore.remove();
        populateFeed(url, feed.paging.cursors.after);
      })
      loadMore.append(loadMoreBtn);
      feedContainer.append(loadMore);
    }
  }

}

function setupMenu(block, url) {
  const btnContainer = createEl('div', {
    class: 'btn-container carousel-btn-container'
  });
  const addBtn = createEl('a', {
    class: 'btn carousel-btn carousel-add-btn'
  });
  addBtn.textContent = 'add to carousel';
  addBtn.addEventListener('click', (e) => {
    const active = document.querySelector('.btn-active');
    active.classList.remove('btn-active');
    addBtn.classList.add('btn-active');
    const feedContainer = document.querySelector('.post-feed');
    feedContainer.classList.remove('hidden');
    const currentCarousel = document.querySelector('.current-carousel');
    currentCarousel.classList.add('hidden');
    populateFeed(url);
  });
  const editBtn = createEl('a', {
    class: 'btn carousel-btn carousel-edit-btn btn-active'
  });
  editBtn.textContent = 'edit carousel';
  editBtn.addEventListener('click', (e) => {
    const active = document.querySelector('.btn-active');
    active.classList.remove('btn-active');
    editBtn.classList.add('btn-active');
    const feedContainer = document.querySelector('.post-feed');
    feedContainer.classList.add('hidden');
    const currentCarousel = document.querySelector('.current-carousel');
    currentCarousel.classList.remove('hidden');
    populateCarousel(url);
  });
  btnContainer.append(addBtn, editBtn);
  block.prepend(btnContainer);
}

async function buildCarousel(block, url) {
  block.classList.add('current-carousel');
  await populateCarousel(url);
}

async function populateCarousel(url) {
  const carouselContainer = document.querySelector('.current-carousel');
  carouselContainer.innerHTML = '';
  const carousel = await fetchCarousel();
  carousel.forEach((img) => {
    const figure = createEl('figure', {
      class: 'post',
      'data-id': img.id
    });
    const media = buildMedia(img);
    const caption = createEl('figcaption', {
      class: 'current-carousel-caption'
    });
    const removeBtn = createEl('a', {
      class: 'btn post-btn post-remove',
      'data-id': img.id
    });
    removeBtn.textContent = 'remove from carousel';
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      removeFromCarousel(e, url);
    })
    const orderForm = createEl('form', { 
      class: 'carousel-builder-form'
    });
    const orderInput = createEl('input', {
      type: 'number',
      'data-id': img.id,
      min: 1,
      // max: carousel.length
    });
    orderInput.value = img.order;
    const orderBtn = createEl('button', {
      class: 'btn post-btn post-order',
      'data-id': img.id
    });
    orderBtn.textContent = 'update order';
    orderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateCarouselOrder(e, url);
    })
    orderForm.append(orderInput, orderBtn);
    caption.append(orderForm, removeBtn);
    figure.append(media, caption);
    carouselContainer.append(figure);
  });
}

function buildFeed(block, url) {
  const feedContainer = createEl('div', {
    class: 'post-feed hidden'
  });
  block.append(feedContainer);
}

export default async function decorate(block) {
  const url = 'https://script.google.com/macros/s/AKfycbwrNz4u7iSN7za1zUDITN9Se0xnEOH6Re1KlDvmR-RHPbPYbwHzXx0bG2GNZUc74e0T/exec';
  setupMenu(block, url);
  await buildCarousel(block.lastChild.firstChild, url);
  buildFeed(block.lastChild, url);
}

