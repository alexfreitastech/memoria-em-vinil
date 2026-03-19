window.addEventListener('DOMContentLoaded', () => {
    const savedPageId = sessionStorage.getItem('paginaAtual') || '1';
    showPage(savedPageId, false);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const pageId = link.getAttribute('data-page');
            sessionStorage.setItem('paginaAtual', pageId);
            showPage(pageId, true);
            document.getElementById('main-menu').classList.remove('open');
        });
    });

    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('main-menu');
    if (hamburger && menu) {
        hamburger.addEventListener('click', () => menu.classList.toggle('open'));
    }

    window.scrollToMain = function () {
        document.getElementById('conteudo-principal').scrollIntoView({ behavior: 'smooth' });
    };

    if (savedPageId === '5') configurarFormularioRelato();
    atualizarRelatos();
});

const posicoesScroll = {};

function showPage(pageId, scroll) {
    const hero = document.getElementById('hero-banner');
    if (hero) hero.classList.toggle('hidden', pageId !== '1');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active-link', link.getAttribute('data-page') === pageId);
    });

    document.querySelectorAll('.page-section').forEach(section => {
        if (section.classList.contains('active')) {
            posicoesScroll[section.id] = window.scrollY;
        }
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(`page-${pageId}`);
    if (targetSection) {
        targetSection.classList.add('active');
        if (scroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo(0, posicoesScroll[targetSection.id] || 0);
        }
        if (pageId === '5') configurarFormularioRelato();
    }
}

let relatosUsuario = JSON.parse(localStorage.getItem('relatosUsuario')) || [];

function atualizarRelatos() {
    const container = document.getElementById('relatos-enviados');
    if (!container) return;
    container.innerHTML = '';

    if (relatosUsuario.length === 0) {
        container.innerHTML = `<p style="text-align:center;color:#888;font-style:italic;font-size:17px;padding:24px 0;">Ainda não há relatos. Seja o primeiro!</p>`;
        return;
    }

    relatosUsuario.forEach((relato, i) => {
        const div = document.createElement('div');
        div.classList.add('relato-usuario');
        div.style.animationDelay = `${i * 0.07}s`;

        const idadeStr = relato.idade ? `${relato.idade} anos` : '';
        div.innerHTML = `
            <p class="user-details">
                <span>${relato.nome}</span>
                ${idadeStr ? `<span>${idadeStr}</span>` : ''}
            </p>
            <p class="relato-text">"${relato.texto}"</p>
        `;
        container.appendChild(div);
    });
}

function configurarFormularioRelato() {
    const form = document.getElementById('form-relato');
    const nomeInput = document.getElementById('nome');
    const idadeInput = document.getElementById('idade');
    const relatoInput = document.getElementById('relato');

    if (!form || !nomeInput || !idadeInput || !relatoInput) return;

    form.onsubmit = function (event) {
        event.preventDefault();
        const nome = nomeInput.value.trim();
        const idade = idadeInput.value.trim();
        const texto = relatoInput.value.trim();

        if (!nome || !idade || !texto) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const nomeFormatado = nome
            .split(' ')
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
            .join(' ');

        const textoFormatado = texto.charAt(0).toUpperCase() + texto.slice(1);

        relatosUsuario.push({ nome: nomeFormatado, idade, texto: textoFormatado });
        localStorage.setItem('relatosUsuario', JSON.stringify(relatosUsuario));
        atualizarRelatos();
        form.reset();
        relatoInput.style.height = 'auto';
        document.getElementById('relatos-enviados').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    relatoInput.oninput = () => {
        relatoInput.style.height = 'auto';
        relatoInput.style.height = relatoInput.scrollHeight + 'px';
    };

    atualizarRelatos();
}

const botaoTopo = document.getElementById('btn-topo');

window.addEventListener('scroll', () => {
    if (botaoTopo) botaoTopo.style.display = window.scrollY > 250 ? 'flex' : 'none';
});

if (botaoTopo) {
    botaoTopo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (header) {
        header.style.boxShadow = window.scrollY > 10
            ? '0 4px 32px rgba(0,0,0,0.42)'
            : '0 4px 24px rgba(0,0,0,0.3)';
    }
});