"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useCallback, useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/providers/auth-context";
import bs58 from "bs58";

function NavBar() {
  const pathname = usePathname();
  const {
    publicKey,
    signMessage,
    connected,
    disconnect,
    wallet,
    connecting,
    connect,
  } = useWallet();
  const { isSignedIn, setIsSignedIn } = useAuth();
  const [isSigning, setIsSigning] = useState(false);

  const navItems = [
    { href: "/all-votes", label: "All Votes" },
    { href: "/create-vote", label: "Create a vote" },
    { href: "/stats", label: "Statistics" },
  ];

  const linkClasses = (active: boolean) =>
    `block px-4 py-3 rounded-lg text-sm font-mono transition-all ${
      active
        ? "bg-foreground/10 text-foreground font-semibold"
        : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
    }`;

  const handleSignIn = useCallback(async () => {
    if (!connected || !publicKey || !signMessage) {
      if (!connected) alert("Please connect your wallet first!");
      if (!signMessage) alert("Your wallet doesn't support message signing!");
      if (!publicKey) alert("Wallet public key not available.");
      return;
    }

    setIsSigning(true);
    try {
      const message = new TextEncoder().encode(
        "Sign in to place and create votes"
      );
      const signature = await signMessage(message);
      const signatureBase58 = bs58.encode(signature);

      setIsSigning(false);
      setIsSignedIn(true);
      //TODO: Add error handling to ensure that the user really has signed in lol
    } catch (err: any) {
      console.error("❌ Sign-in failed:", err);
      alert("Sign-in failed. Please try again.");
      setIsSignedIn(false);
    } finally {
      setIsSigning(false);
    }
  }, [connected, publicKey, signMessage, setIsSignedIn]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-foreground/10 bg-background/95 backdrop-blur lg:flex flex-col">
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="border-b border-foreground/10 p-6">
              <Link
                href="/"
                className="flex items-center gap-2 font-mono text-lg font-semibold tracking-tighter text-foreground hover:opacity-80"
              >
                <span className="text-foreground/50">🗳️</span>
                <span>Vote on SOL</span>
              </Link>
            </div>

            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClasses(pathname.startsWith(item.href))}
                >
                  {item.label}
                </Link>
              ))}

          
            </nav>
          </div>

          {/* Wallet / Sign-in */}
          <div className="border-t border-foreground/10 p-4">
            {!connected ? (
              <div className="space-y-3">
                <WalletMultiButton />
                {connecting && (
                  <div className="space-y-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <p className="text-xs font-mono text-orange-400">
                      Connecting to wallet...
                    </p>
                    <p className="text-xs font-mono text-foreground/60">
                      Check Phantom for approval popup
                    </p>
                    <button className="text-xs font-medium text-red-400 hover:text-red-300 underline">
                      Cancel & Reset
                    </button>
                  </div>
                )}
              </div>
            ) : !isSignedIn ? (
              <div className="space-y-3">
                <div className="p-3 bg-foreground/5 border border-foreground/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-foreground/60">
                      Connected
                    </span>
                    <button
                      onClick={disconnect}
                      className="text-xs px-2 py-1 rounded bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition font-medium text-foreground/70"
                    >
                      Disconnect
                    </button>
                  </div>
                  <div className="text-sm font-mono text-foreground">
                    {publicKey?.toBase58().slice(0, 6)}...
                    {publicKey?.toBase58().slice(-6)}
                  </div>
                </div>

                <button
                  onClick={handleSignIn}
                  disabled={isSigning}
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-3 text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigning ? "Signing In..." : "Sign In"}
                </button>
              </div>
            ) : (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                    <span>✓</span> Signed In
                  </span>
                  <button
                    onClick={disconnect}
                    className="text-xs px-2 py-1 rounded bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition font-medium text-foreground/70"
                  >
                    Disconnect
                  </button>
                </div>
                <div className="text-sm font-mono text-foreground">
                  {publicKey?.toBase58().slice(0, 6)}...
                  {publicKey?.toBase58().slice(-6)}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default NavBar;
