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
  const sortedFiles = Array.from(files).sort((file1, file2) =>
    file1.name.localeCompare(file2.name)
  ); // Correct sorting

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement("img");
          img.src = event.target.result;
          img.classList.add("grid-item");
          img.style.width = widthInput.value + "px";
          img.style.height = heightInput.value + "px";
          gridContainer.appendChild(img);
          resolve(); // Resolve when the image is added
        };
        reader.onerror = (error) => reject(error); // Reject in case of an error
        reader.readAsDataURL(file);
      } else {
        resolve(); // Resolve immediately for non-image files
      }
    });
  };

  const processFilesSequentially = async () => {
    for (const file of sortedFiles) {
      try {
        await processFile(file); // Wait for each file to finish before moving to the next
      } catch (error) {
        console.error("Error processing file:", file.name, error);
      }
    }
    updateGridLayout(); // Apply the current column value automatically after all files are processed
  };

  processFilesSequentially(); // Start processing files in sequence
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
