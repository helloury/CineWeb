import { Routes, Route } from 'react-router-dom';
import { Filmes } from '../pages/filmes/Filmes';
import { Salas } from '../pages/salas/Salas';
import { Lanches } from '../pages/lanches';
import { Sessoes } from '../pages/sessoes';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<div className="container text-center mt-5"><h1>Bem-vindo ao CineWeb</h1></div>} />
            <Route path="/filmes" element={<Filmes />} />
            <Route path="/salas" element={<Salas />} />
            <Route path="/lanches" element={<Lanches />} />
            <Route path="/sessoes" element={<Sessoes />} />
            <Route path="*" element={<div className="container mt-5">Página não encontrada</div>} />
        </Routes>
    );
}