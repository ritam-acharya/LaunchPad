import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";

export default function Header() {
    return <div className="w-full h-auto fixed text-white top-0 left-0 py-2 px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        <div className="text-[22px] md:text-[26px] lg:text-[32px] leading-[22px] md:leading-[26px] lg:leading-[32px] tracking-tight font-medium ">DevnetPool</div>

        <div className="w-auto h-auto flex items-center justify-between gap-6 lg:gap-8 ">
            <Link to="/">Home</Link>
            <Link to="/launchpad">Create Token</Link>
            <Link to="/create-pool">Create Pool</Link>
            <Link to="/swap">Swap</Link>
        </div>

        <WalletMultiButton />
        {/* <div className="absolute cursor-pointer top-2 left-[50%] translate-x-[-50%] bg-[#18191B] px-4 py-2 rounded-xl  text-white hidden md:block ">
            <div className="flex items-center justify-center gap-2"> 
                <div className="h-4 w-4 flex items-center justify-center bg-gray-600 rounded-[100%] ">
                    <div className="h-2 w-2 bg-green-500 rounded-[100%]  "></div>
                </div>
                <p>Devnet</p>
            </div>
        </div> */}

        {/* <div className=" self-center mx-auto block md:hidden ">
            <div className="flex items-center justify-center gap-2 bg-[#18191B] px-4 py-2 rounded-xl  text-white"> 
                <div className="h-4 w-4 flex items-center justify-center bg-gray-600 rounded-[100%] ">
                    <div className="h-2 w-2 bg-green-500 rounded-[100%]  "></div>
                </div>
                <p>Devnet</p>
            </div>
        </div> */}
    </div>
}