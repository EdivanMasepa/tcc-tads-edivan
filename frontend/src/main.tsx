import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './paginas/login/login.tsx'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import RedefinirSenha from './paginas/redefinirSenha/redefinirSenha.tsx'
import Cadastro from './paginas/cadastro/cadastro.tsx'
import Perfil from './paginas/perfil/perfil.tsx'
import PaginaInicial from './paginas/paginaInicial/paginaInicial.tsx'
import RotaProtegida from './componentes/rotaProtegida.tsx'
import Pesquisa from './paginas/pesquisa/pesquisa.tsx'
import { ErrorBoundary } from './componentes/errorBoundary.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={"/login"} />,
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
    element: <RotaProtegida><Perfil /></RotaProtegida> 
  },
  {
    path: '/paginaInicial',
    element: <RotaProtegida><PaginaInicial /></RotaProtegida>
  },
  {
    path: '/pesquisa',
    element: <RotaProtegida><Pesquisa /></RotaProtegida>
  }
])





ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
