import { Module } from '@nestjs/common';
import { PublicacaoService } from './publicacao.service';
import { PublicacaoController } from './publicacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { PessoaEntity } from 'src/usuario/entities/pessoa.entity';
import { InstituicaoEntity } from 'src/usuario/entities/instituicao.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { PublicacaoEntity } from './entities/publicacao.entity';
import { DenunciaEntity } from '../denuncia/entities/denuncia.entity';

@Module({
  imports:[TypeOrmModule.forFeature([
    UsuarioEntity, 
    PessoaEntity, 
    PublicacaoEntity, 
    InstituicaoEntity, 
    DenunciaEntity
  ])],
  controllers: [PublicacaoController],
  providers: [PublicacaoService, UsuarioService, JwtService],
})
export class PublicacaoModule {}
