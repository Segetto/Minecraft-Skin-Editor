const cabeca = document.getElementById('cabeca');
const corpo = document.getElementById('corpo');
let corpoRect = corpo.getBoundingClientRect();
const canvases = document.getElementsByClassName("layer");
const secondLayer = document.getElementsByClassName("second");
let facesCabeca = document.getElementById("cabeca").getElementsByClassName("layer");
let facesBracoEsquerdo = document.getElementById("bracoesquerdo").getElementsByClassName("layer");
let facesTorso = document.getElementById("torso").getElementsByClassName("layer");
let facesBracoDireito = document.getElementById("bracodireito").getElementsByClassName("layer");
let facesPernaEsquerda = document.getElementById("pernaesquerda").getElementsByClassName("layer");
let facesPernaDireita = document.getElementById("pernadireita").getElementsByClassName("layer");
let imagemFonte = "img/Steve.png";
let borrachaTrue = false;

let showSecondLayer = true;
let over = false;
let mouseX = 0;
let mouseY = 0;
let mouseXBefore = 0;
let mouseYBefore = 0;
let mouseXAfter = 0;
let mouseYAfter = 0;
let movX = 0;
let movY = 0;
let cubeX = corpoRect.left + corpoRect.width / 2;
let cubeY = corpoRect.top + corpoRect.height / 2;
let easing = 10; 
let isMouseDown = false;
let botaoMover = false;
let botaoDesenhar = false;
let baldeCor = false;
let corpoXRotation = 0;
let corpoYRotation = 0;
let link = document.getElementById('baixar');
link.download = 'Skin.png';
let tamanhoComputado;
let imgSkinNew = document.createElement("canvas");
let cabecaInvisivel = false;
let torsoInvisivel = false;
let bracoDireitoInvisivel = false;
let bracoEsquerdoInvisivel = false;
let pernaEsquerdaInvisivel = false;
let pernaDireitaInvisivel = false;
const fileInput = document.getElementById('skinarquivo')
let skinEnviada;

function clicarArquivo() {
    fileInput.click();
}

imgSkinNew.width = 64;
imgSkinNew.height = 64;

function adicionarSkin() {
    const novaskin = new Image();
    skinEnviada = fileInput.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
        imagemFonte = event.target.result; 

        novaskin.onload = function () {
            const skinnew = imgSkinNew.getContext('2d');
            skinnew.clearRect(0, 0, imgSkinNew.width, imgSkinNew.height);
            skinnew.drawImage(novaskin, 0, 0);

            var imageDataURL = imgSkinNew.toDataURL('image/png');
            link.setAttribute("href", imageDataURL);
            trocarSkin();
        };

        novaskin.src = imagemFonte; 
    };

    reader.readAsDataURL(skinEnviada); 
}

let skin = new Image();
skin.src = imagemFonte;
const skinImg = imgSkinNew.getContext('2d');
skinImg.drawImage(skin, 0, 0);

var imageIn = imgSkinNew.toDataURL('image/png');

link.setAttribute("href", imageIn);

document.documentElement.onselectstart = function () { return false; };

document.addEventListener('mousemove', updateMouse);

function mover() {
    botaoDesenhar = false;
    baldeCor = false;
    botaoMover = true;
    borrachaTrue = false;
    document.documentElement.style.cursor = "grab";
}

function borracha() {
    borrachaTrue = true;
    baldeCor = false;
    botaoMover = false;
    botaoDesenhar = true;
    document.documentElement.style.cursor = "crosshair";
}

function desenhar() {
    borrachaTrue = false;
    baldeCor = false;
    botaoMover = false;
    botaoDesenhar = true;
    document.documentElement.style.cursor = "crosshair";
}

function balde() {
    borrachaTrue = false;
    baldeCor = true;
    botaoMover = false;
    botaoDesenhar = true;
    document.documentElement.style.cursor = "crosshair";
}

