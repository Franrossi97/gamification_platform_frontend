import { animate, state, style, transition, trigger } from '@angular/animations';

export const fadeInVertical2Seg = trigger('fadeInVertical2Seg', [
  state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),

  transition(':enter', [
    animate(2000)
  ])
])

export const fadeInVertical3Seg = trigger('fadeInVertical3Seg', [
  state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),

  transition(':enter', [
    animate(3000)
  ])
])

export const fadeInVertical4Seg = trigger('fadeInVertical4Seg', [
  state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),

  transition(':enter', [
    animate(4000)
  ])
])

export const fadeInVertical5Seg = trigger('fadeInVertical5Seg', [
  state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),

  transition(':enter', [
    animate(5000)
  ])
])

export const fadeInVertical6Seg = trigger('fadeInVertical6Seg', [
  state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),

  transition(':enter', [
    animate(6000)
  ])
])
