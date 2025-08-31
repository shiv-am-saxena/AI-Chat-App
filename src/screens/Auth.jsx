import { InteractiveGridPattern } from "../components/ui/GridPattern";
import { Outlet } from "react-router-dom";
export default function Auth() {
    return (
        <div className="relative flex h-[calc(100vh-64px)] w-full flex-col items-center overflow-hidden justify-center">
            <div className="relative h-full w-full flex items-center justify-center">
                <Outlet/>
            </div>
            <InteractiveGridPattern/>
        </div>
    );
}
