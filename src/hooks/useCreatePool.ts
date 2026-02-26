
import { CpAmm, getSqrtPriceFromPrice, derivePoolAddress } from "@meteora-ag/cp-amm-sdk";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { ExtensionType, getExtensionData, getMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { unpack, type TokenMetadata } from "@solana/spl-token-metadata";

export default function useCreatePool() {

    const connection = useConnection().connection;
    const cpAmm = new CpAmm(connection);
    const publicKey = useWallet().publicKey;
    const sendTransaction = useWallet().sendTransaction;

    async function createPool(tokenAAddress: string, tokenBAddress: string, tokenAmountA: number, tokenAmountB: number, initialPrice: number, minPrice: number, maxPrice: number, tokenADecimal: number, tokenBDecimal: number) {
        
        if(!isValidMint(tokenAAddress) || !isValidMint(tokenBAddress)) {
            return;
        }
        const blockhash = await connection.getLatestBlockhash();
        const tokenAMint = new PublicKey(tokenAAddress);
        const tokenBMint = new PublicKey(tokenBAddress);

        const tokenAAmount = new BN(tokenAmountA * Math.pow(10, tokenADecimal));
        const tokenBAmount = new BN(tokenAmountB * Math.pow(10, tokenBDecimal));

        const config = new PublicKey("FzvMYBQ29z2J21QPsABpJYYxQBEKGsxA6w6J2HYceFj8");
        const positionNft = Keypair.generate();
        const initPrice = initialPrice;

        // const Q64 = new BN(2).pow(new BN(64));

        function priceToSqrtPriceX64(price: number) {
            const sqrtPrice = Math.sqrt(price);
            const scaled = sqrtPrice * Math.pow(2, 64);
            return new BN(Math.floor(scaled).toString());
        }

        const minSqrtPriceX64 = priceToSqrtPriceX64(minPrice);
        const maxSqrtPriceX64 = priceToSqrtPriceX64(maxPrice); 

        // // Fetch mint accounts for your Token 2022 tokens
        const mintA = await getMint(connection, tokenAMint, 'confirmed', TOKEN_2022_PROGRAM_ID);
        const mintB = await getMint(connection, tokenBMint, 'confirmed', TOKEN_2022_PROGRAM_ID);

        const epochInfo = await connection.getEpochInfo();

        const { liquidityDelta } = await cpAmm.getDepositQuote({
            inAmount: tokenAAmount, 
            isTokenA: true,
            minSqrtPrice: minSqrtPriceX64,
            maxSqrtPrice: maxSqrtPriceX64,
            sqrtPrice: getSqrtPriceFromPrice(initPrice.toString(), tokenADecimal, tokenBDecimal),
            inputTokenInfo: {
                mint: mintA,            // Mint account object from getMint()
                currentEpoch: epochInfo.epoch,
            },
            outputTokenInfo: {
                mint: mintB,            // Mint account object from getMint()
                currentEpoch: epochInfo.epoch,
            }
        });


        const transaction = await cpAmm.createPool({
            creator: publicKey!,
            payer: publicKey!,
            config: config,
            positionNft: positionNft.publicKey,
            tokenAMint: tokenAMint,
            tokenBMint: tokenBMint,
            activationPoint: null,
            tokenAAmount: tokenAAmount,
            tokenBAmount: tokenBAmount,
            initSqrtPrice: getSqrtPriceFromPrice(initPrice.toString(), tokenADecimal, tokenBDecimal),
            liquidityDelta: liquidityDelta,
            tokenAProgram: TOKEN_2022_PROGRAM_ID,
            tokenBProgram: TOKEN_2022_PROGRAM_ID,
            isLockLiquidity: true
        });
        transaction.recentBlockhash = blockhash.blockhash;
        transaction.feePayer = publicKey!;
        transaction.partialSign(positionNft);
        
        await connection.simulateTransaction(transaction);
        const txn = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(txn, 'confirmed');

        const poolAddress = derivePoolAddress(config, tokenAMint, tokenBMint);

        const poolInfo = await cpAmm.fetchPoolState(poolAddress);
        const vault1 = poolInfo.tokenAVault.toBase58();
        const vault2 = poolInfo.tokenBVault.toBase58();
        const bal1 = await connection.getTokenAccountBalance(new PublicKey(vault1));
        const bal2 = await connection.getTokenAccountBalance(new PublicKey(vault2));
        const baseVal = bal1.value.uiAmountString as string;
        const quoteVal = bal2.value.uiAmountString as string;

        return {
            poolAddress,
            baseVal,
            quoteVal
        };
    }

    async function isValidMint(mintStr: string) {
        
        try{
            new PublicKey(mintStr);
        }catch {
            return false;
        }
        const accountInfo = await connection.getAccountInfo(new PublicKey(mintStr));
        if (accountInfo === null) {
            return false;
        }else {
            return true;
        }
    }


    async function extractTokenMetadata(mintAddress: string) {

        const mintPublicKey = new PublicKey(mintAddress);

        const mintInfo = await getMint(
            connection,
            mintPublicKey,
            "confirmed",
            TOKEN_2022_PROGRAM_ID
        );

        // ✅ Extract only the TokenMetadata extension
        const metadataExtension = getExtensionData(
            ExtensionType.TokenMetadata,
            mintInfo.tlvData
        );

        if (!metadataExtension) {
            return;
        }

        // ✅ Now decode properly
        const metadata = unpack(
            metadataExtension
        ) as TokenMetadata;

        try {
            const response = await fetch(metadata.uri);
            const json = await response.json();

            return {
                imageUrl: json.imageUrl,
                ticker: metadata.symbol
            }
        } catch (err) {
            console.error("Failed to fetch external metadata:", err);
        }
    }

    /**
     *  Position NFT Public Key: EbVDRdhifLAYKRL2xcTj5cS6CTw47KCBfEdDHXmWC6qM
        Transaction Signature: 2QGXKcbFJtW3xCEmM51P2AKj6w9KBWtyZytNoETDHakbi1gFoLyFuPuPWBbVjJaMMZsMhfa5R4BKb7ED3BjVucsa
        Pool Address: G26GKf7oyYvdGBsmMvr81rsPcJZyDfzScx8nKbb2dqTi
    * 
    */

    // const poolAddress = new PublicKey("G26GKf7oyYvdGBsmMvr81rsPcJZyDfzScx8nKbb2dqTi");
    // const poolInfo = await cpAmm.fetchPoolState(poolAddress);
    // // // console.log("Pool Info:", poolInfo);
    // // const vaultA = await connection.getTokenAccountBalance(poolInfo.tokenAVault);
    // // const vaultB = await connection.getTokenAccountBalance(poolInfo.tokenBVault);
    // // console.log("Vault A Balance:", vaultA.value.uiAmountString);
    // // console.log("Vault B Balance:", vaultB.value.uiAmountString);
    // const poolState = await cpAmm.fetchPoolState(poolAddress);

    // const currentSlot = await connection.getSlot();
    // const currentTime = Math.floor(Date.now() / 1000);
    // const inAmmount = new BN(10_000_000_000); // 10 tokenA with 9 decimals

    // const quote = cpAmm.getQuote({
    // inAmount: inAmmount,
    // inputTokenMint: tokenAMint,
    // slippage: 0.5,
    // poolState,
    // currentTime,
    // currentSlot,
    // inputTokenInfo: {
    //     mint: mintA,            // Mint account object from getMint()
    //     currentEpoch: epochInfo.epoch,
    // },
    // outputTokenInfo: {
    //     mint: mintB,
    //     currentEpoch: epochInfo.epoch,
    // },
    // tokenADecimal: 9,
    // tokenBDecimal: 9,
    // hasReferral: false,
    // });

    // console.log("Expected out:", quote.swapOutAmount.toString());
    // console.log("Minimum out:", quote.minSwapOutAmount.toString());

    // const swapIx = await cpAmm.swap({
    //     payer: payer.publicKey,
    //     pool: poolAddress,
    //     inputTokenMint: tokenAMint,     // what user is sending
    //     outputTokenMint: tokenBMint,    // what user wants
    //     amountIn: inAmmount, // depends on decimals
    //     minimumAmountOut: quote.minSwapOutAmount,   // slippage protection
    //     tokenAVault: poolInfo.tokenAVault,
    //     tokenBVault: poolInfo.tokenBVault,
    //     tokenAMint: poolInfo.tokenAMint,
    //     tokenBMint: poolInfo.tokenBMint,
    //     tokenAProgram: TOKEN_2022_PROGRAM_ID,
    //     tokenBProgram: TOKEN_2022_PROGRAM_ID,
    //     referralTokenAccount: null
    // });

    // const sign = await sendAndConfirmTransaction(connection, swapIx, [payer]);
    // console.log("Swap Transaction Signature:", sign);


    /***
     * outputs : --------->
     * 
     * ritam@DESKTOP-M58FH1L:~/web-3-learning/week-8$ bun index.ts
    Vault A Balance: 11.477225567
    Vault B Balance: 114.772255743
    ritam@DESKTOP-M58FH1L:~/web-3-learning/week-8$ bun index.ts
    Expected out: 53305453588
    Minimum out: 53300123042
    Swap Transaction Signature: 3wEGeLrLuhpUXZCwGAanG7dERCz9Ham8JwUU1HmuKt5Bxj6e19DuHaFLjhPGZisaogq7m6mfgqBw8oudqbQufdgE
    ritam@DESKTOP-M58FH1L:~/web-3-learning/week-8$ bun index.ts
    Expected out: 19436233785
    Minimum out: 19434290161
    Swap Transaction Signature: 5a7tjMm8W9G3efWTvY8YUtVb2j9KU6FimAiWoi9tURH2viowtATVHNYC8FvJP3Yeq5CrkjvzpH5nBvyGnkU3S75c
    ritam@DESKTOP-M58FH1L:~/web-3-learning/week-8$ bun index.ts
    Expected out: 10064230949
    Minimum out: 10063224525
    Swap Transaction Signature: 3kQB3DxA4q8ad5NXfWHrdQA4q8CiSuyCgzKVG1pbi26s87mSvTM4rtGsW9umtcB75uGPgMDzxzJCRTWVdtFNzFs2
    */

    return {
        createPool,
        extractTokenMetadata,
        isValidMint
    }
}

/**
 * 
 * Mint address :  FPZtn3k3Y8u1Kvh8ftTKSUWojQYqe5ykHsi6bzvpMHhX
useLaunchpad.tsx:132 Signature :  2uGdWQhkGLTdJqWh6ocLS1jhxyCp84kmkGL9fsX9oaNpZpqTXUD7tkEGrggR5UHaEAXtQKEn79vPq57KeENYpj9a
useLaunchpad.tsx:133 ATA address :  9DBPaLd49vz2AbFvqkHBawgwq6EbFQAoiWRzWKq1a6S3


Mint address :  GTUbAqi735mNYVATpMVmZr7F4wTQCY3PB7JQGW62At69
useLaunchpad.tsx:132 Signature :  55cneqPd2KaZzCRTgBsMcRR1MoS8HCkwQL7r4mYUm2uaacjFob6o7FbS8SHhGNbwy3unqoM9EYnuHLa1Y7dZyfLT
useLaunchpad.tsx:133 ATA address :  FBcEQWGpdmtDFg61NFXABdqgJV5nE1PziG8duKvS7qSu
 */