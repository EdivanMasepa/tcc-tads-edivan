import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './paginas/login/login.tsx'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import RedefinirSenha from './paginas/redefinirSenha/redefinirSenha.tsx'
import Cadastro from './paginas/cadastro/cadastro.tsx'
import Perfil from './paginas/perfil/perfil.tsx'
import PaginaInicial from './paginas/paginaInicial/paginaInicial.tsx'
import Cookies from 'js-cookie'
import CriarPublicacao from './paginas/criarPublicacao/criarPublicacao.tsx'

const createProtectRoute = (Page: JSX.Element) => {
  setTimeout(() => {
    const token = Cookies.get("token")
    if (!token) return <Navigate to={"/login"} />
  }, 1000); 
  
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
  },
  {
    path: '/criarPublicacao',
    element: createProtectRoute(<CriarPublicacao />)
  }
])





ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
