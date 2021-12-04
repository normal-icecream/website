import { 
  createEl
} from "../../scripts/scripts.js";

async function fetchFeed(url) {
  url += "?type=feed";
  const resp = await fetch(url, { method: "GET" });
  const json = await resp.json();
  return json;
}

async function addToCarousel(e, url) {
  const id = e.target.getAttribute('data-id');
  const target = document.querySelector(`figure[data-id="${id}"]`);
  // link to post
  const { pathname } = new URL(target.getAttribute('data-link'));
  url += "?type=add";
  url += `&id=${encodeURIComponent(target.getAttribute('data-id'))}`;
  url += `&media=${encodeURIComponent(target.getAttribute('data-type'))}`;
  url += `&link=${encodeURIComponent(pathname)}`;
  url += `&url=${encodeURIComponent(target.getAttribute('data-url'))}`;

  // encodeURIComponent
  console.log(url);

  const resp = await fetch(url, { method: "POST" });
}

function buildFeed(block, feed, url) {
  console.log(block);
  block.classList.add('post-feed');
  feed.data.forEach((post) => {
    console.log(post);
    const postFig = createEl("figure", { 
      class: "post",
      "data-id": post.id,
      "data-type": post.media_type,
      "data-link": post.permalink,
      "data-url": post.media_url,
      "data-time": post.timestamp,
      "data-caption": post.caption
    });
    const postA = createEl("a", {
      href: post.permalink,
      target: "_blank"
    });
    const postPic = createEl("img", { 
      class: "post-pic",
      src: post.media_url
    });
    postA.append(postPic);
    const postCap = createEl("figcaption", { 
      class: "post-caption"
    });
    postCap.innerHTML = post.caption;
    const btn = createEl("a", {
      class: 'btn post-btn post-add',
      "data-id": post.id 
    });
    btn.textContent = "+ add to carousel";
    btn.addEventListener("click", async (e) => {
      await addToCarousel(e, url);
    });
    postFig.append(postA, postCap, btn);
    block.append(postFig);
  });
}

export default async function decorate(block) {
  const url = "https://script.google.com/macros/s/AKfycbw2THb3asXx4WYKklBZO4o5SC6dF5Jrs0IfmvM39vQiRZ1JE6tICo8xBOkCmcV4rbbH/exec";
  const json = await fetchFeed(url);
  buildFeed(block.firstChild.firstChild, json, url);
}
