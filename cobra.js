// Jogo da Cobra (Snake Game)
// Autor: Jan Bodnar
// Adaptado por: Gilson Pereira
// Readptado por: Caio Lucena Colaço
// Código fonte original: http://zetcode.com/javascript/snake/

// Declaração de variáveis e constantes

var tela;
var ctx;

var gamer = "";
var champions = localStorage.getItem("gameChamps")

const mordida = new Audio()
mordida.src = "mordida.wav"

const perdeu = new Audio()
perdeu.src = "perdeu.wav"

const explosao = new Audio()
explosao.src = "explosion.wav"

var cabeca;
var maca;
var bola;

var pontos;
var maca_x;
var maca_y;

var paraEsquerda = false;
var paraDireita = true;
var paraCima = false;
var paraBaixo = false;
var noJogo = true;    

const TAMANHO_PONTO = 10;
const ALEATORIO_MAXIMO = 29;
const ATRASO = 140;
const C_ALTURA = 320;
const C_LARGURA = 320;    

const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;
const TECLA_ABAIXO = 40;

var x = [];
var y = [];

onkeydown = verificarTecla; // Define função chamada ao se pressionar uma tecla

var showScreen = function(screen_opt){
    switch(screen_opt){
            
        case 0:  screen_snake.style.display = "block";
                 screen_menu.style.display = "none";
                 screen_gameover.style.display = "none";
                 break;
            
        case 1:  screen_snake.style.display = "none";
                 screen_menu.style.display = "block";
                 screen_gameover.style.display = "none";
                 break;
        
        case 2: screen_snake.style.display = "none";
                screen_menu.style.display = "none";
                screen_gameover.style.display = "block";
                break;
    }
}

window.onload = function(){
    tela = document.getElementById("tela");
    ctx = tela.getContext("2d");

    atualizarTabela();

    screen_snake = document.getElementById("tela");
    screen_menu = document.getElementById("menu");
    screen_gameover = document.getElementById("gameover");

    button_newgame_menu = document.getElementById("newgame_menu");
    button_newgame_gameover = document.getElementById("newgame_gameover");

    button_name = document.getElementById("nameBtn")
    gamer_name = document.getElementById("gamer")
    gamer_title = document.getElementById("gamerTitle")

    all_score = document.getElementById("score_value");

    button_newgame_menu.onclick = function(){iniciar();};
    button_newgame_gameover.onclick = function(){reIniciar();}; 
    button_name.onclick = function(){definirNome();}; 
}

// Definição das funções

function definirNome(){
    gamer = gamer_name.value
    gamer_title.innerHTML = gamer != ""? `Jiboia do(a) ${gamer}` : "Jiboia"
}

function reIniciar(){
    paraDireita = true;
    paraEsquerda = false;
    paraCima = false;
    paraBaixo = false;
    iniciar()
}

function iniciar() {
    noJogo = true
    showScreen(0)

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

    carregarImagens();
    criarCobra();
    localizarMaca();
    setTimeout("cicloDeJogo()", ATRASO);
}    

function carregarImagens() {
    cabeca = new Image();
    cabeca.src = "cabeca.png";    
    
    bola = new Image();
    bola.src = "ponto.png"; 
    
    maca = new Image();
    maca.src = "maca.png"; 
}

function atualizarTabela() {
    for(champ in champions){
        $("#ranking").append(`
        <li class="table-row">
            <div class="col col-1" >${champ.gamer}</div>
            <div class="col col-2" >${champ.score}</div>
            <div class="col col-3" >${champ.hour}</div>
        </li>
    `)
    }
}

function guardarScore(score){
    // champions.push({gamer: gamer, score: score, hour: new Date()})
    // for(x = champions.length-1; x>0; x--){
    //     if(champions[x].score>champions[x-1].score){
    //         let sub = champions[x-1]
    //         champions[x-1] = champions[x]
    //         champions[x] = sub
    //     }
    // }
    // localStorage.setItem("gameChamps", champions)
    // atualizarTabela()
}

function criarCobra() {
    pontos = 3;
	
    for (var z = 0; z < pontos; z++) {
        x[z] = 50 - z * TAMANHO_PONTO;
        y[z] = 50;
    }
}

function localizarMaca() {
    var r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    maca_x = r * TAMANHO_PONTO;

    r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    maca_y = r * TAMANHO_PONTO;
}    

function cicloDeJogo() {
    if (noJogo) {
        verificarMaca();
        verificarColisao();
        mover();
        fazerDesenho();
        setTimeout("cicloDeJogo()", ATRASO);
    }
}

function add_score(score) {
    all_score.innerHTML = String(score)
}

function verificarMaca() {
    if ((x[0] == maca_x) && (y[0] == maca_y)) {
        mordida.play()
        pontos++;
        add_score(pontos)
        localizarMaca();
    }
}    

function verificarColisao() {
    for (var z = pontos; z > 0; z--) {
        if ((z > 4) && (x[0] == x[z]) && (y[0] == y[z])) {
            mordida.play()
            noJogo = false;
            guardarScore(pontos)
            showScreen(2)
        }
    }

    if (y[0] >= C_ALTURA) {
        explosao.play()
        noJogo = false;
        guardarScore(pontos)
        showScreen(2)
    }

    if (y[0] < 0) {
        explosao.play()
       noJogo = false;
       guardarScore(pontos)
       showScreen(2)
    }

    if (x[0] >= C_LARGURA) {
        explosao.play()
      noJogo = false;
      guardarScore(pontos)
      showScreen(2)
    }

    if (x[0] < 0) {
        mordida.play()
      noJogo = false;
      guardarScore(pontos)
      showScreen(2)
    }
}

function mover() {
    for (var z = pontos; z > 0; z--) {
        x[z] = x[z-1];
        y[z] = y[z-1];
    }

    if (paraEsquerda) {
        x[0] -= TAMANHO_PONTO;
    }

    if (paraDireita) {
        x[0] += TAMANHO_PONTO;
    }

    if (paraCima) {
        y[0] -= TAMANHO_PONTO;
    }

    if (paraBaixo) {
        y[0] += TAMANHO_PONTO;
    }
}    

function fazerDesenho() {
    ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
	ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);
	
    if (noJogo) {
        ctx.drawImage(maca, maca_x, maca_y);
		
        for (var z = 0; z < pontos; z++) {
            if (z == 0) {
                ctx.drawImage(cabeca, x[z], y[z]);
            } else {
                ctx.drawImage(bola, x[z], y[z]);
            }
        }    
    } else {
        showScreen(2)
    }        
}

function verificarTecla(e) {
    var tecla = e.keyCode;

    if ((tecla == TECLA_ESQUERDA) && (!paraDireita)) {
        paraEsquerda = true;
        paraCima = false;
        paraBaixo = false;
    }

    if ((tecla == TECLA_DIREITA) && (!paraEsquerda)) {
        paraDireita = true;
        paraCima = false;
        paraBaixo = false;
    }

    if ((tecla == TECLA_ACIMA) && (!paraBaixo)) {
        paraCima = true;
        paraDireita = false;
        paraEsquerda = false;
    }

    if ((tecla == TECLA_ABAIXO) && (!paraCima)) {
        paraBaixo = true;
        paraDireita = false;
        paraEsquerda = false;
    }        
}