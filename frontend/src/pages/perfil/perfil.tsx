import Button from '../../components/button/button'
import Cabecalho from '../../components/cabecalho/cabecalho'
import Input from '../../components/input/input'
import '../../index.css'
import './perfil.css'

const Perfil: React.FC = () => {
    return(
        <div className='divPrincipal'>
            <Cabecalho />
            <div className='divSecundaria alturaPerfil'>

                <div className='divH2Titulo'>
                    <h2 className='h2Titulo'>ALTERAR PERFIL</h2>
                </div>

                <div className='divAlterarPerfil'>
                    <Input label='Nome' placeholder=''/>
                                
                    <Input label='Email' placeholder=''/>

                    <Input label='Telefone' placeholder=''/>

                    <Input label='Senha' placeholder=''/>
                    
                    <Input label='Confirmar senha' placeholder=''/>

                    <Button legenda='Salvar' />

                </div>
            </div>
        </div>

    )
}
export default Perfil