import './login.css'
import "../../index.css"
import Button from '../../components/button/button'
import Input from '../../components/input/input'
import { useNavigate } from 'react-router-dom'


const Login: React.FC = () => {
  const navigate = useNavigate();
  const redirecionar = (pagina: string) => {
    navigate(`/${pagina}`);
  };
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
              <Input label='Login' placeholder='E-mail, CPF ou Telefone'/>
            </div>

            <div className='divInputSenha'>
              <Input label='Senha' placeholder='Senha'/>
              <h5 className='h5Senha'><a href='/redefinirSenha'>Esqueci minha senha</a></h5>
            </div>

          </div>

          <Button legenda='Entrar' onClick={() => redirecionar('paginaInicial')}/>

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
