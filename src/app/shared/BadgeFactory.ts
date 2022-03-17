import { BadgeTimer } from './BadgeTimer';
import { BadgeQuestions } from './BadgeQuestion';
import { BadgeDate } from './BadgeDate';
import { BadgeAttempts } from "./BadgeAttempts";

export class BadgeFactory {

  constructor(){}

  static getBadge(badge)
  {
    switch(badge.tipo_insignia)
    {
      case 0:
      {
        return new BadgeQuestions(badge.id_insignia,
          badge.puntaje_extra, badge.preguntas_seguidas, 0);
      }
      break;
      case 1:
      {
        return new BadgeTimer(badge.id_insignia,
          badge.puntaje_extra, badge.tiempo_requerido,
          badge.por_pregunta, 1);
      }
      break;
      case 2:
      {
        return new BadgeDate(badge.id_insignia,
          badge.puntaje_extra, badge.hasta_dia, 3);
      }
      break;
      case 3:
      {
        return new BadgeAttempts(badge.id_insignia,
          badge.puntaje_extra, badge.intentos_maximos, 3);
      }
      break;
    }

    //return null;
  }
}
