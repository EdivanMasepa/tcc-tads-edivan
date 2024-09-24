import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/login/login.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RedefinirSenha from './pages/redefinirSenha/redefinirSenha.tsx'
import Cadastro from './pages/cadastro/cadastro.tsx'
import Perfil from './pages/perfil/perfil.tsx'
import PaginaInicial from './pages/paginaInicial/paginaInicial.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login /> 
  },
  {
    path: '/cadastro',
    element: <Cadastro />
  },
  {
    path: '/redefinirSenha',
    element: <RedefinirSenha />
  },
  {
    path: '/perfil',
    element: <Perfil />
  },
  {
    path: '/paginaInicial',
    element: <PaginaInicial />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
