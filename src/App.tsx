import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PageTransition } from './components/motion/PageTransition';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { Store } from './pages/Store';

/** Needs to sit inside the router so it can read the current location. */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
          <PageTransition>
              <Home />
            </PageTransition>
          } />

        <Route
          path="/projects"
          element={
          <PageTransition>
              <Projects />
            </PageTransition>
          } />

        <Route
          path="/store"
          element={
          <PageTransition>
              <Store />
            </PageTransition>
          } />

      </Routes>
    </AnimatePresence>);

}

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div className="blueprint-grid flex min-h-screen w-full flex-col bg-bg text-ink">
          <Header />
          <div className="flex-1">
            <AnimatedRoutes />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>);

}
