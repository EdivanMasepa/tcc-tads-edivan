import { PartialType } from '@nestjs/mapped-types';
import { CriaUsuarioDto } from './criaUsuario.dto';

export class UpdateUsuarioDTO extends PartialType(CriaUsuarioDto) {}
