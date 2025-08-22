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
    
    // Collect player names
    for (let i = 1; i <= playerCount; i++) {
        const name = document.getElementById(`player${i}`).value.trim() || `Player ${i}`;
        players.push({
            name: name,
            pennies: 12
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

// Show action buttons (roll again / end turn)
function showActionButtons() {
    document.getElementById('rollAgain').style.display = 'block';
    document.getElementById('endTurn').style.display = 'block';
    document.getElementById('rollDie').style.display = 'none';
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
    updateGameMessage("Roll the die again!");
}

// End turn
function endTurn() {
    hideActionButtons();
    nextPlayer();
}

// Move to next player
function nextPlayer() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    gameState.canRollAgain = false;
    updateDisplay();
    updateGameMessage(`${gameState.players[gameState.currentPlayerIndex].name}'s turn. Roll the die!`);
    
    // Show only the roll die button for the new player
    document.getElementById('rollAgain').style.display = 'none';
    document.getElementById('endTurn').style.display = 'none';
    document.getElementById('rollDie').style.display = 'block';
    document.getElementById('rollDie').disabled = false;
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
