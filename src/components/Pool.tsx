import { useEffect, useRef, useState } from "react";
import { IoLockClosedOutline } from "react-icons/io5";
import useCreatePool from "../hooks/useCreatePool";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

type mintInfo = {
    imageurl: string,
    ticker: string
}

export default function Pool() {

    const [baseMint, setBaseMint] = useState<string | null>(null);
    const [quoteMint, setQuoteMint] = useState<string | null>(null);
    const [baseAmount, setBaseAmount] = useState<number>(10000);
    const [quoteAmount, setQuoteAmount] = useState<number>(1000);
    const [initialPrice, setInitialPrice] = useState<number>(0.1);
    const [baseDecimals, setBaseDecimals] = useState<number>(6);
    const [quoteDecimals, setQuoteDecimals] = useState<number>(6);
    const [minPrice, setMinPrice] = useState<number>(0.08);
    const [maxPrice, setMaxPrice] = useState<number>(0.12);
    const [loading, setLoading] = useState<boolean>(false);
    const [baseMintInfo, setBaseMintInfo] = useState<mintInfo | null>(null);
    const [quoteMintInfo, setQuoteMintInfo] = useState<mintInfo | null>(null);
    const [baseMintError, setBaseMintError] = useState<boolean>(false);
    const [quoteMintError, setQuoteMintError] = useState<boolean>(false);

    const baseMintRef = useRef<HTMLInputElement>(null);
    const quoteMintRef = useRef<HTMLInputElement>(null);
    const baseAmountRef = useRef<HTMLInputElement>(null);
    const quoteAmountRef = useRef<HTMLInputElement>(null);
    const baseDecimalstRef = useRef<HTMLInputElement>(null);
    const quoteDecimalstRef = useRef<HTMLInputElement>(null);
    const initialPriceRef = useRef<HTMLInputElement>(null);
    const minPriceRef = useRef<HTMLInputElement>(null);
    const maxPriceRef = useRef<HTMLInputElement>(null);

    const { createPool, extractTokenMetadata, isValidMint } = useCreatePool();
    const publicKey = useWallet().publicKey;

    useEffect(() => {
        if(baseAmountRef &&  baseAmountRef.current && quoteAmountRef && quoteAmountRef.current && baseDecimalstRef && baseDecimalstRef.current && quoteDecimalstRef && quoteDecimalstRef.current && initialPriceRef && initialPriceRef.current && minPriceRef && minPriceRef.current && maxPriceRef && maxPriceRef.current) {
            baseAmountRef.current.value = baseAmount.toString();
            quoteAmountRef.current.value = quoteAmount.toString();
            baseDecimalstRef.current.value = baseDecimals.toString();
            quoteDecimalstRef.current.value = quoteDecimals.toString();
            initialPriceRef.current.value = initialPrice.toString();
            minPriceRef.current.value = minPrice.toString();
            maxPriceRef.current.value = maxPrice.toString();
        }
    }, []);

    async function initializePool() {
        if(!publicKey) {
            alert("Please connect your wallet.");
            return;
        }

        if(!baseMint) {
            baseMintRef.current?.focus();
            return;
        }
        if (!quoteMint) {
            quoteMintRef.current?.focus();
            return;
        }
        if(baseAmount <= 0){
            alert("Base amount must not be 0");
            return;
        }

        if(quoteAmount <= 0){
            alert("Quote amount must not be 0");
            return;
        }
        setLoading(true);
        try{
            const result = await createPool(baseMint!, quoteMint!, baseAmount, quoteAmount,initialPrice, minPrice, maxPrice, baseDecimals, quoteDecimals);
            if (!result) {
                alert("Failed to create pool. Please try again.");
                setLoading(false);
                return;
            }
            const { poolAddress, baseVal, quoteVal } = result;
            const reqBody = {
                baseMint,
                quoteMint,
                baseTicker: baseMintInfo?.ticker,
                quoteTicker: quoteMintInfo?.ticker,
                baseImg: baseMintInfo?.imageurl,
                quoteImg: quoteMintInfo?.imageurl,
                baseDecimals,
                quoteDecimals,
                baseAmount: baseVal,
                quoteAmount: quoteVal,
                poolAddress
            };
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/createPool`, reqBody);

            if(res.data.success) {
                alert("Pool created Successfully...");
                setLoading(false);
                setBaseMint(null);
                setQuoteMint(null);
                setBaseMintInfo(null);
                setQuoteMintInfo(null);
                baseMintRef.current!.value="";
                quoteMintRef.current!.value="";
                baseAmountRef.current!.value = "";
                minPriceRef.current!.value = "";
                maxPriceRef.current!.value = "";
            }else {
                alert(res.data.message || "Failed to create pool. Please check the min max price range.");
                setLoading(false);
                setBaseMint(null);
                setQuoteMint(null);
                setBaseMintInfo(null);
                setQuoteMintInfo(null);
                baseMintRef.current!.value="";
                quoteMintRef.current!.value="";
                baseAmountRef.current!.value = "";
                minPriceRef.current!.value = "";
                maxPriceRef.current!.value = "";
            }
        }catch {
            alert("Can't create pool now. Please try again later.");
            setLoading(false);
            setBaseMint(null);
            setQuoteMint(null);
            setBaseMintInfo(null);
            setQuoteMintInfo(null);
            baseMintRef.current!.value="";
            quoteMintRef.current!.value="";
            baseAmountRef.current!.value = "";
            minPriceRef.current!.value = "";
            maxPriceRef.current!.value = "";
        }
    }


    return <div className="px-4 md:px-8 lg:px-12 pt-24 pb-10 h-auto min-h-screen w-full bg-neutral-950 text-white flex flex-col items-start justify-start gap-8 ">
        <h2 className="h-auto w-full px-2 md:px-4 lg:px-6 text-[20px] md:text-[24px] lg:text-[28px] leading-[20px] md:leading-[24px] lg:leading-[28px] tracking-tight font-semibold ">Create DAMM Pool</h2>
        <div className="w-full h-auto flex items-center justify-center mt-6 ">
            <div className="w-full max-w-[700px] h-auto px-2 md:px-4 lg:px-6 py-6 md:py-8 lg:py-10 bg-[#18192C] rounded-lg  ">
                <h2 className="h-auto w-auto text-[18px] md:text-[20px] lg:text-[22px] leading-[18px] md:leading-[20px] lg:leading-[22px] tracking-tight font-medium text-white mb-6 mt-2  ">Create your DAMM Pool</h2>
                <div className="flex flex-col items-start justify-start gap-3 my-6 h-auto w-full ">
                    <p className="text-[15px] md:text-[17px] lg:text-[19px] leading-[15px] md:leading-[17px] lg:leading-[19px] tracking-tight  ">Base token Mint</p>
                    <input 
                    onChange={async (e) => {
                        setBaseMint(e.target.value);
                        if (e.target.value.trim() === "") {
                            setBaseMintInfo(null);
                            return;
                        }
                        const isValid = await isValidMint(e.target.value);
                        if(!isValid) {
                            setBaseMintInfo(null);
                            setBaseMintError(true);
                            return;
                        }
                        setBaseMintError(false);
                        const info = await extractTokenMetadata(e.target.value);
                        if (info && info.imageUrl && info.ticker) {
                            setBaseMintInfo({
                                imageurl: info.imageUrl,
                                ticker: info.ticker
                            });
                        }
                    }}
                    ref={baseMintRef} type="text" placeholder="Base token mint" className="w-full lg:w-[85%] bg-[#141526] px-4 py-3 rounded-md outline-none focus:outline-white text-white placeholder:text-[#666775]  " />
                    {
                        baseMintError && <span className="text-red-500 text-[12px] md:text-sm leading-[12px] md:leading-[14px] tracking-tight ">*Invalid Mint Address</span>
                    }
                    {
                        baseMintInfo !== null &&
                            <div className="h-auto w-auto max-w-[200px] px-4 py-2 flex items-center justify-start gap-2 rounded-lg bg-[#141526]  ">
                                <div className="h-8 w-8 rounded-[100%] overflow-hidden flex items-center justify-center ">
                                    <img src={baseMintInfo.imageurl} alt={baseMintInfo.ticker} className="w-full h-full object-cover" />
                                </div>
                                <p>{baseMintInfo.ticker}</p>
                            </div>
                    }
                </div>

                <div className="flex flex-col items-start justify-start gap-3 my-6 h-auto w-full ">
                    <p className="text-[15px] md:text-[17px] lg:text-[19px] leading-[15px] md:leading-[17px] lg:leading-[19px] tracking-tight  ">Base token Amount </p>
                    <input 
                    onChange={(e) => {
                        setBaseAmount(parseFloat(e.target.value));
                        setInitialPrice(parseFloat(( quoteAmount / parseFloat(e.target.value)).toFixed(9)));
                    }}
                    ref={baseAmountRef} type="text" placeholder="1000" min={1} className="w-full lg:w-[85%] bg-[#141526] px-4 py-3 rounded-md outline-none focus:outline-white text-white placeholder:text-[#666775]  "  />
                </div>

                <div className="flex flex-col items-start justify-start gap-3 my-6 h-auto w-full ">
                    <p className="text-[15px] md:text-[17px] lg:text-[19px] leading-[15px] md:leading-[17px] lg:leading-[19px] tracking-tight  ">Quote token Mint</p>
                    <input 
                    onChange={async (e) => {
                        setQuoteMint(e.target.value);
                        if (e.target.value.trim() === "") {
                            setQuoteMintInfo(null);
                            return;
                        }
                        const isValid = await isValidMint(e.target.value);
                        if(!isValid) {
                            setQuoteMintInfo(null);
                            setQuoteMintError(true);
                            return;
                        }
                        setQuoteMintError(false);
                        const info = await extractTokenMetadata(e.target.value);
                        if (info && info.imageUrl && info.ticker) {
                            setQuoteMintInfo({
                                imageurl: info.imageUrl,
                                ticker: info.ticker
                            });
                        }
                    }}
                    ref={quoteMintRef} type="text" placeholder="Quote token mint" className="w-full lg:w-[85%] bg-[#141526] px-4 py-3 rounded-md outline-none focus:outline-white text-white placeholder:text-[#666775]  "  />
                    {
                        quoteMintError && <span className="text-red-500 text-[12px] md:text-sm leading-[12px] md:leading-[14px] tracking-tight ">*Invalid Mint Address</span>
                    }
                    {
                        quoteMintInfo !== null &&
                            <div className="h-auto w-auto max-w-[200px] px-4 py-2 flex items-center justify-start gap-2 rounded-lg bg-[#141526]  ">
                            <div className="h-8 w-8 rounded-[100%] overflow-hidden flex items-center justify-center ">
                                <img src={quoteMintInfo.imageurl} alt={quoteMintInfo.ticker} className="w-full h-full object-cover" />
                            </div>
                            <p>{quoteMintInfo.ticker}</p>
                        </div>
                    }
                </div>

                <div className="flex flex-col items-start justify-start gap-3 my-6 h-auto w-full ">
                    <p className="text-[15px] md:text-[17px] lg:text-[19px] leading-[15px] md:leading-[17px] lg:leading-[19px] tracking-tight  ">Quote token Amount </p>
                    <input 
                    onChange={(e) => {
                        setQuoteAmount(parseFloat(e.target.value));
                        setInitialPrice(parseFloat(( parseFloat(e.target.value) / baseAmount).toFixed(9)));
                    }}
                    ref={quoteAmountRef} type="text" placeholder="1000" min={1} className="w-full lg:w-[85%] bg-[#141526] px-4 py-3 rounded-md outline-none focus:outline-white text-white placeholder:text-[#666775]  " />
                </div>

                <div className="h-auto w-full flex flex-col md:flex-row items-start md:items-center justifybetween gap-4  ">
                    <div className="flex flex-col items-start justify-start gap-3 my-6 h-auto w-full md:w-1/2 ">
                        <p className="text-[15px] md:text-[17px] lg:text-[19px] leading-[15px] md:leading-[17px] lg:leading-[19px] tracking-tight  ">Base token Decimals</p>
                        <input 
                        onChange={(e) => setBaseDecimals(parseInt(e.target.value))}
                        ref={baseDecimalstRef} type="number" placeholder="9" min={0} max={9}  className="w-full lg:w-[85%] bg-[#141526] px-4 py-3 rounded-md outline-none focus:outline-white text-white placeholder:text-[#666775]  " />
                    </div>

                    <div className="flex flex-col items-start justify-start gap-3 my-6 h-auto w-full md:w-1/2 ">
                        <p className="text-[15px] md:text-[17px] lg:text-[19px] leading-[15px] md:leading-[17px] lg:leading-[19px] tracking-tight  ">Quote token Decimals</p>
                        <input  
                        onChange={(e) => setQuoteDecimals(parseInt(e.target.value))}
                        ref={quoteDecimalstRef} type="number" placeholder="9" min={0} max={9}  className="w-full lg:w-[85%] bg-[#141526] px-4 py-3 rounded-md outline-none focus:outline-white text-white placeholder:text-[#666775]  " />
                    </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-3 my-7 h-auto w-full ">
                    <p className="text-[16px] md:text-[18px] lg:text-[20px] leading-[16px] md:leading-[18px] lg:leading-[20px] tracking-tight  ">Estimated Price</p>
                    <span className="text-red-500 text-sm lg:text-[16px] leading-[14px] lg:leading-[16px] h-auto w-full lg:w-[75%] ">*Please verify that this price matches the current market price to avaoid loosing initial liquidity</span>
                    <input 
                    onChange={(e) => setInitialPrice(parseFloat(e.target.value))}
                    ref={initialPriceRef} type="text" placeholder="0.01" value={initialPrice} disabled  className="w-full lg:w-[85%] bg-[#141526] px-4 py-3 rounded-md outline-none focus:outline-white text-white placeholder:text-[#666775]  " />
                </div>

                <div className="h-auto w-full flex flex-col md:flex-row items-start md:items-center justifybetween gap-4  ">
                    <div className="flex flex-col items-start justify-start gap-3 my-3 h-auto w-full md:w-1/2 ">
                        <p className="text-[15px] md:text-[17px] lg:text-[19px] leading-[15px] md:leading-[17px] lg:leading-[19px] tracking-tight  ">Minimum Price in Range</p>
                        <input 
                        onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                        ref={minPriceRef} type="text" placeholder="0.08" className="w-full lg:w-[85%] bg-[#141526] px-4 py-3 rounded-md outline-none focus:outline-white text-white placeholder:text-[#666775]  " />
                    </div>

                    <div className="flex flex-col items-start justify-start gap-3 my-3 h-auto w-full md:w-1/2 ">
                        <p className="text-[15px] md:text-[17px] lg:text-[19px] leading-[15px] md:leading-[17px] lg:leading-[19px] tracking-tight  ">Maximum Price in Range</p>
                        <input  
                        onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                        ref={maxPriceRef} type="text" placeholder="0.12" className="w-full lg:w-[85%] bg-[#141526] px-4 py-3 rounded-md outline-none focus:outline-white text-white placeholder:text-[#666775]  " />
                    </div>
                </div>

                <div className="flex items-center justify-start gap-6 my-7 h-auto w-full ">
                    <div className="h-auto w-auto  ">
                        <p className="text-[15px] md:text-[17px] lg:text-[19px] leading-[15px] md:leading-[17px] lg:leading-[19px] tracking-tight  ">Fee tier</p>
                        <span className="text-[#666775] text-sm lg:text-[16px] leading-[14px] lg:leading-[16px] h-auto w-full lg:w-[75%] ">The % pool will earn in fee</span>
                    </div>
                    <div className="px-2 py-2 md:px-3 md:py-3 rounded-md text-[#F55832] font-semibold border-[2px] border-[#F55832] bg-[#4F292E] flex items-center justify-center h-auto w-auto ">
                        0.25%
                    </div>
                </div>

                <div className="flex items-center justify-start gap-6 my-7 h-auto w-full ">
                    <div className="h-auto w-auto  ">
                        <p className="text-[15px] md:text-[17px] lg:text-[19px] leading-[15px] md:leading-[17px] lg:leading-[19px] tracking-tight  ">Start time</p>
                    </div>
                    <div className="px-2 py-2 md:px-3 md:py-3 rounded-md text-[#F55832] font-semibold border-[2px] border-[#F55832] bg-[#4F292E] flex items-center justify-center h-auto w-auto ">
                        NOW
                    </div>
                </div>

                <div className="flex items-start justify-start mb-6 mt-8 pl-2 ">
                    <input type="checkbox" name="Lock Liquidity" id="lockLiquidity" value="true" checked disabled className="h-4 w-4 mr-4 " />
                    <IoLockClosedOutline />
                    <p className="h-auto w-auto pl-1 text-[12px] md:text-[14px] lg:text-[16px] leading-[12px] md:leading-[14px] lg:leading-[16px] tracking-tight font-medium  ">Permanently Lock my Liquidity</p>
                </div>

                <div 
                onClick={initializePool}
                className={`h-auto w-full  text-white py-4 px-4 flex items-center justify-center rounded-md mt-12 cursor-pointer ${!publicKey || loading ? "opacity-50 cursor-not-allowed bg-[#87392F]" : "bg-[#F55832] "}  `}>
                    {loading ? "Creating Pool..." : publicKey ? "Create and Initialize Pool" : "Connect Wallet to Create Pool"}
                </div>
            </div>
        </div>
    </div>
}