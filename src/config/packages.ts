export interface Package { id: string; slug: string; name: string; price: number; originalPrice: number; discount: number; items: string; supply: string; freeItems: string; isPopular: boolean; }
export const PACKAGES: Package[] = [
  { id: 'PKG-001', slug: 'self_love_plus', name: 'Self Love Plus', price: 32750, originalPrice: 65500, discount: 50, items: 'You will receive: 1 Shampoo + 1 Pomade + 1 Conditioner', supply: 'The 30-Day Test', freeItems: '', isPopular: false },
  { id: 'PKG-002', slug: 'self_love_return', name: 'Self Love Return', price: 42750, originalPrice: 85500, discount: 50, items: 'You will receive: 3 Pomades', supply: '3-Month Maintenance', freeItems: '', isPopular: false },
  { id: 'PKG-003', slug: 'self_love_b2gof', name: 'Self Love B2GOF', price: 52750, originalPrice: 105500, discount: 50, items: 'You will receive: 3 Shampoos + 3 Pomades', supply: '3-Month Scalp Reset', freeItems: 'Buy 2+2, get 1+1 free', isPopular: false },
  { id: 'PKG-004', slug: 'self_love_plus_b2gof', name: 'Self Love Plus B2GOF', price: 66750, originalPrice: 133500, discount: 50, items: 'You will receive: 3 Shampoos + 3 Pomades + 3 Conditioners', supply: '3-Month Hair Recovery', freeItems: 'Buy 2 of each, get 1 free', isPopular: true },
  { id: 'PKG-005', slug: 'family_saves', name: 'Family Saves', price: 215750, originalPrice: 431500, discount: 50, items: 'You will receive: 10 Shampoos + 10 Pomades + 10 Conditioners', supply: '12 Month Supply', freeItems: 'Buy 6 of each, get 4 free', isPopular: false },
];
