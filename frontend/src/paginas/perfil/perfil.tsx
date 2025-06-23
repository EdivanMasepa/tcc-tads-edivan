import { useEffect, useState } from 'react'
import Button from '../../componentes/botao/botao'
import Cabecalho from '../../componentes/cabecalho/cabecalho'
import Input from '../../componentes/input/input'
import '../../index.css'
import './perfil.css'
import Cookies from "js-cookie"
import axios from 'axios'
import { jwtDecode, JwtPayload } from 'jwt-decode'

interface dadosUsuario {
    nome: string,
    email:string,
    telefone:string
}


const Perfil: React.FC = () => {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
        
    let decodeToken: JwtPayload;

    const salvar = async () => {
        try{
            const token = Cookies.get('token') ;
            
            if(token){
                decodeToken = jwtDecode(token)
            }
            const response = await axios.get<dadosUsuario>(`http://localhost:3000/usuario/buscar-usuario/${decodeToken.sub}`, {
                method: 'GET',
                headers: {'Authorization': `Bearer ${token}`}
            })
            return response.data
        }catch(erro){
            console.log(erro)
        }
    }

    useEffect(()=>{
        salvar().then((response) => {
            if(!response) return null
            setNome(response.nome)
            setEmail(response.email)
            setTelefone(response.telefone)
        })
        

    },[])
    
    return(
        <div className='divPrincipal'>
            <Cabecalho />
            <div className='divSecundaria alturaPerfil'>

                <div className='divH2Titulo'>
                    <h2 className='h2Titulo'>ALTERAR PERFIL</h2>
                </div>

                <div className='divAlterarPerfil'>
                    <Input value = {nome} setValue={setNome} label='Nome' placeholder='' type='text'/>
                                
                    <Input value = {email} setValue={setEmail} label='Email' placeholder=''  type='text'/>

                    <Input value = {telefone} setValue={setTelefone} label='Telefone' placeholder=''  type='text'/>

                    <Input value = {senha} setValue={setSenha} label='Senha' placeholder=''  type='text'/>
                    
                    <Input value = {confirmarSenha} setValue={setConfirmarSenha} label='Confirmar senha' placeholder=''  type='text'/>

                    <Button legenda='Salvar' onClick={() => salvar()}/>

                </div>
            </div>
        </div>

    )
}
export default Perfil