import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const nav = [
    {
        name:"Home",
        path: '/'
    },
    {
        name: "Create Token",
        path: '/launchpad'
    },
    {
        name: "Create Pool",
        path: '/create-pool'
    },
    {
        name: "Swap",
        path: '/swap'
    }
];

export default function Header() {

    const [showMenu, setShowMenu] = useState(false);
    const [path, setPath] = useState(() => {
        return localStorage.getItem('path') || 'Home';
    });

    return <div className="h-auto w-full fixed top-0 left-0 z-20 py-2 ">
        <div className="w-full h-auto text-white top-0 left-0 z-20 py-2 px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
            <div className="text-[20px] md:text-[26px] lg:text-[32px] leading-[20px] md:leading-[26px] lg:leading-[32px] tracking-tight font-medium ">DevPool</div>

            <div className="hidden md:block">
                <div className="w-auto h-auto flex items-center justify-between gap-6 lg:gap-8 ">
                    <Link to="/" onClick={() => {setPath('Home'); localStorage.setItem('path', 'Home')}} className={` ${path === "Home" ? "text-white" : "text-gray-400"} `} >Home</Link>
                    <Link to="/launchpad" onClick={() => {setPath('Create Token'); localStorage.setItem('path', 'Create Token')}} className={` ${path === "Create Token" ? "text-white" : "text-gray-400"} `} >Create Token</Link>
                    <Link to="/create-pool" onClick={() => {setPath('Create Pool'); localStorage.setItem('path', 'Create Pool')}} className={` ${path === "Create Pool" ? "text-white" : "text-gray-400"} `} >Create Pool</Link>
                    <Link to="/swap" onClick={() => {setPath('Swap'); localStorage.setItem('path', 'Swap')}} className={` ${path === "Swap" ? "text-white" : "text-gray-400"} `} >Swap</Link>
                </div>
            </div>

            <div className="flex items-center justify-center gap-1 h-auto w-auto ">
                <WalletMultiButton />
                <span className="block md:hidden px-2 py-2 rounded-[100%] hover:bg-[#444] cursor-pointer  text-[22px]"
                    onClick={() => setShowMenu(!showMenu)}>
                    {
                        showMenu ? <RxCross2 /> : <IoMenu /> 
                    }
                </span>
            </div>

        </div>

        {
            showMenu && <div className="h-auto w-full bg-[#444] md:hidden flex items-start justify-start px-4 py-4 flex-col ">
                {
                    nav.map((item, idx) => (
                        <div 
                        onClick={() => setPath(item.name)}
                        key={idx} className={`w-full h-auto py-2 hover:bg-[#555] cursor-pointer px-2 text-white ${path === item.name ? 'bg-[#3f3e3e]' : ''}`}>
                            <Link to={item.path} className="text-[24px] leading-[24px] tracking-tight ">{item.name}</Link>
                        </div>
                    ))
                }
            </div>
        }
    </div>
}