const player = document.getElementById('player');
const game = document.getElementById('game');
const message = document.getElementById('message');
const nextLevelBtn = document.getElementById('next-level');
const gameTitle = document.getElementById('game-title');

const GRAVITY = 0.8;
const MOVE_SPEED = 5;
const JUMP_POWER = 16;
const COLLISION_TOLERANCE = 5;

let posX = 100;
let posY = 50;
let velocityY = 0;
let grounded = false;
let facingRight = true;
const keys = {};

let currentPhase = 1;

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Estrutura de fases: plataformas e sementes
const phases = {
  1: {
    platforms: [
      {left: 0, bottom: 0, width: 900},
      {left: 150, bottom: 150, width: 120},
      {left: 350, bottom: 250, width: 100},
      {left: 550, bottom: 100, width: 140},
    ],
    seeds: [
      {left: 180, bottom: 170},
      {left: 370, bottom: 270},
      {left: 580, bottom: 120},
    ],
    background: "mapa 1.0.gif"
  },
  2: {
    platforms: [
      {left: 0, bottom: 0, width: 900},
      {left: 100, bottom: 120, width: 150},
      {left: 320, bottom: 200, width: 130},
      {left: 550, bottom: 150, width: 120},
      {left: 700, bottom: 300, width: 100},
    ],
    seeds: [
      {left: 130, bottom: 140},
      {left: 350, bottom: 220},
      {left: 580, bottom: 170},
      {left: 730, bottom: 320},
    ],
    background: "mapa 1.0.gif"
  },
  3: {
    platforms: [
      {left: 0, bottom: 0, width: 900},
      {left: 100, bottom: 180, width: 100},
      {left: 250, bottom: 280, width: 140},
      {left: 450, bottom: 220, width: 150},
      {left: 650, bottom: 140, width: 120},
      {left: 800, bottom: 300, width: 90},
    ],
    seeds: [
      {left: 130, bottom: 200},
      {left: 280, bottom: 300},
      {left: 480, bottom: 240},
      {left: 680, bottom: 160},
      {left: 830, bottom: 320},
    ],
    background: "mapa 1.0.gif"
  }
};

// Remove todas as plataformas e sementes do DOM
function clearGameObjects() {
  document.querySelectorAll('.platform').forEach(el => el.remove());
  document.querySelectorAll('.seed').forEach(el => el.remove());
}

// Cria as plataformas e sementes da fase atual
function loadPhase(phaseNumber) {
  clearGameObjects();

  const phase = phases[phaseNumber];
  if (!phase) {
    console.error("Fase não encontrada:", phaseNumber);
    return;
  }

  // Atualiza título
  gameTitle.textContent = `Salve o Mundo - Fase ${phaseNumber}`;

  // Atualiza background
  game.style.backgroundImage = `url('${phase.background}')`;

  // Cria plataformas
  phase.platforms.forEach(({left, bottom, width}) => {
    const platform = document.createElement('div');
    platform.classList.add('platform');
    platform.style.left = left + 'px';
    platform.style.bottom = bottom + 'px';
    platform.style.width = width + 'px';
    
    // CORREÇÃO: Adicionar a imagem da plataforma
    platform.style.backgroundImage = "url('Plataforma.gif')";
    platform.style.backgroundSize = "cover";
    platform.style.backgroundRepeat = "no-repeat";
    
    game.appendChild(platform);
  });

  // Cria sementes
  phase.seeds.forEach(({left, bottom}) => {
    const seed = document.createElement('div');
    seed.classList.add('seed');
    seed.style.left = left + 'px';
    seed.style.bottom = bottom + 'px';
    
    // Garantir que a semente tenha a imagem também
    seed.style.backgroundImage = "url('Semente Esperança.gif')";
    seed.style.backgroundSize = "contain";
    seed.style.backgroundRepeat = "no-repeat";
    
    game.appendChild(seed);
  });

  // Reseta player position
  posX = 100;
  posY = phase.platforms[0].bottom + 20;
  velocityY = 0;
  grounded = false;
  facingRight = true;

  // Esconde mensagem e botão
  message.classList.remove('show');
  nextLevelBtn.classList.remove('show');
  nextLevelBtn.style.display = 'none';
  message.style.display = 'none';

  // Atualiza player visual imediatamente
  updatePlayerPosition();
}

// Atualiza a posição do player no DOM
function updatePlayerPosition() {
  player.style.left = `${posX}px`;
  player.style.bottom = `${posY}px`;
  player.style.transform = `scaleX(${facingRight ? 1 : -1})`;
}

