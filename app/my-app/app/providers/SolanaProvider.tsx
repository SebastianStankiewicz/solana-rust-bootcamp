"use client";
import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import { AuthProvider } from "./auth-context";

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect={true} 
        localStorageKey="solana-wallet"
        onError={(error, adapter) => {
          console.error("Wallet adapter error:", error);
          console.error("Adapter:", adapter?.name);
          console.error("Error name:", error.name);
          console.error("Error message:", error.message);

          if (error.name === 'WalletNotReadyError') {
            console.error("Wallet not ready - please install wallet extension");
            alert("Please install a Solana wallet extension (Phantom or Solflare) and refresh the page");
          } else if (error.name === 'WalletConnectionError') {
            console.error("Wallet connection failed");
            console.log("Connection was rejected or failed. User can try again.");
          } else if (error.name === 'WalletNotConnectedError') {
            console.log("Wallet not connected (expected)");
          } else {
            console.error("Wallet error:", error.message);
          }
        }}
      >
        <WalletModalProvider>
          <AuthProvider>{children}</AuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};