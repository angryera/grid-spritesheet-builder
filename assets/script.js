const dropZone = document.getElementById("drop-zone");
const gridContainer = document.getElementById("grid-container");
const widthInput = document.getElementById("width-input");
const heightInput = document.getElementById("height-input");
const columnsInput = document.getElementById("columns-input");
const downloadButton = document.getElementById("download-button");

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("hover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("hover");
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("hover");
  dropZone.classList.add("hidden");
  const files = event.dataTransfer.files;
  handleFiles(files);
});

widthInput.addEventListener("input", updateGridLayout);
heightInput.addEventListener("input", updateGridLayout);
columnsInput.addEventListener("input", updateGridLayout);

downloadButton.addEventListener("click", () => {
  domtoimage
    .toPng(gridContainer)
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "grid-container.png";
      link.click();
    })
    .catch((error) => {
      console.error("Error capturing image:", error);
    });
});

function handleFiles(files) {
  Array.from(files).forEach((file) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target.result;
        img.classList.add("grid-item");
        img.style.width = widthInput.value + "px";
        img.style.height = heightInput.value + "px";
        gridContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
  updateGridLayout(); // Apply the current column value automatically
}

function updateGridLayout() {
  const width = widthInput.value;
  const height = heightInput.value;
  const columns = columnsInput.value;

  gridContainer.style.gridTemplateColumns = `repeat(${columns}, ${width}px)`;

  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    item.style.width = width + "px";
    item.style.height = height + "px";
  });
}
