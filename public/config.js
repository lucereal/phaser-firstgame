const phaser = require('phaser');

var canvas_width = window.innerWidth * window.devicePixelRatio;
var canvas_height = window.innerHeight * window.devicePixelRatio;
var platforms;
var player;
var cursors;

function preload(){
    console.log("in preload");
    this.load.image('wall','assets/fog.png');
    this.load.image('space','assets/deep-space.jpg');
    this.load.image('clown','assets/clown.png');
    this.load.image('platform','assets/platform.png');
    this.load.spritesheet('robot', 'assets/running_bot.png',{frameWidth:34, frameHeight:60});
}
function create(){
    console.log('in create');
     this.add.image(256,256,'space');

     //our platforms will be static bodies, if they were dynamic, any collision
     //between player and ground would cause the ground to move from the resulting 
     //force of the collision
     platforms = this.physics.add.staticGroup();
     platforms.create(250,500,'platform').refreshBody();
     platforms.create(250,420,'platform').setScale(0.4).refreshBody();
     player = this.physics.add.sprite(100,200,'clown');
     player.setBounce(0.2);//player given slight bounce so when landing it will bounce 
     player.setCollideWorldBounds(true);//this stops the sprite from running outside of the game demensions
    //  this.player = this.add.image(10,10,'clown').setOrgin(0.5,0.5).setDesiplaySize(26,32);
    //     this.player.body.collideWorldBounds = true;

    //this is a collider object, it monitors two physics objects (can be groups)
    //and checks for collisions or overlap between them, if that occurs you can optionally
    //invoke a callback, but not needed for this situation
    this.physics.add.collider(player,platforms);

    //Phaser has a built in keyboard manager, it populates the cursors object with
    //four properties: up,down,left,right
    //all instances of key objects
    cursors = this.input.keyboard.createCursorKeys();
    }

function update(){
    console.log('in update');
    if(cursors.left.isDown){
        player.setVelocityX(-200);
    }else if(cursors.right.isDown){
        player.setVelocityX(200);
    }else{
        player.setVelocityX(0);
    }

    //jump
    if(cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-180);
    }
}

//instanciate new phaser game with width, height,
//render mode: AUTO which will detect which render mode your browser supports
//'game' the name of the div where our game should be loaded
//scene: the intital state object
var config = {
    type: Phaser.AUTO,
    width: 512,
    height: 512,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    parent:'game',
    scene: {
        preload: preload,
        create: create,
        update
    }
};


const game = new phaser.Game(config);
//phaser uses a notion of 'states' to represent each screen of your game






// function preload ()
// {
//     this.load.setBaseURL('http://labs.phaser.io');

//     this.load.image('sky', 'assets/skies/space3.png');
//     this.load.image('logo', 'assets/sprites/phaser3-logo.png');
//     this.load.image('red', 'assets/particles/red.png');
// }

// function create ()
// {
//     this.add.image(400, 300, 'sky');

//     var particles = this.add.particles('red');

//     var emitter = particles.createEmitter({
//         speed: 100,
//         scale: { start: 1, end: 0 },
//         blendMode: 'ADD'
//     });

//     var logo = this.physics.add.image(400, 100, 'logo');

//     logo.setVelocity(100, 200);
//     logo.setBounce(1, 1);
//     logo.setCollideWorldBounds(true);

//     emitter.startFollow(logo);
// }