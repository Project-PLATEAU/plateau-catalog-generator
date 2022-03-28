interface Token {
  depth: number;
}

export interface Node<T extends Token> {
  token: T;
  children: Node<T>[];
}

export default class TreeBuilder<T extends Token> {
  private pos = 0;
  constructor(private tokens: readonly T[]) {}
  private read() {
    const token = this.tokens[this.pos];
    this.pos += 1;
    return token;
  }
  private peak() {
    return this.tokens[this.pos];
  }
  processNode(): Node<T> {
    const token = this.read();
    const children: Node<T>[] = [];
    while (this.peak() && this.peak().depth > token.depth) {
      children.push(this.processNode());
    }
    return { token, children };
  }
}
