

export const gerarMatriz = (linhas: number, colunas: number): number[][] => {
    return Array.from({ length: linhas }, () => Array(colunas).fill(0));
};

export const calcularCapacidade = (linhas: number, colunas: number) => linhas * colunas;