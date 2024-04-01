import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsuarioService as UsuarioService } from './usuario.service';
import { CriaPessoaDTO } from './dto/usuario/pessoa/criaPessoa.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CriaServicoDto } from './dto/servico/criaServico.dto';
import { AtualizaPessoaDTO } from './dto/usuario/pessoa/atualizaPessoa.dto';
import { CriaInstituicaoDTO } from './dto/usuario/instituicao/criaInstituicao.dto';
import { CriaUsuarioDTO } from './dto/usuario/criaUsuario.dto';

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
  async cadastrarServico(@Req() req, @Body() servico: CriaServicoDto) {
    return await this.usuarioService.criarServico(req.user.sub, servico);
  }
  
  @UseGuards(AuthGuard)
  @Patch('/atualizar-usuario')
  async alterar(@Req() req, @Body() novosDados: AtualizaPessoaDTO) {
    const usuarioAtualizada = await this.usuarioService.alterarUsuario(req.user.sub, novosDados);
      return usuarioAtualizada;
  }

  @UseGuards(AuthGuard)
  @Get(':opcao')
  async listarUsuarios(@Param('opcao') opcao:number) {
      return await this.usuarioService.listarUsuarios(Number(opcao));
  }

  @UseGuards(AuthGuard)
  @Get('/servicos')
  async listarServicos() {
      return await this.usuarioService.listarServicos();
  }

  @UseGuards(AuthGuard)
  @Get('buscar:parametro')
  async buscar(@Param('parametro') parametro: any) {
    return await this.usuarioService.buscarUsuario(parametro); 
  }
  
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usuarioService.deletarUsuario(+id);
  }
}