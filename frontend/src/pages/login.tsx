import './login.css'
import "../index.css"
import Button from '../components/button'
import Input from '../components/input'


function Login() {
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
              <h5 className='h5Senha'><a>Esqueci minha senha</a></h5>
            </div>

          </div>

          <Button legenda='Entrar'/>

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
