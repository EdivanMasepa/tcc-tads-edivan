import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PublicacaoService } from './publicacao.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CriaPublicacaoDto } from './dto/criaPublicacao.dto';
import { AtualizaPublicacaoDTO } from './dto/atualizaPublicacao.dto';

@UseGuards(AuthGuard)
@Controller('publicacao')
export class PublicacaoController {
  constructor(private readonly publicacaoService: PublicacaoService) {}

  @Post('/criar')
  async cadastrar(@Req() req:any, @Body() publicacao: CriaPublicacaoDto) {
    return await this.publicacaoService.criarPublicacao(req.user.sub, publicacao);
  }

  @Patch('/atualizar/:id')
  async alterar(@Req() req:any, @Param('id') id:number, @Body() novosDados: AtualizaPublicacaoDTO) {
    return await this.publicacaoService.editarPublicacao(req.user.sub, id, novosDados);
  }

  @Get('/listar')
  async listar() {
      return await this.publicacaoService.listarPublicacoes();
  }

  @Get('/buscar/:parametro')
  async buscar(@Param('parametro') parametro: number) {
    return await this.publicacaoService.buscarPublicacao(parametro); 
  }

  @Get('/buscar-por-texto/:parametro')
  async buscarPorTexto(@Param('parametro') parametro: string) {
    return await this.publicacaoService.buscaAcaoPorTexto(parametro); 
  }

  @Delete('/deletar/:parametro')
  async deletar(@Req() req:any, @Param('parametro') id:number){
      return await this.publicacaoService.deletarAcao(req.user.sub, Number(id))
  }
}
