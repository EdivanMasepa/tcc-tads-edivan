import React, { useState } from 'react';
import "./cadastro.css"
import "../../index.css"
import { IoArrowBack } from 'react-icons/io5';
import Input from '../../components/input/input';
import Button from '../../components/button/button';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import  'react-toastify/dist/ReactToastify.css' ;

enum TipoCadastro{
  pessoa='pessoa' ,
  instituicao='instituição'
}

interface UsuarioPessoa {
  cpf:string;
  dataNascimento:string;
  genero:string;
}

interface UsuarioInstituicao {
  cnpj: string;
  dataFundacao:string;
  areaAtuacao:string;
}

interface DadosCadastro{
    usuario:{
      tipoUsuario:TipoCadastro;
      nome:string;
      email:string;
      telefone: string;
      senha:string;
    },
    tipoUsuario: UsuarioPessoa | UsuarioInstituicao;
}

const Cadastro: React.FC = () => {
  
  const [tipoCadastro, setTipoCadastro] = useState<TipoCadastro>(TipoCadastro.pessoa);
  const [nome, setNome] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [telefone, setTelefone] = useState<string | null>(null);
  const [senha, setSenha] = useState<string | null>(null);
  const [confirmarSenha, setConfirmarSenha] = useState<string | null>(null);


  const [cpfOuCnpj, setCpfOuCnpj] = useState<string | null>(null);
  const [dataNascimentoOuFundacao, setDataNascimentoOuFundacao] = useState<string | null>(null);
  const [generoOuAreaAtuacao, setGeneroOuAreaAtuacao] = useState<string | null>(null);
  const [situacao, setSituacao] = useState<string | null>(null);


  const listaCamposCadastro = [tipoCadastro, nome, email, telefone, senha, confirmarSenha, cpfOuCnpj, dataNascimentoOuFundacao, generoOuAreaAtuacao];

  for(let campo in listaCamposCadastro){
    if (!campo) {
      toast.dismiss()
      toast.error("Preencha todos os campos")
      return
    }
  }
  const dados: DadosCadastro | any = {
    usuario:{
      tipoUsuario: tipoCadastro,
      nome: nome,
      email: email,
      telefone: telefone,
      senha: senha
    },
    tipoUsuario:{
      cpf: cpfOuCnpj,
      dataNascimento: dataNascimentoOuFundacao,
      genero: generoOuAreaAtuacao,
      situacao: situacao
    }
  
  }
  
  const cadastrar =  async (dadosCadastro: DadosCadastro) => {
    try{
      const response = await axios.post('http://localhost:3000/usuario/cadastrar', dadosCadastro)

      toast.success('Cadastrado com sucesso.')      
    }
    catch(erro){
      if (axios.isAxiosError(erro) && erro.response){
        console.log('erro')

        if(erro.response.data.message){
          console.log(erro.response.data.message)
          toast.dismiss()
          toast.error(erro.response.data.message);
        }
        else {
          toast.dismiss
          toast.error('Erro ao cadastrar.')
        }
      } 
      else {
        console.log('Erro desconhecido', erro);
      }
    }
  }

  const [opcaoCadastro, setOpcaoCadastro] = useState(true)

  const alteraOpcaoCadastro = () =>{
    setOpcaoCadastro(!opcaoCadastro)
  };

  return (
    <div className='divPrincipal alturaCadastroDivPrincipal'>
      
      <a href='/login' className='aCadastroVoltar'><IoArrowBack className='iconeVoltar'/></a>
      
      <div className='divSecundaria alturaCadastroDivSecundaria'>
          
        <div className='divImgLogo'>
          <h3 className='logo'>LOGO</h3>
        </div>

        <div className='divH2Titulo'>
          <h2 className='h2Titulo'>CADASTRO</h2>
        </div>

        <div className='divDescricao'>
          <hr className='hrDescricao hrDescricaoDireita'/>
          <h3 className='h3Descricao'>INFORMAÇÕES {opcaoCadastro ? 'PESSOAIS' : 'BÁSICAS'}</h3>
          <hr className='hrDescricao hrDescricaoEsquerda'/>
        </div>

        <div className='divLegendaTipoCadastro'>
            <p>Cadastrar:</p>
        </div>

        <div className='divTipoCadastro'>
          <button 
            value={TipoCadastro.pessoa}
            onChange={() =>{setTipoCadastro}}
            type='submit' 
            className={opcaoCadastro ? 'buttonOpcaoCadastro buttonSelecionado shadowRight' : 'buttonOpcaoCadastro'}
            onClick={alteraOpcaoCadastro}>PESSOA
          </button>

          <button 
            value={TipoCadastro.instituicao}
            onChange={() =>{setTipoCadastro}}
            type='submit' 
            className={opcaoCadastro ? 'buttonOpcaoCadastro' : 'buttonOpcaoCadastro buttonSelecionado shadowLeft'}
            onClick={alteraOpcaoCadastro}>INSTITUIÇÃO
          </button>
        </div>
        
        <div className='divFormulario'>

          <Input value={nome ?? ""} setValue={setNome} label='Nome completo' placeholder='Nome'  type='text'/>

          <Input value={email ?? ""} setValue={setEmail} label='Email' placeholder='exemplo@exemplo.com'  type='email'/>

          <Input value={telefone ?? ""} setValue={setTelefone} label='Telefone' placeholder='11 91111-1111'  type='text'/>

          <Input value={cpfOuCnpj ?? ""} setValue={setCpfOuCnpj} label={opcaoCadastro ? 'CPF' : 'CNPJ'} placeholder=''  type='text'/>

          <Input value={dataNascimentoOuFundacao ?? ""} setValue={setDataNascimentoOuFundacao} label={opcaoCadastro ? 'Data de nascimento': 'Data de fundação' } placeholder=''  type='text'/>

          <Input value={generoOuAreaAtuacao ?? ""} setValue={setGeneroOuAreaAtuacao} label={opcaoCadastro ? 'Gênero': 'Área de atuação' } placeholder=''  type='text'/>

          {opcaoCadastro && <Input value={situacao ?? ""} setValue={setSituacao} label='Situação' placeholder=''  type='text'/>} 

          <Input value={senha ?? ""} setValue={setSenha} label='Senha' placeholder=''  type='text'/>

          <Input value={confirmarSenha ?? ""} setValue={setConfirmarSenha} label='Confirmar senha' placeholder=''  type='text'/>

          <Button legenda='Cadastrar' onClick={() => cadastrar(dados)}/>

        </div>

      </div>
      <ToastContainer/>
    </div>
  );
};

export default Cadastro;
