import { Module, forwardRef } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioEntity } from './entities/usuario.entity'
import { ServicoEntity } from './entities/servico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity, ServicoEntity])],
  controllers: [UsuarioController],
  providers: [UsuarioService, JwtService, JwtStrategy],
})
export class UsuarioModule {}
