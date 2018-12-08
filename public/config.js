const phaser = require('phaser');

var canvas_width = window.innerWidth * window.devicePixelRatio;
var canvas_height = window.innerHeight * window.devicePixelRatio;
var platforms;
var player;
var cursors;
var balls;
var score = 0;
var scoreText;
var bombs;
var playerspeed = 150;
var bullets;
var facing = 'left';
var fireRate = 200;
var nextFire = 0;
var time = 0;
var baddude;
var baddudeJumpRate = 300;
var nextBaddudeJump = 0;


function preload() {
    console.log("in preload");
    this.load.image('wall', 'assets/fog.png');
    this.load.image('space', 'assets/deep-space.jpg');
    this.load.image('clown', 'assets/clown.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.spritesheet('robot', 'assets/running_bot.png', { frameWidth: 34, frameHeight: 60 });
    this.load.image('ball', 'assets/mushroom.png');
    this.load.image('bomb', 'assets/red_ball.png');
    this.load.image('bullet', 'assets/bullet45.png');
    this.load.image('baddude', 'assets/wabbit.png');

}
function create() {
    console.log('in create');
    this.add.image(256, 256, 'space');

    //our platforms will be static bodies, if they were dynamic, any collision
    //between player and ground would cause the ground to move from the resulting 
    //force of the collision
    platforms = this.physics.add.staticGroup();
    platforms.create(250, 540, 'platform').setScale(2).refreshBody();
    platforms.create(250, 420, 'platform').setScale(0.4).refreshBody();
    platforms.create(100, 340, 'platform').setScale(0.4).refreshBody();
    platforms.create(450, 270, 'platform').setScale(0.5, 0.4).refreshBody();


    player = this.physics.add.sprite(100, 200, 'clown');
    player.setBounce(0.2);//player given slight bounce so when landing it will bounce 
    player.setCollideWorldBounds(true);//this stops the sprite from running outside of the game demensions
    //  this.player = this.add.image(10,10,'clown').setOrgin(0.5,0.5).setDesiplaySize(26,32);
    //     this.player.body.collideWorldBounds = true;

    //this is a collider object, it monitors two physics objects (can be groups)
    //and checks for collisions or overlap between them, if that occurs you can optionally
    //invoke a callback, but not needed for this situation
    this.physics.add.collider(player, platforms);

    //Phaser has a built in keyboard manager, it populates the cursors object with
    //four properties: up,down,left,right
    //all instances of key objects
    cursors = this.input.keyboard.createCursorKeys();


    //create dynamic physics group because we want the balls to be able to move
    //each ball will be texture the ball image
    //we will create one, then repeat 11 times, total of 12 balls
    //the first ball will be at x=12 and each one after will be at x+=70
    balls = this.physics.add.group({
        key: 'ball',
        repeat: 5,
        setXY: { x: 70, y: 0, stepX: 70 }
    });

    //this will assign each ball a bounce value between the range
    balls.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.7));
    })

    //create collider object for balls and platforms just like above 
    this.physics.add.collider(balls, platforms);


    //check to see if player overlaps with a ball, if so call the 
    //collectBall function
    this.physics.add.overlap(player, balls, collectBall, null, this);

    //16x16 is the coordinate
    //this text is score:0
    scoreText = this.add.text(16, 16, 'score:0', { fontSize: '32px', fill: '#fff' });


    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);

    //when a player hits a bomb, call hitBomb()
    this.physics.add.collider(player, bombs, hitBomb, null, this);


    bullets = this.physics.add.group();

    this.physics.add.collider(bullets, platforms, bulletHitPlatform, null, this);

    //bullet hits something
    //this.physics.add.collider(bullets,balls,hit,null,this);


    baddude = this.physics.add.sprite(100, 100, 'baddude');

    baddude.setCollideWorldBounds(true);
    this.physics.add.collider(baddude, platforms);
    baddude.setVelocityX(50);
    this.physics.add.collider(baddude,bullets, bulletHitBaddude, null, this);



}

function update() {

    if (baddude.x >= this.physics.world.bounds.width - baddude.width) {
        baddude.setVelocityX(-50);
    }
    if (baddude.x <= baddude.width) {
        baddude.setVelocityX(50);
    }
    if (this.time.now > nextBaddudeJump && baddude.body.touching.down) {
        nextBaddudeJump = this.time.now + baddudeJumpRate;
        baddude.setVelocityY(-300);
        
    }

    console.log('in update');
    if (cursors.left.isDown) {
        if (playerspeed < 200) {
            playerspeed = playerspeed + 3;
        }

        facing = 'left';

        player.setVelocityX(-playerspeed);
    } else if (cursors.right.isDown) {
        if (playerspeed < 200) {
            playerspeed = playerspeed + 3;
        }

        facing = 'right';

        player.setVelocityX(playerspeed);
    } else {
        playerspeed = 150;
        player.setVelocityX(0);
    }

    //jump
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-300);
    }

    if (cursors.space.isDown) {
        fire(facing, this);
        // if (this.time.now > nextFire) {

        //     nextFire = this.time.now + fireRate;

        //     var bullet = bullets.create(player.x, player.y, 'bullet');
        //     bullet.body.allowGravity = false;

        //     if(facing === 'left'){
        //         this.physics.moveTo(bullet, 0, player.y, 200);
        //     }else if(facing === 'right'){
        //         this.physics.moveTo(bullet, 512, player.y, 200);
        //     }
        // }
    }

}

//this will remove the ball from the display when a player 
//overlaps it
function collectBall(player, ball) {
    ball.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (balls.countActive(true) === 0) {
        balls.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        })

        var x = (player.x < 256) ? phaser.Math.Between(256, 512) : phaser.Math.Between(0, 256);

        var bomb = bombs.create(x, 200, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(phaser.Math.Between(-200, 200), 30);
        bomb.body.allowGravity = false;

    }
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
}

function hit(bullet, ball) {

}

function bulletHitBaddude(baddude, bullet){
    baddude.disableBody(true,true);
}
function bulletHitPlatform(bullet, platform) {
    bullet.disableBody(true, true);
}

function hitEdge(baddude, bounds) {
    console.log("in hitedge");
    baddude.setVelocityX(-30);
}
function fire(direction, thegame) {
    if (thegame.time.now > nextFire) {

        nextFire = thegame.time.now + fireRate;

        var bullet = bullets.create(player.x, player.y, 'bullet').setScale(0.5);
        bullet.body.allowGravity = false;

        if (direction === 'left') {
            thegame.physics.moveTo(bullet, 0, player.y, 200);
        } else if (direction === 'right') {
            thegame.physics.moveTo(bullet, 512, player.y, 200);
        }
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
            gravity: { y: 500 }
        }
    },
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update
    }
};
const game = new phaser.Game(config);


//phaser uses a notion of 'states' to represent each screen of your game

