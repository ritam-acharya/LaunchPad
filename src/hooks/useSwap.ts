import { CpAmm } from "@meteora-ag/cp-amm-sdk";
import { ExtensionType, getExtensionData, getMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { unpack, type TokenMetadata } from "@solana/spl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";

export default function useSwap() {

    const connection = useConnection().connection;
    const cpAmm = new CpAmm(connection);
    const { publicKey, sendTransaction } = useWallet();   

    async function isValidMint(mintStr: string) {
            
        try{
            new PublicKey(mintStr);
        }catch(err) {
            return false;
        }
        const accountInfo = await connection.getAccountInfo(new PublicKey(mintStr));
        if (accountInfo === null) {
            return false;
        }else {
            return true;
        }
    }

    async function swap(poolAddress: PublicKey, fromMint: PublicKey, toMint: PublicKey, fromAmount: number) {
        if (!publicKey) {
            return;
        }
        const poolInfo = await cpAmm.fetchPoolState(poolAddress);
        const mintA = await getMint(connection, fromMint, 'confirmed', TOKEN_2022_PROGRAM_ID);
        const mintB = await getMint(connection, toMint, 'confirmed', TOKEN_2022_PROGRAM_ID);

        const epochInfo = await connection.getEpochInfo();
        // // console.log("Pool Info:", poolInfo);
        // const vaultA = await connection.getTokenAccountBalance(poolInfo.tokenAVault);
        // const vaultB = await connection.getTokenAccountBalance(poolInfo.tokenBVault);
        // console.log("Vault A Balance:", vaultA.value.uiAmountString);
        // console.log("Vault B Balance:", vaultB.value.uiAmountString);
        const poolState = await cpAmm.fetchPoolState(poolAddress);
        const currentSlot = await connection.getSlot();
        const currentTime = Math.floor(Date.now() / 1000);
        const inAmmount = new BN(fromAmount * Math.pow(10, mintA.decimals)); // 10 tokenA with 9 decimals

        const quote = cpAmm.getQuote({
            inAmount: inAmmount,
            inputTokenMint: fromMint,
            slippage: 0.5,
            poolState,
            currentTime,
            currentSlot,
            inputTokenInfo: {
                mint: mintA,            // Mint account object from getMint()
                currentEpoch: epochInfo.epoch,
            },
            outputTokenInfo: {
                mint: mintB,
                currentEpoch: epochInfo.epoch,
            },
            tokenADecimal: mintA.decimals,
            tokenBDecimal: mintB.decimals,
            hasReferral: false,
        });

        console.log("Expected out:", quote.swapOutAmount.toString());
        console.log("Minimum out:", quote.minSwapOutAmount.toString());

        const transaction = await cpAmm.swap({
            payer: publicKey,
            pool: poolAddress,
            inputTokenMint: fromMint,     // what user is sending
            outputTokenMint: toMint,    // what user wants
            amountIn: inAmmount, // depends on decimals
            minimumAmountOut: quote.minSwapOutAmount,   // slippage protection
            tokenAVault: poolInfo.tokenAVault,
            tokenBVault: poolInfo.tokenBVault,
            tokenAMint: poolInfo.tokenAMint,
            tokenBMint: poolInfo.tokenBMint,
            tokenAProgram: TOKEN_2022_PROGRAM_ID,
            tokenBProgram: TOKEN_2022_PROGRAM_ID,
            referralTokenAccount: null
        });
        const blockHash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockHash.blockhash;
        transaction.feePayer = publicKey;
        const signedtrans = await sendTransaction(transaction, connection);
        const sign = await connection.confirmTransaction(signedtrans, 'confirmed');
        console.log(sign);
        return sign;
        // const sign = await sendAndConfirmTransaction(connection, swapIx, [payer]);
        // console.log("Swap Transaction Signature:", sign);

    }

    async function getValue(poolAddress: PublicKey, fromMint: PublicKey, toMint: PublicKey, fromAmount: number) {
        if (!publicKey) {
            return;
        }
        // const poolInfo = await cpAmm.fetchPoolState(poolAddress);
        const mintA = await getMint(connection, fromMint, 'confirmed', TOKEN_2022_PROGRAM_ID);
        const mintB = await getMint(connection, toMint, 'confirmed', TOKEN_2022_PROGRAM_ID);

        const epochInfo = await connection.getEpochInfo();
        // // console.log("Pool Info:", poolInfo);
        // const vaultA = await connection.getTokenAccountBalance(poolInfo.tokenAVault);
        // const vaultB = await connection.getTokenAccountBalance(poolInfo.tokenBVault);
        // console.log("Vault A Balance:", vaultA.value.uiAmountString);
        // console.log("Vault B Balance:", vaultB.value.uiAmountString);
        const poolState = await cpAmm.fetchPoolState(poolAddress);
        const currentSlot = await connection.getSlot();
        const currentTime = Math.floor(Date.now() / 1000);
        const inAmmount = new BN(fromAmount * Math.pow(10, mintA.decimals)); // 10 tokenA with 9 decimals

        const quote = cpAmm.getQuote({
            inAmount: inAmmount,
            inputTokenMint: fromMint,
            slippage: 0.5,
            poolState,
            currentTime,
            currentSlot,
            inputTokenInfo: {
                mint: mintA,            // Mint account object from getMint()
                currentEpoch: epochInfo.epoch,
            },
            outputTokenInfo: {
                mint: mintB,
                currentEpoch: epochInfo.epoch,
            },
            tokenADecimal: mintA.decimals,
            tokenBDecimal: mintB.decimals,
            hasReferral: false,
        });

        console.log("Expected out:", quote.swapOutAmount.toString());
        console.log("Minimum out:", quote.minSwapOutAmount.toString());

        return parseFloat((parseInt(quote.swapOutAmount.toString()) / Math.pow(10, mintB.decimals)).toFixed(mintB.decimals));
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
                console.log("No TokenMetadata extension found.");
                return;
            }
    
            // ✅ Now decode properly
            const metadata = unpack(
                metadataExtension
            ) as TokenMetadata;
    
            console.log("\n--- Token Metadata ---");
            console.log(`Name: ${metadata.name}`);
            console.log(`Symbol: ${metadata.symbol}`);
            console.log(`URI: ${metadata.uri}`);
            console.log(
                `Update Authority: ${metadata.updateAuthority?.toBase58()}`
            );
            console.log("------------------------\n");
    
            try {
                const response = await fetch(metadata.uri);
                const json = await response.json();
    
                console.log("--- External JSON Data ---");
                console.log(`Description: ${json.description}`);
                console.log(`Image URL: ${json.imageUrl}`);
                console.log("--------------------------");
                return {
                    imageUrl: json.imageUrl,
                    ticker: metadata.symbol,
                }
            } catch (err) {
                console.error("Failed to fetch external metadata:", err);
            }
        }

    return {
        isValidMint,
        extractTokenMetadata,
        swap,
        getValue
    }
}