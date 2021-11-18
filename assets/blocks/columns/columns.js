export default function decorateColumns(block) {
  const num = block.firstChild.childNodes.length;
  block.firstChild.classList.add(`columns-${num}`);
}
