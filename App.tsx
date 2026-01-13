
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { MarkRecord, ScoreRecord, BiasRecord, FilterState } from './types';
import { generateMockData } from './services/dataService';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const [marksData, setMarksData] = useState<MarkRecord[]>([]);
  const [scoresData, setScoresData] = useState<ScoreRecord[]>([]);
  const [biasData, setBiasData] = useState<BiasRecord[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    year: '2023',
    grade: '4',
    subject: 'Русский язык',
    municipality: 'Все',
    school: 'Все'
  });

  const loadingMessages = [
    "Подключение модулей визуализации...",
    "Генерация аналитических срезов (150k+)...",
    "Синхронизация региональных данных...",
    "Валидация признаков необъективности...",
    "Финальная отрисовка интерфейса..."
  ];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const initApp = async () => {
      // Даем React время на первый рендер лоадера
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        setLoadingStep(0);
        await new Promise(resolve => setTimeout(resolve, 400));
        
        setLoadingStep(1);
        // Используем requestAnimationFrame, чтобы браузер не считал вкладку зависшей
        requestAnimationFrame(() => {
          const data = generateMockData();
          setMarksData(data.marks);
          setScoresData(data.scores);
          setBiasData(data.bias);
        });
        
        for (let i = 2; i < loadingMessages.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setLoadingStep(i);
        }
        
        // Маленькая пауза перед открытием, чтобы пользователь успел увидеть последний шаг
        setTimeout(() => setLoading(false), 300);
      } catch (err) {
        console.error("Критическая ошибка загрузки:", err);
        // В случае ошибки все равно убираем лоадер, чтобы увидеть хоть что-то
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      if (newFilters.municipality && newFilters.municipality !== prev.municipality) {
        updated.school = 'Все';
      }
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b1120] transition-colors duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative flex flex-col items-center max-w-sm w-full px-6">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-3xl bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
            <div className="relative p-5 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700">
              <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path className="animate-[bounce_2s_infinite]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>

          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-4 overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
            ></div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 text-center">Аналитическая система ВПР</h2>
          <div className="h-6 flex items-center justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium text-center">
              {loadingMessages[loadingStep]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        marksData={marksData}
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />
      
      <main className="container mx-auto px-4 py-6">
        <Dashboard 
          filters={filters}
          marks={marksData}
          scores={scoresData}
          bias={biasData}
        />
      </main>

      <footer className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm">
        <p>© 2024 Аналитическая система ВПР • Облачное решение</p>
        <p className="mt-1">Массив данных: 150,000+ записей • Обработка на клиенте</p>
      </footer>
    </div>
  );
};

export default App;
