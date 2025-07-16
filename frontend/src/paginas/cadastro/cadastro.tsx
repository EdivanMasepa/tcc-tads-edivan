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
import SelectDemo from '../../componentes/select/select-radix';
import { VscArchive } from 'react-icons/vsc';

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

interface UsuarioPessoaInterface {
  cpf:string;
  dataNascimento:string;
  genero:GeneroPessoaEnum;
  situacao: string;
}

interface UsuarioInstituicaoInterface {
  cnpj: string;
  dataFundacao:string;
  segmento:SegmentoInstituicaoEnum;
}

interface DadosCadastroInterface{
      tipoUsuario:TipoCadastroEnum;
      nome:string;
      email:string;
      telefone: string;
      senha:string;
      confirmaSenha:string;
      usuario: UsuarioPessoaInterface | UsuarioInstituicaoInterface;
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
  const alteraOpcaoCadastro = () =>{setOpcaoCadastro(!opcaoCadastro);limparCampos();};
  let campoVazio: boolean = false
  
  const dadosPessoa: UsuarioPessoaInterface | any = {
      cpf: cpfOuCnpj,
      dataNascimento: dataNascimentoOuFundacao,
      genero: generoOuSegmento,
      situacao: situacao
  }

  const dadosInstituicao: UsuarioInstituicaoInterface | any = {
      cnpj: cpfOuCnpj,
      dataFundacao: dataNascimentoOuFundacao,
      segmento: generoOuSegmento
  }

  const dados: DadosCadastroInterface | any = {
      tipoUsuario: tipoCadastro,
      nome: nome,
      email: email,
      telefone: telefone,
      senha: senha,
      confirmaSenha: confirmaSenha,
      pessoa: tipoCadastro === TipoCadastroEnum.PESSOA ? dadosPessoa : dadosInstituicao
  }

  const limparCampos = () => {
      setNome(null);
      setEmail(null);
      setTelefone(null);
      setSenha(null);
      setDataNascimentoOuFundacao(null);
      setCpfOuCnpj(null);
      setGeneroOuSegmento(null);
      setSituacao(null);
  }
  
  const cadastrar =  async (dadosCadastro: DadosCadastroInterface) => {

    for(let campo of listaCamposCadastro){
      if (!campo || campo == null || campo.trim() == '') 
        campoVazio = true;
    } 

    setTimeout(() => {
      campoVazio ? (toast.dismiss(), toast.error("Preencha todos os campos.")) : null;
      return;
    }, 1000);

    try{
      const { data } = await api.post<RetornoRequisicao>('/usuario/cadastrar', dadosCadastro);
      toast.dismiss();
      toast.success(data.message || 'Cadastro realizado com sucesso!');
      limparCampos();
    }catch (erro) {
      const msg = axios.isAxiosError(erro)
        ? erro.response?.data?.message || 'Erro ao cadastrar.'
        : 'Erro inesperado. Tente novamente.';

      console.error('Erro no cadastro:', erro);

      setTimeout(() => {
      toast.dismiss();
      toast.error(msg);
      }, 100);
    }
  }
  const opcoesGenero = [
      { id : 1, label: GeneroPessoaEnum.MASCULINO , value: GeneroPessoaEnum.MASCULINO },
      { id : 2, label: GeneroPessoaEnum.FEMININO, value: GeneroPessoaEnum.FEMININO }
    ]

