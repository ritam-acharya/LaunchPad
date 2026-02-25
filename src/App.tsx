import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LaunchpadPage from './pages/LaunchpadPage';
import SwapPage from './pages/SwapPage';
import CreatePoolPage from './pages/CreatePoolPage';

export default function App() {
    return <ConnectionProvider endpoint='https://api.devnet.solana.com'>
        <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<HomePage />}/>
                        <Route path='/launchpad' element={<LaunchpadPage />}/>
                        <Route path='/swap' element={<SwapPage />}/>
                        <Route path='/create-pool' element={<CreatePoolPage />}/>
                    </Routes>
                </BrowserRouter>
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
}