import { IoClose, IoMenu, IoSearch } from 'react-icons/io5'
import './cabecalho.css'
import Menu from '../menu/menu'
import { useEffect, useRef, useState } from 'react';
import { IoMdAddCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const Cabecalho: React.FC = () => {
    
    const [abreMenu, setAbreMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate()


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

    const criarPublicacao = () => {
      navigate('/criarPublicacao')
    }

    return(
        <div className="divCabecalho">
            <div className="divLogoCabecalho">
                <a href='/paginaInicial'><h3 className='logo'>LOGO</h3></a>
            </div>
            <div className="divCabecalhoCriarPublicacao">
                <button type="submit" className='buttonCriarPublicacao' onClick={criarPublicacao}><IoMdAddCircle className='iconeCriarPublicacao' /></button>
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