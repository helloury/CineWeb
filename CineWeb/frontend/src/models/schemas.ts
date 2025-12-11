import { z } from 'zod';

export const filmeSchema = z.object({
    titulo: z.string().min(1, "Título obrigatório"),
    sinopse: z.string().min(10, "Mínimo 10 caracteres"),
    classificacao: z.string().min(1, "Obrigatório"),
    duracao: z.number({ message: "Numérico" }).positive(),
    genero: z.string().min(1, "Obrigatório"),
    dataInicioExibicao: z.string(),
    dataFinalExibicao: z.string(),
});

export const salaSchema = z.object({
    numero: z.number().positive(),
    filas: z.number().min(1),
    colunas: z.number().min(1)
});

export const sessaoSchema = z.object({
    filmeId: z.string().min(1, "Selecione o Filme"),
    salaId: z.string().min(1, "Selecione a Sala"),
    dataHora: z.string().refine((d) => new Date(d) >= new Date(), "Data futura obrigatória")
});

export const lancheSchema = z.object({
    nome: z.string().min(1, "Nome obrigatório"),
    descricao: z.string().min(3, "Descrição necessária"),
    valorUnitario: z.number({ message: "Numérico" }).positive()
});

export type FilmeForm = z.infer<typeof filmeSchema>;
export type SalaForm = z.infer<typeof salaSchema>;
export type SessaoForm = z.infer<typeof sessaoSchema>;
export type LancheForm = z.infer<typeof lancheSchema>;