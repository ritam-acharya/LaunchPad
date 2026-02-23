import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Header() {
    return <div className="w-full relative h-auto py-2 px-4 md:px-8 lg:px-12 flex flex-col items-end justify-end gap-4">
        
        <WalletMultiButton />
        <div className="absolute cursor-pointer top-2 left-[50%] translate-x-[-50%] bg-[#18191B] px-4 py-2 rounded-xl  text-white hidden md:block ">
            <div className="flex items-center justify-center gap-2"> 
                <div className="h-4 w-4 flex items-center justify-center bg-gray-600 rounded-[100%] ">
                    <div className="h-2 w-2 bg-green-500 rounded-[100%]  "></div>
                </div>
                <p>Devnet</p>
            </div>
        </div>

        <div className=" self-center mx-auto block md:hidden ">
            <div className="flex items-center justify-center gap-2 bg-[#18191B] px-4 py-2 rounded-xl  text-white"> 
                <div className="h-4 w-4 flex items-center justify-center bg-gray-600 rounded-[100%] ">
                    <div className="h-2 w-2 bg-green-500 rounded-[100%]  "></div>
                </div>
                <p>Devnet</p>
            </div>
        </div>
    </div>
}