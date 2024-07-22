import   { forwardRef } from 'react'
import './menu.css'

const Menu = forwardRef<HTMLDivElement>((props, ref) => {

    return(  
        <>
        <div className='divBackgroundMenu'></div>
        <div ref={ref} className="divMenu">
            <ul className="ulMenu">
                <li className="liMenu"><a className='linkMenu' href="/perfil">Perfil</a></li>
                <li className="liMenu"><a className='linkMenu' href="/login">Sair</a></li>
            </ul>
        </div>
        </>          
        
    )
})
export default Menu