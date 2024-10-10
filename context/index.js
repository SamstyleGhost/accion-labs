'use client';

import { useState } from "react";
import { createContext, useContext } from "react";

const SectionContext = createContext();

export const SectionContextProvider = ({ children }) => {

  const [sections, setSections] = useState([]);

  console.log(sections);

  return (
    <SectionContext.Provider
      value={{
        sections,
        setSections
      }}
    >
      {children}
    </SectionContext.Provider>
  )
}

export const useSectionContext = () => useContext(SectionContext);