import { useState } from 'react';
import { api } from '../../services/api';
import type{ SessaoExpandida, LancheCombo, ItemLanchePedido } from '../../types';
import { Button } from '../../components/Button';

interface VendaModalProps {
    sessao: SessaoExpandida;
    lanches: LancheCombo[];
    onClose: () => void;
    onSuccess: () => void;
}

export function VendaModal({ sessao, lanches, onClose, onSuccess }: VendaModalProps) {
    const [selecionados, setSelecionados] = useState<{r:number, c:number}[]>([]);
    const [carrinho, setCarrinho] = useState<ItemLanchePedido[]>([]);
    const [qtMeia, setQtMeia] = useState(0);

    // --- CONSTANTES DE PREÇO ---
    const VALOR_INTEIRA = 30.00;
    const VALOR_MEIA = 15.00;
    // ---------------------------

    const getLabel = (r: number, c: number) => {
        const letra = String.fromCharCode(65 + r);
        return `${letra}${c + 1}`;
    };

    const toggleAssento = (r: number, c: number) => {
        if (sessao.mapaAssentos[r][c] === 1) return;
        const exists = selecionados.find(a => a.r === r && a.c === c);
        if (exists) {
            setSelecionados(prev => prev.filter(a => a.r !== r || a.c !== c));
            if (qtMeia > selecionados.length - 1) setQtMeia(prev => Math.max(0, prev - 1));
        } else {
            setSelecionados(prev => [...prev, { r, c }]);
        }
    };

    const addLanche = (l: LancheCombo) => {
        setCarrinho(prev => {
            const exists = prev.find(i => i.lanche.id === l.id);
            if (exists) return prev.map(i => i.lanche.id === l.id ? { ...i, quantidade: i.quantidade + 1 } : i);
            return [...prev, { lanche: l, quantidade: 1 }];
        });
    };

    const removeLanche = (id: string) => {
        setCarrinho(prev => {
            const item = prev.find(i => i.lanche.id === id);
            if (!item) return prev;
            if (item.quantidade > 1) return prev.map(i => i.lanche.id === id ? { ...i, quantidade: i.quantidade - 1 } : i);
            return prev.filter(i => i.lanche.id !== id);
        });
    };

    const finalizar = async () => {
        if (selecionados.length === 0) return alert("Selecione assentos!");
        
        const qtInteira = selecionados.length - qtMeia;
        // Usa as constantes para calcular
        const totalIngressos = (qtInteira * VALOR_INTEIRA) + (qtMeia * VALOR_MEIA);
        const totalLanches = carrinho.reduce((acc, i) => acc + (i.lanche.valorUnitario * i.quantidade), 0);
        const valorFinal = totalIngressos + totalLanches;

        try {
            const novoMapa = sessao.mapaAssentos.map(r => [...r]);
            selecionados.forEach(p => novoMapa[p.r][p.c] = 1);
            await api.patch(`/sessoes/${sessao.id}`, { mapaAssentos: novoMapa });

            const ingressosIds: string[] = [];
            const tipos = [...Array(qtInteira).fill('INTEIRA'), ...Array(qtMeia).fill('MEIA')];
            
            for (let i = 0; i < selecionados.length; i++) {
                const pos = selecionados[i];
                const tipo = tipos[i];
                const res = await api.post('/ingressos', {
                    sessaoId: sessao.id,
                    tipo: tipo,
                    // Usa as constantes para salvar
                    valorPago: tipo === 'INTEIRA' ? VALOR_INTEIRA : VALOR_MEIA,
                    assento: getLabel(pos.r, pos.c)
                });
                ingressosIds.push(res.data.id);
            }

            await api.post('/pedidos', {
                sessaoId: sessao.id,
                dataPedido: new Date(),
                qtInteira, qtMeia,
                itensLanche: carrinho,
                ingressosIds,
                valorTotal: valorFinal
            });

            alert(`Venda finalizada! Total: R$ ${valorFinal.toFixed(2)}`);
            onSuccess();
        } catch (err) { 
            console.error(err);
            alert("Erro ao realizar venda."); 
        }
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">{sessao.filme?.titulo} - Sala {sessao.sala?.numero}</h5>
                        <button className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body row">
                        {/* LADO ESQUERDO: MAPA */}
                        <div className="col-lg-7 border-end text-center">
                            <h6 className="text-muted">TELA</h6>
                            <div className="bg-secondary py-1 mb-4 w-100 rounded"></div>
                            
                            <div className="d-flex flex-column align-items-center gap-2">
                                {sessao.mapaAssentos.map((fila, i) => (
                                    <div key={i} className="d-flex align-items-center gap-2">
                                        <span className="fw-bold text-muted" style={{width: 20}}>{String.fromCharCode(65 + i)}</span>
                                        <div className="d-flex gap-2">
                                            {fila.map((st, j) => {
                                                const isSel = selecionados.some(a => a.r === i && a.c === j);
                                                let bg = st === 1 ? 'bg-danger opacity-50' : 'bg-success';
                                                if (isSel) bg = 'bg-warning border-dark';
                                                
                                                return (
                                                    <div key={j} onClick={() => toggleAssento(i, j)} 
                                                         className={`rounded border ${bg} text-white`} 
                                                         style={{
                                                             width: 35, height: 35, 
                                                             cursor: st===1?'not-allowed':'pointer',
                                                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                             fontSize: 12
                                                         }}>
                                                        {j + 1}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <span className="fw-bold text-muted" style={{width: 20}}>{String.fromCharCode(65 + i)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 text-start ps-5">
                                <strong>Selecionados: </strong>
                                {selecionados.length > 0 ? selecionados.map(p => getLabel(p.r, p.c)).join(', ') : '-'}
                            </div>
                        </div>

                        {/* LADO DIREITO: CONTROLES */}
                        <div className="col-lg-5">
                            
                            {/* --- NOVA SEÇÃO: EXIBIÇÃO DE PREÇOS --- */}
                            <div className="d-flex gap-2 mb-4">
                                <div className="bg-light border rounded p-2 flex-fill text-center">
                                    <small className="d-block text-muted text-uppercase" style={{fontSize: '0.75rem'}}>Inteira</small>
                                    <strong className="fs-5 text-dark">R$ {VALOR_INTEIRA.toFixed(2)}</strong>
                                </div>
                                <div className="bg-light border rounded p-2 flex-fill text-center">
                                    <small className="d-block text-muted text-uppercase" style={{fontSize: '0.75rem'}}>Meia-Entrada</small>
                                    <strong className="fs-5 text-dark">R$ {VALOR_MEIA.toFixed(2)}</strong>
                                </div>
                            </div>
                            {/* -------------------------------------- */}

                            <h6>Ingressos ({selecionados.length})</h6>
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <small>Definir Meia:</small>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => setQtMeia(q => Math.max(0, q-1))}>-</button>
                                <span className="fw-bold px-2">{qtMeia}</span>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => setQtMeia(q => Math.min(selecionados.length, q+1))}>+</button>
                            </div>
                            <hr/>
                            
                            <h6>Lanches</h6>
                            <div className="d-flex gap-2 overflow-auto mb-2">
                                {lanches.map(l => (
                                    <button key={l.id} onClick={() => addLanche(l)} className="btn btn-sm btn-outline-dark text-nowrap">{l.nome}<br/>R${l.valorUnitario}</button>
                                ))}
                            </div>
                            <ul className="list-group small mb-3">
                                {carrinho.map((item, i) => (
                                    <li key={i} className="list-group-item d-flex justify-content-between">
                                        <span>{item.quantidade}x {item.lanche.nome}</span>
                                        <div className="d-flex gap-2">
                                            <span>R$ {(item.quantidade * item.lanche.valorUnitario).toFixed(2)}</span>
                                            <button onClick={() => removeLanche(item.lanche.id)} className="btn btn-sm btn-outline-danger py-0 px-2"><i className="bi bi-dash"></i></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="alert alert-info">
                                <div className="d-flex justify-content-between small">
                                    <span>Ingressos:</span>
                                    {/* Cálculo visual usando as constantes */}
                                    <span>R$ {((selecionados.length - qtMeia)*VALOR_INTEIRA + qtMeia*VALOR_MEIA).toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between small">
                                    <span>Lanches:</span>
                                    <span>R$ {carrinho.reduce((a,b)=>a+(b.lanche.valorUnitario*b.quantidade),0).toFixed(2)}</span>
                                </div>
                                <hr className="my-1"/>
                                <div className="d-flex justify-content-between fw-bold fs-5">
                                    <span>TOTAL:</span>
                                    <span>R$ {((selecionados.length - qtMeia)*VALOR_INTEIRA + qtMeia*VALOR_MEIA + carrinho.reduce((a,b)=>a+(b.lanche.valorUnitario*b.quantidade),0)).toFixed(2)}</span>
                                </div>
                            </div>

                            <Button variant="success" className="w-100" onClick={finalizar} disabled={selecionados.length === 0}>
                                <i className="bi bi-check-lg"></i> Confirmar Venda
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}