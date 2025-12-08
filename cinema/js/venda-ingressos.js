// js/venda-ingressos.js
document.addEventListener('DOMContentLoaded', () => {
    const formVenda = document.getElementById('form-venda');
    const selectSessao = document.getElementById('select-sessao-venda');
    const inputQuantidade = document.getElementById('quantidade');
    const statusVenda = document.getElementById('status-venda');

    const dbFilmesKey = 'cinemadb_filmes';
    const dbSalasKey = 'cinemadb_salas';
    const dbSessoesKey = 'cinemadb_sessoes';

    // --- FUNÇÃO AUXILIAR PARA PREÇO ---
    function formatarPreco(valor) {
        if (valor === undefined || valor === null) {
            return "R$ 0,00";
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Carrega as sessões ao iniciar
    populateSessoesDisponiveis();

    formVenda.addEventListener('submit', (e) => {
        e.preventDefault();
        statusVenda.textContent = ''; 
        statusVenda.className = ''; 

        // 1. Armazena o ID da sessão selecionada ANTES de qualquer coisa
        const sessaoId = selectSessao.value;
        const quantidade = parseInt(inputQuantidade.value);

        if (!sessaoId) {
            statusVenda.textContent = 'Erro: Por favor, selecione uma sessão.';
            statusVenda.className = 'erro'; 
            return;
        }

        const sessoes = getData(dbSessoesKey);
        const salas = getData(dbSalasKey);

        const sessaoIndex = sessoes.findIndex(s => s.id == sessaoId);
        if (sessaoIndex === -1) {
            statusVenda.textContent = 'Erro: Sessão não encontrada.';
            statusVenda.className = 'erro'; 
            return;
        }
        
        const sessao = sessoes[sessaoIndex];
        const sala = salas.find(s => s.id == sessao.salaId);

        if (!sala) {
            statusVenda.textContent = 'Erro: Sala da sessão não encontrada.';
            statusVenda.className = 'erro'; 
            return;
        }

        const capacidade = sala.capacidade;
        const disponiveis = capacidade - sessao.ingressosVendidos;

        if (quantidade > disponiveis) {
            statusVenda.textContent = `Erro: Quantidade solicitada (${quantidade}) excede os ingressos disponíveis (${disponiveis}).`;
            statusVenda.className = 'erro'; 
            return;
        }

        // --- VENDA EFETUADA ---
        sessoes[sessaoIndex].ingressosVendidos += quantidade;
        saveData(dbSessoesKey, sessoes);

        const novosDisponiveis = disponiveis - quantidade;

        // 2. Feedback de sucesso (mostrando quantos restam)
        statusVenda.textContent = `Venda de ${quantidade} ingresso(s) realizada! Restam ${novosDisponiveis} ingressos.`;
        statusVenda.className = 'sucesso'; 

        // 3. NÃO USAR formVenda.reset()
        //    Em vez disso, resetar apenas a quantidade.
        inputQuantidade.value = 1;

        // 4. Recarregar as sessões, passando o ID da sessão atual
        //    e informando se ela acabou de esgotar.
        populateSessoesDisponiveis(sessaoId, novosDisponiveis === 0);
    });

    /**
     * Popula o <select> de sessões disponíveis.
     * @param {string} [sessaoIdSelecionada] - O ID da sessão que deve permanecer selecionada.
     * @param {boolean} [sessaoEsgotada] - Indica se a sessão acabou de se esgotar.
     */
    function populateSessoesDisponiveis(sessaoIdSelecionada = null, sessaoEsgotada = false) {
        const sessoes = getData(dbSessoesKey);
        const filmes = getData(dbFilmesKey);
        const salas = getData(dbSalasKey);
        const agora = new Date();

        // Limpa a lista para recarregar
        selectSessao.innerHTML = '<option value="">Selecione uma sessão disponível...</option>';

        const sessoesFuturas = sessoes.filter(sessao => new Date(sessao.horario) > agora);
        
        sessoesFuturas.forEach(sessao => {
            const filme = filmes.find(f => f.id == sessao.filmeId);
            const sala = salas.find(s => s.id == sessao.salaId);

            if (!filme || !sala) return;

            const disponiveis = sala.capacidade - sessao.ingressosVendidos;
            
            // Só exibe sessões que ainda têm lugares
            if (disponiveis > 0) {
                const horarioFormatado = new Date(sessao.horario).toLocaleString('pt-BR');
                
                const option = document.createElement('option');
                option.value = sessao.id;
                
                let textoOpcao = `
                    ${filme.titulo} (${sessao.idioma}/${sessao.formato}) - 
                    ${sala.nome} - 
                    ${horarioFormatado} - 
                    (${formatarPreco(sessao.preco)}) - 
                    (Disp: ${disponiveis})
                `;
                
                option.textContent = textoOpcao.replace(/\s+/g, ' ').trim();
                
                selectSessao.appendChild(option);
            }
        });

        // 5. Lógica para restaurar a seleção
        if (sessaoIdSelecionada && !sessaoEsgotada) {
            // Se a sessão foi vendida e NÃO se esgotou, seleciona ela de novo.
            selectSessao.value = sessaoIdSelecionada;
        } else if (sessaoEsgotada) {
            // Se a sessão acabou de se esgotar, o select volta ao "Selecione..."
            selectSessao.value = "";
            // E atualiza a mensagem de status
            statusVenda.textContent += " ESSA SESSÃO ESTÁ ESGOTADA E FOI REMOVIDA DA LISTA.";
            statusVenda.className = 'sucesso'; // Pode manter 'sucesso' ou mudar para 'aviso'
        }
    }
});