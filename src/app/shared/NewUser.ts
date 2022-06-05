export class NewUser
{
  nombre: string;
  apellido: string;
  matricula: string;
  mail: string;
  password: string;
  perfil: number;
  externo: boolean;
  //tipo_usuario: number;

  constructor(nombre, apellido, matricula, mail, password, externo: boolean, profile)//, tipo_usuario)
  {
    this.nombre=nombre;
    this.apellido=apellido;
    this.matricula=matricula;
    this.mail=mail;
    this.password=password;
    this.perfil=profile;
    this.externo= externo;
  }
}
