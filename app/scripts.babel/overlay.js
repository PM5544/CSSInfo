export default function (results) {

  let overlay = document.createElement('div');
  let fragment = document.createDocumentFragment();

  overlay.style.background = 'white';
  overlay.id = 'cssinfo';
  overlay.style.color = '#44123c';
  overlay.style.lineHeight = 1.1;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.float = 'left';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.position = 'fixed';
  overlay.style.overflow = 'auto';
  overlay.style.zIndex = 10000;
  overlay.style.padding = '20px';
  overlay.style.display = 'none';

  let h1 = document.createElement('h1');
  h1.textContent = 'CSSInfo stats for: ' + window.location.href;
  h1.style.paddingBottom = '30px';
  fragment.appendChild(h1);

  for (let result of results) {

    let h2 = document.createElement('h2');
    h2.textContent = `${result.title}`;
    h2.style.fontSize = '20px';
    h2.style.marginBottom = '5px';
    h2.style.marginTop = '15px';

    let p = document.createElement('p');
    p.style.marginBottom = '5px';
    p.style.marginTop = '0px';
    p.textContent = `${result.value}`;

    fragment.appendChild(h2);
    fragment.appendChild(p);

    if (result.html) {
      let div = document.createElement('div');
      div.innerHTML = result.html;
      fragment.appendChild(div);
    }
  }

  overlay.appendChild(fragment);
  document.body.appendChild(overlay);
};
