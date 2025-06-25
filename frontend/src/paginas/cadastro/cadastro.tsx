import React, { useState } from 'react';
import "./cadastro.css"
import "../../index.css"
import { IoArrowBack } from 'react-icons/io5';
import Input from '../../componentes/input/input';
import Button from '../../componentes/botao/botao';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import  'react-toastify/dist/ReactToastify.css' ;
import { RetornoRequisicao } from '../../types/retornoRequisicao';
import { api } from '../../api';

enum TipoCadastroEnum{
  PESSOA='Pessoa' ,
  INSTITUICAO='Instituição'
}

enum SegmentoInstituicaoEnum {
    ADMINISTRACAO_PUBLICA = 'Administração Pública',
    AGRICULTURA = 'Agricultura',
    ASSISTENCIA_SOCIAL = 'Assistência Social',
    COMERCIO = 'Comércio',
    COMUNICACAO_MIDIA = 'Comunicação e Mídia',
    COOPERATIVISMO = 'Cooperativismo',
    CULTURA = 'Cultura',
    DEFESA_CIVIL = 'Defesa Civil',
    EDUCACAO = 'Educação',
    ESPORTE_LAZER = 'Esporte e Lazer',
    FINANCAS = 'Finanças e Bancos',
    INDUSTRIA = 'Indústria',
    ORGANIZACAO_NAO_GOVERNAMENTAL = 'ONG / OSCIP',
    ORGANIZACAO_RELIGIOSA = 'Organização Religiosa',
    OUTROS = 'Outros',
    SAUDE = 'Saúde',
    SEGURANCA_PUBLICA = 'Segurança Pública',
    TECNOLOGIA = 'Tecnologia',
    TRANSPORTE = 'Transporte'
}

enum GeneroPessoaEnum{
  MASCULINO= 'Masculino',
  FEMININO = 'Feminino'
}

interface UsuarioPessoa {
  cpf:string;
  dataNascimento:string;
  genero:GeneroPessoaEnum;
  situacao: string;
}

interface UsuarioInstituicao {
  cnpj: string;
  dataFundacao:string;
  segmento:SegmentoInstituicaoEnum;
}

interface DadosCadastro{
      tipoUsuario:TipoCadastroEnum;
      nome:string;
      email:string;
      telefone: string;
      senha:string;
      confirmaSenha:string;
      usuario: UsuarioPessoa | UsuarioInstituicao;
}

