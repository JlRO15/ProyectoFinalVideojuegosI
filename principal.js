var juego = new Phaser.Game(960, 480, Phaser.CANVAS, 'bloque_juego');

juego.state.add('InitA', InitA);
juego.state.add('Menu', Menu);
juego.state.add('Juego', Juego);
juego.state.add('Juego2', Juego2);
juego.state.add('Juego3', Juego3);
juego.state.add('Terminado', Terminado);
juego.state.add('Ganador', Ganador);
juego.state.start('InitA');


