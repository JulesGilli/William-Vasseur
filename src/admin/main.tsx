import '../index.css';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AdminApp } from './AdminApp';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <ThemeProvider>
      <AdminApp />
    </ThemeProvider>
  );
}
