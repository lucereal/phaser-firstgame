const phaser = require('phaser');

var canvas_width = window.innerWidth * window.devicePixelRatio;
var canvas_height = window.innerHeight * window.devicePixelRatio;

//hi
//hi

function preload(){
    console.log("in preload");
    this.load.image('wall','assets/fog.png');
    this.load.image('space','assets/deep-space.jpg');
}
function create(){
    console.log('in create');
     this.add.image(256,256,'space');
    //this.add.tileSprite(0,0,canvas_width,canvas_height,'wall');
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
        create: create
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