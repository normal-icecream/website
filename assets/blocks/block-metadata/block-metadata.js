import {
  readBlockConfig,
} from '../../scripts/scripts.js';

export default function applyBlockMetadata(block) {
  const config = readBlockConfig(block);
  const target = block.previousElementSibling;
  if (target && [...target.classList].includes('block')) {
    console.log('hi from metadata', config);
    target.setAttribute('data-block-meta', true);
    console.log(target);
    Object.keys(config).forEach((key) => {
      target.classList.add(`${key}-${config[key]}`);
    });
  }
}
