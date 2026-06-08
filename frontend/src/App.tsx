import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { CreateTask } from './pages/CreateTask';
import { Dashboard } from './pages/Dashboard';
import { EditTask } from './pages/EditTask';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks/new" element={<CreateTask />} />
        <Route path="tasks/:id/edit" element={<EditTask />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
