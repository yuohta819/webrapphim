
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import Success from './pages/Success';
import UserHistory from './pages/UserHistory';
import Auth from './pages/Auth';
import EmailVerification from './pages/EmailVerification';
import AdminDashboard from './pages/AdminDashboard';
import SeatSelectionSection from './pages/booking/SeatSelectionSection';

// Centered Page Transition Wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/movie/:id" element={<PageWrapper><MovieDetail /></PageWrapper>} />
        <Route path="/seat-selection/:showtimeId" element={<PageWrapper><SeatSelection /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
        <Route path="/verify-email" element={<PageWrapper><EmailVerification /></PageWrapper>} />
        <Route
          path="/booking/seats/:showtimeId"
          element={<SeatSelectionSection />}
        />
        {/* User Protected Routes */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PageWrapper><Payment /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <PageWrapper><Success /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <PageWrapper><UserHistory /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<PageWrapper><Home /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
            <Navbar />

            {/* Main view container */}
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>

            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
