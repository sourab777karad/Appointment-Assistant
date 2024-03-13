import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const BaseUrlContext = createContext();

export const BaseUrlProvider = ({ children }) => {
	const [baseUrl, setBaseUrl] = useState(
		// "https://brightly-vital-panther.ngrok-free.app",
		"http://localhost:3000/assistant",
		// "https://h1gk4w07-3000.euw.devtunnels.ms/assistant"
	);

	return (
		<BaseUrlContext.Provider value={{ baseUrl, setBaseUrl }}>
			{children}
		</BaseUrlContext.Provider>
	);
};

BaseUrlProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
