
        // --- Definição das variáveis de estado e elementos DOM ---
        const canvas = document.getElementById('pet-canvas');
        const ctx = canvas.getContext('2d');
        const petMessage = document.getElementById('pet-message');
        const petSize = 50; // Tamanho do nosso bichinho (em pixels)
        const groundLevel = canvas.height - 20; // Posição do chão

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

        // --- Funções de Desenho para a animação ---
        function drawPet() {
            // Limpa o canvas para o próximo frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Define o tamanho e cor do "bichinho" (um quadrado)
            ctx.fillStyle = '#ff8c00'; // Cor do pet
            
            // Desenha um "bichinho" pixelado
            ctx.fillRect(canvas.width / 2 - petSize / 2, groundLevel - petSize, petSize, petSize);
        }

        function drawSadPet() {
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             ctx.fillStyle = '#9c9c9c'; // Cor triste
             ctx.fillRect(canvas.width / 2 - petSize / 2, groundLevel - petSize, petSize, petSize);
        }
        
        function drawSickPet() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#b7f047'; // Cor de doente (verde)
            ctx.fillRect(canvas.width / 2 - petSize / 2, groundLevel - petSize, petSize, petSize);
        }

        // --- Funções de Lógica do Jogo ---

        function updateUI() {
            // Atualiza o valor das barras de progresso
            fomeBar.value = petState.fome;
            sedeBar.value = petState.sede;
            felicidadeBar.value = petState.felicidade;
            saudeBar.value = petState.saude;

            // Altera a imagem do pet baseado no seu estado
            if (!petState.isAlive) {
                // Game Over, desenha o pet morto e desativa os botões
                showMessage("Fim de jogo! Seu bichinho não sobreviveu :(");
                // Por agora, o pet sumirá se não estiver vivo.
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                disableButtons();
            } else if (petState.saude <= 25) {
                // Pet doente
                drawSickPet();
                showMessage("Seu bichinho está doente! Dê remédio!");
            } else if (petState.felicidade <= 25) {
                // Pet triste
                drawSadPet();
                showMessage("Seu bichinho está triste! Brinque com ele!");
            } else {
                // Pet normal
                drawPet();
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
            petState.fome = Math.max(0, petState.fome - 10); // Brincar dá fome!
            petState.sede = Math.max(0, petState.sede - 10); // Brincar dá sede!
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
            petState.saude = Math.max(0, petState.saude - 0.1);

            // Verifica as condições de morte
            if (petState.fome <= 0 || petState.sede <= 0 || petState.saude <= 0) {
                petState.isAlive = false;
            }

            updateUI();
        }

        // Inicia o loop do jogo
        setInterval(gameLoop, 500); // Roda a cada 0.5 segundos

        // Chamada inicial para renderizar o pet e a UI
        updateUI();
