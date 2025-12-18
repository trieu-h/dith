const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();

function grayscaleImage(imageData) {
  data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      const gray = r * 0.3 + g * 0.59 + b * 0.11;
      data[i] = data[i+1] = data[i+2] = gray;
  }

  ctx.putImageData(imageData, 0, 0);
}

function performFloydSteinbergDithering(imageData) {
  data = imageData.data;

  const white = 255;
  const black = 0;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = getIndexAt(x, y);
      let gray = data[i];

      const g2w = gray - white;
      const g2b = gray - black;

      let E;
      if (Math.abs(g2b) < Math.abs(g2w)) {
        gray = 0;
        E = g2b;
      } else {
        gray = 255;
        E = g2w;
      }

      data[i] = data[i+1] = data[i+2] = gray;

      if (x < canvas.width - 1) {
        propagateError(data, getIndexAt(x + 1, y), E/16 * 7);
      }

      if (x > 0 && y < canvas.height - 1) {
        propagateError(data, getIndexAt(x - 1, y + 1), E/16 * 3);
      }

      if (y < canvas.height - 1) {
        propagateError(data, getIndexAt(x, y + 1), E/16 * 5);
      }

      if (x < canvas.width - 1 && y < canvas.height - 1) {
        propagateError(data, getIndexAt(x + 1, y + 1), E/16 * 1);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function propagateError(data, idx, E) {
  let gray = data[idx] + E;
  data[idx] = data[idx+1] = data[idx+2] = gray;
}

function getIndexAt(x, y) {
  return (y * canvas.width + x) * 4;
}

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  grayscaleImage(imageData);
  performFloydSteinbergDithering(imageData);
};
img.src = "./image.webp";

