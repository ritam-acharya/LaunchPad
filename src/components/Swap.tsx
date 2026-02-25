import { useRef, useState } from "react";
import { FaArrowDown } from "react-icons/fa6";
import useSwap from "../hooks/useSwap";
import { PublicKey } from "@solana/web3.js";

type tokenInfo = {
    imageUrl: string,
    ticker: string
}

export default function Swap() {
    const [fromAddress, setFromAddress] = useState<string | null>(null);
    const [toAddress, setToAddress] = useState<string | null>(null);
    const [fromInfo, setFromInfo] = useState<tokenInfo | null>(null);
    const [toInfo, setToInfo] = useState<tokenInfo | null>(null);
    const [fromAmount, setFromAmount] = useState<number | null>(null);

    const fromRef = useRef<HTMLInputElement>(null);
    const toRef = useRef<HTMLInputElement>(null);
    const fromAmountRef = useRef<HTMLInputElement>(null);
    const toAmountRef = useRef<HTMLInputElement>(null);

    const { isValidMint, extractTokenMetadata, getValue, swap } = useSwap();

    async function performSwap() {
        const sign = await swap(new PublicKey("FwHmM31zYAEvKhySSNTDVGTPRcqyUDNyQ4kE9c3hyTRB"), new PublicKey(fromAddress!), new PublicKey(toAddress!), fromAmount!);
        alert(sign);
    }

    return <div className="px-4 md:px-8 lg:px-12 pt-24 pb-10 h-auto min-h-screen w-full bg-neutral-950 text-white flex items-center justify-center  ">
        <div className="h-auto w-full max-w-[650px] bg-[#1C243E] rounded-lg px-2 md:px-4 lg:px-6 py-10 ">
            <div className=" text-white flex flex-col items-start justify-between h-auto w-full gap-10 ">
                <div className="relative h-auto w-full flex flex-col items-start justify-between gap-8 ">
                    <div className="from bg-[#141A30] w-full h-auto rounded-lg overflow-hidden pt-3 ">
                        <div className="w-full h-auto px-3 pb-2 flex items-start justify-between gap-4">
                            <p className="inline-block text-white font-semibold h-auto w-auto ">From</p>
                            <input 
                            onChange={async (e) => {
                                setFromAddress(e.target.value);
                                if (e.target.value.trim() === "") {
                                    setFromInfo(null);
                                    return;
                                }
                                const isValid = await isValidMint(e.target.value);
                                if(!isValid) {
                                    setFromInfo(null);
                                    return;
                                }
                                const info = await extractTokenMetadata(e.target.value);
                                if (info && info.imageUrl && info.ticker) {
                                    setFromInfo({
                                        imageUrl: info.imageUrl,
                                        ticker: info.ticker
                                    });
                                }
                            }}
                            ref={fromRef} type="text" placeholder="From Address" className=" h-auto border-[2px] border-[#1C243E] w-[70%] md:w-[60%] lg:w-[55%] rounded-lg px-3 py-2 outline-none placeholder:text-gray-700 bg-transparent text-right placeholder:text-right  " />
                        </div>
                        <div className="bg-[#0B1022] h-auto w-full px-3 py-3 flex items-center justify-between gap-4 ">
                            <div className={`h-auto w-auto max-w-[200px] px-4 py-2 flex items-center justify-start gap-2 rounded-lg ${fromInfo ? "bg-[#141526]" : "bg-transparent"}`}>
                                {
                                    fromInfo !== null &&
                                    <>
                                        <div className="h-8 w-8 rounded-[100%] overflow-hidden flex items-center justify-center ">
                                            <img src={fromInfo.imageUrl} alt={fromInfo.ticker} className="w-full h-full object-cover" />
                                        </div>
                                        <p>{fromInfo.ticker}</p>
                                    </>
                                        
                                }
                            </div>
                            
                            <input 
                            onChange={async (e) => {
                                setFromAmount(parseFloat(e.target.value));
                                const val = await getValue(new PublicKey("FwHmM31zYAEvKhySSNTDVGTPRcqyUDNyQ4kE9c3hyTRB"), new PublicKey(fromAddress!), new PublicKey(toAddress!), parseFloat(e.target.value));
                                if(val) {
                                    if(toAmountRef.current) {
                                        toAmountRef.current.value = val.toString();
                                    }
                                }
                            }}
                            ref={fromAmountRef} type="text" placeholder="Amount" className=" h-auto  w-[70%] md:w-[60%] lg:w-[55%]  rounded-lg px-3 py-2 outline-none placeholder:text-gray-700 bg-transparent text-right placeholder:text-right  " />
                        </div>
                    </div>

                    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] h-auto w-auto rounded-full bg-[#32C0D1] p-2 flex items-center justify-center text-[18px] md:text-[20px] lg:text-[22px] text-black font-light ">
                        <FaArrowDown />
                    </div>

                    <div className="to bg-[#141A30] w-full h-auto rounded-lg overflow-hidden pt-3 ">
                        <div className="w-full h-auto px-3 pb-2 flex items-start justify-between gap-4">
                            <p className="inline-block text-white font-semibold h-auto w-auto ">To</p>
                            <input 
                            onChange={async (e) => {
                                setToAddress(e.target.value);
                                if (e.target.value.trim() === "") {
                                    setToInfo(null);
                                    return;
                                }
                                const isValid = await isValidMint(e.target.value);
                                if(!isValid) {
                                    setToInfo(null);
                                    return;
                                }
                                const info = await extractTokenMetadata(e.target.value);
                                if (info && info.imageUrl && info.ticker) {
                                    setToInfo({
                                        imageUrl: info.imageUrl,
                                        ticker: info.ticker
                                    });
                                }
                            }}
                            ref={toRef} type="text" placeholder="To Address" className=" h-auto border-[2px] border-[#1C243E]  w-[70%] md:w-[60%] lg:w-[55%] rounded-lg px-3 py-2 outline-none placeholder:text-gray-700 bg-transparent text-right placeholder:text-right  " />
                        </div>
                        <div className="bg-[#0B1022] h-auto w-full px-3 py-3 flex items-center justify-between gap-4 ">
                            <div className={`h-auto w-auto max-w-[200px] px-4 py-2 flex items-center justify-start gap-2 rounded-lg ${toInfo ? "bg-[#141526]" : "bg-transparent"}`}>
                                {
                                    toInfo !== null &&
                                    <>
                                        <div className="h-8 w-8 rounded-[100%] overflow-hidden flex items-center justify-center ">
                                            <img src={toInfo.imageUrl} alt={toInfo.ticker} className="w-full h-full object-cover" />
                                        </div>
                                        <p>{toInfo.ticker}</p>
                                    </>
                                        
                                }
                            </div>
                            
                            <input ref={toAmountRef} value={0} disabled type="text" placeholder="Amount" className=" h-auto  w-[70%] md:w-[60%] lg:w-[55%]  rounded-lg px-3 py-2 outline-none placeholder:text-gray-700 bg-transparent text-right placeholder:text-right  " />
                        </div>
                    </div>
                </div>

                <div 
                onClick={performSwap}
                className="bg-[#32C0D1] text-black h-auto w-full rounded-lg px-4 py-4 flex items-center justify-center cursor-pointer font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[14px] md:leading-[16px] lg:leading-[18px] tracking-tight  ">
                    Swap
                </div>
            </div>
        </div>
    </div>
}