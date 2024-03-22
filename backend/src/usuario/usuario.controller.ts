import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsuarioService as UsuarioService } from './usuario.service';
import { CriaUsuarioDto } from './dto/criaUsuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CriaServicoDto } from './dto/criaServico.dto';

@UseGuards(AuthGuard)
@Controller('/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('/cadastrar')
  async criar(@Body() usuario: CriaUsuarioDto) {
      return await this.usuarioService.criarUsuario(usuario);
  }

  @Patch('/criar-servico')
  async cadastrarServico(@Req() req, @Body() servico: CriaServicoDto) {
    return await this.usuarioService.criarServico(req.user.sub, servico);
  }

  @Get()
  async listarUsuarios() {
      return await this.usuarioService.listarUsuarios();
  }

  @Get('/servicos')
  async listarServicos() {
      return await this.usuarioService.listaServicos();
  }

  @Get(':parametro')
  async buscar(@Param('parametro') parametro: any) {
    return await this.usuarioService.buscarUsuario(parametro); 
  }

  @Patch(':id')
  async alterar(@Param('id') id: string, @Body() novosDados: UsuarioEntity) {
    const usuarioAtualizada = await this.usuarioService.alterarUsuario(+id, novosDados);
      return usuarioAtualizada;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usuarioService.deletarUsuario(+id);
  }
}