let diff = 0;
let isAnimating = false;

function startDrag({ target, pageX, touches }) {
  if (isAnimating) return;

  const $article = target.closest("article");
  if (!$article) return;

  const startX = pageX ?? touches[0].pageX;

  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: true });

  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd, { passive: true });

  function onMove(event) {
    const currentX = event.pageX ?? event.touches[0].pageX;

    diff = currentX - startX;
    if (diff === 0) return;

    isAnimating = true;

    const rads = (diff / 25) * (Math.PI / 180);

    $article.style.transform = `translateX(${diff}px) rotate(${rads}rad)`;
    $article.style.cursor = "grabbing";

    const isLeft = diff < 0;
    const opacity = Math.abs(diff) / 120;
    const $message = $article.querySelector(isLeft ? ".nope" : ".like");

    $message.style.opacity = opacity;
  }

  function onEnd() {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    document.removeEventListener("touchmove", onMove, { passive: true });
    document.removeEventListener("touchend", onEnd, { passive: true });

    const $message = $article.querySelector(".message");
    const decisionMade = Math.abs(diff) >= 75;

    if (decisionMade) {
      const isLeft = diff < 0;

      $article.classList.add(isLeft ? "go-left" : "go-right");
      $article.addEventListener("transitionend", () => {
        $article.remove();
      });
    } else {
      $article.classList.add("reset");
      $article.classList.remove("go-left", "go-right");
      $message.style.opacity = 0;
    }

    $article.addEventListener("transitionend", () => {
      $article.removeAttribute("style");
      $article.classList.remove("reset");

      diff = 0;
      isAnimating = false;
    });
  }
}

document.addEventListener("mousedown", startDrag);
document.addEventListener("touchstart", startDrag, { passive: true });