function updateMouse(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (isMouseDown && botaoMover && over) {
        
        let targetXRotation = corpoXRotation + (mouseY - mouseYBefore) * 0.1;
        let targetYRotation = corpoYRotation + (mouseX - mouseXBefore) * 0.1;

        
        corpoXRotation += (targetXRotation - corpoXRotation) * easing;
        corpoYRotation += (targetYRotation - corpoYRotation) * easing;
        
        
        corpo.style.transform = `rotateX(${-corpoXRotation}deg) rotateY(${corpoYRotation}deg)`;

        
        mouseXBefore = mouseX;
        mouseYBefore = mouseY;
    }
}

function mostrarcamada() {
    if (showSecondLayer == true) {
        showSecondLayer = false;
        Array.from(document.getElementsByClassName("icon")).forEach(icone => {
            icone.style.borderStyle = 'none';
        });
        Array.from(secondLayer).forEach(layer => {
            layer.style.visibility = 'hidden';
            layer.style.opacity = '0';
        });
    } else {
        showSecondLayer = true;
        Array.from(document.getElementsByClassName("icon")).forEach(icone => {
            icone.style.borderStyle = 'solid';
        });
        Array.from(secondLayer).forEach(layer => {
            layer.style.visibility = 'visible';
            layer.style.opacity = '1';
        });
    }
}

document.addEventListener('mousedown', function (event) {
    mouseXBefore = mouseX;
    mouseYBefore = mouseY;
    isMouseDown = true;
    if (botaoMover) {
        document.documentElement.style.cursor = "grabbing";
    }
});

document.getElementsByClassName('botoes')[0].addEventListener('mouseover', () => {
    over = false;
});
document.getElementsByClassName('botoes')[0].addEventListener('mouseleave', () => {
    over = true;
});

document.addEventListener('mouseup', function () {
    mouseXAfter = movX;
    mouseYAfter = movY;
    isMouseDown = false;
    if (botaoMover) {
        document.documentElement.style.cursor = "grab";
    }
});


function membroButton(id) {
    let membro = document.getElementById(id).getElementsByClassName("layer");
    let invisivel = true;
    if (membro[0].style.opacity && membro[0].style.opacity == 0) {
        invisivel = false;
    }
    Array.from(membro).forEach(faces => {
        if (invisivel == true) {
            faces.style.opacity = 0;
            faces.style.visibility = 'hidden';
            faces.style.zIndex = '0';
            document.getElementById(id + "-botao").style.backgroundColor = "#F33";
        } else {
            faces.style.opacity = 1;
            faces.style.visibility = 'visible';
            document.getElementById(id + "-botao").style.backgroundColor = "#3F3";
        }
    });
}

function ajustarValor(valor) {
    return valor === 64 ? 0 : valor;
}

function trocarSkin() {
    Array.from(canvases).forEach(canvas => {
        const img = new Image();
        img.onload = function () {
            const ctximage = canvas.getContext('2d');
            const tamanhoComputado = window.getComputedStyle(canvas);
            const imagemSteve = tamanhoComputado.getPropertyValue('background-size').replace('px', '');
            ctximage.imageSmoothingEnabled = false;

            let posX = Math.round(64 * ((imagemSteve - tamanhoComputado.getPropertyValue('background-position-x').replace('px', '')) / imagemSteve));
            let posY = Math.round(64 * ((imagemSteve - tamanhoComputado.getPropertyValue('background-position-y').replace('px', '')) / imagemSteve));
            let scaleX = Math.round(64 * ((tamanhoComputado.getPropertyValue('width').replace('px', '')) / imagemSteve));
            let scaleY = Math.round(64 * ((tamanhoComputado.getPropertyValue('height').replace('px', '')) / imagemSteve));

            posX = ajustarValor(posX);
            posY = ajustarValor(posY);

            ctximage.drawImage(
                img,
                posX,
                posY,
                scaleX,
                scaleY,
                0,
                0,
                Math.round(canvas.width),
                Math.round(canvas.height)
            );
        };

        img.src = imagemFonte;
    });
}

