var meuInput = document.getElementById('anText');
var meuBotao = document.querySelector('#procurar');
var resultadoContainer = document.getElementById('resultadoPersonagens');
var imagem = document.getElementById('personagem-imagem');
var infoDiv = document.getElementById('info-personagem');
var planetaContainerDiv = document.getElementById('planeta-container');
var sumir = document.querySelectorAll('#dragon');

function sumido() {
    sumir.forEach(element => element.style.display = 'none');
};

function mostrar() {
    sumir.forEach(element => element.style.display = 'block');
};

function limparBusca() {
    atualizarTexturaPlaneta('default');
};


const imagemMapa = {
    '1': './assets/imagens/personagens/luke 1.png',
    '2': './assets/imagens/personagens/c3po 1.png',
    '3': './assets/imagens/personagens/r2d2 1.png',
    '4': './assets/imagens/personagens/darth 1.png',
    '5': './assets/imagens/personagens/leia.png',
    '6': './assets/imagens/personagens/owen1.png',
    '7': './assets/imagens/personagens/beru.png',
    '8': './assets/imagens/personagens/r5d4.png',
    '9': './assets/imagens/personagens/biggs.png',
    '10': './assets/imagens/personagens/obiWan.png',
    '11': './assets/imagens/personagens/anakin.png',
    '12': './assets/imagens/personagens/wilhuf.png',
    '13': './assets/imagens/personagens/chewbacca.png',
    '14': './assets/imagens/personagens/hansolo.png',
    '15': './assets/imagens/personagens/greedo.png',
    '16': './assets/imagens/personagens/jabba.png',
    '18': './assets/imagens/personagens/WedgeAntilles.png',
    '19': './assets/imagens/personagens/tono.png',
    '20': './assets/imagens/personagens/yoda.png',

    //continuar ids.
};

meuBotao.addEventListener('click', () => {
    sumido();
    setTimeout(async() => {
        let valor = meuInput.value.trim();
        let URL = `https://swapi.bry.com.br/api/people/${valor}/`;

        try{
            let resposta = await fetch(URL);
            let personagens = await resposta.json();

            if(!resposta.ok) throw new Error('personagem não encontrado');

            imagem.style.display = 'flex';
            infoDiv.style.display = 'flex';
            imagem.style.flexDirection = 'column';
            resultadoContainer.style.display = 'flex';

            // nome do personagem
            let nomeP = document.createElement('h2');
            nomeP.textContent = personagens.name;
            nomeP.style.color = '#fd9103';
            nomeP.style.fontFamily = `'Times New Roman', Times, serif`;
            nomeP.style.fontSize = '30pt';
            imagem.appendChild(nomeP);

            //imagem do personagem
            if(imagemMapa[valor]) {
                let imgElement = document.createElement('img');
                imgElement.src = imagemMapa[valor];
                imgElement.alt = personagens.name;
                imgElement.style.width = '380px';
                imgElement.style.height = '370px';
                imgElement.style.margin = 'auto';

                imagem.appendChild(imgElement);
            };

            //informação do personagem 

            let listaMostrar = [
                `Altura: ${personagens.height}`,
                `Cor do olho: ${personagens.eye_color}`,
                `Cor do Cabelo: ${personagens.hair_color}`,
                `Genero: ${personagens.gender}`
            ]

            let textosContainer = document.createElement('div');
            let htmlInterno = '';
            listaMostrar.forEach(item => {
                htmlInterno += `<p style="color: #fd9103; font-size: 26pt; margin: 18px; text-align: center">${item}<br></p>`
            });
            textosContainer.innerHTML = htmlInterno;
            textosContainer.style.marginBottom = '35px';

            infoDiv.appendChild(textosContainer);
            infoDiv.style.flexDirection = 'colunm';

            if(personagens.homeworld) {
                let respostaPlaneta = await fetch(personagens.homeworld);
                let planeta = await respostaPlaneta.json();

                const tituloPlaneta = document.createElement('h2');
                tituloPlaneta.className = 'titulo-secao';
                tituloPlaneta.textContent = planeta.name;
                tituloPlaneta.style.fontSize = '30pt';
                planetaContainerDiv.appendChild(tituloPlaneta);

                planetaContainerDiv.style.display = 'flex';
                planetaContainerDiv.style.flexDirection = 'colunm-reverse';
                resultadoContainer.style.display = 'flex';
                planetaContainerDiv.style.flexWrap = 'wrap-reverse';

                iniciarPlaneta3D();
                atualizarTexturaPlaneta(planeta.name);
            };

        } catch(erro) {
            imagem.innerHTML = `<p style="color: red">Erro: ${erro.message}</p>`;
            imagem.style.display = 'flex';
        }
    }, 1000);
});

//criando planeta 3d

let globo;
const carregadorDeTextura = new THREE.TextureLoader();

function iniciarPlaneta3D() {
    const container = document.querySelector('#imagem-planeta');

    const cena = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2.0;

    const renderizacao = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderizacao.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderizacao.domElement);

    cena.add(new THREE.AmbientLight(0xffffff, 0.8));
    const luzPonto = new THREE.PointLight(0xffffff, 1);
    luzPonto.position.set(5, 3, 5);
    cena.add(luzPonto);

    const geometria = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: carregadorDeTextura.load('./assets/imagens/planetas/terra.jpg') });
    globo = new THREE.Mesh(geometria, material);
    cena.add(globo);

    function animar() {
        requestAnimationFrame(animar);
        globo.rotation.y += 0.005;
        renderizacao.render(cena, camera);
    };

    animar();
};

const planetaTexturaMapa = {
    'Tatooine': './assets/imagens/planetas/tatooine.jpg',
    'Alderaan': './assets/imagens/planetas/alderaan.png',
    'Naboo': './assets/imagens/planetas/naboo1.jpg',
    'Hoth': './assets/imagens/planetas/hoth.png',
    'Yavin IV': './assets/imagens/planetas/YavinIV.jpg',
    'Bestine IV': './assets/imagens/planetas/BestineIV.png',
    'Stewjon': './assets/imagens/planetas/Stewjon.jpg',
    'Kashyyyk': './assets/imagens/planetas/Kashyyyk.jpg',
    'Corellia': './assets/imagens/planetas/corellia.jpg',
    'Eriadu': './assets/imagens/planetas/eriadu.jpg',
    'Rodia': './assets/imagens/planetas/Rodia.jpg',
    'Nal Hutta': './assets/imagens/planetas/nalhutta.jpg',
    'unknown': './assets/imagens/planetas/unknown.jpg',
    'defaut': './assets/imagens/planetas/terra.jpg'
};

function atualizarTexturaPlaneta(nomeDoPlaneta) {
    if(!globo) return;
    const urlTextura = planetaTexturaMapa[nomeDoPlaneta] || planetaTexturaMapa.defaut;
    globo.material.map = carregadorDeTextura.load(urlTextura)
};
