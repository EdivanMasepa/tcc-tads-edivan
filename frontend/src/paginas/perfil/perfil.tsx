
import Button from '../../componentes/botao/botao'
import Input from '../../componentes/input/input'
import axios, { isAxiosError } from 'axios'
import { FiEdit } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import Cabecalho from '../../componentes/cabecalho/cabecalho'
import '../../index.css'
import './perfil.css'
import imagem from '../../../public/perfil.png'
import Cookies from "js-cookie"
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { api } from '../../api'
import { FaRegCalendarAlt, FaTransgender } from 'react-icons/fa'
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { useParams } from 'react-router-dom'

enum TipoConteudoEnum{
    INFORMACOES='INFORMAÇÕES',
    PUBLICACOES='PUBLICAÇÕES',
}

enum TipoUsuarioEnum{
    PESSOA = 'Pessoa',
    INSTITUICAO ='Instituição',
}

enum CategoriaPublicacaoEnum {
    PEDIDO_AJUDA = 'Pedido de ajuda',
    INFORMACAO_PUBLICA = ' Informação pública',
    ACAO_SOLIDARIA = 'Ação solidária'
}

interface UsuarioPessoaInterface {
  cpf:string;
  dataNascimento:string;
  genero:string;
  situacao: string;
}

interface UsuarioInstituicaoInterface {
  cnpj: string;
  dataFundacao:string;
  segmento:string;
}

interface DadosUsuarioInterface {
    id: number;
    tipoUsuario: TipoUsuarioEnum;
    nome: string;
    email:string;
    telefone:string;
    especificacao: UsuarioPessoaInterface | UsuarioInstituicaoInterface;
    publicacoes: DadosPublicacaoInterface[];
}

interface DadosPublicacaoInterface {
    id: number;
    categoria:CategoriaPublicacaoEnum;
    titulo:string;
    descricao: string;
    data: Date;
    usuarioResponsavel: string;
}