Array.from(canvases).forEach(canvas => {
    const img = new Image();
    img.onload = (function () {
        const ctximage = canvas.getContext('2d');
        const tamanhoComputado = window.getComputedStyle(canvas);
        const imagemSteve = tamanhoComputado.getPropertyValue('background-size').replace('px', '');
        ctximage.imageSmoothingEnabled = false;

        let posX = Math.round(64 * ((imagemSteve - tamanhoComputado.getPropertyValue('background-position-x').replace('px', '')) / imagemSteve));
        let posY = Math.round(64 * ((imagemSteve - tamanhoComputado.getPropertyValue('background-position-y').replace('px', '')) / imagemSteve));
        let scaleX = Math.round(64 * ((tamanhoComputado.getPropertyValue('width').replace('px', '')) / imagemSteve));
        let scaleY = Math.round(64 * ((tamanhoComputado.getPropertyValue('height').replace('px', '')) / imagemSteve));

        posX = ajustarValor(posX);
        posY = ajustarValor(posY);

        ctximage.drawImage(
            img,
            posX,
            posY,
            scaleX,
            scaleY,
            0,
            0,
            Math.round(canvas.width),
            Math.round(canvas.height)
        );
    });
    img.src = imagemFonte;

    canvas.addEventListener('mousedown', function (event) {
        if (botaoDesenhar) {
            isMouseDown = true;
            mouseX = event.offsetX;
            mouseY = event.offsetY;
            mudarCor(canvas, mouseX, mouseY);
        }
    });

    canvas.addEventListener('mousemove', function (event) {
        if (isMouseDown && botaoDesenhar) {
            mouseX = event.offsetX;
            mouseY = event.offsetY;
            mudarCor(canvas, mouseX, mouseY);
        }
    });

    canvas.addEventListener('mouseup', function () {
        isMouseDown = false;
    });
});

function mudarCor(canvas, posx, posy) {
    let cor = document.getElementById("hex").value;
    if (cor === "" || showSecondLayer == false && borrachaTrue == true) {
        cor = "#FFFFFF";
    }
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = cor;

    const estiloComputado = window.getComputedStyle(canvas);
    let pixelSize = estiloComputado.getPropertyValue('background-size').replace('px', '') / 64;
    let pixelWidth = estiloComputado.getPropertyValue('width').replace('px', '') / pixelSize;
    let pixelHeight = estiloComputado.getPropertyValue('height').replace('px', '') / pixelSize;

    let relPosWidth = canvas.width / estiloComputado.getPropertyValue('width').replace('px', '');
    let relPosHeight = canvas.width / estiloComputado.getPropertyValue('height').replace('px', '');

    let tamanhoX = canvas.width / pixelWidth;
    let tamanhoY = canvas.height / pixelHeight;

    const roundedPosX = Math.round(((posx - tamanhoX / 12) * relPosWidth / 1.075) / tamanhoX) * tamanhoX;
    const roundedPosY = Math.round(((posy - tamanhoY / 6) * relPosHeight / 2.15) / tamanhoY) * tamanhoY;

    if (baldeCor == true) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (borrachaTrue == true && showSecondLayer == true) {
        ctx.clearRect(roundedPosX, roundedPosY, tamanhoX, tamanhoY);
    } else {
        ctx.fillRect(roundedPosX, roundedPosY, tamanhoX, tamanhoY);
    }

    const ctxSkin = imgSkinNew.getContext('2d');
    ctxSkin.drawImage(skin, ctxSkin.width, ctxSkin.height);

    const imagemSteve = estiloComputado.getPropertyValue('background-size').replace('px', '');
    ctxSkin.imageSmoothingEnabled = false;

    let posXCanvas = Math.round(64 * ((imagemSteve - estiloComputado.getPropertyValue('background-position-x').replace('px', '')) / imagemSteve));
    let posYCanvas = Math.round(64 * ((imagemSteve - estiloComputado.getPropertyValue('background-position-y').replace('px', '')) / imagemSteve));
    let scaleX = Math.round(64 * ((estiloComputado.getPropertyValue('width').replace('px', '')) / imagemSteve));
    let scaleY = Math.round(64 * ((estiloComputado.getPropertyValue('height').replace('px', '')) / imagemSteve));

    posXCanvas = ajustarValor(posXCanvas);
    posYCanvas = ajustarValor(posYCanvas);

    ctxSkin.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        posXCanvas,
        posYCanvas,
        scaleX,
        scaleY
    );

    var imageDataURL = imgSkinNew.toDataURL('image/png');

    link.setAttribute("href", imageDataURL);
}
