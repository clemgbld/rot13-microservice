const isNotALetter = (letter: string): boolean => !/[a-z]|[A-Z]/.test(letter);

const rot13CodeCalc = (letter: string): number => {
  const code = letter.charCodeAt(0);
  const codeRot13 = letter.toLowerCase() > "m" ? code - 13 : code + 13;
  return codeRot13;
};

const rot13Conversion = (letter: string): string =>
  isNotALetter(letter) ? letter : String.fromCharCode(rot13CodeCalc(letter));

export const rot13 = (str: string): string =>
  str
    .split("")
    .map((l) => rot13Conversion(l))
    .join("");
