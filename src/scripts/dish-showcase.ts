/** Slika iznad mreže prati odabrano jelo: mišem, tipkovnicom ili dodirom. */
function initDishShowcase(stage: HTMLElement) {
  const images = [...stage.querySelectorAll('img')];
  const cells = [...document.querySelectorAll<HTMLElement>('[data-dish]')];

  const show = (selected: number) => {
    images.forEach((image, index) => image.classList.toggle('is-active', index === selected));
    cells.forEach((cell, index) => cell.classList.toggle('is-active', index === selected));
  };

  cells.forEach((cell, index) => {
    cell.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') show(index);
    });
    cell.addEventListener('focusin', () => show(index));
    cell.addEventListener('click', () => show(index));
  });
}

const stage = document.querySelector<HTMLElement>('[data-dish-stage]');
if (stage) initDishShowcase(stage);
