class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images and title sprite
        this.load.image('rocket', './assets/rocket.png');
        //this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('smallship', './assets/smallship.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.image('newShip', './assets/newspaceship.png');
    }

    create() {
        //place tile sprint
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        
        //white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        
        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        //add the rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 
        431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        //add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'newShip', 
        0, 30, 5000).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'newShip', 
        0, 20, 3000).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'newShip', 
        0, 10, 1000).setOrigin(0, 0);
        this.smallship = new Smallship(this, game.config.width, 235, 'smallship', 
        0, 50, 7000).setOrigin(0, 0);
        
        //define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        this.p1Score = 0;
        //score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(55, 54, this.p1Score, scoreConfig);

        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#842603',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.timeLeft = this.add.text(475, 54, game.settings.displayTimer, timeConfig);
        this.timedEvent = this.time.addEvent({delay: 1000, callback: onEvent, callbackScope: this, loop: true});

        //game over flag
        this.gameOver = false;
        // 60 second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            if(this.p1Score > highScore) {
                highScore = this.p1Score;
            }
        }, null, this);

        this.highLeft = this.add.text(185, 54, "High Score: " + highScore, scoreConfig);

        

    }

    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
            game.settings.displayTimer = game.settings.gameTimer/1000;
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        // scroll starfield
        this.starfield.tilePositionX -= 4;

        //update rocket
        this.p1Rocket.update();

        //update spaceship
        if (!this.gameOver) {
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.smallship.update();
        }

        //check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.smallship)) {
            this.p1Rocket.reset();
            this.shipExplode(this.smallship);
        }
    }

    checkCollision(rocket, ship) {
        //Simle AAB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y +ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            } else {
                return false;
            }
    }

    shipExplode(ship) {
        ship.alpha = 0; //temporarily hide ship
        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             //play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        //score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.clock.delay += ship.time;
        this.game.settings.displayTimer += ship.time/1000;

        //plays explosion sound
        this.sound.play('sfx_explosion');
    }

}

function formatTime(seconds) {
    var minutes = Math.floor(seconds/60);

    var partInSeconds = seconds%60;

    partInSeconds = partInSeconds.toString().padStart(2, '0');

    return '${minutes}:${partInSeconds}';
}

function onEvent () {
    if (this.game.settings.displayTimer > 0) {
        this.game.settings.displayTimer -= 1;
    }
    this.timeLeft.setText(game.settings.displayTimer);
}