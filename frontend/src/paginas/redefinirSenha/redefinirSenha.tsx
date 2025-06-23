import { useState } from 'react';
import Button from '../../componentes/botao/botao';
import Input from '../../componentes/input/input';
import '../../index.css'
import './redefinirSenha.css'
import { IoArrowBack } from 'react-icons/io5';

const RedefinirSenha: React.FC = () => {
    const [envio, setEnvio] = useState(false)

    const enviaCodigoVerificacao = () =>{
        setEnvio(!envio)
    };

    return(
        <div className='divPrincipal'>
            <a href='/login' className='aCadastroVoltar'><IoArrowBack className='iconeVoltar'/>
            </a>
            <div className='divSecundaria alturaRedefinirSenha'>

                <div className='divImgLogo'>
                    <h3 className='logo'>LOGO</h3>
                </div>

                <div className='divH2Titulo'>
                    <h2 className='h2Titulo'>REDEFINIR SENHA</h2>
                </div>

                <div className='divConteudo'>
                    {!envio && <div className='divTexto'>
                        <p className='pTexto'>
                            Informe abaixo por onde você prefere recebero código de verificação.
                        </p>
                    </div>}
                    <div className='divEnviarCodigo'>
                        {!envio && <Input label='Digite o E-mail ou Telefone'></Input>}

                        {envio && <Input label='Código de verificação' placeholder=''/>}
                        {envio && <Input label='Senha' placeholder=''/>}
                        {envio && <Input label='Confirmar senha' placeholder=''/>}

                        {!envio && <Button legenda='Enviar código' onClick={enviaCodigoVerificacao}></Button>}

                        {envio && <Button legenda='Alterar senha'></Button>}

                    </div>
                    {envio && <a className='aCodigo' onClick={enviaCodigoVerificacao}>Não recebi o código</a>}
                </div>
            </div>
        </div>
    )
}
export default RedefinirSenha;