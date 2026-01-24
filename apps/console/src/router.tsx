import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './App';
import { DashboardLayout } from './pages/DashboardLayout';
import { ToolsLayout } from './pages/ToolsLayout';
import { ProfilePage } from './pages/ProfilePage';
import { AccountPage } from './pages/AccountPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { AboutPage } from './pages/AboutPage';
import { ToolsPage } from './pages/ToolsPage';
import { ConvertPage } from './pages/ConvertPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: <Navigate to="/profile" replace />,
        },
        {
          element: <DashboardLayout />,
          children: [
            { path: 'profile', element: <ProfilePage /> },
            { path: 'account', element: <AccountPage /> },
            { path: 'subscription', element: <SubscriptionPage /> },
            { path: 'about', element: <AboutPage /> },
          ],
        },
        {
          path: 'tools',
          element: <ToolsLayout />,
          children: [
            { index: true, element: <ToolsPage /> },
            { path: 'convert', element: <ConvertPage /> },
          ],
        },
      ],
    },
  ],
  {
    basename: '/console',
  }
);
