const { FLOAT, INT, UNSIGNED_INT, UNSIGNED_SHORT, UNSIGNED_BYTE } =
  WebGL2RenderingContext;

type GLNumberTypes =
  | typeof FLOAT
  | typeof INT
  | typeof UNSIGNED_INT
  | typeof UNSIGNED_SHORT
  | typeof UNSIGNED_BYTE;

type VertexBufferElement = {
  type: GLNumberTypes;
  count: number;
  normilized: boolean;
  attributeName: string;
};

class VertexBufferLayout {
  private stride: number = 0;
  private elements: VertexBufferElement[] = [];

  constructor() {}

  static createElement(
    type: VertexBufferElement["type"],
    count: VertexBufferElement["count"],
    normilized: VertexBufferElement["normilized"],
    attributeName: VertexBufferElement["attributeName"]
  ): VertexBufferElement {
    return {
      type,
      count,
      normilized,
      attributeName,
    };
  }

  getElementSizeByType(type: VertexBufferElement["type"]) {
    switch (type) {
      case FLOAT: {
        return 4;
      }
      case INT: {
        return 4;
      }
      case UNSIGNED_INT: {
        return 4;
      }
      case UNSIGNED_SHORT: {
        return 2;
      }
      case UNSIGNED_BYTE: {
        return 1;
      }
      default: {
        throw `Cant get element size: Not valid buffer element type`;
      }
    }
  }

  add(element: VertexBufferElement) {
    this.stride += this.getElementSizeByType(element.type) * element.count;
    this.elements.push(element);
  }

  getElements() {
    return this.elements;
  }

  getStride() {
    return this.stride;
  }
}

export default VertexBufferLayout;
