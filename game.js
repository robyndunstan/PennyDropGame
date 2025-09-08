// Game state
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    slots: [null, null, null, null, null, null], // slots 0-4 (representing slots 1-5), slot 5 unused
    droppedPennies: 0,
    gameStarted: false,
    currentRoll: null,
    canRollAgain: false
};

// Die faces
const dieFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

// Initialize the game
function initializeGame() {
    updatePlayerInputs();
}

// Update player input fields based on selected number of players
function updatePlayerInputs() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    const playerInputsContainer = document.getElementById('playerInputs');
    
    playerInputsContainer.innerHTML = '';
    
    for (let i = 1; i <= playerCount; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-input';
        playerDiv.innerHTML = `
            <label for="player${i}">Player ${i} Name:</label>
            <input type="text" id="player${i}" placeholder="Enter name" value="Player ${i}">
        `;
        playerInputsContainer.appendChild(playerDiv);
    }
}

// Start the game
function startGame() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    const players = [];
    
    // Collect player names and types
    for (let i = 1; i <= playerCount; i++) {
        const name = document.getElementById(`player${i}`).value.trim() || `Player ${i}`;
        const isAI = document.getElementById(`player${i}AI`) ? document.getElementById(`player${i}AI`).checked : false;
        const aiDifficulty = document.getElementById(`player${i}Difficulty`) ? document.getElementById(`player${i}Difficulty`).value : 'easy';
        
        players.push({
            name: name,
            pennies: 12,
            isAI: isAI,
            aiDifficulty: aiDifficulty
        });
    }
    
    // Initialize game state
    gameState.players = players;
    gameState.currentPlayerIndex = 0;
    gameState.slots = [null, null, null, null, null];
    gameState.droppedPennies = 0;
    gameState.gameStarted = true;
    gameState.currentRoll = null;
    gameState.canRollAgain = false;
    
    // Show game board and hide setup
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('gameBoard').classList.remove('hidden');
    
    // Update display
    updateDisplay();
    updateGameMessage("Roll the die to start your turn!");
}

// Update player input fields based on selected number of players
function updatePlayerInputs() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    const playerInputsContainer = document.getElementById('playerInputs');
    
    playerInputsContainer.innerHTML = '';
    
    for (let i = 1; i <= playerCount; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-input';
        
        // First player is always human
        if (i === 1) {
            playerDiv.innerHTML = `
                <label for="player${i}">Player ${i} Name:</label>
                <input type="text" id="player${i}" placeholder="Enter name" value="Player ${i}">
            `;
        } else {
            playerDiv.innerHTML = `
                <label for="player${i}">Player ${i} Name:</label>
                <input type="text" id="player${i}" placeholder="Enter name" value="Player ${i}">
                <div class="ai-controls">
                    <label>
                        <input type="checkbox" id="player${i}AI" onchange="toggleAIOptions(${i})"> AI Player
                    </label>
                    <select id="player${i}Difficulty" style="display: none;">
                        <option value="easy">Easy (Always rolls again)</option>
                        <option value="medium">Medium (Stops at 3 pennies on board)</option>
                        <option value="hard">Hard (Stops at 2 pennies on board)</option>
                    </select>
                </div>
            `;
        }
        playerInputsContainer.appendChild(playerDiv);
    }
}

// Toggle AI difficulty selector
function toggleAIOptions(playerNumber) {
    const aiCheckbox = document.getElementById(`player${playerNumber}AI`);
    const difficultySelect = document.getElementById(`player${playerNumber}Difficulty`);
    const nameInput = document.getElementById(`player${playerNumber}`);
    
    if (aiCheckbox.checked) {
        difficultySelect.style.display = 'block';
        updateAIName(playerNumber);
        
        // Add event listener to update name when difficulty changes
        difficultySelect.onchange = () => updateAIName(playerNumber);
    } else {
        difficultySelect.style.display = 'none';
        difficultySelect.onchange = null; // Remove event listener
        nameInput.value = `Player ${playerNumber}`;
    }
}

