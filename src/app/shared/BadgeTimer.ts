import { Badge } from "./Badge";

export class BadgeTimer extends Badge
{
  id_insignia: number;
  tiempo_requerido: number;
  por_pregunta: boolean;

  constructor(id_insignia, puntaje_extra, requiredTime: number,
    perQuestion: boolean, tipo)
  {
    super(id_insignia, puntaje_extra, tipo);
    this.id_insignia=id_insignia;
    this.tiempo_requerido=requiredTime;
    this.por_pregunta=perQuestion;
  }

  validBadge(validParams: number[]): number
  {
    let realRequiredTime: number=this.tiempo_requerido;
    if(this.por_pregunta)
    {
      realRequiredTime*=validParams[1];
    }

    return (realRequiredTime < validParams[0]) ? 0 : this.puntaje_extra;
  }

  getDescription(): string
  {
    let res: string;

    if(this.por_pregunta)
    {
      res=`Tiempo requerido: ${this.tiempo_requerido} segundos por pregunta`;
    }
    else
    {
      res=`Tiempo requerido: ${this.tiempo_requerido} segundos`;
    }

    return res;
  }
}
/*
export interface params
{
  usedTime: number;
  countQuestions: number;
}*/
