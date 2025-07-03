import { useEffect, useState } from 'react'
import Button from '../../componentes/botao/botao'
import Cabecalho from '../../componentes/cabecalho/cabecalho'
import Input from '../../componentes/input/input'
import '../../index.css'
import './perfil.css'
import Cookies from "js-cookie"
import axios from 'axios'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { api } from '../../api'
import { FiEdit } from 'react-icons/fi'

interface dadosUsuario {
    nome: string,
    email:string,
    telefone:string
}

enum TipoConteudoEnum{
    INFORMACOES='INFORMAÇÕES',
    PUBLICACOES='PUBLICAÇÕES',
}

const Perfil: React.FC = () => { 
    const [opcaoCadastro, setOpcaoCadastro] = useState(true);
    const alteraOpcaoCadastro = () =>{setOpcaoCadastro(!opcaoCadastro)};
    const [tipoCadastro, setTipoCadastro] = useState<TipoConteudoEnum>(TipoConteudoEnum.INFORMACOES);
    
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
   
    let decodeToken: JwtPayload;

    const decodificaUsuario = () => {
        const token = Cookies.get('token');
        if (!token) return null;

        try {
            const decodeToken = jwtDecode<JwtPayload>(token);
            return Number(decodeToken.sub);
        } catch (erro) {
            console.error('Erro ao decodificar token:', erro);
            return null;
        }
     };

    const buscarUsuario = async (usuario: number) => {
        try{
            const response = await api.get<dadosUsuario>(`/usuario/buscar/${usuario}`)
            return response.data
        }catch(erro){
            console.error('Erro ao buscar usuário:', erro);
            return null;
        }
    }

    useEffect(()=>{
        const carregarDados = async () => {
            const usuarioId = decodificaUsuario();
            if (usuarioId === null) return;
        
            const response = await buscarUsuario(usuarioId);
            if (!response) return;

            setNome(response.nome);
            setEmail(response.email);
            setTelefone(response.telefone);
        }
        carregarDados()
    },[])
    
    return(
        <div className='divPrincipal alturaPerfil'>
            <Cabecalho />
            <div className='divPaiPerfil'>

                <div className='divPerfil cabecalhoPerfil'>

                    <div className='divFotoPerfil'>
                        <img src='./perfil.png' alt="menu" className='imgUsuarioPerfil'/>     
                    </div>
                    
                    <div className='divEditarFotoPerfil'>
                        <button className='buttonEditarFotoPerfil'><FiEdit className='iconeEditarFotoPerfil'/></button>
                    </div>

                    <div className='divNomeUsuarioPerfil'>
                        <p className='pNomeUsuarioPerfil'>Fulano da silva</p>
                    </div>

                    <div className='divSituacaoPerfil'>
                        <p className='pSituacaoPerfil'>Situação</p>
                    </div>

                </div>
                
                <div className='divTipoConteudoPerfil'>
                    <button 
                    value='INFORMAÇÕES'
                    onChange={() =>{setTipoCadastro}}
                    type='submit' 
                    className={opcaoCadastro ? 'buttonOpcaoConteudoPerfil buttonSelecionadoPerfil shadowRightPerfil' : 'buttonOpcaoConteudoPerfil'}
                    onClick={alteraOpcaoCadastro}>INFORMAÇÕES
                    </button>

                    <button 
                    value='PUBLICAÇÕES'
                    onChange={() =>{setTipoCadastro}}
                    type='submit' 
                    className={opcaoCadastro ? 'buttonOpcaoConteudoPerfil' : 'buttonOpcaoConteudoPerfil buttonSelecionadoPerfil shadowLeftPerfil'}
                    onClick={alteraOpcaoCadastro}>PUBLICAÇÕES
                    </button>
                </div>

                <div className='divPerfil conteudoPerfil'>
                    <div className='divItemConteudoPerfil'>

                    </div>
                </div>

            </div>
{/* <div className='divH2Titulo'>
                        <h2 className='h2Titulo'>ALTERAR PERFIL</h2>
                    </div>

                    <div className='divAlterarPerfil'>
                        <Input value = {nome} setValue={setNome} label='Nome' placeholder='' type='text'/>
                                    
                        <Input value = {email} setValue={setEmail} label='Email' placeholder=''  type='text'/>

                        <Input value = {telefone} setValue={setTelefone} label='Telefone' placeholder=''  type='text'/>

                        <Input value = {senha} setValue={setSenha} label='Senha' placeholder=''  type='text'/>
                        
                        <Input value = {confirmarSenha} setValue={setConfirmarSenha} label='Confirmar senha' placeholder=''  type='text'/>

                        <Button legenda='Salvar' />

                    </div> */}
        </div>

    )
}
export default Perfil