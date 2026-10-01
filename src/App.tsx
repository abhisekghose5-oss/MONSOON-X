import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './layouts/AppLayout';
import { LanguageProvider } from './i18n';

// Page Views
import { OverviewPage } from './pages/OverviewPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { ForecastPage } from './pages/ForecastPage';
import { MonsoonPage } from './pages/MonsoonPage';
import { RainfallPage } from './pages/RainfallPage';
import { ClimatePage } from './pages/ClimatePage';
import { AgriculturePage } from './pages/AgriculturePage';
import { AdvisoriesPage } from './pages/AdvisoriesPage';
import { HistoricalPage } from './pages/HistoricalPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { DataExplorerPage } from './pages/DataExplorerPage';
import { FarmerPage } from './pages/FarmerPage';
import { OfficerPage } from './pages/OfficerPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Configure TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              {/* Default redirect to /overview */}
              <Route index element={<Navigate to="/overview" replace />} />
              
              {/* Core System Routes */}
              <Route path="overview" element={<OverviewPage />} />
              <Route path="risk-map" element={<RiskMapPage />} />
              <Route path="forecast" element={<ForecastPage />} />
              <Route path="monsoon" element={<MonsoonPage />} />
              <Route path="rainfall" element={<RainfallPage />} />
              <Route path="climate" element={<ClimatePage />} />
              <Route path="agriculture" element={<AgriculturePage />} />
              <Route path="advisories" element={<AdvisoriesPage />} />
              <Route path="historical" element={<HistoricalPage />} />
              <Route path="model-performance" element={<ModelPerformancePage />} />
              <Route path="data-sources" element={<DataSourcesPage />} />
              <Route path="data-explorer" element={<DataExplorerPage />} />

              {/* Simplified Farmer Mode */}
              <Route path="farmer" element={<FarmerPage />} />

              {/* Agriculture Officer Operations Command */}
              <Route path="officer" element={<OfficerPage />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
