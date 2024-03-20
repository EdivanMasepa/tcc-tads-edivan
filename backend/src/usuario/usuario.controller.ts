import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuarioService as UsuarioService } from './usuario.service';
import { CriaUsuarioDto } from './dto/criaUsuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('/usuario')

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('/cadastrar')
  async criar(@Body() usuario: CriaUsuarioDto) {
      return await this.usuarioService.criarUsuario(usuario);
  }
 
  @Get()
  async listar() {
      return await this.usuarioService.listarUsuarios();
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