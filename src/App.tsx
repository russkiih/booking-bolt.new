import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookAppointment from './pages/BookAppointment';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { AppointmentProvider } from './contexts/AppointmentContext';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppointmentProvider>
          <Router>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Navbar />
              <main className="container mx-auto py-6 px-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/book" element={<BookAppointment />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
            </div>
          </Router>
          <Toaster />
        </AppointmentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;