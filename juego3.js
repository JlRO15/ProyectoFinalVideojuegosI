var fondo;
var platforms;
var player;
var canJump = true; // Variable para permitir el salto inicial del personaje
var scoreText; // Texto del puntaje
var icons; // Grupo de íconos
var enemies; // Grupo de enemigos
var livesText; // Texto de las vidas
var enemyBullets; // Grupo de balas de los enemigos

var Juego3 = {
  preload: function () {
    juego.load.image('bg', 'img/bg3.png');
    juego.load.image('bpf', 'img/platf.png');
    juego.load.image('player', 'img/pj.png');
    juego.load.image('mono', 'img/mono.png');
    juego.load.image('arana', 'img/arana.png');
    juego.load.image('colibri', 'img/colibri.png');
    juego.load.image('manos', 'img/manos.png');
    juego.load.image('enemigo', 'img/enemigo.png');
    juego.load.image('laser', 'img/laser.png');
    juego.load.audio('disp', 'sounds/laser.mp3');
    juego.load.audio('point', 'sounds/getB.wav');
    juego.load.audio('strike', 'sounds/getC.wav');
    juego.load.spritesheet('vidas', 'img/heart1.png', 32, 30);
    juego.forceSingleUpdate = true;
  },

  create: function () {
    fondo = juego.add.tileSprite(0, 0, 960, 480, 'bg');

    juego.physics.arcade.setBounds(0, 0, juego.world.width, juego.world.height - 70);

    platforms = juego.add.group();
    platforms.enableBody = true;

    const platformPositions = [
      { x: 100, y: 240 },
      { x: 500, y: 280 },
      { x: 700, y: 300 }
    ];

    for (let i = 0; i < platformPositions.length; i++) {
      const platformPos = platformPositions[i];
      const platform = platforms.create(platformPos.x, platformPos.y, 'bpf');
      platform.body.immovable = true;
    }

    var availableIcons = ['mono', 'arana', 'colibri', 'manos'];
    icons = juego.add.group();

    for (let i = 0; i < platformPositions.length; i++) {
      const platformPos = platformPositions[i];
      const randomIndex = juego.rnd.between(0, availableIcons.length - 1);
      const spriteKey = availableIcons.splice(randomIndex, 1)[0];
      const icon = juego.add.sprite(platformPos.x + 50, platformPos.y - 50, spriteKey);
      icon.scale.setTo(0.5);
      juego.physics.arcade.enable(icon);
      icon.body.allowGravity = false;
      icon.body.immovable = true;
      icon.body.checkCollision.down = false;
      icon.iconType = spriteKey;
      icons.add(icon);
    }

    player = juego.add.sprite(32, juego.world.height - 150, 'player');
    juego.physics.arcade.enable(player);
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    juego.physics.arcade.collide(player, platforms);

    scoreText = juego.add.text(16, 16, 'Score: '+score, { fontSize: '32px', fill: '#FFF' });
    livesText = juego.add.text(800, 16, 'Lives: ', { fontSize: '32px', fill: '#FFF' });

    enemies = juego.add.group();
    enemies.enableBody = true;

    enemyBullets = juego.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

    juego.time.events.loop(1500, this.createEnemy, this);

    juego.input.keyboard.addKeyCapture([Phaser.Keyboard.UP]);
    var jumpKey = juego.input.keyboard.addKey(Phaser.Keyboard.UP);
    jumpKey.onDown.add(this.jump, this);

    vidas = juego.add.sprite(900, 20, 'vidas');

    vidas.animations.add('vidaCompleta', [0]);
    vidas.animations.add('dosVidas', [1]);
    vidas.animations.add('unaVidas', [2]);
    Juego.comprobarVida();
  },

  update: function () {

    Juego.comprobarVida();

    player.body.velocity.x = 0;
    if (juego.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      player.body.velocity.x = -150;
    } else if (juego.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      player.body.velocity.x = 150;
    }

    if ((player.body.touching.down || player.body.onFloor()) && canJump) {
      juego.input.keyboard.onDownCallback = null;
      var jumpKey = juego.input.keyboard.addKey(Phaser.Keyboard.UP);
      jumpKey.onDown.add(this.jump, this);
    } else {
      juego.input.keyboard.onDownCallback = null;
    }

    juego.physics.arcade.collide(player, platforms);
    juego.physics.arcade.overlap(player, enemyBullets, Juego.enemyCollision, null, this);
    juego.physics.arcade.overlap(player, icons, this.collectIcon, null, this);

    enemies.forEachAlive(this.enemyUpdate, this);
  },

  jump: function () {
    if (player.body.touching.down || player.body.onFloor()) {
      player.body.velocity.y = -300;
      canJump = false;
    }
  },

  collectIcon: function (player, icon) {
    icon.body.enable = false;
    icon.visible = false;

    mpoint = juego.add.audio('point');
		mpoint.play();

    score += 10;
    scoreText.text = 'Score: ' + score;
    if (score >= 90) {
      musica.stop();
      this.state.start('Ganador');
    }
  },

  createEnemy: function () {
    var startX = juego.rnd.between(0, 1) === 0 ? -100 : juego.world.width + 100;
    var enemy = enemies.create(startX, juego.rnd.between(0, 100), 'enemigo');
    enemy.anchor.setTo(0.5);
    enemy.body.velocity.x = startX === -100 ? 250 : -250; // Velocidad hacia la izquierda o derecha según la posición inicial
    enemy.canShoot = true;
  
    juego.time.events.add(Phaser.Timer.SECOND * 2, function () {
      enemy.canShoot = false;
    }, this);
  },

  enemyUpdate: function (enemy) {
    if (enemy.canShoot) {
      this.enemyFire(enemy);
    }
  },

  enemyFire: function (enemy) {
    var bullet = enemyBullets.create(enemy.x, enemy.y, 'laser');
    bullet.anchor.setTo(0.5);
    bullet.body.velocity.y = 700;

    enemy.canShoot = false;

    juego.time.events.add(Phaser.Timer.SECOND * 1, function () {
      enemy.canShoot = true;
    }, this);
    mDisp = juego.add.audio('disp');
		mDisp.play();
  }
};