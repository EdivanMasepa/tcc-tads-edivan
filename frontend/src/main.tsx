import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/login.tsx'
import './index.css'
import Cadastro from './pages/cadastro.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element:<Login />
  },
  {
    path: '/login',
    element:<Login /> 
  },
  {
    path: 'cadastro',
    element:<Cadastro />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
