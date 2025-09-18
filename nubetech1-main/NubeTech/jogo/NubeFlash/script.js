window.addEventListener('DOMContentLoaded', () => {
    const colors = ['green', 'red', 'yellow', 'blue'];
    const letters = ['C', 'S', 'A', 'A']; // Letras associadas às cores
    let gameSequence = []; // Sequência gerada pelo jogo 
    let playerSequence = [];// Sequência gerada pelo jogador 
    let round = 0; // Fase atual
    let score = 0; // Pontuação atual
    const maxRounds = 5; // Total de fases
    let currentWord = 'CASA'; // Palavra para a primeira fase
    let currentWordIndex = 0; // Para gerenciar o índice das palavras

    const wordList = ['CASA', 'COLO', 'LIVRO']; // Lista de palavras para as fases seguintes

    // Elementos do DOM
    const startButton = document.getElementById('start');
    const colorButtons = document.querySelectorAll('.color');
    const scoreDisplay = document.getElementById('score');
    const phaseDisplay = document.getElementById('phase');
    const wordDisplay = document.getElementById('word-display');

    // Atualiza o display da palavra com underscores
    function updateWordDisplay() {
        wordDisplay.textContent = currentWord
            .split('')
            .map(letter => playerSequence.includes(letter) ? letter : '_')
            .join(' ');
    }

    // Inicia o jogo
    startButton.addEventListener('click', startGame);

    // Evento de clique nas cores
    colorButtons.forEach(button => {
        button.addEventListener('click', () => handlePlayerClick(button));
    });

    // Começa o jogo zerando tudo 
    function startGame() {
        console.log('Jogo iniciado!');
        startButton.disabled = true;
        gameSequence = [];
        playerSequence = [];
        round = 0;
        score = 0;
        currentWord = wordList[currentWordIndex]; // Primeira palavra da lista
        updateScore();
        updateWordDisplay(); // Exibe a palavra com underscores
    }

    // Lida com a entrada do jogador
    function handlePlayerClick(button) {
        const color = button.id;
        const letter = button.getAttribute('data-letter'); // Pega a letra associada à cor
        
        // Adiciona a letra à sequência do jogador se ela estiver correta
        if (currentWord.includes(letter) && !playerSequence.includes(letter)) {
            playerSequence.push(letter);
            flashColor(color, letter);
            updateWordDisplay();
        }
        
        // Verifica se a palavra foi completada
        if (playerSequence.length === new Set(currentWord.split('')).size) { // Verifica se todas as letras foram acertadas
            score++;
            updateScore();
            setTimeout(nextRound, 1000); // Vai para a próxima fase após 1 segundo
        }
    }

    // Animação de clique na cor
    function flashColor(color, letter) {
        const el = document.getElementById(color);
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 300);
    }

    // Passa para a próxima fase
    function nextRound() {
        round++;
        if (round > maxRounds || currentWordIndex >= wordList.length) {
            showModal('Parabéns! Você completou todas as fases!');
            return;
        }

        currentWordIndex++; // Vai para a próxima palavra
        currentWord = wordList[currentWordIndex]; // Atualiza a palavra da fase
        playerSequence = []; // Reseta a sequência do jogador
        updateWordDisplay(); // Atualiza o display da palavra
        updateScore(); // Atualiza a pontuação
    }

    // Atualiza os valores da pontuação e fase na tela
    function updateScore() {
        scoreDisplay.textContent = score;
        phaseDisplay.textContent = round;
    }

    // Exibe o modal com mensagem
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalButton = document.getElementById('modal-button');

    modal.classList.add('hidden');
    // Fecha o modal ao clicar no botão 
    modalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        startButton.disabled = false;
    });

    function showModal(message) {
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
        modal.style.display = 'flex'; // <- força ele a aparecer mesmo com display: none anterior
    }
});
