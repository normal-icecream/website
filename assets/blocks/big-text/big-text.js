export default function decorateBigText(block) {
  block.querySelectorAll('a').forEach((a) => {
    const parent = a.parentNode;
    if (parent.textContent === a.textContent) {
      a.classList.add('btn', 'btn-rect');
    }
  });
}