const Perfil: React.FC = () => { 
    const { id } = useParams<{ id: string }>();
    
    const [opcaoCadastro, setOpcaoCadastro] = useState(true);
    const alteraOpcaoCadastro = () =>{setOpcaoCadastro(!opcaoCadastro)};
    const [usuario, setUsuario] = useState<DadosUsuarioInterface>();
    const [publicacoes, setPublicacoes] = useState<DadosPublicacaoInterface[]>([]);

    const [tipoCadastro, setTipoCadastro] = useState<TipoConteudoEnum>(TipoConteudoEnum.INFORMACOES);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');

    const formatarDataInformacao = (isoDate: string, exibirHora = false) => {
        const data = new Date(isoDate);
        const opcoes: Intl.DateTimeFormatOptions = {dateStyle: 'short'};

        if (exibirHora) opcoes.timeStyle = 'short';

        const formatada = new Intl.DateTimeFormat('pt-BR', opcoes).format(data);

        return exibirHora ? formatada.replace(',', ' -') : formatada;
    };

    const formatarDataPublicacao = (isoDate: string) => {
        const data = new Date(isoDate);
        const formatada = new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(data);

        return formatada.replace(',', ' -');
    };

    const decodificaUsuario = () => {
        const token = Cookies.get('token');
        if (!token) return null;

        try {
            const decodeToken = jwtDecode<JwtPayload>(token);
            return Number(decodeToken.sub);
        }catch (erro) {
            console.error('Erro ao decodificar token:', erro);
            return null;
        }
     };

    const buscarUsuario = async (usuario: number) => {
        try{
            const response = await api.get<DadosUsuarioInterface>(`/usuario/buscar/${usuario}`)
            return response.data
        }catch(erro){
            console.error('Erro ao buscar usuário:', erro);
            return null;
        }
    }

    useEffect(()=>{
        const carregarDados = async () => {
            if (!id) return;
            const usuarioId = Number(id);
            if (isNaN(usuarioId)) return;

            // const usuarioId = decodificaUsuario();
            // if (usuarioId === null) return;
        
            const response = await buscarUsuario(usuarioId);
            console.log(response)
            setUsuario(response ?? undefined)
            setPublicacoes(response?.publicacoes ?? []);
            if (!response) return;

            setNome(response.nome);
            setEmail(response.email);
            setTelefone(response.telefone);
        }
        carregarDados();
    },[id]);
    
    return(
        <div className='divPrincipal'>
            <Cabecalho />
            <div className='divPaiPerfil'>

                <div className='divPerfil cabecalhoPerfil'>

                    <div className='divFotoPerfil'>
                        <img src={imagem} alt="menu" className='imgUsuarioPerfil'/>     
                    </div>
                    
                    {/* <div className='divEditarFotoPerfil'>
                        <button className='buttonEditarFotoPerfil'><FiEdit className='iconeEditarFotoPerfil'/></button>
                    </div> */}

                    <div className='divNomeUsuarioPerfil'>
                        <p className='pNomeUsuarioPerfil'>{usuario?.nome}</p>
                    </div>

                    {usuario?.tipoUsuario === TipoUsuarioEnum.PESSOA && 
                        <div className='divSituacaoPerfil'>
                            <p className='pSituacaoPerfil'>{(usuario.especificacao as UsuarioPessoaInterface).situacao}</p>
                        </div>
                    }

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

                        {opcaoCadastro ? 
                            <div className='divItemConteudoInformacao'>

                                <div className='divSubItemInformacao'>
                                    <div className='divSubItemLegenda'>
                                        <p className='pLegendaPerfil'>Telefone</p> <HiOutlinePhone className='iconeInformacaoPerfil'/>
                                    </div>
                                    <div className='divSubItemValor'>
                                        <p className='pValorPerfil'>{usuario?.telefone}</p>
                                    </div>
                                </div>

                                <div className='divSubItemInformacao'>
                                    <div className='divSubItemLegenda'>
                                        <p className='pLegendaPerfil'>E-mail</p> <HiOutlineMail className='iconeInformacaoPerfil'/>
                                    </div>
                                    <div className='divSubItemValor'>
                                        <p className='pValorPerfil'>{usuario?.email}</p>
                                    </div>
                                </div>

                                <div className='divSubItemInformacao'>
                                    <div className='divSubItemLegenda'>
                                        <p className='pLegendaPerfil'>{usuario?.tipoUsuario === TipoUsuarioEnum.PESSOA ? 'Data de nascimento' : 'Data de fundação'}</p> <FaRegCalendarAlt className='iconeInformacaoPerfil'/>
                                    </div>
                                    <div className='divSubItemValor'>
                                        {usuario?.tipoUsuario === TipoUsuarioEnum.PESSOA && (
                                            <p className='pValorPerfil'>
                                                {formatarDataInformacao((usuario.especificacao as UsuarioPessoaInterface).dataNascimento)}
                                            </p>
                                        )}

                                        {usuario?.tipoUsuario === TipoUsuarioEnum.INSTITUICAO && (
                                            <p className='pValorPerfil'>
                                                {formatarDataInformacao((usuario.especificacao as UsuarioInstituicaoInterface).dataFundacao)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className='divSubItemInformacao' style={{border: 'none'}}>
                                    <div className='divSubItemLegenda'>
                                        <p className='pLegendaPerfil'>{usuario?.tipoUsuario === TipoUsuarioEnum.PESSOA ? 'Gênero' : 'Segmento'}</p> <FaTransgender className='iconeInformacaoPerfil'/>
                                    </div>
                                    <div className='divSubItemValor'>
                                        {usuario?.tipoUsuario === TipoUsuarioEnum.PESSOA && (
                                            <p className='pValorPerfil'>
                                                {(usuario?.especificacao as UsuarioPessoaInterface).genero}
                                            </p>
                                        )}

                                        {usuario?.tipoUsuario === TipoUsuarioEnum.INSTITUICAO && (
                                            <p className='pValorPerfil'>
                                                {(usuario?.especificacao as UsuarioInstituicaoInterface).segmento}
                                            </p>
                                        )}
                                    </div>
                                </div>

                            </div>
                            : 
                            publicacoes
                                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                                .map((publicacao: any)=>(  
                                    <div key={publicacao.id} className='divItemConteudoPublicacao'>

                                        <div  className='divPublicacao' style={{marginTop:'0px'}} key={publicacao.id}>
                                            <div className='divCabecalhoPublicacao'> 
                                                <div className='divCabecalhoUsuarioPublicacao'>
                                                    <img src={imagem} alt="menu" className='imgUsuarioPublicacao'/>

                                                    <div className='divUsuarioPublicacao'>
                                                        <p className="pUsuarioPublicacao">{publicacao.nomeUsuarioResponsavel}</p>
                                                        <p className="pSituacaoUsuarioPublicacao">{publicacao.situacaoUsuarioResponsavel}</p>
                                                    </div>

                                                </div>

                                                <p className="dataPublicacao">{formatarDataPublicacao(publicacao.data)}</p>

                                            </div>

                                            <div className='divConteudoPublicacao'>

                                                <div className='divCabecalhoConteudoPublicacao'>
                                                    <p className='pCategoria'>{publicacao.categoria}</p>
                                                </div>

                                                <div className='divConteudoPrincipalPublicacao1'>
                                                    <p className='pTituloPublicacao'>{publicacao.titulo}</p>
                                                    <p className='pDescricaoPublicacao'>{publicacao.descricao}</p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))
                            }  
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
export default Perfil;