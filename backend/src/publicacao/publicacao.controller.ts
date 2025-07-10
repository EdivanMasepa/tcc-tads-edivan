import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseBoolPipe } from '@nestjs/common';
import { PublicacaoService } from './publicacao.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CriaPublicacaoDTO } from './dto/criaPublicacao.dto';
import { AtualizaPublicacaoDTO } from './dto/atualizaPublicacao.dto';
import { AvaliaPublicacaoDTO } from './dto/avaliaPublicacao.dto';
import { CategoriaPublicacaoEnum } from './enum/categoriaPublicacao.enum';

@UseGuards(AuthGuard)
@Controller('publicacao')
export class PublicacaoController {
  constructor(
    private readonly publicacaoService: PublicacaoService
  ) {}

  @Post('cadastrar')
  async cadastrar(@Req() req:any, @Body() publicacao: CriaPublicacaoDTO) {
    return await this.publicacaoService.criar(req.user.sub, publicacao);
  }

  @Patch('alterar/:id')
  async alterar(@Req() req:any, @Param('id') id:number, @Body() novosDados: AtualizaPublicacaoDTO) {
    return await this.publicacaoService.editar(req.user.sub, id, novosDados);
  }

  @Patch('avaliar')
  async avaliar(@Req() req:any, @Param('id') id:number, @Body() avaliacao: AvaliaPublicacaoDTO) {
    return await this.publicacaoService.avaliar(avaliacao, req.user.sub);
  }

  @Get('listar')
  async listar(@Query('aprovada', ParseBoolPipe) aprovada: boolean,
               @Query('opcao') opcao: CategoriaPublicacaoEnum | string) {
      return await this.publicacaoService.listar(aprovada, opcao);
  }

  @Get('buscar/:parametro')
  async buscar(@Param('parametro') parametro: number) {
    return await this.publicacaoService.buscar(parametro); 
  }

  @Delete('deletar/:parametro')
  async deletar(@Req() req:any, @Param('parametro') id:number){
      return await this.publicacaoService.deletar(req.user.sub, Number(id))
  }
}
