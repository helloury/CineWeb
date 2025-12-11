import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../services/api';
import type { LancheCombo } from '../../types/index';
import { lancheSchema } from '../../models/schemas';
import type { LancheForm } from '../../models/schemas';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export function Lanches() {
    const [lanches, setLanches] = useState<LancheCombo[]>([]);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<LancheForm>({ resolver: zodResolver(lancheSchema) });

    const carregar = async () => { const { data } = await api.get('/lanches'); setLanches(data); };
    useEffect(() => { carregar(); }, []);

    const onSubmit = async (data: LancheForm) => {
        if (editandoId) { await api.put(`/lanches/${editandoId}`, data); setEditandoId(null); } 
        else { await api.post('/lanches', data); }
        reset(); carregar();
    };

    const handleEditar = (l: LancheCombo) => {
        setEditandoId(l.id);
        setValue('nome', l.nome); setValue('descricao', l.descricao); setValue('valorUnitario', l.valorUnitario);
    };

    const handleExcluir = async (id: string) => {
        if(confirm("Excluir combo?")) { await api.delete(`/lanches/${id}`); carregar(); }
    };

    return (
        <div className="container">
            <h2 className="mb-3">Combos e Lanches</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3 mb-5 p-4 border rounded bg-light shadow-sm">
                <Input label="Nome" {...register('nome')} error={errors.nome?.message} className="col-md-5" />
                <Input label="Descrição" {...register('descricao')} error={errors.descricao?.message} className="col-md-5" />
                <Input label="Preço" type="number" step="0.01" {...register('valorUnitario', {valueAsNumber:true})} error={errors.valorUnitario?.message} className="col-md-2" />
                <div className="col-12 d-flex gap-2">
                    <Button type="submit" variant={editandoId ? "warning" : "primary"}>{editandoId ? "Atualizar" : "Cadastrar"}</Button>
                    {editandoId && <Button type="button" variant="secondary" onClick={() => {setEditandoId(null); reset();}}>Cancelar</Button>}
                </div>
            </form>

            <div className="row g-3">
                {lanches.map(l => (
                    <div key={l.id} className="col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <h5 className="card-title">{l.nome}</h5>
                                    <span className="badge bg-success">R$ {l.valorUnitario.toFixed(2)}</span>
                                </div>
                                <p className="text-muted small">{l.descricao}</p>
                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button onClick={() => handleEditar(l)} className="btn btn-sm btn-outline-primary"><i className="bi bi-pencil"></i></button>
                                    <button onClick={() => handleExcluir(l.id)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}