import { BsImages } from "react-icons/bs";
import { CiFileOn } from "react-icons/ci";
import UploadPreview from "./UploadPreview";
import { useRef, useState } from "react";

export default function Launchpad() {
    
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [coinName, setCoinName] = useState<string | null>(null);
    const [ticker, setTicker] = useState<string | null>(null);
    const [ , setDescription] = useState<string | null>(null);
    const coinRef = useRef<HTMLInputElement>(null);
    const tickerRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);


    return <div className="min-h-screen w-full bg-[#111113] h-auto px-4 md:px-8 lg:px-12 py-6 md:py-10 lg:py-14 ">
        <h1 className="text-[24px] md:text-[28px] lg:text-[32px] font-medium px-2 ">Create new coin</h1>
        <h4 className="text-[16px] md:text-[18px] lg:text-[22px] font-medium mb-2 mt-6 px-2 ">Coin details</h4>
        <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-[14px] md:leading-[16px] lg:leading-[18px] tracking-tight font-medium px-2 text-[#949AA4] ">Choose carefully, these can't be changed once the coin is created</p>

        <div className="relative h-auto w-full flex flex-col lg:flex-row items-start justify-between gap-4 py-4 md:py-6 mt-2 mb-6 ">
            <div className="h-auto w-full lg:w-[65%] flex flex-col items-start justify-start gap-6 ">
                <div className="bg-[#18191B] h-auto py-4 md:py-6 px-2 md:px-4 rounded-lg w-full ">
                    <div className="h-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="h-auto w-full md:w-[40%] flex flex-col items-start justify-start gap-3 ">
                            <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-[14px] md:leading-[16px] lg:leading-[18px] tracking-tight ">Coin name</p>
                            <input 
                            ref={coinRef}
                            onChange={(e) => setCoinName(e.target.value)}
                            className="w-[85%] h-auto bg-transparent outline-none border-[0.5px] border-gray-800 rounded-lg px-3 focus:border-[2px] focus:border-white py-2 placeholder:text-[#9CA3AF] " type="text" placeholder="Name your coin" />
                        </div>
                        <div className="h-auto w-full md:w-[40%] flex flex-col items-start justify-start gap-3 ">
                            <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-[14px] md:leading-[16px] lg:leading-[18px] tracking-tight ">Ticker</p>
                            <input 
                            ref={tickerRef}
                            onChange={(e) => setTicker(e.target.value)}
                            className="w-[85%] h-auto bg-transparent outline-none border-[0.5px] border-gray-800 rounded-lg px-3 focus:border-[2px] focus:border-white py-2 placeholder:text-[#9CA3AF] " type="text" placeholder="Add a coin ticker (e.g. DOGE)" />
                        </div>
                    </div>

                    <div className="mt-10 h-auto w-full flex flex-col items-start justify-start gap-4 ">
                        <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-[14px] md:leading-[16px] lg:leading-[18px] tracking-tight ">Description <span className="text-[#9CA3AF] ">(Optional)</span></p>
                        <textarea 
                        ref={descriptionRef}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-[95%] max-h-[200px] min-h-[120px] h-auto bg-transparent outline-none border-[0.5px] border-gray-800 rounded-lg px-3 focus:border-[2px] focus:border-white py-2 placeholder:text-[#9CA3AF] " placeholder="Write a short de" />
                    </div>

                    <div className="my-3 w-full h-auto flex flex-col ">
                        <p className="text-sm text-red-500 md:text-[16px] leading-[14px] md:leading-[16px] tracking-tight ">* We will revoke the mint and freeze authority default</p>
                    </div>
                </div>
                
                <div className="bg-[#18191B] h-auto py-4 md:py-6 px-2 md:px-4 rounded-lg w-full ">   
                    <UploadPreview file={file} previewUrl={previewUrl} setFile={setFile} setPreviewUrl={setPreviewUrl} />
                    <div className="h-auto w-full my-3 flex flex-col md:flex-row items-start justify-between gap-6 mt-8 md:mt-12 lg:mt-14 px-2 md:px-4 ">
                        <div className="h-auto w-full md:w-[45%] ">
                            <span className="text-[24px] lg:text-[28px] my-3 text-[#9CA3AF] ">
                                <CiFileOn />
                            </span>
                            <p className="text-sm md:text-[16px] lg:text-[18px] leading-[14px] md:leading-[16px] lg:leading-[18px] tracking-tight font-medium mt-3 mb-2 ">File size and type</p>
                            <div className="text-[#9CA3AF] flex items-start justify-start gap-4 mt-1 mb-1 h-auto w-[80%] ">
                                <div className="h-[5px] w-[5px] rounded-[100%] bg-[#9CA3AF] mt-2 "></div>
                                <div className="text-[12px] md:text-[14px] lg:text-[16px] leading-[12px] md:leading-[14px] lg:leading-[16px] tracking-tight ">
                                    Image - max 15mb. '.jpg', '.gif' or '.png' recommended
                                </div>
                            </div>
                            <div className="text-[#9CA3AF] flex items-start justify-start gap-4 mt-2 mb-1 h-auto w-[80%] ">
                                <div className="h-[5px] w-[5px] rounded-[100%] bg-[#9CA3AF] mt-2 "></div>
                                <div className="text-[12px] md:text-[14px] lg:text-[16px] leading-[12px] md:leading-[14px] lg:leading-[16px] tracking-tight ">
                                    Video - max 30mb. '.mp4' recommended
                                </div>
                            </div>
                            
                        </div>

                        <div className="h-auto w-full md:w-[45%] ">
                            <span className="text-[24px] lg:text-[32px] my-3 ">
                                <BsImages />
                            </span>
                            <p className="text-sm md:text-[16px] lg:text-[18px] leading-[14px] md:leading-[16px] lg:leading-[18px] tracking-tight font-medium mt-3 mb-2 ">Resolution and aspect ratio</p>
                            <div className="text-[#9CA3AF] flex items-start justify-start gap-4 mt-1 mb-1 h-auto w-[80%] ">
                                <div className="h-[5px] w-[5px] rounded-[100%] bg-[#9CA3AF] mt-2 "></div>
                                <div className="text-[12px] md:text-[14px] lg:text-[16px] leading-[12px] md:leading-[14px] lg:leading-[16px] tracking-tight ">
                                    Image - min. 1000x1000px, 1:1 square recommended
                                </div>
                            </div>
                            <div className="text-[#9CA3AF] flex items-start justify-start gap-4 mt-2 mb-1 h-auto w-[80%] ">
                                <div className="h-[5px] w-[5px] rounded-[100%] bg-[#9CA3AF] mt-2 "></div>
                                <div className="text-[12px] md:text-[14px] lg:text-[16px] leading-[12px] md:leading-[14px] lg:leading-[16px] tracking-tight ">
                                    Video - 16:9 or 9:16, 1080p+ recommended
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/** preview **/}
            <div className=" lg:sticky lg:top-[10%] lg:left-0 lg:right-0 h-auto px-4 rounded-lg w-full lg:w-[27%] flex items-center justify-center flex-col ">
                <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-[14px] md:leading-[16px] lg:leading-[18px] tracking-tight font-medium mt-2 mb-3 ">Preview</p>
                {
                    !previewUrl ? <div className="bg-[#18191B] h-[200px] w-[280px] md:w-[320px] lg:w-full rounded-lg flex items-center justify-center ">
                        <p className="text-[#9CA3AF] max-w-[60%] text-center h-auto ">A preview of how the coin will look like</p>
                    </div>
                    :
                    <div className="bg-[#18191B] h-[200px] w-[280px] md:w-[320px] lg:w-full rounded-lg flex items-center justify-center gap-4 px-2 py-2 ">
                        <div className="h-full w-[56%] flex items-center justify-center overflow-hidden ">
                            {
                                previewUrl && file && file.type.startsWith("image") && (
                                    <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-full w-full object-center"
                                    />
                                )
                            }
                            {
                                previewUrl && file && file.type.startsWith("video") && (
                                    <video
                                    src={previewUrl}
                                    controls
                                    className="h-full w-full object-center"
                                    />
                                )
                            }
                        </div>
                        <div className="h-full w-[40%] mt-6 flex flex-col items-start justify-start gap-2  ">
                            <h2 className="text-white font-semibold text-[16px] md:text-[18px] lg:text-[20px] leading-[16px] md:leading-[18px] lg:leading-[20px] tracking-tight h-auto w-full overflow-hidden  ">{coinName ? coinName : "Coin name"}</h2>
                            <p className="text-[#444] text-[14px] md:text-[16px] lg:text-[18px] leading-[14px] md:leading-[16px] lg:leading-[18px] tracking-tight h-auto w-full overflow-hidden ">{ticker ? ticker : "Ticker"}</p>
                            <p className="text-[12px] md:text-sm leading-[12px] md:leading-[14px] tracking-tight ">Now</p>
                        </div>
                    </div>
                }


                
            </div>
        </div>
    </div>
}