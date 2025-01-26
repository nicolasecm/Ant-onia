export class gameScene extends Phaser.Scene {
  constructor() {
    super({ key: "gameScene" });

    // Referencias a objetos y variables necesarias
    this.backgroundTile = null;
    this.player = null;
    this.cursors = null;
    this.buble = null;
    // this.bug = null;
    this.bugs = null; // Grupo de mosquitos
  }

  preload() {
    // Carga de imágenes

    this.load.image("background", "assets/Fondo1.png");
    this.load.image("ground", "assets/negro.png");
    this.load.image("buble", "assets/buble.png");
    this.load.image("bug", "assets/mosquito.png"); // Carga el sprite del bicho
    this.load.spritesheet("dude", "assets/Pushing.png", {
      frameWidth: 218.5,
      frameHeight: 220,
    });
    this.load.audio("forestSound", "sounds/cool.mp3"); // Asegúrate de usar la ruta correcta
  }

  create() {
    // Fondo infinito
    // this.add.image(400, 300, "background");
    this.physics.world.gravity.y = 300;

    this.add.image(510, 400, "background").setScale(1.1);

    this.platforms = this.physics.add.staticGroup();
    this.createInitialPlatforms();

    // this.platforms.create(350, 568, "ground").setScale(3).refreshBody();
    this.player = this.physics.add.sprite(100, 550, "dude");
    this.player.setScale(0.5);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBoundsCollision(true, true, true, true);

    this.buble = this.physics.add.sprite(290, 500, "buble");
    this.buble.setDisplaySize(150, 150);
    // Crear grupo de insectos
    this.bugs = this.physics.add.group();

    // // Configurar bicho
    // this.bug = this.physics.add.sprite(400, 300, "bug");
    // this.bug.setScale(0.1);

    // this.bug.setBounce(1); // Rebote total
    // this.bug.setCollideWorldBounds(true); // Colisiona con bordes
    // this.bug.setVelocity(200, 150); // Velocidad inicial

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 8 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 9, end: 16 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.burbles = this.physics.add.group();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.burbles, this.platforms);
    this.physics.add.collider(this.bugs, this.platforms);
    this.physics.add.collider(
      this.bugs,
      this.player,
      this.onPlayerCollision,
      null,
      this
    );

    this.physics.add.collider(this.buble, this.platforms);
    this.physics.add.collider(
      this.player,
      this.buble,
      this.pushBuble,
      null,
      this
    );
    // this.physics.add.collider(
    //   this.bug,
    //   this.player,
    //   this.onPlayerCollision,
    //   null,
    //   this
    // );

    // Reproduce el sonido de fondo en loop
    this.forestSound = this.sound.add("forestSound", {
      loop: true,
      volume: 0.2,
    });
    this.forestSound.play();
  }

  update() {
    // Movimiento del jugador
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    // Salto con flecha hacia arriba o espacio
    if (
      (this.cursors.up.isDown || this.spaceBar.isDown) &&
      this.player.body.blocked.down
    ) {
      this.player.setVelocityY(-300); // Ajusta la fuerza del salto
    }

    if (this.buble.body.velocity.x > 0) {
      this.buble.setVelocityX(this.buble.body.velocity.x * 0.98); // Desacelerar
    } else if (this.buble.body.velocity.x < 0) {
      this.buble.setVelocityX(this.buble.body.velocity.x * 0.98); // Desacelerar
    }
    if (this.buble.x >= 780) {
      // Límite izquierdo o derecho
      if (this.forestSound) {
        this.forestSound.stop();
      }
      console.log("Buble ha tocado la esquina horizontal");
      this.scene.start("CinematicScene2");

      // Aquí puedes cambiar de escena:
      // this.scene.start('otraEscena');
    }
  }

  pushBuble() {
    // Empujar buble cuando el jugador lo toque
    if (this.player.body.touching.right && this.buble.body.touching.left) {
      this.buble.setVelocityX(10); // Empuja hacia la derecha
    } else if (
      this.player.body.touching.left &&
      this.buble.body.touching.right
    ) {
      this.buble.setVelocityX(-200); // Empuja hacia la izquierda
    }
  }
  onPlayerCollision() {
    console.log("¡Has perdido!");
    this.scene.restart(); // Reinicia la escena
  }
  createInitialPlatforms() {
    this.platforms.create(500, 800, "ground").setScale(3).refreshBody();
  }
  // spawnBug() {
  //   // const bug = this.physics.add.sprite(Phaser.Math.Between(50, 750), 0, "bug");
  //   // bug.setScale(0.1); // Reducir tamaño
  //   // bug.body.setAllowGravity(false);

  //   // bug.setBounce(1); // Rebote total
  //   // bug.setCollideWorldBounds(true); // Rebote en bordes
  //   // bug.setVelocity(
  //   //   Phaser.Math.Between(-200, 200), // Velocidad aleatoria en el eje X
  //   //   Phaser.Math.Between(-200, 200) // Velocidad aleatoria en el eje Y
  //   // );

  //   // this.bugs.add(bug); // Agregar al grupo de insectos

  //   // // Ajustar el cuerpo físico del mosquito
  //   // bug.body.setSize(bug.width * 0.5, bug.height * 0.5);
  //   // bug.body.setOffset(bug.width * 0.25, bug.height * 0.25);

  //   var bug = this.bugs.create(150, 150, "bug");
  //   bug.setBounce(1);
  //   bug.setCollideWorldBounds(true);
  //   bug.setVelocity(Phaser.Math.Between(-200, 200), 20);
  //   bug.allowGravity = false;
  // }

  spawnBug() {
    const bug = this.bugs.create(
      Phaser.Math.Between(50, 750),
      Phaser.Math.Between(50, 300),
      "bug"
    );
    bug.setScale(0.1); // Reducir tamaño del insecto
    bug.setBounce(1); // Rebote total
    bug.setCollideWorldBounds(true); // Rebote en los bordes del canvas
    bug.setVelocity(
      Phaser.Math.Between(-200, 200), // Velocidad aleatoria en el eje X
      Phaser.Math.Between(-200, 200) // Velocidad aleatoria en el eje Y
    );
    bug.body.setAllowGravity(false); // Desactiva la gravedad para el insecto
  }

  // Reinicia la escena y variables
}

export default gameScene;
