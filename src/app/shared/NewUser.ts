export class NewUser
{
  nombre: string;
  apellido: string;
  matricula: string;
  mail: string;
  password: string;
  //tipo_usuario: number;

  constructor(nombre, apellido, matricula, mail, password)//, tipo_usuario)
  {
    this.nombre=nombre;
    this.apellido=apellido;
    this.matricula=matricula;
    this.mail=mail;
    this.password=password;
    //this.tipo_usuario=tipo_usuario;
  }
}
