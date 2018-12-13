class Carder {
  constructor(file) {
    this.file = file;
  }

  createStream() {
    const reader = new FileReader();
    const ext = this.file.name.substring(this.file.name.lastIndexOf('.') + 1).toLowerCase();
    if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
      alert('图片的格式必须是png或jpg或jpeg格式！');
      return;
    }
    reader.onload = (e) => {
      const src = e.target ? e.target.result : '';
      const img = new Image();
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        this.fitch(w, h, img);
      }
      img.src = src;
    };
    reader.readAsDataURL(this.file);
  }

  fitch(width, height, img) {
    let dataUrl = '';
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const tl = Array.prototype.slice.call(ctx.getImageData(0, 0, 1, 1).data).join(',');
    const tr = Array.prototype.slice.call(ctx.getImageData(width - 1, 0, 1, 1).data).join(',');
    const bl = Array.prototype.slice.call(ctx.getImageData(0, height - 1, 1, 1).data).join(',');
    const br = Array.prototype.slice.call(ctx.getImageData(width - 1, height - 1, 1, 1).data).join(',');
    const imgData = [tl, tr, bl, br]; // 取点颜色

    // 需要被抠出的颜色
    let removeColor = [];
    imgData.sort();
    // 根据四个角的颜色，判断如果颜色相似度在10度以内，即为扣除这些颜色
    if (this.unique(imgData).length <= 1) {
      removeColor = imgData[0].split(',');
      let isPNG = true;
      const imgDataUrl = ctx.getImageData(0, 0, width, height); // 获取图片所有的像素点
      let data = imgDataUrl.data;
      for (let i = 0; i < data.length; i += 4) {
        // 获取rgba四个值，分别对应data的数组下标0， 1， 2， 3依次类推
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const isIn = (numerical, index) => {
          if (removeColor[3] === 0) {
            isPNG = false;
            return isPNG;
          }
          return numerical === parseInt(removeColor[index]); // 判断如果r,g,b对应的值和需要排除的颜色相同，将该像素的透明度设为0
        }

        if ([r, g, b].every(isIn)) {
          data[i + 3] = 0;
        }
      }

      // 将修改后的代码复制到画布中
      ctx.putImageData(imgDataUrl, 0, 0);
      dataUrl = c.toDataURL('image/png');
      if (isPNG) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'test.png';
        a.click();
      }
    } else {
      alert('只支持纯色背景抠图');
    }
  }

  unique(arr) {
    const res = [];
    const json = {};
    arr.forEach((item, i) => {
      if (!json[item]) {
        res.push(item);
        json[item] = true;
      }
    });
    return res;
  }
}

window.Carder = Carder;
