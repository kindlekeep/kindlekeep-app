import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Flex, Text, Box } from '@radix-ui/themes';
import { Settings as SettingsIcon, ShieldAlert, Lock } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { MonitorDetail } from './pages/MonitorDetail';
import { AuthCallback } from './features/auth/components/AuthCallback';
import { LoginView } from './features/auth/components/LoginView';
import { Incidents } from './pages/Incidents';
import { Vault } from './pages/Vault';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <Box className="min-h-screen bg-zinc-950 font-onest text-zinc-50">
    <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
      <Flex align="center" justify="between" className="max-w-7xl mx-auto px-6 h-16">
        <Link to="/">
          <Text className="font-righteous text-xl text-zinc-50 tracking-tight lowercase">
            kindlekeep
          </Text>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/vault" className="text-zinc-400 hover:text-zinc-50 transition-colors flex items-center gap-2">
            <Lock size={18} strokeWidth={1} />
            <span className="text-sm font-medium font-onest">Vault</span>
          </Link>
          <Link to="/incidents" className="text-zinc-400 hover:text-zinc-50 transition-colors flex items-center gap-2">
            <ShieldAlert size={18} strokeWidth={1} />
            <span className="text-sm font-medium font-onest">Incidents</span>
          </Link>
          <Link to="/settings" className="text-zinc-400 hover:text-zinc-50 transition-colors flex items-center gap-2">
            <SettingsIcon size={18} strokeWidth={1} />
            <span className="text-sm font-medium font-onest">Settings</span>
          </Link>
        </nav>
      </Flex>
    </header>
    <main>
      {children}
    </main>
  </Box>
);

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboard/monitor/:id" element={<Layout><MonitorDetail /></Layout>} />
        <Route path="/incidents" element={<Layout><Incidents /></Layout>} />
        <Route path="/vault" element={<Layout><Vault /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/auth/callback/:provider" element={<AuthCallback />} />
      </Routes>
    </Router>
  );
};