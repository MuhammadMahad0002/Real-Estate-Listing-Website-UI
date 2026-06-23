import { PROPERTIES, Property } from "../data/data";

export function fetchProperties(): Promise<Property[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...PROPERTIES]);
    }, 600);
  });
}
