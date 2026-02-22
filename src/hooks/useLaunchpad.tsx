import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, createMintToInstruction, ExtensionType, getAssociatedTokenAddressSync, getMintLen, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token";
import { createInitializeInstruction, pack, type TokenMetadata } from "@solana/spl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


export default function useLaunchPad() {

    const connection = useConnection().connection;
    const payer = useWallet().publicKey as PublicKey;
    const sendTransaction = useWallet().sendTransaction;

    async function createMintWithMetadata({mint, name, symbol, uri, description, decimals}: {mint: Keypair, name: string, symbol: string, uri: string, description: string, decimals: number}) {
        const block = await connection.getLatestBlockhash();
        console.log("Creating mint account with metadata...");

        const metadata: TokenMetadata = {
            mint: mint.publicKey,
            name: name,
            symbol: symbol,
            uri: uri,
            additionalMetadata: [['description', description]]
        };

        const metadataLen = pack(metadata).length;
        const spaceWithoutMetadata = getMintLen([
            ExtensionType.MetadataPointer
        ]);
        const metadataExtension = TYPE_SIZE + LENGTH_SIZE;

        const lamports = await connection.getMinimumBalanceForRentExemption(
            spaceWithoutMetadata + metadataLen + metadataExtension
        );

        // 1. create mint account
        const createMintIns = SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mint.publicKey,
            lamports,
            space: spaceWithoutMetadata,
            programId: TOKEN_2022_PROGRAM_ID
        });

        // 2. initialize token metadata pointer extension
        const initializeMetadataPointerExtensionIns = createInitializeMetadataPointerInstruction(
            mint.publicKey,
            payer,
            mint.publicKey,
            TOKEN_2022_PROGRAM_ID
        );

        // 3. initialize mint account
        const initializeMintIns = createInitializeMintInstruction(
            mint.publicKey,
            decimals,
            payer,
            null,
            TOKEN_2022_PROGRAM_ID
        );

        // 4. initialize metadata extension
        const initializeMetadataExtensionIns = createInitializeInstruction({
            mint: mint.publicKey,
            mintAuthority: payer,
            programId: TOKEN_2022_PROGRAM_ID,
            updateAuthority: payer,
            name: name,
            symbol: symbol,
            uri: uri,
            metadata: mint.publicKey
        });

        // 5. build transaction
        const transaction = new Transaction({
            lastValidBlockHeight: block.lastValidBlockHeight,
            blockhash: block.blockhash,
            feePayer: payer
        }).add(
            createMintIns,
            initializeMetadataPointerExtensionIns,
            initializeMintIns,
            initializeMetadataExtensionIns
        );

        transaction.partialSign(mint);

        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, 'confirmed');

        console.log('Mint address : ', mint.publicKey.toBase58());
        console.log("Signature : ", signature);
    }

    async function createAta({mint}: {mint: Keypair}) {
        const block = await connection.getLatestBlockhash();
        console.log("inside ata function");

        const ataAddress = getAssociatedTokenAddressSync(
            mint.publicKey,
            payer,
            false,
            TOKEN_2022_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const createAtaIns = createAssociatedTokenAccountInstruction(
            payer,
            ataAddress,
            payer,
            mint.publicKey,
            TOKEN_2022_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const transaction = new Transaction({
            lastValidBlockHeight: block.lastValidBlockHeight,
            blockhash: block.blockhash,
            feePayer: payer
        }).add(createAtaIns);

        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, "confirmed");

        console.log('ATA address : ', ataAddress.toBase58());
        return ataAddress;
    }

    async function mintTo({mint, ataAddress, initialSupply, decimals}: {mint: Keypair, ataAddress: PublicKey, initialSupply: number, decimals: number}) {
        const block = await connection.getLatestBlockhash();
        console.log("inside mint to function");

        const mintToIns = createMintToInstruction(
            mint.publicKey,
            ataAddress,
            payer,
            initialSupply * (10 ** decimals),
            [],
            TOKEN_2022_PROGRAM_ID
        );

        const transaction = new Transaction({
            lastValidBlockHeight: block.lastValidBlockHeight,
            blockhash: block.blockhash,
            feePayer: payer
        }).add(mintToIns);

        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, "confirmed");

        console.log('MINT successfull...');
    }

    return {
        createMintWithMetadata,
        createAta,
        mintTo
    }
}


