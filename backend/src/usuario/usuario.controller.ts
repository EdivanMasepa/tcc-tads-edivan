import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsuarioService as UsuarioService } from './usuario.service';
import { CriaPessoaDto } from './dto/usuario/pessoa/criaPessoa.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CriaServicoDto } from './dto/servico/criaServico.dto';
import { AtualizaPessoaDTO } from './dto/usuario/pessoa/atualizaPessoa.dto';
import { CriaInstituicaoDto } from './dto/usuario/instituicao/criaInstituicao.dto';

@Controller('/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('/cadastrar-pessoa')
  async cadastrarPessoa(@Body() usuario: CriaPessoaDto) {
      return await this.usuarioService.criarUsuario(usuario, null);
  }
  
  @Post('/cadastrar-instituicao')
  async cadastrarInstituicao(@Body() usuario: CriaInstituicaoDto) {
      return await this.usuarioService.criarUsuario(null, usuario);
  }

  @UseGuards(AuthGuard)
  @Patch('/criar-servico')
  async cadastrarServico(@Req() req, @Body() servico: CriaServicoDto) {
    return await this.usuarioService.criarServico(req.user.sub, servico);
  }

  @UseGuards(AuthGuard)
  @Get()
  async listarUsuarios() {
      return await this.usuarioService.listarUsuarios();
  }

  @UseGuards(AuthGuard)
  @Get('/servicos')
  async listarServicos() {
      return await this.usuarioService.listarServicos();
  }

  @UseGuards(AuthGuard)
  @Get(':parametro')
  async buscar(@Param('parametro') parametro: any) {
    return await this.usuarioService.buscarUsuario(parametro); 
  }

  @UseGuards(AuthGuard)
  @Patch('/atualizar-usuario')
  async alterar(@Req() req, @Body() novosDados: AtualizaPessoaDTO) {
    const usuarioAtualizada = await this.usuarioService.alterarUsuario(req.user.sub, novosDados);
      return usuarioAtualizada;
  }
  
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usuarioService.deletarUsuario(+id);
  }
}