import './login.css'
import "../../index.css"
import Button from '../../componentes/botao/botao'
import Input from '../../componentes/input/input'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { toast, ToastContainer } from 'react-toastify'
import  'react-toastify/dist/ReactToastify.css' ;
import axios from 'axios'
import { api } from '../../api'

interface DadosLogin {
  dadosLogin:{
    login: string | null;
    senha: string | null;
  }
  
};

const Login: React.FC = () => {
  const [login, setLogin] = useState<string | null>(null);
  const [senha, setSenha] = useState<string | null>(null);
  const [verSenha, setVerSenha] = useState(true);
  const navigate: NavigateFunction = useNavigate();
  const mostrarSenha = () => {setVerSenha(!verSenha)}
  
  const logar = async () => {
    if (!login?.trim() || !senha?.trim()) {
      toast.dismiss();
      toast.error('Preencha todos os campos');
      return;
    }
    const dadosLogin = {
      dadosLogin: { login, senha }
    };

    try{
      const {data} = await api.post('/auth/login', dadosLogin)
      console.log(data.token)
      Cookies.set('token', data.token)
      
      navigate('/paginaInicial')  
      
    }catch(erro){
      toast.dismiss();

      const mensagem = axios.isAxiosError(erro) && erro.response?.data?.message
      ? erro.response.data.message
      : "Erro ao fazer login. Tente novamente.";

      toast.error(mensagem);
    }
  }
  
  return (
    <>
      <div className='divPrincipal'>
        <div className='divSecundaria alturaLogin'>

          <div className='divImgLogo'>
            <h3 className='logo'>LOGO</h3>
          </div>

          <div className='divH2Titulo'>
            <h2 className='h2Titulo'>LOGIN</h2>
          </div>
        
          <div className='divInputs'>
            <div className='divInputLogin'>
              <Input value={login ?? ""} setValue={setLogin} label='Login' placeholder='E-mail, CPF ou Telefone' type='text'/>
            </div>


            <div className='divInputSenha'>
              <div className='div2InputSenha'>
                <Input value={senha ?? ""} setValue={setSenha} label='Senha' placeholder='Senha' type={verSenha ? 'password' : 'text'}/>
                <h5 className='h5Senha'><a href='/redefinirSenha'>Esqueci minha senha</a></h5>
              </div>

              <div className='div3InputSenha'>
                <span onClick={mostrarSenha}>{verSenha ? <IoEyeOutline className='iconeVerSenha'/> : <IoEyeOffOutline className='iconeVerSenha'/>}</span>
              </div>
            </div>
          </div>

          <div className='divEntrar'>
            <div className='divButtonEntrar'>
              <Button legenda='Entrar' onClick={logar}/>
            </div>
          </div>
  
        </div>

        <div className='divButtonCadastrar'>
          <label className='labelCadastrar'>Não possui uma conta?</label>
          <a href='/cadastro' className='aCadastrar'><Button legenda='Cadastrar'/></a>
        </div>

      </div>
      <ToastContainer/> 
    </>
  )
}
export default Login;
