import { Module, forwardRef } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PessoaEntity } from './entities/pessoa.entity'
import { AcaoEntity } from '../acao/entities/acao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { InstituicaoEntity } from './entities/instituicao.entity';
import { UsuarioEntity } from './entities/usuario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity, PessoaEntity, AcaoEntity, InstituicaoEntity])],
  controllers: [UsuarioController],
  providers: [UsuarioService, JwtService],
})
export class UsuarioModule {}
