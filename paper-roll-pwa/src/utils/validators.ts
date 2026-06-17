export function isValidINN(inn: string): boolean {
  if (!/^\d+$/.test(inn)) {
    return false;
  }

  if (inn.length === 10) {
    const coefficients = [2, 4, 10, 3, 5, 9, 4, 6, 8];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(inn[i]) * coefficients[i];
    }
    let check = sum % 11;
    if (check > 9) check = 0;
    return check === parseInt(inn[9]);
  }

  if (inn.length === 12) {
    const coef1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
    let sum1 = 0;
    for (let i = 0; i < 10; i++) {
      sum1 += parseInt(inn[i]) * coef1[i];
    }
    let check1 = sum1 % 11;
    if (check1 > 9) check1 = 0;

    const coef2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
    let sum2 = 0;
    for (let i = 0; i < 11; i++) {
      sum2 += parseInt(inn[i]) * coef2[i];
    }
    let check2 = sum2 % 11;
    if (check2 > 9) check2 = 0;

    return check1 === parseInt(inn[10]) && check2 === parseInt(inn[11]);
  }

  return false;
}