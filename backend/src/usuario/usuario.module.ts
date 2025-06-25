import { Module, forwardRef } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PessoaEntity } from './entities/pessoa.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { InstituicaoEntity } from './entities/instituicao.entity';
import { UsuarioEntity } from './entities/usuario.entity';
import { PublicacaoEntity } from '../publicacao/entities/publicacao.entity';
import { DenunciaEntity } from '../denuncia/entities/denuncia.entity';
import { PublicacaoModule } from '../publicacao/publicacao.module';
import { PublicacaoService } from '../publicacao/publicacao.service';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity, PessoaEntity, PublicacaoEntity, InstituicaoEntity, DenunciaEntity]), forwardRef(() => PublicacaoModule)],
  controllers: [UsuarioController],
  providers: [UsuarioService, JwtService],
  exports: [UsuarioService]
})
export class UsuarioModule {}
