export const randomDelay = () => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, randomIntBetween(100, 500));
  });
};

export const getWeather = async (zipCode: string) => {
  await randomDelay();

  if (!getWeatherCache[zipCode]) {
    getWeatherCache[zipCode] = randomIntBetween(5, 35);
  } else {
    getWeatherCache[zipCode] += randomIntBetween(-1, 2);
  }

  return getWeatherCache[zipCode];
};

const getWeatherCache: Record<string, number> = {};

export function randomIntBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
