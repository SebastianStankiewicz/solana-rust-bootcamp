import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { BN } from "bn.js";
import assert from "assert";

describe("decentra_vote (simple, debug)", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.decentra_vote as any;

  it("creates an event PDA, casts a vote, and prevents double voting", async () => {
    const creator = provider.wallet.publicKey;
    console.log("Creator wallet:", creator.toBase58());

    // Generate deterministic timestamp (matches Rust seeds)
    const timestamp = Math.floor(Date.now() / 1000);
    const tsBuf = new BN(timestamp).toArrayLike(Buffer, "le", 8);
    console.log("Using timestamp seed:", timestamp);

    // Derive event PDA (must match Rust seeds)
    const [eventPda, eventBump] = await PublicKey.findProgramAddress(
      [Buffer.from("event"), creator.toBuffer(), tsBuf],
      program.programId
    );

    console.log("Derived event PDA:", eventPda.toBase58());
    console.log("bump:", eventBump);
    console.log("Program ID:", program.programId.toBase58());

    // Event metadata
    const title = "Simple Test";
    const description = "Voting test with timestamp seed";
    const choices = ["Yes", "No"];
    const deadline = Math.floor(Date.now() / 1000) + 120; // 2 min from now
    console.log("Deadline (unix):", deadline);

    // Initialize the event
    console.log("Initializing event...");
    try {
      const txSig = await program.methods
        .initializeEvent(title, description, choices, new BN(deadline), new BN(timestamp))
        .accounts({
          event: eventPda,
          creator,
          systemProgram: SystemProgram.programId,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .rpc();

      console.log("Event initialized successfully. Tx:", txSig);
    } catch (err) {
      console.error("Failed to initialize event:", err);
      throw err;
    }

    // Derive vote PDA
    const [votePda, voteBump] = await PublicKey.findProgramAddress(
      [Buffer.from("vote"), eventPda.toBuffer(), creator.toBuffer()],
      program.programId
    );
    console.log("Derived vote PDA:", votePda.toBase58(), "bump:", voteBump);

    // Cast a vote
    console.log("Casting first vote...");
    try {
      const txSig = await program.methods
        .castVote(0)
        .accounts({
          event: eventPda,
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

    // Fetch and verify event tallies
    console.log("Fetching event account...");
    const eventAccount: any = await program.account.eventAccount.fetch(eventPda);
    console.log("Event account data:", eventAccount);
    console.log("Total votes:", eventAccount.totalVotes);

    assert.strictEqual(Number(eventAccount.totalVotes[0]), 1, "Yes votes should equal 1");
    assert.strictEqual(Number(eventAccount.totalVotes[1]), 0, "No votes should equal 0");

    // Attempt to double vote
    console.log("Attempting to double vote (should fail)...");
    let failed = false;
    try {
      await program.methods
        .castVote(1)
        .accounts({
          event: eventPda,
          voteRecord: votePda,
          voter: creator,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    } catch (err) {
      console.log("Double vote correctly failed:", err.error?.errorMessage || err.message);
      failed = true;
    }

    assert.ok(failed, "Expected second vote to fail");
    console.log("Test completed successfully!");
  }).timeout(180000);
});