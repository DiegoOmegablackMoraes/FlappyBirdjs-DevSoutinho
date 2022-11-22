console.log("[OmegaBlack] Flappy Bird");

let gameFrames = 0;
const som_Hit = new Audio();
som_Hit.src = "./efeitos/hit.wav";
const som_Caiu = new Audio();
som_Caiu.src = "./efeitos/caiu.wav";
const som_ponto = new Audio();
som_ponto.src = "./efeitos/ponto.wav";
const som_pulo = new Audio();
som_pulo.src = "./efeitos/pulo.wav";

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
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;

      /// formula magica para repeticao infinita do paralax
      /// o resto da divisao nunca sera maior que o dividendo.
      /// sendo assim, a posicao do chao sera sempre:
      /// restoDivisao de [posicao do chao - 1] pela metade da largura do chao
      /// complicado? Pra caramba!
      chao.x = movimentacao % repeteEm;
    },
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
  return chao;
}

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY) {
    return true;
  }

  return false;
}

function criaFlappyBird() {
  const flappyBird = {
    //objeto que renderiza o passarinho
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula() {
      flappyBird.velocidade = -flappyBird.pulo;
    },
    velocidade: 0,
    gravidade: 0.25,
    atualiza() {
      if (fazColisao(flappyBird, globais.chao)) {
        som_Hit.play();

        mudaParaTela(Telas.GAME_OVER);
        return;
      }

      flappyBird.velocidade += flappyBird.gravidade;
      flappyBird.y += flappyBird.velocidade;
    },
    //animando voo do passarinho
    movimentos: [
      { spriteX: 0, spriteY: 0 }, // asa pra cima
      { spriteX: 0, spriteY: 26 }, //asa no meio
      { spriteX: 0, spriteY: 52 }, //asa pra baixo
      { spriteX: 0, spriteY: 26 }, //asa no meio
    ],
    frameAtual: 0,
    atualizaFrameAtual() {
      const intervaloDeFrames = 10;
      const passouIntervalo = gameFrames % intervaloDeFrames === 0; //retorna true toda vez que o resto da divisao for zero

      if (passouIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
    },
    desenha() {
      flappyBird.atualizaFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual]; //destruct
      contexto.drawImage(
        sprites,
        spriteX,
        spriteY,
        flappyBird.largura,
        flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x,
        flappyBird.y,
        flappyBird.largura,
        flappyBird.altura
      );
    },
  };

  return flappyBird;
}

///// [mensagemGetReady] vulgo Tela Inicial
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

///// [mensagemGameOver] vulgo Tela Final
const mensagemGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: canvas.width / 2 - 226 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.sX,
      mensagemGameOver.sY,
      mensagemGameOver.w,
      mensagemGameOver.h,
      mensagemGameOver.x,
      mensagemGameOver.y,
      mensagemGameOver.w,
      mensagemGameOver.h
    );
  },
};

function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: { spriteX: 0, spriteY: 169 },
    ceu: { spriteX: 52, spriteY: 169 },
    espaco: 80,
    desenha() {
      canos.pares.forEach((par) => {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;
        const canoCeuX = par.x;
        const canoCeuY = yRandom;

        // [Cano do Céu]
        contexto.drawImage(
          sprites,
          canos.ceu.spriteX,
          canos.ceu.spriteY,
          canos.largura,
          canos.altura,
          canoCeuX,
          canoCeuY,
          canos.largura,
          canos.altura
        );

        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
        contexto.drawImage(
          sprites,
          canos.chao.spriteX,
          canos.chao.spriteY,
          canos.largura,
          canos.altura,
          canoChaoX,
          canoChaoY,
          canos.largura,
          canos.altura
        );

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY,
        };

        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY,
        };
      });
    },
    temColisaoComFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
      if (globais.flappyBird.x + (globais.flappyBird.largura - 2) >= par.x) {
        if (cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if (peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = gameFrames % 100 === 0;
      if (passou100Frames) {
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      canos.pares.forEach((par) => {
        par.x -= 2;

        if (canos.temColisaoComFlappyBird(par)) {
          som_Hit.play();
          mudaParaTela(Telas.GAME_OVER);
        }

        if (par.x + canos.largura <= 0) {
          globais.placar.atualiza();
          canos.pares.shift();vc
        }
      });
    },
  };

  return canos;
}

function criaPlacar() {
  const placar = {
    pontuacao: 0,
    desenha() {
      contexto.font = "35px VT323";
      contexto.textAlign = "right";
      contexto.fillStyle = "white";
      contexto.fillText(`SCORE: ${placar.pontuacao}`, canvas.width - 10, 35);
    },
    atualiza() {
      placar.pontuacao++;
    },
  };
  return placar;
}
//
// [Telas]
//
const globais = {};
let telaAtiva = {}; // vai receber sempre uma objeto de tela para atualizar

function mudaParaTela(novaTela) {
  //troca a tela ativa
  telaAtiva = novaTela;

  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}
const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    },
  },
};

Telas.JOGO = {
  inicializa() {
    globais.placar = criaPlacar();
  },
  desenha() {
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
    globais.placar.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza(); //atualiza a posicao antes de desenhar
  },
};

Telas.GAME_OVER = {
  desenha() {
    mensagemGameOver.desenha();
  },
  atualiza() {},
  click() {
    mudaParaTela(Telas.INICIO);
  },
};
//funcao que fica executando infinitamente renderizando o jogo na tela
function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  gameFrames++;
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
