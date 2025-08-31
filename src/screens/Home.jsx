import { Particles } from '../components/ui/Particles';
import { RxArrowRight } from "react-icons/rx";
import { cn } from "../lib/utils.js";
import { ShinyText } from "../components/ui/ShinyText";
import { BorderBeam } from "../components/ui/BorderBeam";
import { useNavigate } from 'react-router-dom';
export default function Home() {
    const color = '#fff';
    const navigate = useNavigate();
    return (
        <>
            <section id='hero' className='relative flex flex-col mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8'>
                <div
                    className={cn(
                        "group w-fit mx-auto rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    )}
                >
                    <ShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                        <span>✨ Introducing Adhyay AI</span>
                        <RxArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                    </ShinyText>
                </div>
                <h1 className="bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl translate-y-[-1rem] animate-fade-in [--animation-delay:200ms]">Adhyay AI is the new way<br className="hidden md:block" /> to build projects.</h1>
                <p className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl text-balance translate-y-[-1rem] animate-fade-in [--animation-delay:400ms]">
                    Real-time chatrooms where teams and AIs bring ideas to life through collaboration.<br className="hidden md:block" />
                    Crafted with precision, speed, and a touch of intelligence.
                </p>

                <button
                    className="inline-flex mx-auto w-fit items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  shadow h-9 px-4 py-2 translate-y-[-1rem] animate-fade-in gap-1 bg-white rounded-lg text-black ease-in-out [--animation-delay:600ms]" onClick={() => (navigate('/auth/sign-in'))}>
                    <span>Get Started for free </span><RxArrowRight />
                </button>
                <div className="relative mt-[8rem] animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,rgba(0,0,0,1)_25%,transparent_100%)]">

                    <div className="rounded-xl border border-[#333] bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background:linear-gradient(to_bottom,#ffbd7a,#ffbd7a,transparent_20%)] before:animate-image-glow">
                        <BorderBeam duration={12} size={150} />
                        <img src="./image.png" className="relative w-full h-full rounded-[inherit] border border-[#333] object-contain z-auto" />
                    </div>
                </div>

                <Particles
                    className="absolute inset-0 z-0"
                    quantity={40}
                    ease={80}
                    color={color}
                    refresh
                />
            </section>
            <section id="clients" className="text-center mx-auto max-w-[80rem] px-6 md:px-8">
                <div className="py-14">
                    <div className="mx-auto max-w-screen-xl px-4 md:px-8">
                        <h2 className="text-center text-sm font-semibold text-gray-600">TRUSTED BY TEAMS FROM AROUND THE WORLD</h2>
                        <div className="mt-6">
                            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16 [&amp;_path]:fill-white">
                                <li><img src="https://cdn.magicui.design/companies/Google.svg" className="h-8 w-28 px-2 dark:brightness-0 dark:invert" /></li>
                                <li><img src="https://cdn.magicui.design/companies/Microsoft.svg" className="h-8 w-28 px-2 dark:brightness-0 dark:invert" /></li>
                                <li><img src="https://cdn.magicui.design/companies/GitHub.svg" className="h-8 w-28 px-2 dark:brightness-0 dark:invert" /></li>
                                <li><img src="https://cdn.magicui.design/companies/Uber.svg" className="h-8 w-28 px-2 dark:brightness-0 dark:invert" /></li>
                                <li><img src="https://cdn.magicui.design/companies/Notion.svg" className="h-8 w-28 px-2 dark:brightness-0 dark:invert" /></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