  const opcoesSegmento = [
    { id : 1, label: SegmentoInstituicaoEnum.ADMINISTRACAO_PUBLICA , value: SegmentoInstituicaoEnum.ADMINISTRACAO_PUBLICA },
    { id : 2, label: SegmentoInstituicaoEnum.AGRICULTURA , value: SegmentoInstituicaoEnum.AGRICULTURA },
    { id : 3, label: SegmentoInstituicaoEnum.ASSISTENCIA_SOCIAL , value: SegmentoInstituicaoEnum.ASSISTENCIA_SOCIAL },
    { id : 4, label: SegmentoInstituicaoEnum.COMERCIO , value: SegmentoInstituicaoEnum.COMERCIO },
    { id : 5, label: SegmentoInstituicaoEnum.COMUNICACAO_MIDIA , value: SegmentoInstituicaoEnum.COMUNICACAO_MIDIA },
    { id : 6, label: SegmentoInstituicaoEnum.COOPERATIVISMO , value: SegmentoInstituicaoEnum.COOPERATIVISMO },
    { id : 7, label: SegmentoInstituicaoEnum.CULTURA , value: SegmentoInstituicaoEnum.CULTURA },
    { id : 8, label: SegmentoInstituicaoEnum.DEFESA_CIVIL , value: SegmentoInstituicaoEnum.DEFESA_CIVIL },
    { id : 9, label: SegmentoInstituicaoEnum.EDUCACAO , value: SegmentoInstituicaoEnum.EDUCACAO },
    { id : 10, label: SegmentoInstituicaoEnum.ESPORTE_LAZER , value: SegmentoInstituicaoEnum.ESPORTE_LAZER },
    { id : 11, label: SegmentoInstituicaoEnum.FINANCAS , value: SegmentoInstituicaoEnum.FINANCAS },
    { id : 12, label: SegmentoInstituicaoEnum.INDUSTRIA , value: SegmentoInstituicaoEnum.INDUSTRIA },
    { id : 13, label: SegmentoInstituicaoEnum.ORGANIZACAO_NAO_GOVERNAMENTAL , value: SegmentoInstituicaoEnum.ORGANIZACAO_NAO_GOVERNAMENTAL },    { id : 10, label: SegmentoInstituicaoEnum.ESPORTE_LAZER , value: SegmentoInstituicaoEnum.ESPORTE_LAZER },
    { id : 14, label: SegmentoInstituicaoEnum.ORGANIZACAO_RELIGIOSA , value: SegmentoInstituicaoEnum.ORGANIZACAO_RELIGIOSA },
    { id : 15, label: SegmentoInstituicaoEnum.OUTROS , value: SegmentoInstituicaoEnum.OUTROS },
    { id : 16, label: SegmentoInstituicaoEnum.SAUDE , value: SegmentoInstituicaoEnum.SAUDE },
    { id : 17, label: SegmentoInstituicaoEnum.SEGURANCA_PUBLICA , value: SegmentoInstituicaoEnum.SEGURANCA_PUBLICA },
    { id : 18, label: SegmentoInstituicaoEnum.TECNOLOGIA , value: SegmentoInstituicaoEnum.TECNOLOGIA },
    { id : 19, label: SegmentoInstituicaoEnum.TRANSPORTE , value: SegmentoInstituicaoEnum.TRANSPORTE },            

  ]
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

              <Input value={telefone ?? ""} setValue={setTelefone} label='Telefone' placeholder='(00) 90000-0000'  type='text' mask='telefone'/>

              {opcaoCadastro === true ? 
                <Input value={cpfOuCnpj ?? ""} setValue={setCpfOuCnpj} label='CPF' placeholder='000.000.000-00' type='text' mask='cpf' maxLength={14}/> :
                <Input value={cpfOuCnpj ?? ""} setValue={setCpfOuCnpj} label='CNPJ' placeholder='00.000.000/0000-00' type='text' mask='cnpj' maxLength={18}/>
              }

              <Input value={dataNascimentoOuFundacao ?? ""} setValue={setDataNascimentoOuFundacao} label={opcaoCadastro ? 'Data de nascimento': 'Data de fundação' } placeholder='00/00/0000' type='text' mask='data' maxLength={10}/>

              {/* <Input value={generoOuSegmento ?? ""} setValue={setGeneroOuSegmento} label={opcaoCadastro ? 'Gênero': 'Área de atuação' } placeholder=''  type='text'/> */}

              <div className='divSelectCadastro'>
                {opcaoCadastro === true ? 
                  <>
                    <label className='labelSelectCadastro'>Gênero</label>
                    <SelectDemo 
                      value={generoOuSegmento} 
                      onValueChange={setGeneroOuSegmento}
                      options={opcoesGenero.map( (opcao) => (
                        { key : opcao.id, label: opcao.label , value: opcao.value }
                      ))}
                      className='selectCadastro'
                    />
                  </> 
                  :
                  <>
                    <label className='labelSelectCadastro'>Segmento</label>
                    <SelectDemo 
                      value={generoOuSegmento} 
                      onValueChange={setGeneroOuSegmento}
                      options={opcoesSegmento.map( (opcao) => (
                        { key : opcao.id, label: opcao.label , value: opcao.value }
                      ))}
                    />
                  </>
                }
              </div>
              

              {opcaoCadastro && <Input value={situacao ?? ""} setValue={setSituacao} label='Situação' placeholder='' type='text'/>} 

              <Input value={senha ?? ""} setValue={setSenha} label='Senha' placeholder='••••••••' type='text'/>

              <Input value={confirmaSenha ?? ""} setValue={setConfirmarSenha} label='Confirmar senha' placeholder='••••••••' type='text'/>

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
