const bagsInfo = [
  {title: 'Bag Cenario 1', color: 'linear-gradient(135deg, #444, #777)', items: ['barra1_palco.png','barra2_palco.png','barra3_palco.png','barra4_palco.png']},
  {title: 'Bag Cenario 2', color: 'linear-gradient(135deg, #444, #777)', items: ['barra5_palco.png','barra6_palco.png','barra7_palco.png','barra8_palco.png']},
  {title: 'Bag Cenario 3', color: 'linear-gradient(135deg, #444, #777)', items: ['barra9_palco.png','barra10_palco.png','barra11_palco.png','barra12_palco.png']},
  {title: 'Bag Cenario 4', color: 'linear-gradient(135deg, #444, #777)', items: ['barra13_palco.png','barra14_palco.png','barra15_palco.png','barra16_palco.png']},
  {title: 'Bag Stella', color: 'linear-gradient(135deg, #e91e63, #ff80ab)', items: ['blusa_stella.png','jaleco_stella.png','maquiagem_stella.png','meia1_stella.png','meia2_stella.png','peruca_stella.png','saia_stella.png','sapato1_stella.png','sapato2_stella.png']},
  {title: 'Bag WJ', color: 'linear-gradient(135deg, #f00, #ffeb3b)', items: ['calça wj.png','colete_wj.png','luva_wj.png','mascara wj.png','sapatos_wj.png']},
  {title: 'Bag Professor Xuxu', color: 'linear-gradient(135deg, #ff9800, #2196f3)', items: ['boina_professor.png','oculos_professor.png','calça_professor.png','camisa_professor.png','jaleco_professor.png','luva1_professor.png','luva2_professor.png','sapato1_professor.png','sapato2_professor.png']},
  {title: 'Bag 08', color: 'linear-gradient(135deg, #673ab7, #ffd700)', items: ['extensao_palco.png','laser1_palco.png','laser2_palco.png','laser3_palco.png','laser4_palco.png','laser_palco.png','setlight1_palco.png','setlight2_palco.png','setlight3_palco.png']}
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

  const folder = encodeURIComponent(title);
  items.forEach((item, i) => {
    const checked = checkedItemsPerBag[bagIndex].has(i);
    const src = `Imagens/${folder}/${encodeURIComponent(item)}`;
    listHTML += `<img id="item-${i}" class="${checked ? 'checked' : ''}" onclick="toggleItem(${i})" src="${src}" alt="item" />`;
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
