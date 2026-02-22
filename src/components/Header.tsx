import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Header() {
    return <div className="w-full relative h-auto py-2 px-4 md:px-8 lg:px-12 flex items-end justify-end">
        <WalletMultiButton />
        <div className="absolute top-2 left-[50%] translate-x-[-50%] bg-[#444] px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-white ">
            <div className="h-4 w-4 flex items-center justify-center bg-gray-600 rounded-[100%] ">
                <div className="h-3 w-3 bg-green-500 rounded-[100%]  "></div>
            </div>
            <p>Devnet</p>
        </div>
    </div>
}