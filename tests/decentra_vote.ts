
import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";


import * as assert from "assert";
import crypto from "crypto";
// Minimal test for decentra_vote program
describe("decentra_vote (simple)", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.decentra_vote as any;

  // read unix_timestamp from clock sysvar account (i64 at offset 24)
  async function getClockUnixTs(): Promise<number> {
    const info = await provider.connection.getAccountInfo(anchor.web3.SYSVAR_CLOCK_PUBKEY);
    if (!info) throw new Error("Failed to fetch clock sysvar");
    const data = info.data;
    return Number(data.readBigInt64LE(24));
  }

  it("creates an event PDA, casts a vote, and prevents double voting", async () => {
    const creator = provider.wallet.publicKey;

    // Derive event PDA using clock unix timestamp (matches lib.rs seeds)
    const clockTs = await getClockUnixTs();
    const tsBuf = new anchor.BN(clockTs).toArrayLike(Buffer, "le", 8);
    const [eventPda] = await PublicKey.findProgramAddress([
      Buffer.from("event"),
      creator.toBuffer(),
      tsBuf,
    ], program.programId);

    const title = "Simple Test";
    const description = "test";
    const choices = ["Yes", "No"];
    const deadline = Math.floor(Date.now() / 1000) + 60;

    // initialize event (PDA)
    await program.rpc.initializeEvent(title, description, choices, new anchor.BN(deadline), {
      accounts: {
        event: eventPda,
        creator,
        systemProgram: SystemProgram.programId,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      },
    });

    // derive vote PDA and cast a vote
    const [votePda] = await PublicKey.findProgramAddress([
      Buffer.from("vote"),
      eventPda.toBuffer(),
      creator.toBuffer(),
    ], program.programId);

    await program.rpc.castVote(0, {
      accounts: {
        event: eventPda,
        voteRecord: votePda,
        voter: creator,
        systemProgram: SystemProgram.programId,
      },
    });

    // verify tally
  const eventAccount: any = await (program.account as any).eventAccount.fetch(eventPda);
    assert.strictEqual(Number(eventAccount.totalVotes[0]), 1);
    assert.strictEqual(Number(eventAccount.totalVotes[1]), 0);

    // second vote from same wallet should fail because PDA already exists
    let failed = false;
    try {
      await program.rpc.castVote(1, {
        accounts: {
          event: eventPda,
          voteRecord: votePda,
          voter: creator,
          systemProgram: SystemProgram.programId,
        },
      });
    } catch (err) {
      failed = true;
    }
    assert.ok(failed, "Expected second vote to fail");
  }).timeout(120000);
});
