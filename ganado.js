var boton;
var musicW;

var Ganador = {
    
    preload: function(){
        juego.stage.backgroundColor = "000000";
        juego.load.image('botons', 'img/reset.png');
        juego.load.image('bwn', 'img/finalW.jpg');
        juego.load.audio('win', 'sounds/win.wav');
    },
    
    create: function(){
        fondo = juego.add.tileSprite(0,0,960,480,'bwn');

  		boton = this.add.button(juego.width/2, juego.height/2+40, 'botons', 
            this.iniciarJuego, this);
        boton.anchor.setTo(0.5);
        boton.scale.setTo(0.2,0.2);

        var txtTitle =juego.add.text(juego.width/2, juego.height/2-90, 
            "Ha ganado", {font:"40px Arial", fill:"#FFF", aling: "center"});
        txtTitle.anchor.setTo(0.5);

        var txtPuntaje =juego.add.text(juego.width/2, juego.height/2-60, 
            "Puntaje: "+score.toString(), {font:"30px Arial", fill:"#FFF", aling: "center"});
            txtPuntaje.anchor.setTo(0.5);

        musicW = juego.add.audio('win');
        musicW.play();
    },

    iniciarJuego: function(){
        musicW.stop();
        score=0;
        lives=3
        this.state.start('Juego');
    }
};