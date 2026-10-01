import type { DataProvider } from './DataProvider';
import { StaticDataProvider } from './StaticDataProvider';

export * from './DataProvider';
export * from './StaticDataProvider';
export * from './MockDataProvider';
export * from './APIDataProvider';

let currentProvider: DataProvider = new StaticDataProvider();

export function getDataProvider(): DataProvider {
  return currentProvider;
}

export function setDataProvider(provider: DataProvider): void {
  currentProvider = provider;
}
