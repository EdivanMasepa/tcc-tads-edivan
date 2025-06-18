import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { UsuarioService as UsuarioService } from './usuario.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CriaUsuarioDTO } from './dto/criaUsuario.dto';
import { AtualizaUsuarioDTO } from './dto/atualizaUsuario.dto';

@Controller('/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('/cadastrar')
  async cadastrar(@Body() usuario: CriaUsuarioDTO){
    return await this.usuarioService.criarUsuario(usuario);
  }
  
  @UseGuards(AuthGuard)
  @Patch('/atualizar')
  async alterar(@Req() req:any, @Body() novosDados: Partial<AtualizaUsuarioDTO>){
    return await this.usuarioService.alterarUsuario(req.user.sub, novosDados);
  }

  @UseGuards(AuthGuard)
  @Get('/listar/:opcao')
  async listar(@Param('opcao') opcao:number) {
      return await this.usuarioService.listarUsuarios(Number(opcao));
  }

  @UseGuards(AuthGuard)
  @Get('/buscar/:parametro')
  async buscar(@Param('parametro') parametro: any) {
    return await this.usuarioService.buscarUsuario(parametro); 
  }

  @UseGuards(AuthGuard)
  @Delete('/deletar')
  async deletar(@Req() req:any) {
    return await this.usuarioService.deletarUsuario(req.user.sub);
  }
}