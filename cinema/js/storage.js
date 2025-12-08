// js/storage.js

/**
 * Busca dados do localStorage.
 * @param {string} key A chave para buscar no localStorage.
 * @returns {Array} Um array de dados (ou um array vazio se nada for encontrado).
 */
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

/**
 * Salva dados no localStorage.
 * @param {string} key A chave para salvar no localStorage.
 * @param {Array} data O array de dados a ser salvo.
 */
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Gera um ID único simples baseado no timestamp.
 * @returns {number} Um ID numérico.
 */
function generateId() {
    return Date.now();
}