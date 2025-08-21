const bagsInfo = [
  {title: 'Bag Cenario 1', color: 'linear-gradient(135deg, #444, #777)', items: ['Barra de ferro simples 01','Barra de ferro simples 02','Barra de ferro simples 03','Barra de ferro simples 04']},
  {title: 'Bag Cenario 2', color: 'linear-gradient(135deg, #444, #777)', items: ['Barra de ferro simples 05','Barra de ferro simples 06','Barra de ferro simples 07','Barra de ferro simples 08']},
  {title: 'Bag Cenario 3', color: 'linear-gradient(135deg, #444, #777)', items: ['Barra de ferro com conector 01','Barra de ferro com conector 02','Barra de ferro com conector 03','Barra de ferro com conector 04']},
  {title: 'Bag Cenario 4', color: 'linear-gradient(135deg, #444, #777)', items: ['Barra de ferro com conector 05','Barra de ferro com conector 06','Barra de ferro com conector 07','Barra de ferro com conector 08']},
  {title: 'Bag Stella', color: 'linear-gradient(135deg, #e91e63, #ff80ab)', items: ['Peruca Stella','Vestido Stella','Maquiagem Stella','Sapatilha Stella','Meia Stella']},
  {title: 'Bag WJ', color: 'linear-gradient(135deg, #f00, #ffeb3b)', items: ['Cabeça WJ','Camisa WJ','Jaleco WJ','Calça WJ']},
  {title: 'Bag Professor Xuxu', color: 'linear-gradient(135deg, #ff9800, #2196f3)', items: ['Boina Professor Xuxu','Óculos Professor Xuxu','Calça Professor Xuxu','Camisa Professor Xuxu','Jaleco Professor Xuxu','Luvas Professor Xuxu','Óculos Professor Xuxu']},
  {title: 'Bag 08', color: 'linear-gradient(135deg, #673ab7, #ffd700)', items: ['Lápis cenográfico','Tesoura cenográfica','Boneco pequeno (brinde)','Fantoche 01','Fantoche 02','Fantoche 03','Fantoche 04']}
];

let checkedItemsPerBag = bagsInfo.map(() => new Set());
let currentBagIndex = null;
let currentPage = 0;

function renderPage() {
  const container = document.getElementById('bags-page');
  container.innerHTML = '';
  const start = currentPage * 4;
  const end = start + 4;
  bagsInfo.slice(start, end).forEach((bag, idx) => {
    const globalIndex = start + idx;
    const wrapper = document.createElement('div');
    wrapper.className = 'bag-wrapper';

    const bagDiv = document.createElement('div');
    bagDiv.className = 'bag';
    bagDiv.style.background = bag.color;
    bagDiv.innerText = bag.title;
    bagDiv.onclick = () => openBag(bag.title, globalIndex, bag.items, bag.color);
    wrapper.appendChild(bagDiv);

    const progress = document.createElement('div');
    progress.className = 'bag-progress';
    progress.innerHTML = `<div class="bag-progress-bar" id="bag-progress-${globalIndex}"></div>`;
    wrapper.appendChild(progress);

    container.appendChild(wrapper);
  });
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
  }
}

function nextPage() {
  if ((currentPage + 1) * 4 < bagsInfo.length) {
    currentPage++;
    renderPage();
  }
}

// Swipe detection for mobile
let touchStartX = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});
document.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) nextPage();
  if (touchEndX > touchStartX + 50) prevPage();
});

function openBag(title, bagIndex, items, bgColor) {
  document.getElementById('modal').style.display = 'flex';
  const modalContent = document.getElementById('modal-content');
  modalContent.style.background = bgColor;
  document.getElementById('bag-title').innerText = title;
  let listHTML = '';
  currentBagIndex = bagIndex;

  items.forEach((item, i) => {
    const checked = checkedItemsPerBag[bagIndex].has(i);
    listHTML += `<h2 id="item-${i}" class="${checked ? 'checked' : ''}" onclick="toggleItem(${i})">${item}</h2>`;
  });

  document.getElementById('items-list').innerHTML = listHTML;
  updateProgress();
}

function closeBag(event) {
  if (event.target.id === 'modal') {
    document.getElementById('modal').style.display = 'none';
  }
}

function toggleItem(index) {
  const itemElement = document.getElementById(`item-${index}`);
  if (checkedItemsPerBag[currentBagIndex].has(index)) {
    checkedItemsPerBag[currentBagIndex].delete(index);
    itemElement.classList.remove('checked');
  } else {
    checkedItemsPerBag[currentBagIndex].add(index);
    itemElement.classList.add('checked');
  }
  updateProgress();
}

function updateProgress() {
  const items = bagsInfo[currentBagIndex].items;
  const checkedCount = checkedItemsPerBag[currentBagIndex].size;
  const percent = (checkedCount / items.length) * 100;
  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById(`bag-progress-${currentBagIndex}`).style.width = percent + '%';

  // update global progress
  let totalItems = 0;
  let totalChecked = 0;
  bagsInfo.forEach((bag, idx) => {
    totalItems += bag.items.length;
    totalChecked += checkedItemsPerBag[idx].size;
  });
  const globalPercent = (totalChecked / totalItems) * 100;
  document.getElementById('global-progress-bar').style.width = globalPercent + '%';
}

// Initial render
renderPage();
