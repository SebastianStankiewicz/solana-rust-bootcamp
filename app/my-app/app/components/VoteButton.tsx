"use client";
import React from "react";
import { PublicKey, SystemProgram, Connection } from "@solana/web3.js";
import { web3, AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { DecentraVote } from "../../../../target/types/decentra_vote";
import idl from "../../../../target/idl/decentra_vote.json";

interface VoteButtonProps {
  eventPda: String;

}

export function VoteButton({ eventPda }: VoteButtonProps) {
  const connection = new Connection("https://api.devnet.solana.com");
  const wallet = useAnchorWallet();
    if (!wallet) {
    console.log("Find the wallet")
    return;
    }
    const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
    });
  const program = new Program<DecentraVote>(idl as DecentraVote, provider);


  const handleVote = async (choiceIndex: number) => {

    const creator = provider.wallet.publicKey;
    const eventPublicKey = new PublicKey(eventPda); 
    console.log(eventPublicKey)
    const [votePda, voteBump] = await PublicKey.findProgramAddress(
      [Buffer.from("vote"), eventPublicKey.toBuffer(), creator.toBuffer()],
      program.programId
    );
    try {
      const txSig = await program.methods
        .castVote(choiceIndex)
        .accounts({
          event: eventPublicKey,
          voteRecord: votePda,
          voter: creator,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Vote cast successfully. Tx:", txSig);
    } catch (err) {
      console.error("Failed to cast first vote:", err);
      throw err;
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleVote(1)}
        className="p-2 bg-red-500 text-white rounded"
      >
        Vote 
      </button>
      <button
        onClick={() => handleVote(0)}
        className="p-2 bg-green-500 text-white rounded"
      >
        Vote 
      </button>
    </div>
  );
}
