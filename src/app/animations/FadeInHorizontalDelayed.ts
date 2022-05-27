import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';

export const fadeInHorizontal = trigger('fadeInHorizontal', [
  state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),

  transition(':enter', [
    animate(400)
  ])
])

export const fadeInHorizontal2Seg = trigger('fadeInHorizontal2Seg', [
  state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),

  transition(':enter', [
    animate(2000)
  ])
])

export const fadeInHorizontal3Seg = trigger('fadeInHorizontal3Seg', [
  state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),

  transition(':enter', [
    animate(3000)
  ])
])

export const fadeInHorizontal4Seg = trigger('fadeInHorizontal4Seg', [
  state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),

  transition(':enter', [
    animate(4000)
  ])
])

export const fadeInHorizontal5Seg = trigger('fadeInHorizontal5Seg', [
  state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),

  transition(':enter', [
    animate(5000)
  ])
])

export const fadeInHorizontal6Seg = trigger('fadeInHorizontal6Seg', [
  state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),

  transition(':enter', [
    animate(6000)
  ])
])
