import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PublicacaoService } from './publicacao.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CriaPublicacaoDTO } from './dto/criaPublicacao.dto';
import { AtualizaPublicacaoDTO } from './dto/atualizaPublicacao.dto';

@UseGuards(AuthGuard)
@Controller('publicacao')
export class PublicacaoController {
  constructor(private readonly publicacaoService: PublicacaoService) {}

  @Post('cadastrar')
  async cadastrar(@Req() req:any, @Body() publicacao: CriaPublicacaoDTO) {
    return await this.publicacaoService.criar(req.user.sub, publicacao);
  }

  @Patch('alterar/:id')
  async alterar(@Req() req:any, @Param('id') id:number, @Body() novosDados: AtualizaPublicacaoDTO) {
    return await this.publicacaoService.editar(req.user.sub, id, novosDados);
  }

  @Get('listar/:aprovada')
  async listar(@Param('aprovada') aprovada: boolean,) {
      return await this.publicacaoService.listar(aprovada);
  }

  @Get('buscar/:parametro')
  async buscar(@Param('parametro') parametro: number) {
    return await this.publicacaoService.buscar(parametro); 
  }

  @Get('buscar-por-texto/:parametro')
  async buscarPorTexto(@Param('parametro') parametro: string) {
    return await this.publicacaoService.buscarPorTexto(parametro); 
  }

  @Delete('deletar/:parametro')
  async deletar(@Req() req:any, @Param('parametro') id:number){
      return await this.publicacaoService.deletar(req.user.sub, Number(id))
  }
}
