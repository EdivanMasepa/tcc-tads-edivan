import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/login/login.tsx'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import RedefinirSenha from './pages/redefinirSenha/redefinirSenha.tsx'
import Cadastro from './pages/cadastro/cadastro.tsx'
import Perfil from './pages/perfil/perfil.tsx'
import PaginaInicial from './pages/paginaInicial/paginaInicial.tsx'
import Cookies from 'js-cookie'

const createProtectRoute = (Page: JSX.Element) => {
  const token = Cookies.get("token")
  if (!token) return <Navigate to={"/login"} />
  return Page
}

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
    element: createProtectRoute(<Perfil />)
  },
  {
    path: '/paginaInicial',
    element: createProtectRoute(<PaginaInicial />)
  }
])





ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
