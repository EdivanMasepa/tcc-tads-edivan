import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsuarioService as UsuarioService } from './usuario.service';
import { CriaUsuarioDto } from './dto/criaUsuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';

@Controller('/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('/cadastrar')
  async criar(@Body() usuario: CriaUsuarioDto) {
    const usuarioCriada = await this.usuarioService.criarUsuario(usuario);
    if(usuarioCriada)
    return {'Usuario cadastrada' : usuarioCriada};
  else
    return {Mensagem : 'Erro ao cadastrar.'};
  }

  @Get()
  async listar() {
    const listaUsuarios = await this.usuarioService.listarUsuarios();
    if(listaUsuarios)
      return {'Usuarios cadastradas' : listaUsuarios};
    else
      return {Mensagem : '0 registros encontrados.'};
  }

  @Get(':id')
  async buscar(@Param('id') id: string) {
    const usuarioEncontrada = await this.usuarioService.buscarUsuario(+id);
    if(usuarioEncontrada)
      return {'Cadastro localizado' : usuarioEncontrada};
    else
      return{Mensagem : 'Nenhum registro localizado.'};
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

  @Post(':cpf')
  async validacpf(@Param('cpf') cpf: string){
    return this.usuarioService.validarCPF(cpf);
  }
}