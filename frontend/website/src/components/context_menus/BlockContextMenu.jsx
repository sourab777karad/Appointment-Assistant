import PropTypes from "prop-types";

const BlockContextMenu = ({ x, y, onClose, date, start_time }) => {
	const handleClick = (e) => {
		e.preventDefault(); // Prevent default right-click menu
		onClose(); // Close custom menu
	};

	return (
		<div
			className="custom-menu absolute z-50"
			style={{
				top: y,
				left: x,
			}}
			onClick={handleClick}
		>
			<div className="p-2">
				<ul className="menu bg-base-200 w-56 rounded-box">
					<li
						onClick={() => {
							console.log("clicked");
						}}
					>
						<a>Block</a>
					</li>
					<li
						onClick={() => {
							console.log("clicked");
						}}
					>
						<a>Un-Block</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default BlockContextMenu;
BlockContextMenu.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
	date: PropTypes.string.isRequired,
	start_time: PropTypes.string.isRequired,
};
