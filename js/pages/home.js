window.FENW = window.FENW || {};

document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("heroColors");

  if (!container) {
    return;
  }

  const apiClient = new FENW.ApiClient();

  try {
    const colors = await apiClient.getColors();
    renderHeroColors(container, colors);
  } catch (error) {
    renderHeroColors(container, new FENW.Game().colors);
  }
});

function renderHeroColors(container, colors) {
  container.innerHTML = "";

  colors.forEach((color) => {
    const dot = document.createElement("span");
    dot.className = "hero__color";
    dot.style.background = color.name;
    container.appendChild(dot);
  });
}
