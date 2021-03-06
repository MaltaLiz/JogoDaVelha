const campos = document.querySelectorAll('.campo');
const jogador1 = document.querySelector('#jogador1');
const jogador2 = document.querySelector('#jogador2');
const placarJogador1 = document.querySelector('#placarJogador1');
const placarJogador2 = document.querySelector('#placarJogador2');
const info = document.querySelector('#informacoes');
let jogada = 0;
const camposX = [];
const camposO = [];
const casosDeSucesso =
    [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ];
const vez = {
    'jogador1': true,
    'jogador2': false
}

iniciaOJogo();

campos.forEach(campo => {
    campo.addEventListener('click', () => {
        const vezJogador1 = verificaVez();
        if (vezJogador1) {
            campo.textContent = 'X';
            camposX.push(parseInt(campo.getAttribute("value")));
            if (verificaVitoria(camposX)) {
                aumentaPlacar('jogador1');
                jogador1.textContent = verificaPlacar('jogador1');
                reiniciaOJogo();
            } else if (jogada == 8) {
                deuVelha('jogador1');
                reiniciaOJogo();
            } else {
                trocaVezDeJogar();
            }
        }
        else {
            campo.textContent = 'O';
            camposO.push(parseInt(campo.getAttribute("value")));
            if (verificaVitoria(camposO)) {
                aumentaPlacar('jogador2');
                jogador2.textContent = verificaPlacar('jogador2');
                reiniciaOJogo();
            } else if (jogada == 8) {
                deuVelha('jogador2');
                reiniciaOJogo();
            } else {
                trocaVezDeJogar();
            }
        }
        jogada++;
    })
});

function iniciaOJogo() {
    sessionStorage.setItem('vez', JSON.stringify(vez));

    jogador1.textContent = verificaPlacar('jogador1');
    jogador2.textContent = verificaPlacar('jogador2');
    placarJogador1.classList.add('vez');

}

function marcaCamposVitorioso(arrayVitorias) {
    for (campoVitorioso of arrayVitorias) {
        campos.forEach(campo => {
            if (campo.getAttribute("value") == campoVitorioso) campo.classList.add('vencedor');
        })
    }
}

function verificaVitoria(arrayJogadas) {

    const vitorias = casosDeSucesso
        .filter(casos => {
            let contador = 0;
            for (caso of casos) {
                if (arrayJogadas.includes(caso)) contador++;
            }
            if (contador === 3) return true;
            return false;
        })
        .reduce((arr, item) => arr.concat(item), []);

    if (vitorias.length) {
        marcaCamposVitorioso(vitorias);
        return true;
    }
    return false;
}

function verificaPlacar(placarDoJogador) {
    let resultado = sessionStorage.getItem(placarDoJogador);
    if (resultado === null) {
        sessionStorage.setItem(placarDoJogador, '0');
        resultado = sessionStorage.getItem(placarDoJogador);
    };
    return parseInt(resultado);
}

function aumentaPlacar(placarDoJogador) {
    sessionStorage.setItem(placarDoJogador, verificaPlacar(placarDoJogador) + 1);
    trocaVezDeComecar(placarDoJogador);
}

function verificaVez() {
    const vezObj = JSON.parse(sessionStorage.getItem('vez'));
    if (vezObj.jogador1) {
        marcaProximaVez(vezObj.jogador2);
        return true;
    } else {
        marcaProximaVez(!vezObj.jogador1);
        return false;
    }
}

function marcaProximaVez(vezJogador1){
    if(vezJogador1) {
        placarJogador1.classList.add('vez');
        placarJogador2.classList.remove('vez');
    }else {
        placarJogador1.classList.remove('vez');
        placarJogador2.classList.add('vez');
    }
}

function trocaVezDeJogar() {
    vez.jogador1 = !vez.jogador1;
    vez.jogador2 = !vez.jogador2;
    sessionStorage.setItem('vez', JSON.stringify(vez));
}

function trocaVezDeComecar(vencedor) {
    if (vencedor === 'jogador1') {
        vez.jogador1 = true;
        vez.jogador2 = false;
        marcaProximaVez(vez.jogador1)
    } else {
        vez.jogador1 = false;
        vez.jogador2 = true;
        marcaProximaVez(!vez.jogador2);
    }
    sessionStorage.setItem('vez', JSON.stringify(vez));
}

function deuVelha(jogador) {
    info.textContent = 'Deu velha!';
    info.classList.add('empate');
    if (jogador === 'jogador1') {
        marcaProximaVez(vez.jogador1);
    } else {
        marcaProximaVez(!vez.jogador2);
    }
}

function reiniciaOJogo() {
    setTimeout(() => {
        campos.forEach(campo => {
            campo.textContent = ''
            campo.classList.remove('vencedor');
        });
        info.classList.remove('empate');
        info.textContent = '';
        jogada = 0;
    }, 1800);
    while (camposX.length) camposX.pop();
    while (camposO.length) camposO.pop();
}


