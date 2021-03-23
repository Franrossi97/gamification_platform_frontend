export class Option
{
  texto: string;
  porcentaje_puntaje: number;
  id_pregunta: number;

  constructor(texto, porcentaje_puntaje, id_pregunta)
  {
    this.texto=texto;
    this.porcentaje_puntaje=porcentaje_puntaje;
    this.id_pregunta=id_pregunta;
  }
}
