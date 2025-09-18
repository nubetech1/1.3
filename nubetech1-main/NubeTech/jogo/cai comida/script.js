// Definições iniciais e captura de elementos
const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreSpan = document.getElementById("score");
const livesSpan = document.getElementById("lives");
const gameOverScreen = document.getElementById("game-over");
const finalScoreText = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");

// Variáveis de controle do jogo
let score = 0;
let lives = 3;
let playerX = (game.clientWidth - player.clientWidth) / 2;
let playerY = 10; // Posição fixa verticalmente
let facingRight = true; // Direção inicial do personagem
let keys = {};

// Inicializando a posição do jogador
player.style.left = playerX + "px";
player.style.bottom = playerY + "px";

// Função para controlar o movimento do jogador
function movePlayer() {
  const step = 5;  // Passo reduzido para movimentos mais suaves
  let isMoving = false; // Flag para checar se está se movendo

  if (keys["ArrowLeft"] || keys["a"]) {
    if (playerX > 0) {
      playerX -= step;
      facingRight = false;
      isMoving = true;
    }
  }
  if (keys["ArrowRight"] || keys["d"]) {
    if (playerX < game.clientWidth - player.clientWidth) {
      playerX += step;
      facingRight = true;
      isMoving = true;
    }
  }

  // Atualiza a posição do jogador e a rotação (direção)
  player.style.left = playerX + "px";
  player.style.transform = `scaleX(${facingRight ? 1 : -1})`;

  // Se o jogador está se movendo, usa a animação de andar, senão usa a de parado
  if (isMoving) {
    player.style.backgroundImage = "url('pompom andando.gif')";
  } else {
    player.style.backgroundImage = "url('pompom.png')";  // Imagem do coelho parado
  }
}

// Função para lidar com as teclas pressionadas
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

// Função para lidar com a liberação das teclas
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Função para criar um novo item (comida ou lixo)
function createItem() {
  const item = document.createElement("div");
  const isFood = Math.random() > 0.3;
  item.classList.add("item", isFood ? "food" : "trash");
  item.dataset.type = isFood ? "food" : "trash";

  const width = isFood ? 50 : 30;
  item.style.width = width + "px";
  item.style.height = width + "px";
  item.style.left = Math.random() * (game.clientWidth - width) + "px";

  if (isFood) {
    item.style.backgroundImage = "url('Cenoura.png')";
  } else {
    const trashImages = ["halter.png", "peso2.png"];
    const randomTrash = trashImages[Math.floor(Math.random() * trashImages.length)];
    item.style.backgroundImage = `url('${randomTrash}')`;
  }

  game.appendChild(item);
  dropItem(item);
}

// Função para fazer os itens caírem e verificar colisão
function dropItem(item) {
  let top = 0;
  const fallSpeed = 2;
  const interval = setInterval(() => {
    top += fallSpeed;
    item.style.top = top + "px";

    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Verificação de colisão com o jogador
    if (
      itemRect.bottom >= playerRect.top &&
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left
    ) {
      clearInterval(interval);
      item.remove();
      if (item.dataset.type === "food") {
        score++;
      } else {
        lives--;
      }
      updateStatus();
    }

    // Se o item cair fora da tela, remove ele
    if (top > game.clientHeight) {
      clearInterval(interval);
      item.remove();
    }
  }, 16);
}

// Função para atualizar o status do jogo (pontos e vidas)
function updateStatus() {
  scoreSpan.textContent = `Pontos: ${score}`;
  livesSpan.textContent = `Vidas: ${lives}`;
  if (lives <= 0) showGameOver();
}

// Função para mostrar a tela de "Game Over"
function showGameOver() {
  finalScoreText.textContent = `Sua pontuação: ${score}`;
  gameOverScreen.style.display = "flex";
  clearInterval(itemInterval);
}

// Função para reiniciar o jogo
restartButton.addEventListener("click", () => location.reload());

// Intervalo para criar itens no jogo
let itemInterval = setInterval(createItem, 1000);

// Função principal de atualização (loop de animação)
function update() {
  movePlayer();
  requestAnimationFrame(update);  // Faz o loop de animação
}

update(); // Inicializa o loop de animação