const Cadastro: React.FC = () => {
  const [tipoCadastro, setTipoCadastro] = useState<TipoCadastroEnum>(TipoCadastroEnum.PESSOA);
  const [nome, setNome] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [telefone, setTelefone] = useState<string | null>(null);
  const [senha, setSenha] = useState<string | null>(null);
  const [confirmaSenha, setConfirmarSenha] = useState<string | null>(null);
  const [cpfOuCnpj, setCpfOuCnpj] = useState<string | null>(null);
  const [dataNascimentoOuFundacao, setDataNascimentoOuFundacao] = useState<string | null>(null);
  const [generoOuSegmento, setGeneroOuSegmento] = useState<string | null>(null);
  const [situacao, setSituacao] = useState<string | null>(null);
  const listaCamposCadastro = [tipoCadastro, nome, email, telefone, senha, confirmaSenha, cpfOuCnpj, dataNascimentoOuFundacao, generoOuSegmento];
  const [opcaoCadastro, setOpcaoCadastro] = useState(true);
  const alteraOpcaoCadastro = () =>{
    setOpcaoCadastro(!opcaoCadastro)
  };
  
  
  
  const dadosPessoa: UsuarioPessoa | any = {
      cpf: cpfOuCnpj,
      dataNascimento: dataNascimentoOuFundacao,
      genero: generoOuSegmento,
      situacao: situacao
  }

  const dadosInstituicao: UsuarioInstituicao | any = {
      cnpj: cpfOuCnpj,
      dataFundacao: dataNascimentoOuFundacao,
      segmento: generoOuSegmento,
      situacao: situacao
  }

  const dados: DadosCadastro | any = {
      tipoUsuario: tipoCadastro,
      nome: nome,
      email: email,
      telefone: telefone,
      senha: senha,
      confirmaSenha: confirmaSenha,
      pessoa: dadosPessoa
  }
  
  const cadastrar =  async (dadosCadastro: DadosCadastro) => {
          console.log(dados)

    for(let campo in listaCamposCadastro){
      if (!campo || campo == null || campo.trim() == '') {
        console.log('oi')
        toast.dismiss()
        toast.error("Preencha todos os campos")
      }
    }
    try{
      const response = await api.post<RetornoRequisicao>('/usuario/cadastrar', dadosCadastro)
      toast.dismiss()
      toast.success(response.data.message)      
    }
    catch(erro){
      if (axios.isAxiosError(erro) && erro.response){
        console.log('erro')

        if(erro.response.data.message){
          console.log(erro.response.data.message)
          toast.error(erro.response.data.message);
        }
        else {
          toast.error('Erro ao cadastrar.')
        }
      } 
      else {
        console.log('Erro desconhecido', erro);
      }
    }
  }
  return (
    <>
      <div className='divPrincipal alturaCadastroDivPrincipal'>
        
        <a href='/login' className='aCadastroVoltar'><IoArrowBack className='iconeVoltar'/></a>
        
        <div className='divSecundaria alturaCadastroDivSecundaria'>
            
          <div className='divImgLogo divImgLogoAltura'>
            <h3 className='logo'>LOGO</h3>
          </div>

          <div className='divH2Titulo divH2TituloAltura'>
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
              value={TipoCadastroEnum.PESSOA}
              onChange={() =>{setTipoCadastro}}
              type='submit' 
              className={opcaoCadastro ? 'buttonOpcaoCadastro buttonSelecionado shadowRight' : 'buttonOpcaoCadastro'}
              onClick={alteraOpcaoCadastro}>PESSOA
            </button>

            <button 
              value={TipoCadastroEnum.INSTITUICAO}
              onChange={() =>{setTipoCadastro}}
              type='submit' 
              className={opcaoCadastro ? 'buttonOpcaoCadastro' : 'buttonOpcaoCadastro buttonSelecionado shadowLeft'}
              onClick={alteraOpcaoCadastro}>INSTITUIÇÃO
            </button>
          </div>
          
          <div className='divFormulario'>
            <div className='divConteudoFormulario'>
              <Input value={nome ?? ""} setValue={setNome} label='Nome completo' placeholder='Nome'  type='text'/>

              <Input value={email ?? ""} setValue={setEmail} label='Email' placeholder='exemplo@email.com'  type='email'/>

              <Input value={telefone ?? ""} setValue={setTelefone} label='Telefone' placeholder='(11) 91111-1111'  type='text'/>

              <Input value={cpfOuCnpj ?? ""} setValue={setCpfOuCnpj} label={opcaoCadastro ? 'CPF' : 'CNPJ'} placeholder={opcaoCadastro ? '123.456.789-10' : '12.345.687/0001-23'}  type='text'/>

              <Input value={dataNascimentoOuFundacao ?? ""} setValue={setDataNascimentoOuFundacao} label={opcaoCadastro ? 'Data de nascimento': 'Data de fundação' } placeholder='01/01/0001'  type='text'/>

              <Input value={generoOuSegmento ?? ""} setValue={setGeneroOuSegmento} label={opcaoCadastro ? 'Gênero': 'Área de atuação' } placeholder=''  type='text'/>

              {opcaoCadastro && <Input value={situacao ?? ""} setValue={setSituacao} label='Situação' placeholder=''  type='text'/>} 

              <Input value={senha ?? ""} setValue={setSenha} label='Senha' placeholder='••••••••'  type='text'/>

              <Input value={confirmaSenha ?? ""} setValue={setConfirmarSenha} label='Confirmar senha' placeholder='••••••••'  type='text'/>

              <Button legenda='Cadastrar' onClick={() => cadastrar(dados)}/>
            </div>
          </div>

        </div>
    
      </div>
          <ToastContainer/>
    </>
  );
};

export default Cadastro;
