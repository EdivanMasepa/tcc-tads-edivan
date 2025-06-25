import { forwardRef, Module } from '@nestjs/common';
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
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity, PessoaEntity, PublicacaoEntity, InstituicaoEntity, DenunciaEntity]), forwardRef(() => UsuarioModule)],
  controllers: [PublicacaoController],
  providers: [PublicacaoService, JwtService],
  exports: [PublicacaoService]
})
export class PublicacaoModule {}
