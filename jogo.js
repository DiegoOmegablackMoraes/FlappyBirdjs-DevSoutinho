console.log("[DevSoutinho] Flappy Bird");

const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const contexto = canvas.getContext("2d");

// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390, //coordenada onde começa a imagem no eixo X
  spriteY: 0, //coordenada onde começa a imagem no eixo Y
  largura: 275, //largura da imagem
  altura: 204, //altura da imagem
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = "#70c5ce";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX,
      planoDeFundo.spriteY,
      planoDeFundo.largura,
      planoDeFundo.altura,
      planoDeFundo.x,
      planoDeFundo.y,
      planoDeFundo.largura,
      planoDeFundo.altura
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX,
      planoDeFundo.spriteY,
      planoDeFundo.largura,
      planoDeFundo.altura,
      planoDeFundo.x + planoDeFundo.largura,
      planoDeFundo.y,
      planoDeFundo.largura,
      planoDeFundo.altura
    );
  },
};

// [Chao]
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  desenha() {
    contexto.drawImage(
      sprites,
      chao.spriteX,
      chao.spriteY,
      chao.largura,
      chao.altura,
      chao.x,
      chao.y,
      chao.largura,
      chao.altura
    );

    contexto.drawImage(
      sprites,
      chao.spriteX,
      chao.spriteY,
      chao.largura,
      chao.altura,
      chao.x + chao.largura,
      chao.y,
      chao.largura,
      chao.altura
    );
  },
};

const flappyBird = {
  //objeto que renderiza o passarinho
  spriteX: 0,
  spriteY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50,
  velocidade: 0,
  gravidade: 0.25,
  atualiza() {
    flappyBird.velocidade += flappyBird.gravidade;
    flappyBird.y += flappyBird.velocidade;
  },
  desenha() {
    contexto.drawImage(
      sprites,
      flappyBird.spriteX,
      flappyBird.spriteY, // Sprite X, Sprite Y
      flappyBird.largura,
      flappyBird.altura, // Tamanho do recorte na sprite
      flappyBird.x,
      flappyBird.y,
      flappyBird.largura,
      flappyBird.altura
    );
  },
};

///// [mensagemGetReadr] vulgo Tela Inicial
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX,
      mensagemGetReady.sY,
      mensagemGetReady.w,
      mensagemGetReady.h,
      mensagemGetReady.x,
      mensagemGetReady.y,
      mensagemGetReady.w,
      mensagemGetReady.h
    );
  },
};

//
// [Telas]
//
let telaAtiva = {}; // vai receber sempre uma objeto de tela para atualizar

function mudaParaTela(novaTela) {
  //troca a tela ativa
  telaAtiva = novaTela;
}
const Telas = {
  INICIO: {
    desenha() {
      planoDeFundo.desenha();
      chao.desenha();
      flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {},
  },
};

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha();
    chao.desenha();
    flappyBird.desenha();
  },
  atualiza() {
    flappyBird.atualiza(); //atualiza a posicao antes de desenhar
  },
};

//funcao que fica executando infinitamente renderizando o jogo na tela
function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  requestAnimationFrame(loop);
}

//monitora se houve um evento  de click em qqer lugar da tela
window.addEventListener("click", () => {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();
