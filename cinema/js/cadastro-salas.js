// js/cadastro-salas.js
document.addEventListener('DOMContentLoaded', () => {
    const formSala = document.getElementById('form-sala');
    const listaSalas = document.getElementById('lista-salas');
    const dbKey = 'cinemadb_salas';

    renderSalas();

    formSala.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Coletar dados (incluindo o novo campo 'tipo')
        const novaSala = {
            id: generateId(),
            nome: document.getElementById('nome').value,
            capacidade: parseInt(document.getElementById('capacidade').value),
            tipo: document.getElementById('tipo').value // <-- ADICIONADO
        };

        const salas = getData(dbKey);
        salas.push(novaSala);
        saveData(dbKey, salas);

        renderSalas();
        formSala.reset();
        alert('Sala cadastrada com sucesso!');
    });

    function renderSalas() {
        const salas = getData(dbKey);
        listaSalas.innerHTML = '';

        if (salas.length === 0) {
            listaSalas.innerHTML = '<p>Nenhuma sala cadastrada.</p>';
            return;
        }

        salas.forEach(sala => {
            const salaDiv = document.createElement('div');
            salaDiv.className = 'lista-item';
            
            // 2. Exibir o novo campo 'tipo' na listagem
            salaDiv.innerHTML = `
                <h3>${sala.nome}</h3>
                <p><strong>Tipo:</strong> ${sala.tipo}</p>
                <p><strong>Capacidade:</strong> ${sala.capacidade} lugares</p>
            `;
            listaSalas.appendChild(salaDiv);
        });
    }
});