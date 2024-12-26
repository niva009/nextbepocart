export interface Item {
  id: string | number;
  price: number;
  quantity?: number;
  stock?: number;
  [key: string]: any;
}

export interface UpdateItemInput extends Partial<Omit<Item, 'id'>> {}

export function addItemWithQuantity(
  items: Item[] = [],
  item: Item,
  quantity: number
) {
  if (!Array.isArray(items)) {
    console.error('Error: items is not an array', items);
    return [];
  }

  if (quantity <= 0)
    throw new Error("cartQuantity can't be zero or less than zero");

  const existingItemIndex = items.findIndex(
    (existingItem) => existingItem.id === item.id
  );

  if (existingItemIndex > -1) {
    const newItems = [...items];
    newItems[existingItemIndex].quantity! += quantity;
    return newItems;
  }
  return [...items, { ...item, quantity }];
}

export function removeItemOrQuantity(
  items: Item[] = [],
  id: Item['id'],
  quantity: number
) {
  if (!Array.isArray(items)) {
    console.error('Error: items is not an array', items);
    return [];
  }

  return items.reduce((acc: Item[], item) => {
    if (item.id === id) {
      const newQuantity = item.quantity! - quantity;

      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc];
    }
    return [...acc, item];
  }, []);
}

// Simple CRUD for Item
export function addItem(items: Item[] = [], item: Item) {
  if (!Array.isArray(items)) {
    console.error('Error: items is not an array', items);
    return [];
  }
  return [...items, item];
}

export function getItem(items: Item[] = [], id: Item['id']) {
  if (!Array.isArray(items)) {
    console.error('Error: items is not an array', items);
    return undefined;
  }
  return items.find((item) => item.id === id);
}

export function updateItem(
  items: Item[] = [],
  id: Item['id'],
  item: UpdateItemInput
) {
  if (!Array.isArray(items)) {
    console.error('Error: items is not an array', items);
    return [];
  }

  return items.map((existingItem) =>
    existingItem.id === id ? { ...existingItem, ...item } : existingItem
  );
}

export function removeItem(items: Item[] = [], id: Item['id']) {
  if (!Array.isArray(items)) {
    console.error('Error: items is not an array', items);
    return [];
  }
  return items.filter((existingItem) => existingItem.id !== id);
}

export function inStock(items: Item[] = [], id: Item['id']) {
  const item = getItem(items, id);
  if (item) return item['quantity']! < item['stock']!;
  return false;
}

// Totals Calculations
export const calculateItemTotals = (items: Item[] = []) => {
  if (!Array.isArray(items)) {
    console.error('Error: items is not an array', items);
    return [];
  }

  return items.map((item) => ({
    ...item,
    itemTotal: item.price * (item.quantity || 0),
  }));
};

export const calculateTotal = (items: Item[] = []) => {
  if (!Array.isArray(items)) {
    console.error('Error: items is not an array', items);
    return 0;
  }

  return items.reduce(
    (total, item) => total + (item.quantity || 0) * item.price,
    0
  );
};

export const calculateTotalItems = (items: Item[] = []) => {
  if (!Array.isArray(items)) {
    console.error('Error: items is not an array', items);
    return 0;
  }

  return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
};

export const calculateUniqueItems = (items: Item[] = []) => {
  if (!Array.isArray(items)) {
    console.error('Error: items is not an array', items);
    return 0;
  }
  return items.length;
};
