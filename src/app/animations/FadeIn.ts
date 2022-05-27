import { animate, state, style, transition, trigger } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),

  transition(':enter', [
    animate(500)
  ])
])
