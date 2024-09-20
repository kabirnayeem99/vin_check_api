export function calculateVinCheckDigit(vin: string): string {
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  const valueMap: { [key: string]: number } = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    P: 7,
    R: 9,
    S: 2,
    T: 3,
    U: 4,
    V: 5,
    W: 6,
    X: 7,
    Y: 8,
    Z: 9,
  };

  let weightedSum = 0;

  console.log("VIN Length: " + vin.length);

  for (let i = 0; i < vin.length; i++) {
    console.log("\n");
    console.log("Index: " + i);
    const char = vin[i];
    console.info("Character " + char);
    const value = valueMap[char.toUpperCase()];
    console.info("Value " + value);
    if (value === undefined) {
      console.error(`Invalid character in VIN: ${char}`);
      continue;
    }
    const weight = weights[i];
    console.info("Weight " + weight);
    if (weight == undefined) continue;

    if (!Number.isNaN(weight)) {
      weightedSum += value * weight;
      console.info("Weighted Sum " + weightedSum);
    }

    console.log("\n");
  }

  const checkDigit = weightedSum % 11;
  if (Number.isNaN(checkDigit)) {
    console.error(
      "Failed to check digit for vin. Weighted Sum was " + weightedSum
    );
    return "";
  }

  return checkDigit === 10 ? "X" : checkDigit.toString();
}
