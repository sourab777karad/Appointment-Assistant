import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const BaseUrlContext = createContext();

export const BaseUrlProvider = ({ children }) => {
  const [baseUrl, setBaseUrl] = useState(
    // "https://brightly-vital-panther.ngrok-free.app",
    // "http://localhost:3000/assistant",
    "https://h1gk4w07-3000.euw.devtunnels.ms/assistant"
  );

  const [onlyBaseUrl, setOnlyBaseUrl] = useState();
  // "https://brightly-vital-panther.ngrok-free.app",
  // "https://h1gk4w07-3000.euw.devtunnels.ms"

  useEffect(() => {
    // update only base url when base url changes
    const url = new URL(baseUrl);
    setOnlyBaseUrl(url.origin);
  }, [baseUrl]);

  return (
    <BaseUrlContext.Provider value={{ baseUrl, setBaseUrl, onlyBaseUrl }}>
      {children}
    </BaseUrlContext.Provider>
  );
};

BaseUrlProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
