export class AuthRequiredError extends Error {
  constructor(message = "Authentication Required to access this resource") {
    super(message);
    this.name = "AuthRequiredError";
  }
}
