// Utility functions for localStorage management
export const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('financialDataUpdate'));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const loadFromStorage = (key: string, defaultValue: any = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const updateStorageArray = (key: string, newItem: any, updateFn?: (items: any[]) => any[]) => {
  const currentItems = loadFromStorage(key, []);
  const updatedItems = updateFn ? updateFn(currentItems) : [...currentItems, newItem];
  saveToStorage(key, updatedItems);
  return updatedItems;
};