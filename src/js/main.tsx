import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import { App } from './App';
import { EpisodeSearch } from './EpisodeSearch';
import { EpisodesTable } from './EpisodesTable';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <EpisodeSearch />,
        children: [
          {
            index: true,
            element: <EpisodesTable />,
          },
          {
            path: '/episodes/:episodeId',
            element: <EpisodesTable />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
