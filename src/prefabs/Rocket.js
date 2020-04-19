//Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add an object to existing scene
        scene.add.existing(this);
        this.isFiring = false; //track rocket firing status

        //add rocket sound
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update() {
        // left/right movement
  
        if(keyLEFT.isDown && this.x >= 47) {
            this.x -= 2;
        } else if (keyRIGHT.isDown && this.x <= 584) {
            this.x += 2;
        }
        
        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF)) {
            this.isFiring = true;
            this.sfxRocket.play(); // play sound
        }

        //if fired, move up
        if(this.isFiring && this.y >= 108) {
            this.y -= 2;
        }

        //reset on miss
        if(this.y <= 108) {
            this.reset();
        }

    }

    //reset rocket to bottom of screen
    reset() {
        this.isFiring = false;
        this.y = 431;
    }
}