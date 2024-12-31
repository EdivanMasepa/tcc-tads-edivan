import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AcaoService } from './acao.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CriaAcaoDto } from './dto/criaAcao.dto';
import { AtualizaAcaoDTO } from './dto/atualizaAcao.dto';

@UseGuards(AuthGuard)
@Controller('acao')
export class AcaoController {
  constructor(private readonly acaoService: AcaoService) {}

  @Post('/criar-acao')
  async cadastrarAcao(@Req() req:any, @Body() acao: CriaAcaoDto) {
    return await this.acaoService.criarAcao(req.user.sub, acao);
  }

  @Patch('/atualizar-acao/:idAcao')
  async alterarAcao(@Req() req:any, @Param('idAcao') idAcao:number, @Body() novosDados: AtualizaAcaoDTO) {
    return await this.acaoService.editarAcao(req.user.sub, idAcao, novosDados);
  }

  @Get('/acoes')
  async listarAcoes() {
      return await this.acaoService.listarAcoes();
  }

  @Get('/buscar-acao/:parametro')
  async buscarAcao(@Param('parametro') parametro: number) {
    return await this.acaoService.buscarAcao(parametro); 
  }

  @Get('/buscar-acao-por-texto/:parametro')
  async buscarAcaoPorTexto(@Param('parametro') parametro: string) {
    return await this.acaoService.buscaAcaoPorTexto(parametro); 
  }

  @Delete('/deletar-acao/:parametro')
  async removerAcao(@Req() req:any, @Param('parametro') idAcao:number){
      return await this.acaoService.deletarAcao(req.user.sub, Number(idAcao))
  }
}
