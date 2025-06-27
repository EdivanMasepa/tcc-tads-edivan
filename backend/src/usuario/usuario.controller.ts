import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { UsuarioService as UsuarioService } from './usuario.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CriaUsuarioDTO } from './dto/criaUsuario.dto';
import { AtualizaUsuarioDTO } from './dto/atualizaUsuario.dto';
import { AlteraSenhaDTO } from './dto/alteraSenha.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('cadastrar')
  async cadastrar(@Body() usuario: CriaUsuarioDTO){
    return await this.usuarioService.criar(usuario);
  }
  
  @UseGuards(AuthGuard)
  @Patch('atualizar')
  async alterar(@Req() req:any, @Body() novosDados: AtualizaUsuarioDTO){
    return await this.usuarioService.alterar(req.user.sub, novosDados);
  }

  @UseGuards(AuthGuard)
  @Patch('alterarSenha')
  async alterarSenha(@Req() req:any, @Body() alterarSenha: AlteraSenhaDTO){
    return await this.usuarioService.alterarSenha(req.user.sub, alterarSenha);
  }

  @UseGuards(AuthGuard)
  @Get('listar/:opcao')
  async listar(@Param('opcao') opcao:number) {
      return await this.usuarioService.listar(Number(opcao));
  }

  @UseGuards(AuthGuard)
  @Get('buscar/:parametro')
  async buscar(@Param('parametro') parametro: any) {
    return await this.usuarioService.buscarUsuarioFormatado(parametro); 
  }

  @UseGuards(AuthGuard)
  @Delete('deletar')
  async deletar(@Req() req:any) {
    return await this.usuarioService.deletar(req.user.sub);
  }
}