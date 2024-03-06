import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioEntity } from './entities/usuario.entity'
import { ServicoEntity } from './entities/servico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity, ServicoEntity])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
