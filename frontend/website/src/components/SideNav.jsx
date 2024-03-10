// this is the drawer. it contains cart. This is present always, and is activated by javascript.

import { useNavigate } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
const SideNav = () => {
	const navigate = useNavigate();
	return (
		<div>
			<div className="drawer drawer-end z-50">
				<input
					id="my-drawer"
					type="checkbox"
					className="drawer-toggle hidden"
				/>
				{/* <label
          id="cartlabel"
          htmlFor="my-drawer"
          className="btn btn-primary drawer-button"
        >
          Open drawer
        </label> */}
				<div className="drawer-side">
					<label
						htmlFor="my-drawer"
						aria-label="close sidebar"
						className="drawer-overlay"
					></label>
					<div className="w-1/5 min-h-full bg-gray-100 text-base-content drawer-content">
						<div className="w-full flex justify-between">
							<div className="text-xl uppercase m-8">
								Notifications
							</div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 w-12 m-4"
								viewBox="0 0 24 24"
								onClick={() => {
									document.getElementById(
										"my-drawer"
									).checked = false;
								}}
							>
								<g
									fill="none"
									stroke="currentColor"
									stroke-dasharray="16"
									stroke-dashoffset="16"
									stroke-linecap="round"
									stroke-width="2"
								>
									<path d="M7 7L17 17">
										<animate
											fill="freeze"
											attributeName="stroke-dashoffset"
											dur="0.4s"
											values="16;0"
										/>
									</path>
									<path d="M17 7L7 17">
										<animate
											fill="freeze"
											attributeName="stroke-dashoffset"
											begin="0.4s"
											dur="0.4s"
											values="16;0"
										/>
									</path>
								</g>
							</svg>
						</div>
						{/* <div className="flex justify-center">
              <div className="text-2xl droidserif">
                Discounts are calculated at checkout
              </div>
            </div> */}
						<div className="flex justify-center">
							<button
								className="btn btn-secondary uppercase w-4/5 rounded-none m-8"
								onClick={() => {
									document.getElementById(
										"my-drawer"
									).checked = false;
									navigate("/checkout");
								}}
							>
								Checkout
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideNav;
