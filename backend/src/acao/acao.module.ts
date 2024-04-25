import { Module } from '@nestjs/common';
import { AcaoService } from './acao.service';
import { AcaoController } from './acao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { PessoaEntity } from 'src/usuario/entities/pessoa.entity';
import { AcaoEntity } from 'src/acao/entities/acao.entity';
import { InstituicaoEntity } from 'src/usuario/entities/instituicao.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity, PessoaEntity, AcaoEntity, InstituicaoEntity])],
  controllers: [AcaoController],
  providers: [AcaoService, UsuarioService, JwtService],
})
export class AcaoModule {}
