import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../services/api';
import type { SessaoExpandida, Filme, Sala, LancheCombo } from '../../types';
import { sessaoSchema } from '../../models/schemas';
import type { SessaoForm } from '../../models/schemas';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { VendaModal } from './Venda';

export function Sessoes() {
    const [sessoes, setSessoes] = useState<SessaoExpandida[]>([]);
    const [filmes, setFilmes] = useState<Filme[]>([]);
    const [salas, setSalas] = useState<Sala[]>([]);
    const [lanches, setLanches] = useState<LancheCombo[]>([]);
    const [sessaoVenda, setSessaoVenda] = useState<SessaoExpandida | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<SessaoForm>({ resolver: zodResolver(sessaoSchema) });

    const carregar = async () => {
        const [rFilmes, rSalas, rSessoes, rLanches] = await Promise.all([
            api.get('/filmes'), api.get('/salas'), api.get('/sessoes'), api.get('/lanches')
        ]);
        setFilmes(rFilmes.data); setSalas(rSalas.data); setLanches(rLanches.data);
        setSessoes(rSessoes.data.map((s: any) => ({
            ...s,
            filme: rFilmes.data.find((f: Filme) => f.id === s.filmeId),
            sala: rSalas.data.find((sl: Sala) => sl.id === s.salaId)
        })));
    };
    useEffect(() => { carregar(); }, []);

    const onSubmit = async (data: SessaoForm) => {
        const sala = salas.find(s => s.id === data.salaId);
        await api.post('/sessoes', { ...data, mapaAssentos: sala?.poltronas || [[0]] });
        reset(); carregar();
    };

    const deletar = async (id: string) => {
        if(confirm("Cancelar sessão?")) { await api.delete(`/sessoes/${id}`); carregar(); }
    };

    return (
        <div className="container">
            <h2 className="mb-4">Sessões</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3 mb-5 border p-3 rounded bg-light shadow-sm">
                <div className="col-md-4">
                    <label className="form-label">Filme</label>
                    <select {...register('filmeId')} className="form-select"><option value="">Selecione...</option>{filmes.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}</select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Sala</label>
                    <select {...register('salaId')} className="form-select"><option value="">Selecione...</option>{salas.map(s => <option key={s.id} value={s.id}>Sala {s.numero}</option>)}</select>
                </div>
                <Input type="datetime-local" label="Data" {...register('dataHora')} error={errors.dataHora?.message} className="col-md-4" />
                <div className="col-12"><Button type="submit">Agendar</Button></div>
            </form>

            <table className="table table-hover align-middle">
                <thead className="table-dark"><tr><th>Filme</th><th>Sala</th><th>Data</th><th>Ações</th></tr></thead>
                <tbody>
                    {sessoes.map(s => (
                        <tr key={s.id}>
                            <td className="fw-bold">{s.filme?.titulo}</td>
                            <td>Sala {s.sala?.numero}</td>
                            <td>{new Date(s.dataHora).toLocaleString()}</td>
                            <td>
                                <Button variant="success" className="btn-sm me-2" onClick={() => setSessaoVenda(s)}><i className="bi bi-ticket-perforated"></i> Adquirir</Button>
                                <Button variant="outline-danger" className="btn-sm" onClick={() => deletar(s.id)}><i className="bi bi-trash"></i></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {sessaoVenda && <VendaModal sessao={sessaoVenda} lanches={lanches} onClose={() => setSessaoVenda(null)} onSuccess={() => { setSessaoVenda(null); carregar(); }} />}
        </div>
    );
}