class Magic {
  constructor(file) {
    this.file = file;
  }

  createStream() {
    const reader = new FileReader();
    const ext = this.file.name.substring(this.file.name.lastIndexOf('.') + 1).toLowerCase();
    if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
      wx.showToast({
        title: '图片的格式必须是png或jpg或jpeg格式！',
        icon: 'none',
        duration: 1000,
      });
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
    
  }
}