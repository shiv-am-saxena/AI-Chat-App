import { useAnimationFrame, useSpring } from "framer-motion";
import GoogleGeminiEffect from "../components/Google-gemini-effect";

const Home = () => {
    const progress = useSpring(0, { damping: 10, stiffness: 50 });

    useAnimationFrame((time) => {
        progress.set((time % 3000) / 3000); // Normalize time to a range [0, 1] over 3 seconds
    });

    const pathLengthFirst = progress;
    const pathLengthSecond = progress;
    const pathLengthThird = progress;
    const pathLengthFourth = progress;
    const pathLengthFifth = progress;

    return (
        <div className="relative h-[calc(100vh-136px)] py-10 w-full flex items-center justify-center">
            <GoogleGeminiEffect
                pathLengths={[
                    pathLengthFirst,
                    pathLengthSecond,
                    pathLengthThird,
                    pathLengthFourth,
                    pathLengthFifth,
                ]}
                title={"Adhyay-AI Chat"}
                description={"Seamlessly connect with the future of AI-powered communication."}
            />
        </div>
    );
};

export default Home;
