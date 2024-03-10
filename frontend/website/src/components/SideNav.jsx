// this is the drawer. it contains cart. This is present always, and is activated by javascript.

import { useNavigate } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
const SideNav = () => {
	const navigate = useNavigate();
	return (
		<div>
			<div className="drawer drawer-end z-50">
				<input
					id="notif-drawer"
					type="checkbox"
					className="drawer-toggle hidden"
				/>
				{/* <label
          id="cartlabel"
          htmlFor="notif-drawer"
          className="btn btn-primary drawer-button"
        >
          Open drawer
        </label> */}
				<div className="drawer-side">
					<label
						htmlFor="notif-drawer"
						aria-label="close sidebar"
						className="drawer-overlay"
					></label>
					<div className="w-[23vw] min-h-full bg-gray-100 text-base-content drawer-content border-l-2 border-black">
						<div className="bg-gray-200 m-4 outline rounded-lg outline-2 mr-6">
							<div className="w-full flex justify-between p-4">
								<div className="text-xl">Notifications</div>
								<IconX
									className="w-8 h-8 cursor-pointer"
									onClick={() => {
										document.getElementById(
											"notif-drawer"
										).checked = false;
									}}
								/>
							</div>
						</div>
						<div className="flex justify-center"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideNav;
