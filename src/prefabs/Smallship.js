//smallship prefap
class Smallship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, timeValue) {
        super(scene, x, y, texture, frame);

        //add an object to existing scene
        scene.add.existing(this);
        this.points = pointValue;
        this.time = timeValue;
    }

    update() {
        //move spaceship left
        this.x -= game.settings.smallshipSpeed;
        // wraparound screen bounds
        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
    }
}