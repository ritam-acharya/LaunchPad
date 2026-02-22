import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import Launchpad from "./components/Launchpad";
import Header from './components/Header';

export default function App() {
    return <ConnectionProvider endpoint='https://api.devnet.solana.com'>
        <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
                <div className="bg-[#111113] text-white min-h-screen w-[100%] wraper ">
                    <Header />
                    <Launchpad />
                </div>
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
}