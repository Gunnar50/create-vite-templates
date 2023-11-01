import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, selectCount } from "./counterSlice";

export function Counter() {
	const count = useSelector(selectCount);
	const dispatch = useDispatch();

	return (
		<div>
			<button
				onClick={() => {
					dispatch(increment(1));
				}}
			>
				add
			</button>
			{count}
			<button
				onClick={() => {
					dispatch(decrement(1));
				}}
			>
				minus
			</button>
		</div>
	);
}