// Update AI player name based on difficulty and player number
function updateAIName(playerNumber) {
    const difficultySelect = document.getElementById(`player${playerNumber}Difficulty`);
    const nameInput = document.getElementById(`player${playerNumber}`);
    const difficulty = difficultySelect.value;
    
    // Capitalize first letter of difficulty
    const capitalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    nameInput.value = `AI ${capitalizedDifficulty} ${playerNumber}`;
}

// AI decision making
function makeAIDecision(player) {
    const penniesOnBoard = gameState.slots.filter(slot => slot !== null).length;
    
    switch (player.aiDifficulty) {
        case 'easy':
            return true; // Always roll again
        case 'medium':
            return penniesOnBoard < 3; // Stop if 3+ pennies on board
        case 'hard':
            return penniesOnBoard < 2; // Stop if 2+ pennies on board
        default:
            return true;
    }
}

// Handle AI turn
function handleAITurn() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (!currentPlayer.isAI || !gameState.canRollAgain) {
        return;
    }
    
    // AI makes decision after a short delay for realism
    setTimeout(() => {
        const shouldRollAgain = makeAIDecision(currentPlayer);
        
        if (shouldRollAgain) {
            updateGameMessage(`${currentPlayer.name} decides to roll again...`);
            setTimeout(() => {
                rollAgain();
            }, 1000);
        } else {
            updateGameMessage(`${currentPlayer.name} decides to end their turn.`);
            setTimeout(() => {
                endTurn();
            }, 1500);
        }
    }, 1500);
}

// Roll the die
function rollDie() {
    const dieElement = document.getElementById('die');
    const rollButton = document.getElementById('rollDie');
    
    // Disable roll button during animation
    rollButton.disabled = true;
    dieElement.classList.add('rolling');
    
    // Animate the die
    let rollCount = 0;
    const rollAnimation = setInterval(() => {
        const randomFace = dieFaces[Math.floor(Math.random() * 6)];
        dieElement.textContent = randomFace;
        rollCount++;
        
        if (rollCount >= 8) {
            clearInterval(rollAnimation);
            
            // Final roll
            const finalRoll = Math.floor(Math.random() * 6) + 1;
            gameState.currentRoll = finalRoll;
            dieElement.textContent = dieFaces[finalRoll - 1];
            dieElement.classList.remove('rolling');
            
            // Process the roll
            processRoll(finalRoll);
            rollButton.disabled = false;
        }
    }, 100);
}

// Process the die roll
function processRoll(roll) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (roll === 6) {
        // Penny goes in the box (dropped)
        currentPlayer.pennies--;
        gameState.droppedPennies++;
        updateDisplay();
        
        if (currentPlayer.pennies === 0) {
            endGame(currentPlayer);
            return;
        }
        
        updateGameMessage(`${currentPlayer.name} rolled a 6! Penny dropped in the box. You can roll again or end your turn.`);
        gameState.canRollAgain = true;
        showActionButtons();
    } else {
        // Rolls 1-5
        const slotIndex = roll - 1;
        
        if (gameState.slots[slotIndex] === null) {
            // Empty slot - place penny
            currentPlayer.pennies--;
            gameState.slots[slotIndex] = 1;
            updateDisplay();
            
            if (currentPlayer.pennies === 0) {
                endGame(currentPlayer);
                return;
            }
            
            updateGameMessage(`${currentPlayer.name} rolled a ${roll}! Penny placed in slot ${roll}. You can roll again or end your turn.`);
            gameState.canRollAgain = true;
            showActionButtons();
        } else {
            // Filled slot - take all pennies from slots 1-5
            let collectedPennies = 0;
            for (let i = 0; i < 5; i++) {
                if (gameState.slots[i] !== null) {
                    collectedPennies += gameState.slots[i];
                    gameState.slots[i] = null;
                }
            }
            
            currentPlayer.pennies += collectedPennies;
            updateDisplay();
            
            updateGameMessage(`${currentPlayer.name} rolled a ${roll}! Slot ${roll} was filled. Collected ${collectedPennies} pennies from all slots. Turn ends.`);
            gameState.canRollAgain = false;
            
            // Hide all buttons during transition
            document.getElementById('rollAgain').style.display = 'none';
            document.getElementById('endTurn').style.display = 'none';
            document.getElementById('rollDie').style.display = 'none';
            
            setTimeout(() => {
                nextPlayer();
            }, 2000);
        }
    }
}

