export default function decorateRedirect(block) {
  const a = block.querySelector('a');
  if (a && a.href) {
    window.location.replace(a.href);
  }
}
