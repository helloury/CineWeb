import { Link } from 'react-router-dom';

export function Nav() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">🎬 CineWeb</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><Link className="nav-link" to="/filmes">Filmes</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/salas">Salas</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/lanches">Lanches</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/sessoes">Sessões</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}