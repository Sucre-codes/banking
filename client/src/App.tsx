import { Routes, Route } from 'react-router-dom';
import Layout from './component/Layout';
import LandingPage from './pages/LandingPagee';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import SettingsPage from './pages/SettingsPage';
import DashboardLayout from './component/DashboardLayout';
import WithdrawPage from './pages/WithdrawPage';
import DepositPage from './pages/DepositPage';
import TransferPage from './pages/TransferPage';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <DashboardLayout>
          <DashboardPage />
          </DashboardLayout>
          } />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/withdraw" element={<WithdrawPage/>} />
         <Route path="/transfer" element={<TransferPage/>} />
      </Routes>
    </Layout>
  );
};

export default App;