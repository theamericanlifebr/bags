const bagColor = 'linear-gradient(135deg, #eeeeee, #ffffff)';

const bagsInfo = [
  {title: 'Bag Cenario 1', items: ['barra1_palco.png','barra2_palco.png','barra3_palco.png','barra4_palco.png']},
  {title: 'Bag Cenario 2', items: ['barra5_palco.png','barra6_palco.png','barra7_palco.png','barra8_palco.png']},
  {title: 'Bag Cenario 3', items: ['barra9_palco.png','barra10_palco.png','barra11_palco.png','barra12_palco.png']},
  {title: 'Bag Cenario 4', items: ['barra13_palco.png','barra14_palco.png','barra15_palco.png','barra16_palco.png']},
  {title: 'Bag Stella', items: ['blusa_stella.png','jaleco_stella.png','maquiagem_stella.png','meia1_stella.png','meia2_stella.png','peruca_stella.png','saia_stella.png','sapato1_stella.png','sapato2_stella.png']},
  {title: 'Bag WJ', items: ['calça wj.png','colete_wj.png','luva_wj.png','mascara wj.png','sapatos_wj.png']},
  {title: 'Bag Professor Xuxu', items: ['boina_professor.png','oculos_professor.png','calça_professor.png','camisa_professor.png','jaleco_professor.png','luva1_professor.png','luva2_professor.png','sapato1_professor.png','sapato2_professor.png']},
  {title: 'Bag 08', items: ['extensao_palco.png','laser1_palco.png','laser2_palco.png','laser3_palco.png','laser4_palco.png','laser_palco.png','setlight1_palco.png','setlight2_palco.png','setlight3_palco.png']}
];

const musicList = [
  {title: 'Mundo colorido', file: 'Mundo colorido.mp3'},
  {title: 'Casinha do coração', file: 'Casinha do coração.mp3'},
  {title: 'Você é especial', file: 'Você é especial.mp3'},
  {title: 'Fábrica de heróis', file: 'Fábrica de Heróis.mp3'},
  {title: 'Você não é todo mundo', file: 'Você não é todo mundo.mp3'},
  {title: 'Eu vim aqui para adorar', file: 'Eu vim aqui para adorar.mp3'}
];

let checkedItemsPerBag = bagsInfo.map(() => new Set());
let currentBagIndex = null;
let currentPage = 0;
let toggleTracker = {};
let currentAudio = null;

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
    bagDiv.style.background = bagColor;
    bagDiv.innerText = bag.title;
    bagDiv.onclick = () => openBag(bag.title, globalIndex, bag.items);
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

function openBag(title, bagIndex, items) {
  document.getElementById('modal').style.display = 'flex';
  const modalContent = document.getElementById('modal-content');
  modalContent.style.background = bagColor;
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
  const key = currentBagIndex + '-' + index;
  const now = Date.now();
  if (toggleTracker[key] && now - toggleTracker[key].start < 5000) {
    toggleTracker[key].count++;
  } else {
    toggleTracker[key] = { count: 1, start: now };
  }
  if (toggleTracker[key] && toggleTracker[key].count >= 3) {
    toggleTracker[key] = null;
    showMusicOverlay();
  }

  const itemElement = document.getElementById(`item-${index}`);
  if (checkedItemsPerBag[currentBagIndex].has(index)) {
    checkedItemsPerBag[currentBagIndex].delete(index);
    itemElement.classList.remove('checked');
  } else {
    checkedItemsPerBag[currentBagIndex].add(index);
    itemElement.classList.add('checked');
    new Audio('Songs/Sucesso.mp3').play();
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

function disableAllButtons(disable) {
  document.querySelectorAll('button').forEach(btn => btn.disabled = disable);
  document.querySelectorAll('.bag, .boxmusic').forEach(el => {
    el.style.pointerEvents = disable ? 'none' : 'auto';
  });
}

function buildMusicOverlay() {
  const overlay = document.getElementById('music-overlay');
  overlay.innerHTML = '';
  musicList.forEach((m, i) => {
    const box = document.createElement('div');
    box.className = 'boxmusic';
    box.innerText = m.title;
    box.addEventListener('click', () => playMusic(i));
    const progress = document.createElement('div');
    progress.className = 'music-progress';
    progress.innerHTML = `<div class="music-progress-bar" id="music-progress-${i}"></div>`;
    box.appendChild(progress);
    overlay.appendChild(box);
  });
  overlay.dataset.built = 'true';
  overlay.addEventListener('click', e => {
    if (e.target.id === 'music-overlay') hideMusicOverlay();
  });
}

function showMusicOverlay() {
  const overlay = document.getElementById('music-overlay');
  if (!overlay.dataset.built) buildMusicOverlay();
  overlay.style.display = 'flex';
}

function hideMusicOverlay() {
  const overlay = document.getElementById('music-overlay');
  overlay.style.display = 'none';
}

function playMusic(idx) {
  if (currentAudio) {
    currentAudio.pause();
  }
  const music = musicList[idx];
  currentAudio = new Audio('Songs/' + encodeURIComponent(music.file));
  const progressBar = document.getElementById(`music-progress-${idx}`);
  document.querySelectorAll('.music-progress-bar').forEach(bar => bar.style.width = '0%');
  currentAudio.addEventListener('timeupdate', () => {
    const pct = (currentAudio.currentTime / currentAudio.duration) * 100;
    progressBar.style.width = pct + '%';
  });
  currentAudio.addEventListener('ended', () => {
    disableAllButtons(false);
  });
  disableAllButtons(true);
  currentAudio.play();
}

let tapCount = 0;
let tapTimer = null;
document.addEventListener('click', () => {
  tapCount++;
  if (tapTimer) clearTimeout(tapTimer);
  tapTimer = setTimeout(() => { tapCount = 0; }, 1000);
  if (tapCount >= 5 && currentAudio) {
    fadeOutCurrentAudio();
    tapCount = 0;
  }
});

function fadeOutCurrentAudio() {
  if (!currentAudio) return;
  const audio = currentAudio;
  const startVolume = audio.volume;
  const duration = 3000;
  const step = 50;
  const decrement = startVolume / (duration / step);
  const interval = setInterval(() => {
    if (audio.volume - decrement > 0) {
      audio.volume -= decrement;
    } else {
      audio.volume = 0;
      clearInterval(interval);
      audio.pause();
      audio.volume = startVolume;
      disableAllButtons(false);
    }
  }, step);
}

// Initial render
renderPage();
