# Penny Drop Game

A JavaScript implementation of the fun Penny Drop Game!

## Game Rules

1. Every player starts with 12 pennies
2. There is a box with 6 slots and a 6-sided die:
   - Slots 1-5 are partial (pennies stick up and are visible)
   - Slot 6 goes through into the box (pennies are removed from play)
3. Each player rolls the die at least once per turn:
   - **Roll 6**: Penny goes in the box (removed from play). Player may choose to roll again
   - **Roll 1-5 (empty slot)**: Place penny in that slot. Player may choose to roll again
   - **Roll 1-5 (filled slot)**: Take ALL pennies from slots 1-5. Turn ends immediately
4. Continue around the group until someone runs out of pennies
5. **First person to run out of all their pennies wins!**

## How to Play

1. Open `index.html` in your web browser
2. Enter player names and click "Start Game"
3. Follow the on-screen prompts to roll the die and make decisions
4. Have fun!

## Files

- `index.html` - Main game interface
- `game.js` - Game logic and mechanics
- `style.css` - Game styling