import { useDispatch, useSelector } from "react-redux";
import "./counter.scss";
import { increment, selectCount } from "./counterSlice";

export function Counter() {
	const count = useSelector(selectCount);
	const dispatch = useDispatch();

	return (
		<div className="counter">
			<button
				onClick={() => {
					dispatch(increment(1));
				}}
			>
				add
			</button>
			{count}
		</div>
	);
}
