var InitA = {
    preload: function() {
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
      juego.load.image('ch', 'img/bad.jpg');
      juego.load.image('botons', 'img/reset.png');
      juego.load.audio('fail', 'sounds/failure.wav');
      juego.load.image('bwn', 'img/finalW.jpg');
      juego.load.audio('win', 'sounds/win.wav');
      juego.load.image('bg', 'img/into.jpg');
      juego.load.image('botons', 'img/boton.png');
      juego.load.audio('intro', 'sounds/sonidoI.mp3');
      
      juego.forceSingleUpdate = true;
      juego.stage.backgroundColor = "#000000";
    },
  
    create: function() {
      setTimeout(this.iniciarJuego.bind(this), 3000);
    },
  
    iniciarJuego: function() {
      juego.state.start('Menu');
    }
  };
