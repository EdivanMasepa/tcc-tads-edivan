import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DenunciaService } from './denuncia.service';
import { CriaDenunciaDTO } from './dto/criaDenuncia.dto';
import { ListaDenunciasDTO } from './dto/listaDenuncias.dto';

@Controller('denuncia')
export class DenunciaController {
  constructor(private readonly denunciaService: DenunciaService) {}

  @Post('cadastrar')
  async cadastrar(@Body() createDenunciaDto: CriaDenunciaDTO) {
    return this.denunciaService.criar(createDenunciaDto);
  }

  @Patch('alterar/:id')
  async alterar(@Param('id') id: string, @Body() updateDenunciaDto: ListaDenunciasDTO) {
    return this.denunciaService.alterar(+id, updateDenunciaDto);
  }

  @Get('listar')
  async listar() {
    return this.denunciaService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id') id: string) {
    return this.denunciaService.buscar(+id);
  }

  @Delete('deletar/:id')
  async deletar(@Param('id') id: string) {
    return this.denunciaService.deletar(+id);
  }
}
