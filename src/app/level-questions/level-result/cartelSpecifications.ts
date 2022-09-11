export const cartelSpecifications=new Map<number, {img:string, message: string}>();

cartelSpecifications.set(0, {
  img: "../../../assets/img/result_background/stars0.png",
  message: 'MAL',
});

cartelSpecifications.set(1, {
  img: "../../../assets/img/result_background/stars1.png",
  message: 'REGULAR',
});

cartelSpecifications.set(2, {
  img: "../../../assets/img/result_background/stars2.png",
  message: 'MUY BIEN',
});

cartelSpecifications.set(3, {
  img: "../../../assets/img/result_background/stars3.png",
  message: 'EXCELENTE',
});

interface infoToShow
{
  img: string,
  message: string,
}
