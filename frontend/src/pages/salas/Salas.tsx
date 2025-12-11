import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../services/api';
import type { Sala } from '../../types/index';
import { salaSchema } from '../../models/schemas';
import type { SalaForm } from '../../models/schemas';
import { calcularCapacidade, gerarMatriz } from '../../models/logic';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export function Salas() {
    const [salas, setSalas] = useState<Sala[]>([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<SalaForm>({ resolver: zodResolver(salaSchema) });

    const carregar = async () => { const { data } = await api.get('/salas'); setSalas(data); };
    useEffect(() => { carregar(); }, []);

    const onSubmit = async (data: SalaForm) => {
        await api.post('/salas', {
            ...data,
            capacidade: calcularCapacidade(data.filas, data.colunas),
            poltronas: gerarMatriz(data.filas, data.colunas)
        });
        reset(); carregar();
    };

    return (
        <div className="container">
            <h2 className="mb-3">Salas</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3 mb-5 p-4 border rounded bg-light shadow-sm">
                <Input label="Número" type="number" {...register('numero', {valueAsNumber:true})} error={errors.numero?.message} className="col-md-4" />
                <Input label="Filas" type="number" {...register('filas', {valueAsNumber:true})} error={errors.filas?.message} className="col-md-4" />
                <Input label="Colunas" type="number" {...register('colunas', {valueAsNumber:true})} error={errors.colunas?.message} className="col-md-4" />
                <div className="col-12"><Button type="submit">Criar Layout</Button></div>
            </form>

            <div className="row">
                {salas.map(s => (
                    <div key={s.id} className="col-md-6 mb-3">
                        <div className="card p-3">
                            <h5>Sala {s.numero} <span className="badge bg-secondary">{s.capacidade} Lugares</span></h5>
                            <div className="d-flex flex-column gap-1 align-items-center mt-3">
                                {s.poltronas?.map((fila, i) => (
                                    <div key={i} className="d-flex gap-1">
                                        {fila.map((_, j) => <div key={j} style={{width: 15, height: 15, background: '#28a745', borderRadius: 2}}></div>)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}