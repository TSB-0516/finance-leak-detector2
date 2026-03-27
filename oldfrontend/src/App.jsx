import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnalysisProvider, useAnalysis } from './context/AnalysisContext';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import BreakdownPage from './pages/BreakdownPage';
import TrendsPage from './pages/TrendsPage';
import TransactionsPage from './pages/TransactionsPage';
import AppShell from './components/layout/AppShell';

function ProtectedRoute({ children }) {
  const { analysisData } = useAnalysis();
  if (!analysisData) {
    return <Navigate to="/" replace />;
  }
  return <AppShell>{children}</AppShell>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/breakdown"
        element={
          <ProtectedRoute>
            <BreakdownPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trends"
        element={
          <ProtectedRoute>
            <TrendsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AnalysisProvider>
  );
}
