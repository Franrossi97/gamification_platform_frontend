import { BadgeTimer } from './../../../shared/BadgeTimer';
import { BadgeQuestions } from './../../../shared/BadgeQuestion';
import { BadgeDate } from './../../../shared/BadgeDate';
import { BadgeAttempts } from './../../../shared/BadgeAttempts';
import { FormGroup } from '@angular/forms';

export async function generateBadge(fullEditingBadge: BadgeAttempts | BadgeDate | BadgeQuestions | BadgeTimer, editBadgeForm: FormGroup)
  {
    let badgeAux: any=fullEditingBadge;
    console.log(badgeAux);

    badgeAux.puntaje_extra=editBadgeForm.get('extra').value;
    if(fullEditingBadge.tipo_insignia==0)
    {
      badgeAux.preguntas_seguidas=editBadgeForm.get('parameter').value;
    }
    else
    if(fullEditingBadge.tipo_insignia==1)
    {
      badgeAux.tiempo_requerido=editBadgeForm.get('parameter').value;
      badgeAux.por_pregunta=editBadgeForm.get('perQuestion').value;
    }
    else
    if(fullEditingBadge.tipo_insignia==2)
    {
      badgeAux.hasta_dia=editBadgeForm.get('date').value;
    }
    else
    if(fullEditingBadge.tipo_insignia==3)
    {
      badgeAux.intentos_maximos=editBadgeForm.get('parameter').value;
    }

    return badgeAux;
  }
