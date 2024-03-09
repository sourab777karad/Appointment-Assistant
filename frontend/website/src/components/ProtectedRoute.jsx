import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Route } from "react-router-dom";
import { UserInfoContext } from "../context/UserInfoContext";

function ProtectedRoute({ path, ...rest }) {
	let navigate = useNavigate();
	const userToken = useContext(UserInfoContext).userToken;

	// Function to check if user is authenticated
	function isAuthenticated() {
		// Here you should replace this with the actual authentication check
		// check if the token attribute in userinfocontext is present
		if (userToken === null || userToken === undefined || userToken === "") {
			// else return false
			return false;
		}
		// if it is present, return true
		return true;
	}

	useEffect(() => {
		if (!isAuthenticated()) {
			// replace this with your actual authentication check
			navigate("/");
		}
	}, []); // add dependencies if needed

	return <Route path={path} {...rest} />;
}

export default ProtectedRoute;

import PropTypes from "prop-types";

ProtectedRoute.propTypes = {
	component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node])
		.isRequired,
	path: PropTypes.string.isRequired,
	rest: PropTypes.object,
};
