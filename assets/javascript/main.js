import { Initializer } from './initializer.js';

var config = {
    type: Phaser.AUTO,
    width: 780,
    height: 615,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var platforms;
var cursors;
var gameOver = false;
var text = "You wake up in an empty room...";
var key;
var door;
var hasKey = false;
var hole; 
var redirect = 0;

var game = new Phaser.Game(config);


function preload ()
{
    this.load.image('floor', 'assets/sprites/gray.png');
    this.load.image('wall', 'assets/sprites/platform_gray.png');
    this.load.image('stone', 'assets/sprites/stone.png');
    this.load.image('key', 'assets/sprites/key.png');
    this.load.image('door', 'assets/sprites/door.png');
    this.load.image('hole', 'assets/sprites/hole.webp');
    this.load.spritesheet('shogun_sprite', 'assets/sprites/shogun_sprites_flat.png', { frameWidth: 63, frameHeight: 62});
}

function create ()
{
    this.add.image(400, 300, 'floor');

    key = this.physics.add.sprite(200, 400, 'key');
    key.setScale(0.2);
    
    door = this.physics.add.sprite(705, 250, 'door');
    door.setScale(0.15);
    door.body.moves = false;

    hole = this.physics.add.sprite(100, 140, 'hole');
    hole.setScale(0.2);

    platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 14; i++){
        platforms.create(25+56*i, 25, 'stone').setScale(0.5).refreshBody();
    }
    
    for (let i = 0; i < 14; i++){
        let platform = platforms.create(25+56*i, 589, 'stone').setScale(0.5).refreshBody();
        platform.angle += 180;
    }

    for (let i = 0; i < 9; i++){
        let platform = platforms.create(760, 57+25+56*i, 'stone').setScale(0.5).refreshBody();
        platform.angle += 90;
    }

    for (let i = 0; i < 9; i++){
        let platform = platforms.create(25, 57+25+56*i, 'stone').setScale(0.5).refreshBody();
        platform.angle += 270;
    }

    for (let i = 0; i < 11; i++){
        let platform = platforms.create(85+56*i, 250, 'stone').setScale(0.5).refreshBody();
        platform.angle += 180;
    }

    text = this.add.text(75, 500, text, { fontSize: '32px', fill: '#000' });

    // The player and its settings
    player = this.physics.add.sprite(400, 450, 'shogun_sprite');
    player.setSize(30, 60, true)

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('shogun_sprite', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'shogun_sprite', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'stop',
        frames: [ { key: 'shogun_sprite', frame: 0 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('shogun_sprite', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('shogun_sprite', { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('shogun_sprite', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    console.log(platforms);
    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, door);
    this.physics.add.overlap(player, key, grabKey, null, this);
    this.physics.add.overlap(player, door, handleDoor, null, this);
    this.physics.add.overlap(player, hole, handleHole, null, this);
}

function handleHole(player, hole) {
    console.log('hole');
    // window.location.replace('https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage');
    if (redirect === 0) {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank').focus();
        redirect = 1;
    }
}

function handleDoor(player, door) {
    if (hasKey) {
        door.disableBody(true, true);
    }
}

function grabKey(player, key) {
    key.disableBody(true, true);
    hasKey = true;
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.space.isDown)
    {
        interactNearbyObjects();
    }
    else if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.setVelocityY(0);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.setVelocityY(0);

        player.anims.play('right', true);
    }
    else if (cursors.up.isDown)
    {
        player.setVelocityX(0);
        player.setVelocityY(-160);
        
        player.anims.play('up', true);
    } else if (cursors.down.isDown) {
        player.setVelocityX(0);
        player.setVelocityY(160);

        player.anims.play('down', true);
    } else {
        player.setVelocityY(0);
        player.setVelocityX(0);

        player.anims.play('stop');
    }
}

function interactNearbyObjects ()
{
    text.setText('INTERACTING!');
}
