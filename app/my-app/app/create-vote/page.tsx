"use client";
import React, { useState } from "react";
import { web3, AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import bs58 from "bs58";
//import idl from "@/target/idl/ctf_anchor.json";
import idl from "../../../../target/idl/decentra_vote.json";
import { DecentraVote } from "../../../../target/types/decentra_vote";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";


function Page() {
  const [data, setData] = useState({ title: "", oneLiner: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeploy = async () => {
    console.log("Creating on-chain vote event...");
    try {
      const connection = new web3.Connection("https://api.devnet.solana.com");
      const provider = new AnchorProvider(connection, window.solana, {
        preflightCommitment: "processed",
      });

      const program = new Program<DecentraVote>(idl as DecentraVote, provider);

      const creator = provider.wallet.publicKey;
      const timestamp = Math.floor(Date.now() / 1000);
      const tsBuf = new BN(timestamp).toArrayLike(Buffer, "le", 8);

      const [eventPda] = await PublicKey.findProgramAddress(
        [Buffer.from("event"), creator.toBuffer(), tsBuf],
        program.programId
      );
  

      const title = data.title;
      const description = data.oneLiner;
      const choices = ["Yes", "No"]; // example choices, or add form inputs for this
      const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now
      console.log("THIS WORKED EVENT PDA BELOW")
      console.log(eventPda)
      const tx = await program.methods
        .initializeEvent(
          title,
          description,
          choices,
          new BN(deadline),
          new BN(timestamp)
        )
        .accounts({
          event: eventPda,
          creator,
          systemProgram: web3.SystemProgram.programId,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .rpc({ skipPreflight: true });

      console.log("Vote event created on-chain. Tx:", tx);
      console.log("Event PDA:", eventPda.toBase58());
    } catch (err) {
      console.error("Failed to create vote event:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-background/95 border border-foreground/10 rounded-xl shadow-sm p-6 space-y-6">
        <h1 className="text-2xl font-mono font-semibold text-foreground text-center tracking-tight">
          Create a Vote
        </h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground/70 mb-1 font-mono"
            >
              Vote Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              placeholder="Enter vote title"
              className="w-full bg-background border border-foreground/10 rounded-lg px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          <div>
            <label
              htmlFor="oneLiner"
              className="block text-sm font-medium text-foreground/70 mb-1 font-mono"
            >
              Vote One-Liner
            </label>
            <input
              id="oneLiner"
              type="text"
              name="oneLiner"
              value={data.oneLiner}
              onChange={handleChange}
              placeholder="Enter one-liner"
              className="w-full bg-background border border-foreground/10 rounded-lg px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
        </div>
        <div className="flex flex-row">
          <button
            onClick={handleDeploy}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm font-mono rounded-lg px-4 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Deploy Vote on Chain!
          </button>
          <div className=" text-black font-medium text-sm font-mono rounded-lg px-4 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Estimated cost: 0.1
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
