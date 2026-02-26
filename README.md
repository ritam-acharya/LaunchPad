# Token Launchpad 🚀

A decentralized token launchpad built on Solana blockchain that enables users to create, launch, and trade SPL tokens with integrated liquidity pool creation and automated market maker (AMM) functionality.

## ✨ Features

### 🪙 Token Creation (Launchpad)
- Create SPL tokens using **Token-2022 standard** with metadata extension
- Configure token parameters:
  - Name and symbol
  - Decimals (precision)
  - Initial supply
  - Description
  - Token image/logo
- Upload token images to Cloudinary for decentralized storage
- Integrated metadata pointer extension for on-chain metadata

### 💧 Liquidity Pool Creation
- Create constant product (CP) AMM liquidity pools using Meteora
- Support for Token-2022 tokens
- Configure initial liquidity parameters:
  - Token A and Token B amounts
  - Initial price
  - Min/Max price ranges
- Automatic pool address derivation
- Position NFT generation for liquidity providers

### 🔄 Token Swapping
- Swap tokens through constant product AMM pools
- Real-time price quotes with slippage protection
- Support for both Token-2022 and standard SPL tokens
- Dynamic fee calculation
- Multi-hop swap support

### 📊 Pool Explorer
- Browse all available liquidity pools
- View pool statistics and metadata
- Filter and search pools
- Real-time pool state updates

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation

### Blockchain
- **Solana Web3.js** - Solana blockchain interaction
- **@solana/spl-token** - SPL token operations
- **@solana/spl-token-metadata** - Token metadata handling
- **@meteora-ag/cp-amm-sdk** - Constant product AMM SDK
- **@solana/wallet-adapter** - Wallet connection and management

### Additional Tools
- **Cloudinary** - Image upload and hosting
- **Axios** - HTTP client
- **BN.js** - Big number handling
- **bs58** - Base58 encoding/decoding

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- A **Solana wallet** (Phantom, Solflare, etc.)
- **SOL tokens** on Devnet (for testing)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ritam-acharya/LaunchPad.git
   cd LaunchPad/FE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_CLOUD_URL=your_cloudinary_upload_url
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5173`

## ⚙️ Configuration

### Cloudinary Setup
1. Create a [Cloudinary account](https://cloudinary.com/)
2. Get your upload preset for unsigned uploads
3. Add the upload URL to `.env` file
4. Update the upload preset name in [Launchpad.tsx](src/components/Launchpad.tsx)

### Solana Network
The application is currently configured for **Solana Devnet**. To change the network, update the endpoint in [App.tsx](src/App.tsx):

```tsx
<ConnectionProvider endpoint='https://api.devnet.solana.com'>
```

For mainnet, use:
```tsx
<ConnectionProvider endpoint='https://api.mainnet-beta.solana.com'>
```

## 📖 Usage

### Creating a Token

1. Navigate to the **Launchpad** page
2. Connect your Solana wallet
3. Fill in token details:
   - Token name
   - Symbol/ticker
   - Decimals (default: 9)
   - Initial supply
   - Description
4. Upload token logo/image
5. Click "Create Token"
6. Approve the transaction in your wallet

### Creating a Liquidity Pool

1. Navigate to **Create Pool** page
2. Enter Token A and Token B addresses
3. Configure pool parameters:
   - Token amounts for each side
   - Initial price
   - Price range (min/max)
4. Click "Create Pool"
5. Approve the transaction

### Swapping Tokens

1. Go to the **Swap** page
2. Select the pool you want to swap in
3. Enter token addresses and amount
4. Review the quote and slippage
5. Execute the swap
6. Confirm in your wallet

### Browsing Pools

1. Visit the **Home** page
2. Browse all available pools
3. View pool details including:
   - Token pairs
   - Liquidity
   - Price information

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AllPools.tsx    # Pool listing component
│   ├── Header.tsx      # Navigation header
│   ├── Launchpad.tsx   # Token creation form
│   ├── Pool.tsx        # Individual pool display
│   ├── Swap.tsx        # Token swap interface
│   └── UploadPreview.tsx # Image upload preview
├── hooks/              # Custom React hooks
│   ├── useCreatePool.ts # Pool creation logic
│   ├── useLaunchpad.tsx # Token creation logic
│   └── useSwap.ts      # Swap functionality
├── pages/              # Page components
│   ├── CreatePoolPage.tsx
│   ├── HomePage.tsx
│   ├── LaunchpadPage.tsx
│   └── SwapPage.tsx
├── App.tsx             # Main app component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 📜 Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## 🔗 Important Links

- [Solana Documentation](https://docs.solana.com/)
- [SPL Token Documentation](https://spl.solana.com/token)
- [Meteora CP-AMM SDK](https://github.com/meteora-ag/cp-amm-sdk)
- [Token-2022 (Token Extensions)](https://spl.solana.com/token-2022)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

This is experimental software for educational purposes. Use at your own risk. Always test on devnet before deploying to mainnet.
