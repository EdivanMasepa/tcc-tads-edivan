import   { forwardRef, useEffect, useState } from 'react'
import './menu.css'
import Cookies from 'js-cookie'
import { FiUser } from 'react-icons/fi'
import { TbLogout } from 'react-icons/tb'
import { IoKeyOutline } from 'react-icons/io5'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { Link } from 'react-router-dom'
import imagem from '../../../public/perfil.png'

const Menu = forwardRef<HTMLDivElement>((props, ref) => {
    const deslogar = ()=>{
        Cookies.remove('token', {sameSite: "Strict", secure: true})
    }

    const decodificaUsuario = () => {        
        const token = Cookies.get('token');
        if (!token) return null;

        try {
            const decodeToken = jwtDecode<JwtPayload>(token);
            return Number(decodeToken.sub);
        }catch (erro) {
            console.error('Erro ao decodificar token:', erro);
            return null;
        }
    };

    return(  
        <>
            <div className='divBackgroundMenu'></div>

            <div ref={ref} className="divMenu">
                <div className='divPerfilMenu'>
                    <img src={imagem} alt="menu" className='imgUsuarioMenu'/>

                    <div className='divNomeUsuarioMenu'>
                        <p className="pNomeUsuarioMenu">Nome</p>
                    </div>

                </div>

                <div className='divListaMenu'>
                    <ul className="ulMenu">
                        {/* <a className='linkMenu' href={`/perfil/${decodificaUsuario()}`}> */}
                        <Link className='linkMenu' to={`/perfil/${decodificaUsuario()}`}>
                            <li className="liMenu"><FiUser className='iconeListaMenu'/> Perfil</li>
                        </Link>
                        {/* </a> */}

                        <a className='linkMenu' href="/redefinirSenha">
                            <li className="liMenu"><IoKeyOutline className='iconeListaMenu'/> Alterar senha</li>
                        </a>

                        <a className='linkMenu' href="/login" onClick={deslogar}>
                            <li className="liMenu"> <TbLogout className='iconeListaMenu'/> Sair</li>
                        </a>
                    </ul>
                </div>

                <div className='divRodapeMenu'>
                    <a href='./paginaSobre' className='aSobre'>Sobre o sistema</a>
                </div>
            </div>
        </>          
    )
})
export default Menu;