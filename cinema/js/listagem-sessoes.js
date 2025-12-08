// js/listagem-sessoes.js
document.addEventListener('DOMContentLoaded', () => {
    const listaSessoes = document.getElementById('lista-sessoes-disponiveis');

    const dbFilmesKey = 'cinemadb_filmes';
    const dbSalasKey = 'cinemadb_salas';
    const dbSessoesKey = 'cinemadb_sessoes';
    
    // --- FUNÇÃO AUXILIAR PARA PREÇO (Copie para cá também) ---
    function formatarPreco(valor) {
        if (valor === undefined || valor === null) {
            return "R$ 0,00";
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    renderizarListagem();

    function renderizarListagem() {
        const sessoes = getData(dbSessoesKey);
        const filmes = getData(dbFilmesKey);
        const salas = getData(dbSalasKey);
        const agora = new Date();

        listaSessoes.innerHTML = '';

        const sessoesFuturas = sessoes
            .filter(sessao => new Date(sessao.horario) > agora)
            .sort((a, b) => new Date(a.horario) - new Date(b.horario));


        if (sessoesFuturas.length === 0) {
            listaSessoes.innerHTML = '<p>Nenhuma sessão disponível no momento.</p>';
            return;
        }
        
        sessoesFuturas.forEach(sessao => {
            const filme = filmes.find(f => f.id == sessao.filmeId);
            const sala = salas.find(s => s.id == sessao.salaId);

            if (!filme || !sala) return; 

            const capacidade = sala.capacidade;
            const disponiveis = capacidade - sessao.ingressosVendidos;
            const horarioFormatado = new Date(sessao.horario).toLocaleString('pt-BR');
            const corClasse = disponiveis > 0 ? 'disponiveis-verde' : 'disponiveis-vermelho';

            const sessaoDiv = document.createElement('div');
            sessaoDiv.className = 'lista-item';
            // ATUALIZANDO O HTML DA LISTAGEM
            sessaoDiv.innerHTML = `
                <h3>${filme.titulo}</h3>
                <p><strong>Sessão:</strong> ${sessao.idioma} - ${sessao.formato}</p>
                <p><strong>Sala:</strong> ${sala.nome} (${sala.tipo})</p>
                <p><strong>Horário:</strong> ${horarioFormatado}</p>
                <p><strong>Preço:</strong> ${formatarPreco(sessao.preco)}</p>
                <p class="${corClasse}">
                    Ingressos Disponíveis: ${disponiveis}
                </p>
            `;
            listaSessoes.appendChild(sessaoDiv);
        });
    }
});