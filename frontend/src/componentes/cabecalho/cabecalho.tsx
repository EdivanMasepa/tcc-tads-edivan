import { IoClose, IoMenu, IoSearch } from 'react-icons/io5'
import './cabecalho.css'
import Menu from '../menu/menu'
import { useEffect, useRef, useState } from 'react';
import { IoMdAddCircle, IoMdAddCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import CriarPublicacao from '../criarPublicacao/criarPublicacao';
import imagem from '../../perfil.png'

const Cabecalho: React.FC = () => {
  const [abreMenu, setAbreMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const abrirMenu = () => { if (abreCriarPublicacao) return; setAbreMenu(!abreMenu)}
  const fecharMenu = () => {setAbreMenu(false)};

  const [abreCriarPublicacao, setAbreCriarPublicacao] = useState(false);
  const criarPublicacaoRef = useRef<HTMLDivElement>(null);
  const abrirCriarPublicacao = () => {setAbreCriarPublicacao(!abreCriarPublicacao)};
  const fecharCriarPublicacao = () => {setAbreCriarPublicacao(false)};
  
  const navigate = useNavigate();
  const pesquisar = () => { if (abreCriarPublicacao) return; navigate('/pesquisa')};
  
  const cliqueFora = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      fecharMenu();
    }
  };

  const cancelarCriarPublicacao = (event: MouseEvent) => {
    if (criarPublicacaoRef.current && !criarPublicacaoRef.current.contains(event.target as Node)) {
      fecharCriarPublicacao();
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
    <>
      <div className="divCabecalho">
          <div className="divLogoCabecalho">
              <a href='/paginaInicial' className='aLogo'><h3 className='logo'>LOGO</h3></a>
          </div>

          <div className="divCabecalhoCriarPublicacao">
              <button type="submit" className='buttonCriarPublicacao' onClick={abrirCriarPublicacao}>
                {abreCriarPublicacao ? <IoMdAddCircle className='iconeCriarPublicacao' /> : <IoMdAddCircleOutline className='iconeCriarPublicacao' /> }
              </button>
          </div>

          <div className="divCabecalhoPesquisa">
              <button type="submit" className='buttonPesquisa' onClick={pesquisar} >
                <IoSearch className='iconePesquisa' />
              </button>
          </div>

          <div className="divCabecalhoMenu">
            <button className='buttonMenu' onClick={abrirMenu}>                
                {abreMenu && !abreCriarPublicacao ? <IoClose className='iconeMenu'/> : <img src={imagem} alt="menu" className='imgMenu'/>}
            </button> 
          </div>
          
      </div>
      {abreMenu && !abreCriarPublicacao && <Menu ref={menuRef} />}

      {/* <CriarPublicacao ref={criarPublicacaoRef} onCancelar={() => {
        setTimeout(() => setAbreCriarPublicacao(false), 150);
        }} visivel={abreCriarPublicacao}
      /> */}
      <CriarPublicacao 
        ref={criarPublicacaoRef} 
        onCancelar={() => setAbreCriarPublicacao(false)}
        visivel={abreCriarPublicacao}
      />
      {/* {abreCriarPublicacao && (<CriarPublicacao ref={criarPublicacaoRef} onCancelar={fecharCriarPublicacao}/>)}  */}
    </>
  )
}
export default Cabecalho;