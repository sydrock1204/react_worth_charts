import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context value
interface MobileToggleContextProps {
  isToggled: boolean;
  setIsToggled: Dispatch<SetStateAction<boolean>>;
}

// Create the context with a default value
export const MobileToggleContext = createContext<MobileToggleContextProps | undefined>(undefined);

interface MobileToggleProviderProps {
  children: ReactNode;
}

export const MobileToggleProvider: React.FC<MobileToggleProviderProps> = ({ children }) => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <MobileToggleContext.Provider value={{ isToggled, setIsToggled }}>
      {children}
    </MobileToggleContext.Provider>
  );
};