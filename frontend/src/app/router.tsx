// app/router.tsx — Rutas con protección auth y layout
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from './Layout'
import { ProtectedRoute } from './ProtectedRoute'
import AuthPage from '../pages/AuthPage'
import DashboardPage from '../pages/DashboardPage'
import VenturesPage from '../pages/VenturesPage'
import VentureDetailPage from '../pages/VentureDetailPage'
import SettingsWhatsAppPage from '../pages/SettingsWhatsAppPage'
import SettingsKeywordsPage from '../pages/SettingsKeywordsPage'

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'ventures', element: <VenturesPage /> },
      { path: 'ventures/:id', element: <VentureDetailPage /> },
      { path: 'settings/whatsapp', element: <SettingsWhatsAppPage /> },
      { path: 'settings/keywords', element: <SettingsKeywordsPage /> },
    ],
  },
])
