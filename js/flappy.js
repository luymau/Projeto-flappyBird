function novoElemento(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Barreira(reversa = false){
    this.elemento = novoElemento('div', 'barreira');

    const borda = novoElemento('div', 'borda');
    const corpo = novoElemento('div', 'corpo');
    this.elemento.appendChild(reversa ? corpo : borda);
    this.elemento.appendChild(reversa ? borda : corpo);

    this.setAltura = altura => corpo.style.height = `${altura}px`;
}

//const b = new Barreira(true);
//b.setAltura(300);
//document.querySelector('[wm-flappy]').appendChild(b.elemento);

function parDeBarreiras(altura, abertura, posicaoX){
    this.elemento = novoElemento('div', 'par-de-barreiras');

    this.superior = new Barreira(true);
    this.inferior = new Barreira(false);

    this.elemento.appendChild(this.superior.elemento);
    this.elemento.appendChild(this.inferior.elemento);

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura);
        const alturaInferior = altura - abertura - alturaSuperior;
        this.superior.setAltura(alturaSuperior);
        this.inferior.setAltura(alturaInferior);
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]);
    this.setX = posicaoX => this.elemento.style.left = `${posicaoX}px`;
    this.getLargura = () => this.elemento.clientWidth;

    this.sortearAbertura();
    this.setX(posicaoX);
}

//const b = new parDeBarreiras(700, 200, 400);
//document.querySelector('[wm-flappy]').appendChild(b.elemento);

function Barreiras(altura, largura, abertura, espaco, notificarPonto){
    this.pares = [
        new parDeBarreiras(altura, abertura, largura),
        new parDeBarreiras(altura, abertura, largura + espaco),
        new parDeBarreiras(altura, abertura, largura + espaco * 2),
        new parDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3;
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento);

            //Quando o elemento sair da área do jogo
            if(par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length);
                par.sortearAbertura();
            }

            const meio = largura / 2;
            const cruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio
            if(cruzouMeio) notificarPonto();
        })
    }
}

function Passaro(alturaJogo){
    let voando = false;
    

    this.elemento = novoElemento('img', 'passaro');
    this.elemento.src = 'imgs/passaro.png';

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0]);
    this.setY = y => this.elemento.style.bottom = `${y}px`;

    window.onkeydown = e => voando = true; //Se qualquer tecla tiver pressionada, será setado true
    window.onkeyup = e => voando = false;

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5) //Quanto o passaro sobe ou cai
        const alturaMaxima = alturaJogo - this.elemento.clientHeight;

        if(novoY <= 0){
            this.setY(0)
        }else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima);
        }else {
            this.setY(novoY);
        }
    }

  this.setY(alturaJogo / 2);
}

/*const barreiras = new Barreiras(700, 1200, 200, 400)
const passaro = new Passaro(700)
const areaJogo = document.querySelector('[wm-flappy]')

areaJogo.appendChild(passaro.elemento);
barreiras.pares.forEach(par => areaJogo.appendChild(par.elemento))
setInterval( () => {
    barreiras.animar();
    passaro.animar();
},20)*/