// Lógica de colisão e física
function update() {
  const playerWidth = player.offsetWidth;
  const playerHeight = player.offsetHeight;
  const gameWidth = game.clientWidth;

  // Movimento horizontal
  if (keys['arrowright'] || keys['d']) {
    posX += MOVE_SPEED;
    facingRight = true;
  }
  if (keys['arrowleft'] || keys['a']) {
    posX -= MOVE_SPEED;
    facingRight = false;
  }

  posX = Math.max(0, Math.min(gameWidth - playerWidth, posX));

  // Pulo
  if ((keys[' '] || keys['space'] || keys['w'] || keys['arrowup']) && grounded) {
    velocityY = JUMP_POWER;
    grounded = false;
  }

  if (!grounded) {
    velocityY -= GRAVITY;
    posY += velocityY;
  }

  grounded = false;

  // Colisão com plataformas
  const platforms = document.querySelectorAll('.platform');
  platforms.forEach(platform => {
    const platRect = platform.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();
    const platLeft = platRect.left - gameRect.left;
    const platBottom = gameRect.bottom - platRect.bottom;
    const platWidth = platform.offsetWidth;
    const platTop = platBottom + platform.offsetHeight;

    const playerBottom = posY;
    const playerTop = posY + playerHeight;
    const playerLeft = posX;
    const playerRight = posX + playerWidth;

    const horizontallyOverlapping = playerRight > platLeft && playerLeft < platLeft + platWidth;

    if (
      velocityY <= 0 &&
      horizontallyOverlapping &&
      playerBottom >= platTop &&
      playerBottom + velocityY <= platTop + COLLISION_TOLERANCE
    ) {
      posY = platTop;
      velocityY = 0;
      grounded = true;
    }
  });

  // Colisão com chão (plataforma base)
  const ground = platforms[0];
  const groundHeight = ground ? ground.offsetHeight : 0;
  if (posY < groundHeight) {
    posY = groundHeight;
    velocityY = 0;
    grounded = true;
  }

  // Coleta de sementes
  const seeds = document.querySelectorAll('.seed');
  seeds.forEach(seed => {
    const seedRect = seed.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    const seedLeft = seedRect.left - gameRect.left;
    const seedBottom = gameRect.bottom - seedRect.bottom;
    const seedRight = seedLeft + seed.offsetWidth;
    const seedTop = seedBottom + seed.offsetHeight;

    const playerLeft = posX;
    const playerRight = posX + playerWidth;
    const playerTop = posY + playerHeight;
    const playerBottom = posY;

    const isColliding =
      playerRight > seedLeft &&
      playerLeft < seedRight &&
      playerTop > seedBottom &&
      playerBottom < seedTop;

    if (isColliding && !seed.classList.contains('collected')) {
      seed.classList.add('collected');
      setTimeout(() => seed.remove(), 300);
    }
  });

  // Verifica se todas as sementes foram coletadas
  if (document.querySelectorAll('.seed').length === 0 && !message.classList.contains('show')) {
    message.textContent = "Você coletou todas as sementes! 🌱";
    message.classList.add('show');
    message.style.display = 'block';

    if (currentPhase < Object.keys(phases).length) {
      nextLevelBtn.textContent = "Próxima Fase";
      nextLevelBtn.style.display = 'inline-block';
      nextLevelBtn.classList.add('show');
    } else {
      // Última fase completada
      nextLevelBtn.textContent = "Reiniciar Jogo";
      nextLevelBtn.style.display = 'inline-block';
      nextLevelBtn.classList.add('show');
    }
  }

  // Atualiza sprite do personagem
  if (keys['arrowright'] || keys['d'] || keys['arrowleft'] || keys['a']) {
    player.style.backgroundImage = "url('Prota Andando Final.gif')";
  } else {
    player.style.backgroundImage = "url('Prota Respirando.gif')";
  }

  updatePlayerPosition();

  requestAnimationFrame(update);
}

// Botão para avançar de fase
nextLevelBtn.addEventListener('click', () => {
  if (currentPhase < Object.keys(phases).length) {
    currentPhase++;
  } else {
    // Reiniciar o jogo
    currentPhase = 1;
  }
  nextLevelBtn.classList.remove('show');
  nextLevelBtn.style.display = 'none';
  message.classList.remove('show');
  message.style.display = 'none';
  loadPhase(currentPhase);
});

loadPhase(currentPhase);
update();