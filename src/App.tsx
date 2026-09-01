import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { CartDrawer } from './components/shop/CartDrawer';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PageTransition } from './components/motion/PageTransition';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { Store } from './pages/Store';

/** Needs to sit inside the router so it can read the current location. */
function AnimatedRoutes() {
  const location = useLocation();

  // No AnimatePresence around this. With mode="wait" the incoming route is
  // held back until the outgoing one has finished animating away, so a second
  // click during that window — or anything that stalls the frame loop — left
  // the address bar on the new page and the old one still on screen, which is
  // the "page does not load until you refresh" report. Each page now mounts at
  // once and fades in on its own; nothing has to wait for anything.
  return (
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

    </Routes>);

}

export function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          {/* The model viewers spill past their frames on purpose, which at
              narrow widths runs off the page and leaves the whole site
              scrollable sideways. Clipped here rather than shrinking the
              effect, so the mesh still breaks its frame and simply stops at
              the edge of the screen. `clip` and not `hidden`: hidden would
              make this a scroll container and kill the pinned Process
              section. */}
          <div className="blueprint-grid flex min-h-screen w-full flex-col overflow-x-clip bg-bg text-ink">
            <Header />
            <div className="flex-1">
              <AnimatedRoutes />
            </div>
            <Footer />
          </div>
          <CartDrawer />
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>);

}
