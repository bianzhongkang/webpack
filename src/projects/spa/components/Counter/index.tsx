import { useDispatch, useSelector } from "react-redux";
import {
  selectCount,
  increment,
  decrement,
  incrementByAmount,
} from "@/stores/reducers/counter";

export default function Counter(): JSX.Element {
  const dispatch = useDispatch();
  const count = useSelector(selectCount);
  return (
    <div>
      <div>count: {count}</div>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(incrementByAmount(2))}>+2</button>
    </div>
  );
}
