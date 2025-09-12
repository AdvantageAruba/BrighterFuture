// Global data context to prevent multiple useClasses instances
import React, { createContext, useContext, ReactNode } from 'react';
import { useClasses } from '../hooks/useClasses';

interface ClassesDataContextType {
  classesData: ReturnType<typeof useClasses>;
}

const ClassesDataContext = createContext<ClassesDataContextType | undefined>(undefined);

interface ClassesDataProviderProps {
  children: ReactNode;
}

export const ClassesDataProvider: React.FC<ClassesDataProviderProps> = ({ children }) => {
  const classesData = useClasses();

  return (
    <ClassesDataContext.Provider value={{ classesData }}>
      {children}
    </ClassesDataContext.Provider>
  );
};

export const useClassesData = () => {
  const context = useContext(ClassesDataContext);
  if (context === undefined) {
    throw new Error('useClassesData must be used within a ClassesDataProvider');
  }
  return context.classesData;
};

