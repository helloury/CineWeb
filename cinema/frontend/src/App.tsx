import { BrowserRouter } from 'react-router-dom';
import { Nav } from './components/Nav';
import { AppRoutes } from './routes';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App;