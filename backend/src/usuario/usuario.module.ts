import { Module, forwardRef } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PessoaEntity } from './entities/pessoa.entity'
import { ServicoEntity } from './entities/servico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { InstituicaoEntity } from './entities/instituicao.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PessoaEntity, ServicoEntity, InstituicaoEntity])],
  controllers: [UsuarioController],
  providers: [UsuarioService, JwtService],
})
export class UsuarioModule {}
