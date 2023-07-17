var boton;
var musicF;

var Terminado = {
    
    preload: function(){
        juego.stage.backgroundColor = "000000";
        juego.load.image('ch', 'img/bad.jpg');
        juego.load.image('botons', 'img/reset.png');
        juego.load.audio('fail', 'sounds/failure.wav');
    },
    
    create: function(){
        fondo = juego.add.tileSprite(0,0,960,480,'ch');

  		boton = this.add.button(juego.width/2, juego.height/2+30, 'botons', 
            this.iniciarJuego, this);
        boton.anchor.setTo(0.5);
        boton.scale.setTo(0.2,0.2);

        var txtTitle =juego.add.text(juego.width/2, juego.height/2-90, 
            "Vuelva a Intentarlo", {font:"30px Arial", fill:"#FFF", aling: "center"});
        txtTitle.anchor.setTo(0.5);

        var txtPuntaje =juego.add.text(juego.width/2, juego.height/2-50, 
            "Puntaje: "+score.toString(), {font:"20px Arial", fill:"#FFF", aling: "center"});
            txtPuntaje.anchor.setTo(0.5);

        musicF = juego.add.audio('fail');
        musicF.play();
    },

    iniciarJuego: function(){
        musicF.stop();
        score=0;
        lives=3
        this.state.start('Juego');
    }
    
   
};