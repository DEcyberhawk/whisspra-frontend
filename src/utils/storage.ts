import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const isNative = Capacitor.isNativePlatform();

export const setStorageItem = async (key: string, value: string): Promise<void> => {
  if (isNative) {
    await Preferences.set({ key, value });
  } else {
    localStorage.setItem(key, value);
  }
};

export const getStorageItem = async (key: string): Promise<string | null> => {
  if (isNative) {
    const { value } = await Preferences.get({ key });
    return value;
  } else {
    return localStorage.getItem(key);
  }
};

export const removeStorageItem = async (key: string): Promise<void> => {
    if (isNative) {
        await Preferences.remove({ key });
    } else {
        localStorage.removeItem(key);
    }
};
