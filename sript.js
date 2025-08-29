// --- Definição das variáveis de estado e elementos DOM ---
// Remova o canvas e o ctx
const petImage = document.getElementById('pet-image');
const petMessage = document.getElementById('pet-message');

let petState = {
    fome: 100,
    sede: 100,
    felicidade: 100,
    saude: 100,
    isAlive: true
};

// Carrega as barras de progresso do DOM
const fomeBar = document.getElementById('fome-progress');
const sedeBar = document.getElementById('sede-progress');
const felicidadeBar = document.getElementById('felicidade-progress');
const saudeBar = document.getElementById('saude-progress');

// Carrega os botões de ação do DOM
const alimentarBtn = document.getElementById('alimentar-btn');
const darAguaBtn = document.getElementById('dar-agua-btn');
const brincarBtn = document.getElementById('brincar-btn');
const remedioBtn = document.getElementById('remedio-btn');

// --- Caminhos para as imagens do bichinho ---
const petImages = {
    normal: 'caminho/para/pet_normal.png',
    fome: 'caminho/para/pet_com_fome.png',
    sede: 'caminho/para/pet_com_sede.png',
    triste: 'caminho/para/pet_triste.png',
    doente: 'caminho/para/pet_doente.png',
    morto: 'caminho/para/pet_morto.png'
};

// --- Funções de Lógica do Jogo ---
function updateUI() {
    // Atualiza o valor das barras de progresso
    fomeBar.value = petState.fome;
    sedeBar.value = petState.sede;
    felicidadeBar.value = petState.felicidade;
    saudeBar.value = petState.saude;

    // A cor da barra de saúde pode mudar dependendo do seu valor
    if (petState.saude <= 25) {
        saudeBar.classList.add('low-health');
    } else {
        saudeBar.classList.remove('low-health');
    }

    // Lógica para definir qual imagem exibir
    if (!petState.isAlive) {
        petImage.src = petImages.morto;
        showMessage("Fim de jogo! Seu bichinho não sobreviveu :(");
        disableButtons();
    } else if (petState.saude <= 25) {
        petImage.src = petImages.doente;
        showMessage("Seu bichinho está doente! Dê remédio!");
    } else if (petState.fome <= 25) {
        petImage.src = petImages.fome;
        showMessage("Seu bichinho está com fome! Hora de alimentar.");
    } else if (petState.sede <= 25) {
        petImage.src = petImages.sede;
        showMessage("Seu bichinho está com sede! Dê água.");
    } else if (petState.felicidade <= 25) {
        petImage.src = petImages.triste;
        showMessage("Seu bichinho está triste! Brinque com ele!");
    } else {
        petImage.src = petImages.normal;
        showMessage("Tudo certo por aqui!");
    }
}

function disableButtons() {
    alimentarBtn.disabled = true;
    darAguaBtn.disabled = true;
    brincarBtn.disabled = true;
    remedioBtn.disabled = true;
}

function showMessage(msg) {
    petMessage.textContent = msg;
}

// --- Ações dos Botões ---
// (Mantenha as funções dos botões inalteradas)
alimentarBtn.addEventListener('click', () => {
    if (!petState.isAlive) return;
    petState.fome = Math.min(100, petState.fome + 25);
    petState.felicidade = Math.min(100, petState.felicidade + 5);
    showMessage("O bichinho se alimentou! A fome diminuiu.");
    updateUI();
});

darAguaBtn.addEventListener('click', () => {
    if (!petState.isAlive) return;
    petState.sede = Math.min(100, petState.sede + 30);
    showMessage("O bichinho bebeu água! A sede foi saciada.");
    updateUI();
});

brincarBtn.addEventListener('click', () => {
    if (!petState.isAlive) return;
    if (petState.felicidade >= 100) {
        showMessage("Seu bichinho já está muito feliz!");
        return;
    }
    petState.felicidade = Math.min(100, petState.felicidade + 35);
    petState.fome = Math.max(0, petState.fome - 10);
    petState.sede = Math.max(0, petState.sede - 10);
    showMessage("Você brincou com o bichinho. Ele está mais feliz!");
    updateUI();
});

remedioBtn.addEventListener('click', () => {
    if (!petState.isAlive) return;
    if (petState.saude >= 100) {
        showMessage("Seu bichinho já está saudável!");
        return;
    }
    petState.saude = Math.min(100, petState.saude + 50);
    showMessage("O bichinho tomou o remédio e está se sentindo melhor.");
    updateUI();
});

// --- Game Loop Principal ---
function gameLoop() {
    if (!petState.isAlive) return;

    // Diminui os status com o tempo
    petState.fome = Math.max(0, petState.fome - 0.5);
    petState.sede = Math.max(0, petState.sede - 0.5);
    petState.felicidade = Math.max(0, petState.felicidade - 0.2);
    
    // Diminuição da saúde dependendo dos outros status
    if (petState.fome <= 0 || petState.sede <= 0 || petState.felicidade <= 0) {
        petState.saude = Math.max(0, petState.saude - 0.5);
    }

    // Verifica as condições de morte
    if (petState.fome <= 0 && petState.sede <= 0 && petState.saude <= 0) {
        petState.isAlive = false;
    }

    updateUI();
}

// Inicia o loop do jogo
setInterval(gameLoop, 500);

// Chamada inicial para renderizar a UI
updateUI();