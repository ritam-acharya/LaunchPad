import AllPools from "../components/AllPools";
import Header from "../components/Header";

export default function HomePage() {
    return <div className="bg-[#111113] h-auto min-h-screen w-[100%] wraper ">
        <Header />
        <AllPools />
    </div>
}