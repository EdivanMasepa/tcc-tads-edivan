import   { forwardRef } from 'react'
import './menu.css'
import Cookies from 'js-cookie'
import { FiUser } from 'react-icons/fi'
import { TbLogout } from 'react-icons/tb'
import { IoKeyOutline } from 'react-icons/io5'

const Menu = forwardRef<HTMLDivElement>((props, ref) => {
    const deslogar = ()=>{
        Cookies.remove('token', {sameSite: "Strict", secure: true})
    }

    return(  
        <>
            <div className='divBackgroundMenu'></div>

            <div ref={ref} className="divMenu">
                <div className='divPerfilMenu'>
                    <img src='./perfil.png' alt="menu" className='imgUsuarioMenu'/>

                    <div className='divNomeUsuarioMenu'>
                        <p className="pNomeUsuarioMenu">Fulano da silva</p>
                    </div>

                </div>

                <div className='divListaMenu'>
                    <ul className="ulMenu">
                        <a className='linkMenu' href="/perfil">
                            <li className="liMenu"><FiUser className='iconeListaMenu'/> Perfil</li>
                        </a>

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