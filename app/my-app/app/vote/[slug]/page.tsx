// app/vote/[slug]/page.tsx
import { web3, AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey, Connection, SystemProgram } from "@solana/web3.js";
import idl from "../../../../../target/idl/decentra_vote.json";
import { DecentraVote } from "../../../../../target/types/decentra_vote";
import { notFound } from "next/navigation";
import { VoteButton } from "@/app/components/VoteButton";

interface PageProps {
  params: Promise<{ slug: string }>; // params is now a Promise
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params; // unwrap the promise
  let eventPda: PublicKey;

  try {
    eventPda = new PublicKey(slug);
  } catch {
    return notFound(); // invalid PDA
  }

  // Server-side connection
  const connection = new Connection("https://api.devnet.solana.com");
  const provider = new AnchorProvider(connection, {} as any, {
    preflightCommitment: "processed",
  });

  const program = new Program<DecentraVote>(idl as DecentraVote, provider);

  let eventAccount;
  try {
    eventAccount = await program.account.eventAccount.fetch(eventPda);
    console.log(eventAccount);
  } catch {
    return notFound(); // account not found
  }

  const totalVotes = eventAccount.totalVotes.reduce((a, b) => a + Number(b), 0);

  const YESPercentage =
    totalVotes > 0 ? (eventAccount.totalVotes[0] / totalVotes) * 100 : 0;
  const NOPercentage =
    totalVotes > 0 ? (eventAccount.totalVotes[1] / totalVotes) * 100 : 0;

  let yesBarColor = "bg-green-500";
  let noBarColor = "bg-red-500";

  if (eventAccount.totalVotes[0] > eventAccount.totalVotes[1]) {
    noBarColor = "bg-red-700/50"; // Dimmer red
  } else if (eventAccount.totalVotes[1] > eventAccount.totalVotes[0]) {
    yesBarColor = "bg-green-700/50"; // Dimmer green
  } else if (
    eventAccount.totalVotes[0] === eventAccount.totalVotes[1] &&
    totalVotes > 0
  ) {
    yesBarColor = "bg-yellow-500/70";
    noBarColor = "bg-yellow-500/70";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10 lg:pl-72">
      <div className="w-full max-w-4xl space-y-6">
        {/* Title */}
        <h1 className="text-4xl font-mono font-semibold text-foreground text-center">
          {eventAccount.title}
        </h1>

        {/* Links */}
        <div className="text-lg text-foreground/70 flex flex-col gap-2 text-center">
          <a
            href={""}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            View on Solscan
          </a>
          <span>PDA: {slug}</span>
        </div>

        {/* Tug-of-War Bar */}
        {totalVotes === 0 ? (
          <div className="h-6 w-full bg-foreground/10 rounded-full flex items-center justify-center">
            NO VOTES
          </div>
        ) : (
          <div className="relative h-6 w-full rounded-full overflow-hidden flex">
            {/* NO bar first (left side) */}
            <div
              className={`h-full ${noBarColor} transition-all duration-500`}
              style={{ width: `${NOPercentage}%` }}
            />
            {/* YES bar on top */}
            <div
              className={`h-full ${yesBarColor} transition-all duration-500`}
              style={{ width: `${YESPercentage}%` }}
            />
          </div>
        )}

        {/* Statistics */}
        <div className="flex flex-col w-full max-w-md mx-auto space-y-6">
          {/* Vote stats */}
          <div className="flex justify-between items-center text-lg font-mono text-foreground/80 px-4">
            <div className="flex flex-col justify-center items-center">
              <div className="text-red-500 font-semibold">
                {eventAccount.choices[1]}: {eventAccount.totalVotes[1]} ({Math.round(NOPercentage)}%)
              </div>
            </div>

            <div className="text-foreground/50 text-center">
              Total: {totalVotes}
            </div>

            <div className="flex flex-col justify-center items-center">
              <div className="text-green-500 font-semibold">
              {eventAccount.choices[0]}: {eventAccount.totalVotes[0]} ({Math.round(YESPercentage)}%)
              </div>
            </div>
          </div>

          {/* Vote buttons */}
          <div className="flex justify-center gap-4 px-4">
            <VoteButton eventPda={eventPda.toBase58()} />
          </div>
        </div>

        {/* Date of creation */}
      </div>
    </div>
  );
}
