// js/cadastro-sessoes.js
document.addEventListener('DOMContentLoaded', () => {
    const formSessao = document.getElementById('form-sessao');
    const selectFilme = document.getElementById('select-filme');
    const selectSala = document.getElementById('select-sala');
    const listaSessoes = document.getElementById('lista-sessoes');

    const dbFilmesKey = 'cinemadb_filmes';
    const dbSalasKey = 'cinemadb_salas';
    const dbSessoesKey = 'cinemadb_sessoes';

    // --- FUNÇÃO AUXILIAR PARA PREÇO ---
    /**
     * Formata um número para o formato de moeda BRL (R$ 10,00).
     * @param {number} valor O valor numérico.
     * @returns {string} O valor formatado como moeda.
     */
    function formatarPreco(valor) {
        if (valor === undefined || valor === null) {
            return "R$ 0,00";
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Funções de inicialização
    populateFilmes();
    populateSalas();
    renderSessoes();

    // Evento de submit do formulário
    formSessao.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Coletar todos os dados do formulário
        const novaSessao = {
            id: generateId(),
            filmeId: selectFilme.value, 
            salaId: selectSala.value,   
            horario: document.getElementById('horario').value,
            preco: parseFloat(document.getElementById('preco').value), // NOVO
            idioma: document.getElementById('idioma').value,         // NOVO
            formato: document.getElementById('formato').value,       // NOVO
            ingressosVendidos: 0 
        };

        const sessoes = getData(dbSessoesKey);
        sessoes.push(novaSessao);
        saveData(dbSessoesKey, sessoes);

        renderSessoes();
        formSessao.reset();
        alert('Sessão cadastrada com sucesso!');
    });

    // ... (funções populateFilmes e populateSalas permanecem iguais) ...
    function populateFilmes() {
        const filmes = getData(dbFilmesKey);
        filmes.forEach(filme => {
            const option = document.createElement('option');
            option.value = filme.id;
            option.textContent = filme.titulo;
            selectFilme.appendChild(option);
        });
    }

    function populateSalas() {
        const salas = getData(dbSalasKey);
        salas.forEach(sala => {
            const option = document.createElement('option');
            option.value = sala.id;
            // Agora exibimos o tipo da sala no select
            option.textContent = `${sala.nome} (${sala.tipo} - Cap: ${sala.capacidade})`;
            selectSala.appendChild(option);
        });
    }


    // Renderiza a lista de sessões cadastradas
    function renderSessoes() {
        const sessoes = getData(dbSessoesKey);
        const filmes = getData(dbFilmesKey);
        const salas = getData(dbSalasKey);

        listaSessoes.innerHTML = '';

        if (sessoes.length === 0) {
            listaSessoes.innerHTML = '<p>Nenhuma sessão cadastrada.</p>';
            return;
        }

        sessoes.forEach(sessao => {
            const filme = filmes.find(f => f.id == sessao.filmeId);
            const sala = salas.find(s => s.id == sessao.salaId);

            const horarioFormatado = new Date(sessao.horario).toLocaleString('pt-BR');

            // 2. Exibir os novos dados na listagem
            const sessaoDiv = document.createElement('div');
            sessaoDiv.className = 'lista-item';
            sessaoDiv.innerHTML = `
                <h3>${filme ? filme.titulo : 'Filme não encontrado'}</h3>
                <p><strong>Info:</strong> ${sessao.idioma || 'N/A'} - ${sessao.formato || 'N/A'}</p>
                <p><strong>Sala:</strong> ${sala ? sala.nome : 'Sala não encontrada'}</p>
                <p><strong>Horário:</strong> ${horarioFormatado}</p>
                <p><strong>Preço:</strong> ${formatarPreco(sessao.preco)}</p>
                <p><strong>Ingressos Vendidos:</strong> ${sessao.ingressosVendidos}</p>
            `;
            listaSessoes.appendChild(sessaoDiv);
        });
    }
});