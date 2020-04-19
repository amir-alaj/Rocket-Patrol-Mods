/*
Amir Alaj : aalaj
(10) Track highscore that persists across screens and is displayed in UI
(10) Allow player to control rocket after fired
(15) Display time (in seconds) on the screen
(15) Create new animated sprites for spaceships
(25) Create new spaceship type that is smaller, moves faster, worth more points, and worth more time
(25) Implement new timing/scoring mechanism that adds time on succesful hits.
*/

let config = {
    type: Phaser.CANVAS, 
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
};

let game = new Phaser.Game(config);

//define game settings
game.settings = {
    spaceshipSpeed: 3,
    smallshipSpeed: 6, 
    gameTimer: 60000
}

//reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT, highScore = 0;