// --- ENTIDADES PRINCIPAIS ---

// 1. Gêneros (Novo: para o cadastro dinâmico)
export interface Genero {
    id: string;
    nome: string;
}

// 2. Filmes
export interface Filme {
    id: string;
    titulo: string;
    sinopse: string;
    classificacao: string;
    duracao: number; // em minutos
    genero: string;  // Salva o nome do gênero selecionado
    dataInicioExibicao: string; // Formato ISO ou YYYY-MM-DD
    dataFinalExibicao: string;
}

// 3. Salas (Layout Físico)
export interface Sala {
    id: string;
    numero: number;
    capacidade: number;      // Calculado (filas * colunas)
    filas: number;           // Usado para gerar a grade
    colunas: number;         // Usado para gerar a grade
    poltronas: number[][];   // A Matriz padrão da sala (0=Livre, 1=Inexistente/Corredor se houver lógica futura)
}

// 4. Sessões (O Evento)
export interface Sessao {
    id: string;
    filmeId: string;
    salaId: string;
    dataHora: string;        // ISO Date
    mapaAssentos: number[][]; // O estado REAL dos assentos para esta sessão (0=Livre, 1=Vendido)
}

// Tipo Auxiliar para exibição na tela (Com os objetos Filme e Sala dentro)
export interface SessaoExpandida extends Sessao {
    filme?: Filme;
    sala?: Sala;
}

// --- VENDAS E PRODUTOS ---

// 5. Lanches e Combos
export interface LancheCombo {
    id: string;
    nome: string;
    descricao: string;
    valorUnitario: number;
}

// Tipo Auxiliar: Item dentro do carrinho de compras
export interface ItemLanchePedido {
    lanche: LancheCombo;
    quantidade: number;
}

// 6. Ingressos Individuais
export interface Ingresso {
    id: string;
    sessaoId: string;
    tipo: 'INTEIRA' | 'MEIA';
    valorPago: number;
    assento: string; // A etiqueta do assento (Ex: "A1", "B5", "H12")
}

// 7. Pedido (A Compra Fechada)
export interface Pedido {
    id: string;
    sessaoId: string;
    dataPedido: string; // Data da venda
    
    // Resumo dos Ingressos
    qtInteira: number;
    qtMeia: number;
    ingressosIds: string[]; // IDs dos ingressos gerados na tabela 'ingressos'
    
    // Resumo dos Lanches
    itensLanche: ItemLanchePedido[];
    
    // Financeiro
    valorTotal: number;
}