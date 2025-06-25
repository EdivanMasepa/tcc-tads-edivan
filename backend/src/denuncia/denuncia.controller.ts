import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DenunciaService } from './denuncia.service';
import { CriaDenunciaDTO } from './dto/criaDenuncia.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { BuscaDenunciaDTO } from './dto/buscaDenuncia.dto';

@UseGuards(AuthGuard)
@Controller('denuncia')
export class DenunciaController {
  constructor(private readonly denunciaService: DenunciaService) {}

  @Post('criar')
  async cadastrar(@Body() dadosDenuncia: CriaDenunciaDTO) {
    return this.denunciaService.criar(dadosDenuncia);
  }
  @Get('listar')
  async listar() {
    return this.denunciaService.listar();
  }

  @Get('buscar')
  async buscar(@Body('params') params: BuscaDenunciaDTO) {
    return this.denunciaService.buscar(params);
  }

}
