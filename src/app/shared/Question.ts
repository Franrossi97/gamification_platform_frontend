import { Option } from "./Option";
import { User } from "./User";

export class Question
{
  id_pregunta:number;
  texto: string;
  dificil: boolean;
  tipo_pregunta: number;
  //porcentaje_pregunta: number;
  user: User;
  tiempo: number;
  recompensa: number;
  id_nivel: number;
  opciones: Option[];

  constructor(id_pregunta, texto, dificil, tipo_pregunta, user, time, reward, id_nivel, opciones)
  {
    this.id_pregunta=id_pregunta;
    this.texto=texto;
    this.dificil=dificil;
    this.tipo_pregunta=tipo_pregunta;
    //this.porcentaje_pregunta=porcentaje_pregunta;
    this.user=user;
    this.tiempo=time;
    this.recompensa=reward;
    this.id_nivel=id_nivel;
    this.opciones=opciones;
  }
}
