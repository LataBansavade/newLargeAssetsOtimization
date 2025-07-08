import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));

// Layout component for consistent structure
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-black text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-500">
          Video Gallery
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
        </div>
      </nav>
    </header>
    
    <main className="flex-grow">
      {children}
    </main>
    
    <footer className=" text-white bg-black py-20">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} Video Gallery. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);


function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
        <Toaster position="bottom-right" />
      </Layout>
    </Router>
  );
}

export default App;