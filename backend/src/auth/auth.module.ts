import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaEntity } from 'src/usuario/entities/pessoa.entity';
import { ServicoEntity } from 'src/usuario/entities/servico.entity';
import { InstituicaoEntity } from 'src/usuario/entities/instituicao.entity';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';

@Module({
  imports:[PassportModule, UsuarioModule, ConfigModule.forRoot(), JwtModule.register({
    privateKey: process.env.JWT_SECRET,
    secret: process.env.JWT_SECRET,
    signOptions:{expiresIn:'50000s'}}),
    TypeOrmModule.forFeature([UsuarioEntity, PessoaEntity, ServicoEntity, InstituicaoEntity])],
  controllers: [AuthController],
  providers: [AuthService, UsuarioService],
})
export class AuthModule {}
