import { calculateVinCheckDigit } from "./check_digit_calculator";
import { Result } from "./result";

export function generateVin(): Result<string> {
  try {
    let vin = "";

    for (let i = 0; i < 8; i++) {
      vin += getRandomCharacter();
    }
    vin += "X";

    for (let i = 0; i < 7; i++) {
      vin += getRandomCharacter();
    }
    const checkDigit = calculateVinCheckDigit(vin);
    if (checkDigit != "") {
      vin = vin.slice(0, 8) + checkDigit + vin.slice(9);
    }
    vin += getRandomCharacter();
    return Result.success(vin);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return Result.error(error.message);
    } else {
      return Result.error("Unknown error. " + error);
    }
  }
}

function getRandomCharacter(): string {
  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}
