function capitalizeFirstLetter(electrate: string) {
  return electrate.charAt(0).toUpperCase() + electrate.slice(1).toLowerCase();
}

function capitalizeEachWord(input: string): string {
  const words = input.split(" ");

  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  });

  return capitalizedWords.join(" ");
}

export { capitalizeFirstLetter, capitalizeEachWord };
