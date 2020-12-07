function start() {

    $("#start").hide();

    $("#background").append("<div id='player' class='anima1'></div>");
    $("#background").append("<div id='enemy1' class='anima2'></div>");
    $("#background").append("<div id='enemy2' ></div>");
    $("#background").append("<div id='friend' class='anima3'></div>");
    $("#background").append("<div id='scoreboard'></div>");
    $("#background").append("<div id='energy'></div>");

    let somDisparo = document.getElementById("somDisparo");
    let somExplosao = document.getElementById("somExplosao");
    let bgmusic = document.getElementById("bgmusic");
    let somGameover = document.getElementById("somGameover");
    let somPerdido = document.getElementById("somPerdido");
    let somResgate = document.getElementById("somResgate");

    bgmusic.addEventListener("ended", function () {
        bgmusic.currentTime = 0;
        bgmusic.play();
    }, false);
    bgmusic.play();

    let game = {}
    let velocity = 5;
    let end = false;
    let canShoot = true;
    let points = 0;
    let rescues = 0;
    let deads = 0;
    let energyCurrent = 3;
    let positionY = parseInt(Math.random() * 334);
    let controls = {
        W: 87,
        S: 83,
        D: 68
    }

    game.press = [];

    $(document).keydown(function (e) {
        game.press[e.which] = true;
    });


    $(document).keyup(function (e) {
        game.press[e.which] = false;
    });

    //Game Loop
    game.timer = setInterval(loop, 30);

    function loop() {

        moveBackground();
        movePlay();
        moveEnemy1();
        moveEnemy2();
        moveFriend();
        colision();
        scoreboard();
        energy();
    }

    function moveBackground() {

        left = parseInt($("#background").css("background-position"));
        $("#background").css("background-position", left - 1);

    }

    function movePlay() {

        if (game.press[controls.W]) {
            var top = parseInt($("#player").css("top"));
            $("#player").css("top", top - 10);

            if (top <= 0) {

                $("#player").css("top", top + 20);
            }
        }

        if (game.press[controls.S]) {

            var top = parseInt($("#player").css("top"));
            $("#player").css("top", top + 10);

            if (top >= 434) {
                $("#player").css("top", top - 10);

            }
        }

        if (game.press[controls.D]) {

            shoot();
        }

    }

    function moveEnemy1() {

        positionX = parseInt($("#enemy1").css("left"));
        $("#enemy1").css("left", positionX - velocity);
        $("#enemy1").css("top", positionY);

        if (positionX <= 0) {
            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", positionY);

        }
    }

    function moveEnemy2() {
        positionX = parseInt($("#enemy2").css("left"));
        $("#enemy2").css("left", positionX - 3);

        if (positionX <= 0) {

            $("#enemy2").css("left", 775);

        }
    }

    function moveFriend() {

        positionX = parseInt($("#friend").css("left"));
        $("#friend").css("left", positionX + 1);

        if (positionX > 906) {

            $("#friend").css("left", 0);

        }

    }

    function shoot() {

        if (canShoot == true) {
            somDisparo.play();
            canShoot = false;

            topo = parseInt($("#player").css("top"))
            positionX = parseInt($("#player").css("left"))
            shootX = positionX + 190;
            topShoot = topo + 39;
            $("#background").append("<div id='shoot'></div");
            $("#shoot").css("top", topShoot);
            $("#shoot").css("left", shootX);

            var timeShoot = window.setInterval(shooting, 30);

        }

        function shooting() {
            positionX = parseInt($("#shoot").css("left"));
            $("#shoot").css("left", positionX + 15);

            if (positionX > 900) {

                window.clearInterval(timeShoot);
                timeShoot = null;
                $("#shoot").remove();
                canShoot = true;

            }
        }
    }

    function colision() {
        let colision1 = ($("#player").collision($("#enemy1")));
        let colision2 = ($("#player").collision($("#enemy2")));
        let colision3 = ($("#shoot").collision($("#enemy1")));
        let colision4 = ($("#shoot").collision($("#enemy2")));
        let colision5 = ($("#player").collision($("#friend")));
        let colision6 = ($("#enemy2").collision($("#friend")));

        // jogador com o inimigo1
        if (colision1.length > 0) {
            energyCurrent--;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
            explosion1(enemy1X, enemy1Y);

            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", positionY);
        }

        // jogador com o inimigo2 
        if (colision2.length > 0) {
            energyCurrent--;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            explosion2(enemy2X, enemy2Y);

            $("#enemy2").remove();

            repositionEnemy2();

        }

        // Disparo com o inimigo1
        if (colision3.length > 0) {

            points = points + 100;
            velocity = velocity + 0.3;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));

            explosion1(enemy1X, enemy1Y);
            $("#shoot").css("left", 950);

            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", positionY);

        }

        // Disparo com o inimigo2

        if (colision4.length > 0) {
            points = points + 50;

            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            $("#enemy2").remove();

            explosion2(enemy2X, enemy2Y);
            $("#shoot").css("left", 950);

            repositionEnemy2();

        }

        // jogador com o amigo

        if (colision5.length > 0) {
            rescues++;
            somResgate.play();
            friendReposition();
            $("#friend").remove();
        }

        //Inimigo2 com o amigo

        if (colision6.length > 0) {
            deads++;

            friendX = parseInt($("#friend").css("left"));
            friendY = parseInt($("#friend").css("top"));
            explosion3(friendX, friendY);
            $("#friend").remove();

            friendReposition();

        }


    }

    function explosion1(enemy1X, enemy1Y) {
        somExplosao.play();

        $("#background").append("<div id='explosion1'></div");
        $("#explosion1").css("background-image", "url(images/explosao.png)");
        let div = $("#explosion1");
        div.css("top", enemy1Y);
        div.css("left", enemy1X);
        div.animate({
            width: 200,
            opacity: 0
        }, "slow");

        let explosionTime = window.setInterval(removeExplosion, 1000);

        function removeExplosion() {

            div.remove();
            window.clearInterval(explosionTime);
            explosionTime = null;

        }

    }

    function explosion2(enemy2X, enemy2Y) {
        somExplosao.play();

        $("#background").append("<div id='explosion2'></div");
        $("#explosion2").css("background-image", "url(images/explosao.png)");
        let div2 = $("#explosion2");
        div2.css("top", enemy2Y);
        div2.css("left", enemy2X);
        div2.animate({
            width: 200,
            opacity: 0
        }, "slow");

        let explosionTime2 = window.setInterval(removeExplsion2, 1000);

        function removeExplsion2() {

            div2.remove();
            window.clearInterval(explosionTime2);
            explosionTime2 = null;

        }

    }

    function explosion3(friendX, friendY) {
        somPerdido.play();

        $("#background").append("<div id='explosion3' class='anima4'></div");
        $("#explosion3").css("top", friendY);
        $("#explosion3").css("left", friendX);
        var explosionTime3 = window.setInterval(resetExplosion3, 1000);

        function resetExplosion3() {
            $("#explosion3").remove();
            window.clearInterval(explosionTime3);
            explosionTime3 = null;

        }

    }

    function repositionEnemy2() {

        let timeColision4 = window.setInterval(reposition4, 6000);

        function reposition4() {
            window.clearInterval(timeColision4);
            timeColision4 = null;

            if (end == false) {

                $("#background").append("<div id='enemy2'></div");

            }

        }
    }

    function friendReposition() {

        let timeFriend = window.setInterval(reposition6, 6000);

        function reposition6() {
            window.clearInterval(timeFriend);
            timeFriend = null;

            if (end == false) {

                $("#background").append("<div id='friend' class='anima3'></div>");

            }

        }

    }

    function scoreboard() {

        $("#scoreboard").html("<h2> Pontos: " + points + " Resgatados: " + rescues + " Mortos: " + deads + "</h2>");

    }

    function energy() {

        if (energyCurrent === 3) {

            $("#energy").css("background-image", "url(images/energia3.png)");
        }

        if (energyCurrent === 2) {

            $("#energy").css("background-image", "url(images/energia2.png)");
        }

        if (energyCurrent === 1) {

            $("#energy").css("background-image", "url(images/energia1.png)");
        }

        if (energyCurrent === 0) {

            $("#energy").css("background-image", "url(images/energia0.png)");

            gameOver();
        }

    }

    function gameOver() {
        end = true;
        bgmusic.pause();
        somGameover.play();

        window.clearInterval(game.timer);
        game.timer = null;

        $("#player").remove();
        $("#enemy1").remove();
        $("#enemy2").remove();
        $("#friend").remove();

        $("#background").append("<div id='end'></div>");

        $("#end").html("<h1> Game Over </h1><p>Sua pontuação foi: " + points + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><button>Jogar Novamente</button></div>");
    }
}

function reiniciaJogo() {
    somGameover.pause();
    $("#end").remove();
    start();
}