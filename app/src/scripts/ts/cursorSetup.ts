import gsap from "gsap";

export const cursorSetup = (speed: number): void => {
  const cursor = Array.from(
    document.getElementsByClassName("cursor") as HTMLCollectionOf<HTMLElement>
  )[0];

  let mouseX = 0;
  let mouseY = 0;

  let cursorX = 0;
  let cursorY = 0;
  const animateCursor = (): void => {
    const distX = mouseX - cursorX;
    const distY = mouseY - cursorY;

    cursorX = cursorX + distX * speed;
    cursorY = cursorY + distY * speed;

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";

    requestAnimationFrame(animateCursor);
  };

  animateCursor();

  document.addEventListener("mousemove", (e) => {
    cursor.classList.add("fadeIn");

    mouseX = e.pageX - 25;
    mouseY = e.clientY - 125;
  });

  $("body").on("mouseover", ".hoverable, a", (e) => {
    cursor.classList.add("hovered");
    gsap.to(".cursor", {
      scale: 0.8,
      duration: 0.6,
    });
  });

  $("body").on("mouseleave", ".hoverable, a", (e) => {
    cursor.classList.remove("hovered");
    gsap.to(".cursor", {
      scale: 1,
      duration: 0.6,
    });
  });
};
