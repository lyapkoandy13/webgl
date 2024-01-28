// function isPowerOf2(n: number): boolean {
//   if (n == 0) return false;

//   return Math.ceil(Math.log2(n)) == Math.floor(Math.log2(n));
// }

class Texture {
  private texture: WebGLTexture;
  private slot: number = -1;

  constructor(
    private gl: WebGL2RenderingContext,
    imageUrl: string = "textures/crate.png"
  ) {
    const texture = gl.createTexture();
    if (!texture) {
      throw `Could not crete texture`;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 0, 255, 255]); // opaque blue
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );

    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      );

      // WebGL1 has different requirements for power of 2 images
      // vs. non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      //   if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      //     gl.generateMipmap(gl.TEXTURE_2D);
      //   } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    // };
    image.src = imageUrl;

    // TODO?: free buffer?
    this.texture = texture;
  }

  getTexture() {
    return this.texture;
  }

  // TODO: check bitwise stuff
  bind(slot?: number) {
    this.gl.activeTexture(this.gl.TEXTURE0 + (slot || 0));
    this.slot = this.gl.TEXTURE0 + (slot || 0);
  }

  unbind() {
    //TODO
  }

  getSlot(absolute?: boolean) {
    return absolute ? this.slot : this.slot - this.gl.TEXTURE0;
  }
}

export default Texture;
