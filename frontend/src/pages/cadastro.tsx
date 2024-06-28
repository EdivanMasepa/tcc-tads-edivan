import React, { useState } from 'react';
import "./cadastro.css"
import "../index.css"
import Input from '../components/input';
import Button from '../components/button';
import { IoArrowBack } from 'react-icons/io5';

const Cadastro: React.FC = () => {
  const [opcao, setOpcao] = useState(true)

  const alteraOpcaoCadastro = () =>{
    setOpcao(!opcao)
  };

  return (
    <div className='divPrincipal alturaCadastroDivPrincipal'>
      <a href='/login' className='aCadastroVoltar'><IoArrowBack className='iconeVoltar'/>
      </a>
      <div className='divSecundaria alturaCadastroDivSecundaria'>
          
        <div className='divImgLogo'>
          <h3 className='logo'>LOGO</h3>
        </div>

        <div className='divH2Titulo'>
          <h2 className='h2Titulo'>CADASTRO</h2>
        </div>

        <div className='divDescricao'>
          <hr className='hrDescricao hrDescricaoDireita'/>
          <h3 className='h3Descricao'>INFORMAÇÕES PESSOAIS</h3>
          <hr className='hrDescricao hrDescricaoEsquerda'/>
        </div>

        <div className='divTipoCadastro'>
          <button 
            type='submit' 
            className={opcao ? 'buttonOpcaoCadastro buttonSelecionado shadowRight' : 'buttonOpcaoCadastro'}
            onClick={alteraOpcaoCadastro}
          >
            PESSOA
          </button>

          <button 
            type='submit' 
            className={opcao ? 'buttonOpcaoCadastro' : 'buttonOpcaoCadastro buttonSelecionado shadowLeft'}
            onClick={alteraOpcaoCadastro}
          >
            INSTITUIÇÃO
          </button>
        </div>
        
        <div className='divFormulario'>

            <Input label='Nome completo' placeholder=''/>

            <Input label='Email' placeholder=''/>

            <Input label='Telefone' placeholder=''/>

            <Input label={opcao ? 'CPF' : 'CNPJ'} placeholder=''/>

            <Input label={opcao ? 'Data de nascimento': 'Data de fundação' } placeholder=''/>

            <Input label={opcao ? 'Gênero': 'Área de atuação' } placeholder=''/>

            {opcao && <Input label='Situação' placeholder=''/>} 

            <Input label='Senha' placeholder=''/>

            <Input label='Confirmar senha' placeholder=''/>
            <Button legenda='Cadastrar'/>

        </div>

      </div>
      
    </div>
  );
};

export default Cadastro;
