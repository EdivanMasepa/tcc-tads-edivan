import { IoClose, IoMenu, IoSearch } from 'react-icons/io5'
import './cabecalho.css'
import Menu from '../menu/menu'
import { useEffect, useRef, useState } from 'react';

const Cabecalho: React.FC = () => {
    
    const [abreMenu, setAbreMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const abrirMenu = () => {
        setAbreMenu(!abreMenu);
    }
    const fechaMenu = () => {
        setAbreMenu(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          fechaMenu();
        }
    };

    useEffect(() => {
        if (abreMenu) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [abreMenu]);


    return(
        <div className="divCabecalho">
            <div className="divLogoCabecalho">
                <a href='/paginaInicial'><h3 className='logo'>LOGO</h3></a>
            </div>
            <div className="divCabecalhoPesquisa">
                <button type="submit" className='buttonPesquisa'><IoSearch className='iconePesquisa' /></button>
            </div>
            <div className="divCabecalhoMenu">
                <button className='buttonMenu' onClick={abrirMenu}>{abreMenu ? <IoClose className='iconeMenu'/> : <IoMenu className='iconeMenu'/>}</button>
            </div>
            {abreMenu &&
                <Menu ref={menuRef} />
            }  
        </div>
    )
}
export default Cabecalho