import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import LoadingIndicator from '../components/common/LoadingIndicator';

// Lazy-loaded pages
const HomePage = lazy(() => import('../pages/HomePage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const CalculatorPage = lazy(() => import('../pages/CalculatorPage'));
const ResultsPage = lazy(() => import('../pages/ResultsPage'));
const DocumentationPage = lazy(() => import('../pages/DocumentationPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const ErrorPage = lazy(() => import('../pages/ErrorPage'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={
          <Suspense fallback={<LoadingIndicator />}>
            <HomePage />
          </Suspense>
        } />
        <Route path="projects" element={
          <Suspense fallback={<LoadingIndicator />}>
            <ProjectsPage />
          </Suspense>
        } />
        <Route path="calculator" element={
          <Suspense fallback={<LoadingIndicator />}>
            <CalculatorPage />
          </Suspense>
        } />
        <Route path="results" element={
          <Suspense fallback={<LoadingIndicator />}>
            <ResultsPage />
          </Suspense>
        } />
        <Route path="documentation" element={
          <Suspense fallback={<LoadingIndicator />}>
            <DocumentationPage />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<LoadingIndicator />}>
            <SettingsPage />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<LoadingIndicator />}>
            <ErrorPage />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
