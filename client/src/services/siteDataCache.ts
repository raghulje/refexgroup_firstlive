import { footerService, globalSettingsService, navigationService, socialLinksService } from './apiService';

const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry<T> = {
  ts: number;
  promise: Promise<T>;
};

let navigationCache: CacheEntry<any[]> | null = null;
let footerCache: CacheEntry<any[]> | null = null;
let socialCache: CacheEntry<any[]> | null = null;
let globalSettingsCache: CacheEntry<any> | null = null;

const isFresh = (entry: CacheEntry<unknown> | null): boolean => {
  return !!entry && (Date.now() - entry.ts) < CACHE_TTL_MS;
};

export const getCachedNavigation = (): Promise<any[]> => {
  if (isFresh(navigationCache)) return navigationCache!.promise;
  const promise = navigationService.getByLocation('header');
  navigationCache = { ts: Date.now(), promise };
  return promise;
};

export const getCachedFooterSections = (): Promise<any[]> => {
  if (isFresh(footerCache)) return footerCache!.promise;
  const promise = footerService.getAll();
  footerCache = { ts: Date.now(), promise };
  return promise;
};

export const getCachedSocialLinks = (): Promise<any[]> => {
  if (isFresh(socialCache)) return socialCache!.promise;
  const promise = socialLinksService.getAll();
  socialCache = { ts: Date.now(), promise };
  return promise;
};

export const getCachedGlobalSettings = (): Promise<any> => {
  if (isFresh(globalSettingsCache)) return globalSettingsCache!.promise;
  const promise = globalSettingsService.getAll();
  globalSettingsCache = { ts: Date.now(), promise };
  return promise;
};

export const invalidateSiteDataCache = (): void => {
  navigationCache = null;
  footerCache = null;
  socialCache = null;
  globalSettingsCache = null;
};

