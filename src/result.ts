export class Result<D> {
  private constructor(
    private readonly value?: D,
    private readonly error?: string
  ) {}

  static success<D>(value: D): Result<D> {
    return new Result<D>(value, undefined);
  }

  static error<D>(error: string): Result<D> {
    return new Result<D>(undefined, error);
  }

  isSuccess(): boolean {
    return this.error == undefined;
  }

  isFailure(): boolean {
    return this.value == undefined;
  }

  getValue(): D {
    if (this.isFailure()) {
      throw new Error("Cannot get value from a failed result.");
    }
    if (this.value != undefined) return this.value;
    else throw new Error("Cannot get value from a failed result.");
  }

  getError(): string {
    return this.error || "";
  }
}
