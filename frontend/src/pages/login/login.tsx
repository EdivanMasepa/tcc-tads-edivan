import './login.css'
import "../../index.css"
import Button from '../../components/button/button'
import Input from '../../components/input/input'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'


const Login: React.FC = () => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value);
  };

  const dadosLogin = {
    login: login,
    senha: senha,
  };
  const navigate = useNavigate()
  const logar = async () => {

    try{


      console.log(dadosLogin)
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosLogin),
      })

      console.log(response)

      if (response.ok) {
        const data = await response.json();
        console.log('Login bem-sucedido:', data);
        // Você pode armazenar o token ou redirecionar o usuário
        navigate('/paginaInicial')
      } else {
        console.error(response.statusText);
      }
      } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
      }
    }
  
  // const navigate = useNavigate();
  // const redirecionar = (pagina: string) => {
  //   navigate(`/${pagina}`);
  // };
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
              <Input value={login} setValue={setLogin} label='Login' placeholder='E-mail, CPF ou Telefone'/>
            </div>

            <div className='divInputSenha'>
              <Input value={senha} setValue={setSenha} label='Senha' placeholder='Senha'/>
              <h5 className='h5Senha'><a href='/redefinirSenha'>Esqueci minha senha</a></h5>
            </div>

          </div>

          <Button className='novaAltura' legenda='Entrar' onClick={() => logar()}/>

        </div>

        <div className='divButtonCadastrar'>
          <label className='labelCadastrar'>Não possui uma conta?</label>
          <a href='/cadastro' className='aCadastrar'><Button legenda='Cadastrar'/></a>
        </div>

      </div>
    </>
  )
}

export default Login
