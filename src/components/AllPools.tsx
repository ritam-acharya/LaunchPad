import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


type Pool = {
    id: number;
    baseSymbol: string;
    quoteSymbol: string;
    baseImage: string;
    quoteImage: string;
    createdAt: string;
    baseAmount: string;
    quoteAmount: string;
    baseDecimals: number;
    quoteDecimals: number;
    poolAddress: string;
}


export default function AllPools() {
    const [pools, setPools] = useState<Pool[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/pools`);
        if(res.data.success) {
            const poolsData = [];
            for(const pool of res.data.message) {
                poolsData.push({
                    id: pool._id,
                    baseSymbol: pool.baseTicker,
                    quoteSymbol: pool.quoteTicker,
                    baseImage: pool.baseImg,
                    quoteImage: pool.quoteImg,
                    createdAt: new Date(pool.createdAt).toLocaleDateString(),
                    baseAmount: pool.baseAmount.toLocaleString(),
                    quoteAmount: pool.quoteAmount.toLocaleString(),
                    baseDecimals: pool.baseDecimals,
                    quoteDecimals: pool.quoteDecimals,
                    poolAddress: pool.poolAddress
                });
            }
            setPools(poolsData);
        }
        setLoading(false);
    }

    useEffect(() => {
        function callBack() {
            fetchData();
        }
        callBack();
    }, []);

    if(loading) {
        return <div className="px-4 md:px-6 lg:px-10 pt-24 pb-10 h-screen w-full flex items-center justify-center text-white">
            Loading...
        </div>
    }

    if (pools.length < 1) {
        return <div className="px-4 md:px-6 lg:px-10 pt-24 pb-10 h-screen w-full flex flex-col ">
            <h2 className="text-[20px] md:text-[24px] lg:text-[28px] text-white leading-[20px] md:leading-[24px] lg:leading-[28px] tracking-tight  font-semibold mb-8 pl-2">All Liquidity Pools</h2>
            <div className=" h-auto flex-1 w-full flex items-center justify-center flex-col gap-3">
                <div className="text-white text-center py-4 tracking-tight text-[16px] md:text-[18px] lg:text-[22px] leading-[16px] md:leading-[18px] lg:leading-[22px] px-2 md:px-4 lg:px-6 flex flex-wrap items-center justify-center ">
                    No pools found. Create a pool first.
                </div>
                <div className="inline-block bg-green-500 text-black px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium hover:bg-green-600 transition">
                    <Link to="/create-pool" className="">Create Pool</Link>
                </div>
            </div>
        </div>
    }

    return <div className="px-4 md:px-6 lg:px-10 pt-24 pb-10">
        <h2 className="text-[20px] md:text-[24px] lg:text-[28px] text-white leading-[20px] md:leading-[24px] lg:leading-[28px] tracking-tight  font-semibold mb-8">All Liquidity Pools</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pools.map((pool, idx) => (
                <div
                key={idx}>
                <div className="bg-[#17171f] border border-white/5 rounded-2xl shadow-lg hover:shadow-xl transition">
                    <div className="p-6">
                    {/* Token Images */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex -space-x-3">
                        <img
                            src={pool.baseImage}
                            alt={pool.baseSymbol}
                            className="w-10 h-10 rounded-full border-2 border-[#0f0f14]"
                        />
                        <img
                            src={pool.quoteImage}
                            alt={pool.quoteSymbol}
                            className="w-10 h-10 rounded-full border-2 border-[#0f0f14]"
                        />
                        </div>
                        <div>
                        <p className="font-semibold text-lg text-white">
                            {pool.baseSymbol}/{pool.quoteSymbol}
                        </p>
                        <p className="text-xs text-gray-400">
                            Created on {pool.createdAt}
                        </p>
                        </div>
                    </div>

                    {/* Liquidity Info */}
                    <div className="space-y-2 text-sm text-gray-300 mb-6">
                        <p>
                        <span className="text-gray-500">Base Liquidity:</span> {pool.baseAmount} {pool.baseSymbol}
                        </p>
                        <p>
                        <span className="text-gray-500">Quote Liquidity:</span> {pool.quoteAmount} {pool.quoteSymbol}
                        </p>
                    </div>

                    {/* Deposit Button */}
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-2xl py-3 text-white font-medium">
                        Deposit Liquidity
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
}