// Show action buttons (roll again / end turn) - updated for AI
function showActionButtons() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (currentPlayer.isAI) {
        // For AI players, don't show buttons but handle turn automatically
        handleAITurn();
    } else {
        // For human players, show the buttons
        document.getElementById('rollAgain').style.display = 'block';
        document.getElementById('endTurn').style.display = 'block';
        document.getElementById('rollDie').style.display = 'none';
    }
}

// Hide action buttons
function hideActionButtons() {
    document.getElementById('rollAgain').style.display = 'none';
    document.getElementById('endTurn').style.display = 'none';
    document.getElementById('rollDie').style.display = 'block';
}

// Roll again
function rollAgain() {
    hideActionButtons();
    updateGameMessage("Rolling again...");
    rollDie();
}

// End turn
function endTurn() {
    hideActionButtons();
    nextPlayer();
}

// Move to next player - updated for AI
function nextPlayer() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    gameState.canRollAgain = false;
    updateDisplay();
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    updateGameMessage(`${currentPlayer.name}'s turn. Roll the die!`);
    
    // Show only the roll die button for the new player
    document.getElementById('rollAgain').style.display = 'none';
    document.getElementById('endTurn').style.display = 'none';
    document.getElementById('rollDie').style.display = 'block';
    
    // Only enable the button for human players
    if (currentPlayer.isAI) {
        document.getElementById('rollDie').disabled = true;
        setTimeout(() => {
            rollDie();
        }, 1500);
    } else {
        document.getElementById('rollDie').disabled = false;
    }
}

// Update the display
function updateDisplay() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Update current player info
    document.getElementById('currentPlayerName').textContent = currentPlayer.name;
    document.getElementById('currentPlayerPennies').textContent = currentPlayer.pennies;
    
    // Update slots
    for (let i = 0; i < 5; i++) {
        const slotElement = document.getElementById(`slot${i + 1}`);
        if (gameState.slots[i] !== null) {
            slotElement.innerHTML = '<div class="penny"></div>';
        } else {
            slotElement.innerHTML = '';
        }
    }
    
    // Update dropped pennies count
    document.getElementById('droppedCount').textContent = gameState.droppedPennies;
    
    // Update players list
    updatePlayersList();
}

// Update players list
function updatePlayersList() {
    const playersListElement = document.getElementById('playersList');
    playersListElement.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-status';
        if (index === gameState.currentPlayerIndex) {
            playerDiv.classList.add('current');
        }
        
        playerDiv.innerHTML = `
            <span class="player-name">${player.name}</span>
            <span class="player-pennies">${player.pennies} pennies</span>
        `;
        
        playersListElement.appendChild(playerDiv);
    });
}

// Update game message
function updateGameMessage(message) {
    document.getElementById('gameMessage').textContent = message;
}

// End the game
function endGame(winner) {
    document.getElementById('gameBoard').classList.add('hidden');
    document.getElementById('gameOver').classList.remove('hidden');
    
    document.getElementById('winnerMessage').textContent = `🎉 ${winner.name} wins! 🎉 They ran out of pennies first!`;
}

// Reset the game
function resetGame() {
    // Reset game state
    gameState = {
        players: [],
        currentPlayerIndex: 0,
        slots: [null, null, null, null, null, null],
        droppedPennies: 0,
        gameStarted: false,
        currentRoll: null,
        canRollAgain: false
    };
    
    // Show setup and hide other sections
    document.getElementById('setup').classList.remove('hidden');
    document.getElementById('gameBoard').classList.add('hidden');
    document.getElementById('gameOver').classList.add('hidden');
    
    // Reset die
    document.getElementById('die').textContent = '🎲';
    
    // Hide action buttons
    hideActionButtons();
    
    // Reset player inputs
    updatePlayerInputs();
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', initializeGame);
