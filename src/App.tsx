import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplets, 
  ArrowLeftRight, 
  Stethoscope, 
  LogOut, 
  User,
  Settings,
  HelpCircle,
  Menu
} from 'lucide-react';
import { View } from './types';
import CustomerManagement from './components/CollectionMaintenance';
import OpportunityPipeline from './components/TransfusionRequest';
import SalesOrder from './components/TherapeuticProcedure';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('customers');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { id: 'customers', name: 'Clientes', icon: Droplets },
    { id: 'opportunities', name: 'Oportunidades', icon: ArrowLeftRight },
    { id: 'orders', name: 'Pedidos', icon: Stethoscope },
  ];

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-[#333] font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#1E3A5A] text-white flex flex-col shadow-xl z-20"
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-lg shrink-0">
              <Droplets className="text-white h-6 w-6" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl tracking-tight whitespace-nowrap">3brasil<span className="text-red-400">tech</span></span>
            )}
          </div>
          {isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-3">
            {navigation.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id as View)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 overflow-hidden ${
                    currentView === item.id 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {!isSidebarOpen && (
          <div className="p-4 flex justify-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-white/10 rounded-md transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="p-4 border-t border-white/10 space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white transition-colors overflow-hidden">
            <Settings className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Configurações</span>}
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors overflow-hidden">
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span className="font-medium whitespace-nowrap">Sair</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">
              {navigation.find(n => n.id === currentView)?.name}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-200">
              <HelpCircle className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 font-medium">Suporte</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-none">Anselmo Ferreira</p>
                <p className="text-xs text-gray-500 mt-1">Administrador</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-gray-100">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F0F2F5]">
          <div className="max-w-7xl mx-auto pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentView === 'customers' && <CustomerManagement />}
                {currentView === 'opportunities' && <OpportunityPipeline />}
                {currentView === 'orders' && <SalesOrder />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
