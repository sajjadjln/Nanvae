import { useContext, useState, createContext } from 'react';

export const StoreContext = createContext();

export default function useStoreContext() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
}

export function StoreProvider({ children }) {
  const [basket, setBasket] = useState(null);
  function removeItem(productId,quantity) {
    if (!basket) return;
    const items = [...basket.items];
    const itemIndex = items.findIndex((item) => item.productId === productId);
    if (itemIndex >= 0) {
      items[itemIndex].quantity -= quantity;
      if (items[itemIndex].quantity === 0) {
        items.splice(itemIndex, 1);
      }
      setBasket((prevState) => ({ ...prevState, items }));
    }
  }

  return (
    <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
      {children}
    </StoreContext.Provider>
  );
}
