import { Badge } from "./Badge";

export class BadgeQuestions extends Badge
{
  id_insignia: number;
  preguntas_seguidas: number;

  constructor(id_insignia, puntaje_extra, preguntas_seguidas, tipo)
  {
    super(id_insignia, puntaje_extra, tipo);
    this.id_insignia=id_insignia;
    this.preguntas_seguidas=preguntas_seguidas;
  }

  validBadge(actualQuestionFollow: number): number
  {
    return (actualQuestionFollow < this.preguntas_seguidas) ? 0 : this.puntaje_extra;
  }

  getDescription(): string
  {
    return `Preguntas seguidas: ${this.preguntas_seguidas}`;
  }
}
