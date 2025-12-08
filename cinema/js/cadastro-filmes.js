// js/cadastro-filmes.js
document.addEventListener('DOMContentLoaded', () => {
    const formFilme = document.getElementById('form-filme');
    const listaFilmes = document.getElementById('lista-filmes');
    const dbKey = 'cinemadb_filmes';

    // --- FUNÇÃO AUXILIAR PARA FORMATAR DATA ---
    /**
     * Formata uma data do formato 'YYYY-MM-DD' para 'DD/MM/YYYY'.
     * @param {string} dataISO A data no formato ISO (YYYY-MM-DD).
     * @returns {string} A data formatada (DD/MM/YYYY).
     */
    function formatarData(dataISO) {
        if (!dataISO) return 'N/A';
        // new Date(dataISO) pode ter problemas com fuso horário (timezone).
        // É mais seguro tratar a string diretamente.
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Carrega e renderiza os filmes ao iniciar
    renderFilmes();

    formFilme.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Coletar dados do formulário (COM NOVOS CAMPOS)
        const novoFilme = {
            id: generateId(),
            titulo: document.getElementById('titulo').value,
            genero: document.getElementById('genero').value,
            dataEstreia: document.getElementById('dataEstreia').value, // NOVO
            duracao: parseInt(document.getElementById('duracao').value),
            classificacao: document.getElementById('classificacao').value,
            descricao: document.getElementById('descricao').value // NOVO
        };

        // 2. Salvar no localStorage
        const filmes = getData(dbKey);
        filmes.push(novoFilme);
        saveData(dbKey, filmes);

        // 3. Atualizar a lista e limpar o formulário
        renderFilmes();
        formFilme.reset();
        alert('Filme cadastrado com sucesso!');
    });

    function renderFilmes() {
        const filmes = getData(dbKey);
        listaFilmes.innerHTML = ''; // Limpa a lista antes de renderizar

        if (filmes.length === 0) {
            listaFilmes.innerHTML = '<p>Nenhum filme cadastrado.</p>';
            return;
        }

        filmes.forEach(filme => {
            const filmeDiv = document.createElement('div');
            filmeDiv.className = 'lista-item';

            // 4. Renderizar os novos campos na lista
            filmeDiv.innerHTML = `
                <h3>${filme.titulo}</h3>
                <p><strong>Gênero:</strong> ${filme.genero}</p>
                <p><strong>Estreia:</strong> ${formatarData(filme.dataEstreia)}</p>
                <p><strong>Duração:</strong> ${filme.duracao} minutos</p>
                <p><strong>Classificação:</strong> ${filme.classificacao}</p>
                <p><strong>Descrição:</strong> ${filme.descricao || 'N/A'}</p> 
            `;
            // Usamos (filme.descricao || 'N/A') caso a descrição esteja vazia.

            listaFilmes.appendChild(filmeDiv);
        });
    }
});