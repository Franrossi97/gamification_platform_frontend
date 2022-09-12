import { Badge } from '../shared/Badge';
import { BadgeAttempts } from './../shared/BadgeAttempts';
import { BadgeTimer } from './../shared/BadgeTimer';
import { BadgeQuestions } from "../shared/BadgeQuestion";
import { BadgeDate } from '../shared/BadgeDate';

export class BadgeFactory
{
  static badgeGenerator(tipo: number, puntajeXtra: number, extraOptions: any): Badge
  {
    let newBadge: Badge=null;
    if(tipo==0)
    {
      newBadge= new BadgeQuestions(null, puntajeXtra, extraOptions.preguntas_seguidas, tipo);
    }
    else
    if(tipo==1)
    {
      newBadge= new BadgeTimer(null, puntajeXtra, extraOptions.tiempo_requerido, extraOptions.por_pregunta, tipo);
    }
    else
    if(tipo==2)
    {
      newBadge= new BadgeDate(null, puntajeXtra, extraOptions.limitDate, tipo);
    }
    else
    if(tipo==3)
    {
      newBadge= new BadgeAttempts(null, puntajeXtra, extraOptions.maxAttempts, tipo);
    }

    return newBadge;
  }
}
