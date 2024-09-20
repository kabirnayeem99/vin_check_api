import { calculateVinCheckDigit } from "./check_digit_calculator";
import { Result } from "./result";

function validateVin(vinParam: string): Result<string> {
  try {
    const vin = vinParam
      .replace(" ", "")
      .replace("\n", "")
      .replace("\t", "")
      .toUpperCase();

    if (vin.length == 0) return Result.error("VIN can't be empty.");
    if (vin.length > 17) {
      return Result.error(
        "VIN length can't be more than 17. Current length is " +
          vin.length +
          ". "
      );
    }
    if (vin.length < 17) {
      return Result.error(
        "VIN length can't be less than 17. Current length is " +
          vin.length +
          ". "
      );
    }

    const validCharacters = /^[A-HJ-NPR-Z0-9]+$/;
    if (!validCharacters.test(vin)) {
      return Result.error(
        "VIN contains invalid characters. Only alphanumeric characters are allowed, which means A-H, J-N, P-R, and 0-9."
      );
    }

    if (vin.includes("O") || vin.includes("Q") || vin.includes("I")) {
      return Result.error("VIN can't include invalid characters, i.e. I, O, Q");
    }

    const currentCheckDigit = vin[8];
    const correctCheckDigit = calculateVinCheckDigit(vin);
    if (correctCheckDigit != "") {
      let isCheckDigitValid = currentCheckDigit === correctCheckDigit;
      if (!isCheckDigitValid) {
        return Result.error(
          "VIN check digit is not valid. Current check digit is " +
            currentCheckDigit +
            ". Valid check digit is " +
            correctCheckDigit +
            "."
        );
      }
    }

    return Result.success(vin);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return Result.error(error.message);
    } else {
      console.error(error);
      return Result.error("Something went wrong.");
    }
  }
}

export default validateVin;
