import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../services/api';
import type { Filme, Genero } from '../../types/index'; // Importamos Genero
import { filmeSchema } from '../../models/schemas';
import type { FilmeForm } from '../../models/schemas';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export function Filmes() {
    const [filmes, setFilmes] = useState<Filme[]>([]);
    const [generos, setGeneros] = useState<Genero[]>([]); 

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FilmeForm>({
        resolver: zodResolver(filmeSchema)
    });

    const carregar = async () => {
        // Buscamos Filmes E Gêneros simultaneamente
        const [resFilmes, resGeneros] = await Promise.all([
            api.get('/filmes'),
            api.get('/generos')
        ]);
        setFilmes(resFilmes.data);
        setGeneros(resGeneros.data);
    };

    useEffect(() => { carregar(); }, []);

    const onSubmit = async (data: FilmeForm) => {
        await api.post('/filmes', data);
        reset(); carregar();
    };

    const deletar = async (id: string) => {
        if (!confirm("Ao excluir, sessões vinculadas serão apagadas.")) return;
        const sessoes = await api.get(`/sessoes?filmeId=${id}`);
        await Promise.all(sessoes.data.map((s: any) => api.delete(`/sessoes/${s.id}`)));
        await api.delete(`/filmes/${id}`);
        carregar();
    };

    return (
        <div className="container">
            <h2 className="mb-3">Filmes</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3 mb-5 p-4 border rounded bg-light shadow-sm">
                <Input label="Título" {...register('titulo')} error={errors.titulo?.message} className="col-md-6" />
                <Input label="Duração (min)" type="number" {...register('duracao', { valueAsNumber: true })} error={errors.duracao?.message} className="col-md-2" />
                
                {/* --- SELECT DINÂMICO DE GÊNEROS --- */}
                <div className="col-md-4">
                    <label className="form-label">Gênero</label>
                    <select 
                        {...register('genero')} 
                        className={`form-select ${errors.genero ? 'is-invalid' : ''}`}
                    >
                        <option value="">Selecione...</option>
                        {generos.map(g => (
                            <option key={g.id} value={g.nome}>{g.nome}</option>
                        ))}
                    </select>
                    {errors.genero && <div className="invalid-feedback">{errors.genero.message}</div>}
                </div>
                {/* ---------------------------------- */}

                <Input label="Sinopse" {...register('sinopse')} error={errors.sinopse?.message} className="col-12" />
                <Input label="Início Exibição" type="date" {...register('dataInicioExibicao')} className="col-md-3" />
                <Input label="Fim Exibição" type="date" {...register('dataFinalExibicao')} className="col-md-3" />
                <Input label="Classificação" {...register('classificacao')} className="col-md-3" />

                <div className="col-12 mt-3"><Button type="submit">Salvar Filme</Button></div>
            </form>

            <div className="row g-3">
                {filmes.map(f => (
                    <div key={f.id} className="col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5>{f.titulo}</h5>
                                <span className="badge bg-secondary mb-2">{f.genero}</span>
                                <p className="text-muted small">{f.duracao} min</p>
                                <Button variant="outline-danger" className="btn-sm" onClick={() => deletar(f.id)}><i className="bi bi-trash"></i> Excluir</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}