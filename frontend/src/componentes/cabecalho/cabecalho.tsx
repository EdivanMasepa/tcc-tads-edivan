import { IoClose, IoMenu, IoSearch } from 'react-icons/io5'
import './cabecalho.css'
import Menu from '../menu/menu'
import { useEffect, useRef, useState } from 'react';
import { IoMdAddCircle, IoMdAddCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import perfil from '../../../public/perfil.png'

const Cabecalho: React.FC = () => {
    
  const [abreMenu, setAbreMenu] = useState(false);
  const [criaPublicacao, setCriaPublicacao] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const criarPublicacao = () => {navigate('/criarPublicacao')};
  const abrirMenu = () => {setAbreMenu(!abreMenu)}
  const fecharMenu = () => {setAbreMenu(false)};

  const cliqueFora = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      fecharMenu();
    }
  };

  useEffect(() => {
    if(abreMenu) 
      document.addEventListener('mousedown', cliqueFora);
    else 
      document.removeEventListener('mousedown', cliqueFora);

    return () => {
      document.removeEventListener('mousedown', cliqueFora);
    };
  }, [abreMenu]);

  return(
      <div className="divCabecalho">
          <div className="divLogoCabecalho">
              <a href='/paginaInicial' className='aLogo'><h3 className='logo'>LOGO</h3></a>
          </div>

          <div className="divCabecalhoCriarPublicacao">
              <button type="submit" className='buttonCriarPublicacao' onClick={criarPublicacao}>
                {abreMenu ? <IoMdAddCircle className='iconeCriarPublicacao' /> : <IoMdAddCircleOutline className='iconeCriarPublicacao' /> }
              </button>
          </div>

          <div className="divCabecalhoPesquisa">
              <button type="submit" className='buttonPesquisa'><IoSearch className='iconePesquisa' /></button>
          </div>

          <div className="divCabecalhoMenu">
            <img src={perfil} alt="menu" className='imgMenu'/>
            {/* <button className='buttonMenu' onClick={abrirMenu}>{abreMenu ? <IoClose className='iconeMenu'/> : <IoMenu className='iconeMenu'/>}</button> */}
          </div>
          {abreMenu && <Menu ref={menuRef} />}  
      </div>
  )
}
export default Cabecalho;