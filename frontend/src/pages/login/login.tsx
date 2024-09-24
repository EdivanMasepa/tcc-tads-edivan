import './login.css'
import "../../index.css"
import Button from '../../components/button/button'
import Input from '../../components/input/input'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { toast, ToastContainer } from 'react-toastify'
import  'react-toastify/dist/ReactToastify.css' ;
import axios from 'axios'

interface DadosLogin {
  login: string | null;
  senha: string | null;
};

const Login: React.FC = () => {
  const [login, setLogin] = useState<string | null>(null);
  const [senha, setSenha] = useState<string | null>(null);
  const [verSenha, setVerSenha] = useState(true);

  const mostrarSenha = ()=>{
    setVerSenha(!verSenha)
  }

  const navigate = useNavigate()
  const logar = async (dadosLogin:DadosLogin) => {

    if (!login || !senha) {
      toast.dismiss()
      toast.error("Preencha todos os campos")
      return
    }

    try{
      const response = await axios.post('http://localhost:3000/auth/login', dadosLogin)
      
      Cookies.set('token', response.data.token, {sameSite: "Strict", secure: true})
      navigate('/paginaInicial')
      toast.success('Sucesso')     

      return response.data

    }catch(erro){
      if (axios.isAxiosError(erro) && erro.response){

        if(erro.response.data.message){
          toast.dismiss()
          toast.error(erro.response.data.message);
        }
        else {
          toast.dismiss
          toast.error('Erro ao fazer login.')
        }
  
      } 
      else {
        console.log('Erro desconhecido', erro);
      }
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

              <div className='div1InputSenha'>
                
              </div>

              <div className='div2InputSenha'>
                <Input value={senha ?? ""} setValue={setSenha} label='Senha' placeholder='Senha' type={verSenha ? 'password' : 'text'}/>
                <h5 className='h5Senha'><a href='/redefinirSenha'>Esqueci minha senha</a></h5>
              </div>

              <div className='div3InputSenha'>
                <span onClick={mostrarSenha}>{verSenha ? <IoEyeOutline className='iconeVerSenha'/> : <IoEyeOffOutline className='iconeVerSenha'/>}</span>
              </div>
                
            </div>

          </div>

          <Button className='novaAltura' legenda='Entrar' onClick={() => logar({login, senha})}/>

        </div>

        <div className='divButtonCadastrar'>
          <label className='labelCadastrar'>Não possui uma conta?</label>
          <a href='/cadastro' className='aCadastrar'><Button legenda='Cadastrar'/></a>
        </div>

      </div>
      <ToastContainer /> 
    </>
  )
}

export default Login
