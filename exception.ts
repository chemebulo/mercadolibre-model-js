export class UserException extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'UserException';
  }
}

export class ProductException extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ProductException';
  }
}

export class CategoryException extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'CategoryException';
  }
}

export class PurchaseException extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'PurchaseException';
  }
}

export class QuestionException extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'QuestionException';
  }
}