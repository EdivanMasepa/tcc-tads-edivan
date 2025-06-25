import { Module } from '@nestjs/common';
import { DenunciaService } from './denuncia.service';
import { DenunciaController } from './denuncia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/entities/usuario.entity';
import { PublicacaoEntity } from '../publicacao/entities/publicacao.entity';
import { DenunciaEntity } from './entities/denuncia.entity';
import { InstituicaoEntity } from '../usuario/entities/instituicao.entity';
import { PessoaEntity } from '../usuario/entities/pessoa.entity';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { PublicacaoService } from '../publicacao/publicacao.service';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity, PessoaEntity, PublicacaoEntity, InstituicaoEntity, DenunciaEntity])],
  controllers: [DenunciaController],
  providers: [DenunciaService, UsuarioService, JwtService, PublicacaoService],
})
export class DenunciaModule {}
