let username = '';
let originalOrder = [];
let currentLevel = 1;
let currentColors = [];

function goToSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function saveUsername() {
  username = document.getElementById('username').value;
  if (username.trim() === '') {
    alert("Please enter your name!");
    return;
  }
  goToSection('levelSelect');
}

function getColorSet(level) {
  if (level === 'easy') return 3;
  if (level === 'medium') return 7;
  return 3 + currentLevel; // for difficult
}

function startGame(levelType) {
  currentLevel = 1;
  loadLevel(levelType);
}

function loadLevel(levelType) {
  goToSection('game');
  document.getElementById('levelTitle').innerText = `Level ${currentLevel} - ${levelType.toUpperCase()}`;
  let colorCount = getColorSet(levelType);
  currentColors = generateRandomColors(colorCount);
  originalOrder = [...currentColors];

  setTimeout(() => {
    displayShuffledColors(currentColors);
  }, 4000);

  displayOriginalColors(currentColors);
}

function generateRandomColors(num) {
  const baseColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'cyan', 'magenta'];
  let shuffled = baseColors.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function displayOriginalColors(colors) {
  const area = document.getElementById('gameArea');
  area.innerHTML = '<h4>Memorize these colors...</h4>';
  colors.forEach(color => {
    const box = document.createElement('div');
    box.className = 'color-box';
    box.style.backgroundColor = color;
    area.appendChild(box);
  });
}

function displayShuffledColors(colors) {
  const shuffled = [...colors].sort(() => 0.5 - Math.random());
  const area = document.getElementById('gameArea');
  area.innerHTML = '<h4>Reorder the colors (Drag and Drop)</h4>';

  shuffled.forEach(color => {
    const box = document.createElement('div');
    box.className = 'color-box';
    box.style.backgroundColor = color;
    box.setAttribute('draggable', true);
    box.ondragstart = dragStart;
    box.ondragover = allowDrop;
    box.ondrop = drop;
    area.appendChild(box);
  });
}

let dragged;

function dragStart(event) {
  dragged = event.target;
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const draggedColor = dragged.style.backgroundColor;
  const targetColor = event.target.style.backgroundColor;
  dragged.style.backgroundColor = targetColor;
  event.target.style.backgroundColor = draggedColor;
}

function submitAnswer() {
  const boxes = document.querySelectorAll('#gameArea .color-box');
  const answer = Array.from(boxes).map(box => box.style.backgroundColor);

  if (JSON.stringify(answer) === JSON.stringify(originalOrder)) {
    alert("Correct! Next Level.");
    currentLevel++;
    if (currentLevel > 10) {
      alert("Game Completed!");
      goToSection('welcome');
    } else {
      loadLevel('difficult');
    }
  } else {
    alert("Wrong! Try Again.");
    loadLevel('difficult');
  }
}
