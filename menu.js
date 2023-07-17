var boton;
var musicaFondo;
var Menu = {
    
    preload: function(){
        juego.load.image('bg', 'img/into.jpg');
        juego.stage.backgroundColor = "009900";
        juego.load.image('botons', 'img/boton.png');
        juego.load.audio('intro', 'sounds/sonidoI.mp3');
    },
    
    create: function(){
        musicaFondo = juego.add.audio('intro');
		musicaFondo.play();
        fondo = juego.add.tileSprite(0, 0, 960, 480, 'bg');
  		boton = this.add.button(juego.width/2, juego.height/2+60, 'botons', 
            this.iniciarJuego, this);
        boton.anchor.setTo(0.5);
        boton.scale.setTo(0.3,0.3);

        var txtTitle =juego.add.text(juego.width/2, juego.height/2-100, 
            "Invasión a Nazca", {font:"48px Arial", fill:"#FFF", aling: "center"});
        txtTitle.anchor.setTo(0.5);

        var txtTitle2 =juego.add.text(juego.width/2, juego.height/2+200, 
            "Jose Luis Rivas Olaya", {font:"20px Arial", fill:"#FFF", aling: "center"});
        txtTitle2.anchor.setTo(0.5);
    },

    iniciarJuego: function(){
        musicaFondo.stop();
        this.state.start('Juego');
    }
    
   
};