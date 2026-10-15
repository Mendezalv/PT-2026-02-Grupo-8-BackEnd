export class UnauthorizedError extends Error {
  constructor(message = 'Acesso nao autorizado.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
