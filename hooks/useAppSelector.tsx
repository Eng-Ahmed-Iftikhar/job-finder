import { RootState } from "@/store/reducers";
import { useSelector } from "react-redux";

export const useAppSelector = useSelector.withTypes<RootState>();
