import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/home';
import LoginPage from './pages/login';
import ForgotPasswordPage from './pages/forgot-password';
import ResetPasswordPage from './pages/reset-password';
import VerifyEmailPage from './pages/verify-email';
import RegisterPage from './pages/register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Private Route */}
        <Route path="/" Component={Homepage} />

        {/* Public Routes */}
        <Route path="/register" Component={RegisterPage} />
        <Route path="/login" Component={LoginPage} />
        <Route path="/forgot-password" Component={ForgotPasswordPage} />
        <Route path="/reset-password" Component={ResetPasswordPage} />
        <Route path="/verify-email" Component={VerifyEmailPage} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
