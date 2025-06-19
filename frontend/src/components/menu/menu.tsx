import   { forwardRef } from 'react'
import './menu.css'
import Cookies from 'js-cookie'

const Menu = forwardRef<HTMLDivElement>((props, ref) => {
    const deslogar = ()=>{
        Cookies.remove('token', {sameSite: "Strict", secure: true})
    }

    return(  
        <>
        <div className='divBackgroundMenu'></div>
        <div ref={ref} className="divMenu">
            <ul className="ulMenu">
                <li className="liMenu"><a className='linkMenu' href="/perfil">Perfil</a></li>
                <li className="liMenu"><a className='linkMenu' onClick={deslogar} href="/login">Sair</a></li>
            </ul>
        </div>
        </>          
        
    )
})
export default Menu