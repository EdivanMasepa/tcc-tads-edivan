import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsuarioService as UsuarioService } from './usuario.service';
import { CriaPessoaDTO } from './dto/usuario/pessoa/criaPessoa.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CriaServicoDto } from './dto/servico/criaServico.dto';
import { AtualizaPessoaDTO } from './dto/usuario/pessoa/atualizaPessoa.dto';
import { CriaInstituicaoDTO } from './dto/usuario/instituicao/criaInstituicao.dto';
import { CriaUsuarioDTO } from './dto/usuario/criaUsuario.dto';
import { AtualizaUsuarioDTO } from './dto/usuario/atualizaUsuario.dto';
import { AtualizaServicoDTO } from './dto/servico/atualizaServico.dto';

@Controller('/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('/cadastrar')
  async cadastrarUsuario(@Body() usuarioCadastro: any){
    const usuario = usuarioCadastro.usuario;
    const tipoUsuario = usuarioCadastro.tipoUsuario;

    if(usuario.tipoUsuario === 'pessoa')
      return await this.usuarioService.criarUsuario(usuario, tipoUsuario, null);

    else if(usuario.tipoUsuario === 'instituicao')
      return await this.usuarioService.criarUsuario(usuario,null, tipoUsuario);
  }

  @UseGuards(AuthGuard)
  @Patch('/criar-servico')
  async cadastrarServico(@Req() req:any, @Body() servico: CriaServicoDto) {
    return await this.usuarioService.criarServico(req.user.sub, servico);
  }
  
  @UseGuards(AuthGuard)
  @Patch('/atualizar-usuario')
  async alterar(@Req() req, @Body() novosDados: Partial<AtualizaUsuarioDTO>) {
    return await this.usuarioService.alterarUsuario(req.user.sub, novosDados);
  }

  @UseGuards(AuthGuard)
  @Patch('/atualizar-servico/:idServico')
  async alterarServico(@Req() req:any, @Param('idServico') idServico:number, @Body() novosDados: AtualizaServicoDTO) {
    return await this.usuarioService.editarServico(req.user.sub, idServico, novosDados);
  }

  @UseGuards(AuthGuard)
  @Get('/listar-usuarios/:opcao')
  async listarUsuarios(@Param('opcao') opcao:number) {
      return await this.usuarioService.listarUsuarios(Number(opcao));
  }

  @UseGuards(AuthGuard)
  @Get('/servicos')
  async listarServicos() {
      return await this.usuarioService.listarServicos();
  }

  @UseGuards(AuthGuard)
  @Get('buscar-usuario/:parametro')
  async buscar(@Param('parametro') parametro: any) {
    return await this.usuarioService.buscarUsuario(parametro); 
  }

  @UseGuards(AuthGuard)
  @Get('/buscar-servico/:parametro')
  async buscarServico(@Param('parametro') parametro: number) {
    return await this.usuarioService.buscarServico(parametro); 
  }
  
  @UseGuards(AuthGuard)
  @Delete('/deletar')
  async remove(@Req() req:any) {
    return await this.usuarioService.deletarUsuario(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete('deletar-servico/:parametro')
  async removerServico(@Req() req:any, @Param('parametro') idServico:number){
      return await this.usuarioService.deletarServico(req.user.sub, Number(idServico))
  }
}