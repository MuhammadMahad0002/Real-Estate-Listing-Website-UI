import { PROPERTIES, Property } from "../components/data";

export function fetchProperties(): Promise<Property[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...PROPERTIES]);
    }, 600);
  });
}
