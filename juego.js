var fondo;
var platforms;//plataformas
var player;//jugador
var canJump = true; // Variable para permitir el salto inicial del personaje
var score = 0; // Puntaje inicial
var scoreText; // Texto del puntaje
var icons; // Grupo de íconos
var enemies; // Grupo de enemigos
var lives = 3; // Vidas del personaje
var livesText; // Texto de las vidas
var enemyBullets; // Grupo de balas de los enemigos
var musica;
var mDisp;// sonido de disparo
var mpoint;// sonido de punto obtenido
var mStrike;// sonido de impacto al jugador
var vidas;

var Juego = {
  preload: function () {
    juego.load.image('bg', 'img/bg.jpg');
    juego.load.image('bpf', 'img/platf.png');
    juego.load.image('player', 'img/pj.png');
    juego.load.image('mono', 'img/mono.png');
    juego.load.image('arana', 'img/arana.png');
    juego.load.image('colibri', 'img/colibri.png');
    juego.load.image('manos', 'img/manos.png');
    juego.load.image('enemigo', 'img/enemigo.png');
    juego.load.image('laser', 'img/laser.png');
    juego.load.audio('intro', 'sounds/sonidoF.mp3');
    juego.load.audio('disp', 'sounds/laser.mp3');
    juego.load.audio('point', 'sounds/getB.wav');
    juego.load.audio('strike', 'sounds/getC.wav');
    juego.load.spritesheet('vidas', 'img/heart1.png', 32, 30);
    juego.forceSingleUpdate = true;
  },

  create: function () {

    musica = juego.add.audio('intro'); // iniciar musica de fondo
		musica.play();

    fondo = juego.add.tileSprite(0, 0, 960, 480, 'bg');

    juego.physics.arcade.setBounds(0, 0, juego.world.width, juego.world.height - 70); //limites del juego

    platforms = juego.add.group();
    platforms.enableBody = true;

    const platformPositions = [
      { x: 100, y: 260 },
      { x: 400, y: 300 },
      { x: 700, y: 200 }
    ];

    for (let i = 0; i < platformPositions.length; i++) {
      const platformPos = platformPositions[i];
      const platform = platforms.create(platformPos.x, platformPos.y, 'bpf');
      platform.body.immovable = true;
    }

    var availableIcons = ['mono', 'arana', 'colibri', 'manos']; // Íconos disponibles
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

    scoreText = juego.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    livesText = juego.add.text(800, 16, 'Lives: ', { fontSize: '32px', fill: '#000' });

    enemies = juego.add.group();
    enemies.enableBody = true;

    enemyBullets = juego.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

    juego.time.events.loop(1500, this.createEnemy, this);

    juego.input.keyboard.addKeyCapture([Phaser.Keyboard.UP]);
    var jumpKey = juego.input.keyboard.addKey(Phaser.Keyboard.UP);
    jumpKey.onDown.add(this.jump, this);

    //Agrega el sprite de vida
    vidas = juego.add.sprite(900, 20, 'vidas');

    // Definir animaciones
    vidas.animations.add('vidaCompleta', [0]);
    vidas.animations.add('dosVidas', [1]);
    vidas.animations.add('unaVidas', [2]);

    // Reproducir animación inicial
    vidas.animations.play('vidaCompleta');
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

    //Colisiones
    juego.physics.arcade.collide(player, platforms);
    juego.physics.arcade.overlap(player, enemyBullets, this.enemyCollision, null, this);
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
    if (score >= 30) {
      if(lives<3){
        lives++;
      }
      this.state.start('Juego2');
    }
  },

  createEnemy: function () {
    var enemy = enemies.create(juego.world.width, juego.rnd.between(0, 100), 'enemigo');
    enemy.anchor.setTo(0.5);
    enemy.body.velocity.x = -150;
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
    bullet.body.velocity.y = 500;

    enemy.canShoot = false;

    juego.time.events.add(Phaser.Timer.SECOND * 2, function () {
      enemy.canShoot = true;
    }, this);
    mDisp = juego.add.audio('disp');
		mDisp.play();
  },

  enemyCollision: function (player, enemyBullet) {
    enemyBullet.kill();
    lives--;
    mStrike = juego.add.audio('strike');
		mStrike.play();
    if (lives === 0) {
      musica.stop();
      this.state.start('Terminado');
    }
  },

  comprobarVida: function(){
    if (lives === 3) {
      vidas.animations.play('vidaCompleta');
    } else if (lives === 2) {
      vidas.animations.play('dosVidas');
    } else if (lives === 1) {
      vidas.animations.play('unaVidas');
    }
  }
};


