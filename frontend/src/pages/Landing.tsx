import { useNavigate } from "react-router-dom";

const Landing = () => {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen w-screen flex justify-center items-center bg-[#312E2B] p-8">
			<div className="flex w-[70%] justify-between items-center h-[70%] flex-col md:flex-row gap-8">
				<img
					src={"/chessboard.png"}
					alt="chessboard"
					className="md:h-full rounded-lg md:w-[50%]"
				/>
				<div className="h-full flex flex-col md:w-[40%] items-center gap-8">
					<h1 className="text-5xl font-bold text-center text-white">
						Play Chess Online on the #1 Site!
					</h1>
					<button
						className="w-full p-8 bg-[#81B64C] text-white rounded-lg flex justify-center items-center"
						onClick={() => navigate("/game")}
					>
						Play Online
					</button>
				</div>
			</div>
		</div>
	);
};

export default Landing;
