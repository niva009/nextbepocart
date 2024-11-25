// context/stateContext.js
import { createContext, useState, useContext } from 'react';


const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [actionState, setActionState] = useState(null);

  const triggerAction = (state) => {
    setActionState(state);  // Update state when an action is triggered
    console.log("triggerAction called with state:", state);  
  };

  return (
    <StateContext.Provider value={{ actionState, triggerAction }}>
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use context
export const useStateContext = () => useContext(StateContext);
