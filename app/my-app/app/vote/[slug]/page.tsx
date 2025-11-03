"use client";
import React from "react";

function Page() {
  const dummyVote = {
    PDA: "9xJkVt1s9...T2bL",
    title: "Should we launch DAO rewards?",
    YES: 128,
    NO: 32,
    createdAt: "2025-11-03T12:00:00Z",
    solscanLink: "https://solscan.io/account/9xJkVt1s9...T2bL",
  };

  const totalVotes = dummyVote.YES + dummyVote.NO;
  const YESPercentage = totalVotes > 0 ? (dummyVote.YES / totalVotes) * 100 : 0;
  const NOPercentage = totalVotes > 0 ? (dummyVote.NO / totalVotes) * 100 : 0;

  let yesBarColor = "bg-green-500";
  let noBarColor = "bg-red-500";

  if (dummyVote.YES > dummyVote.NO) {
    noBarColor = "bg-red-700/50"; // Dimmer red
  } else if (dummyVote.NO > dummyVote.YES) {
    yesBarColor = "bg-green-700/50"; // Dimmer green
  } else if (dummyVote.YES === dummyVote.NO && totalVotes > 0) {
    yesBarColor = "bg-yellow-500/70";
    noBarColor = "bg-yellow-500/70";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10 lg:pl-72">
      <div className="w-full max-w-4xl space-y-6">
        {/* Title */}
        <h1 className="text-4xl font-mono font-semibold text-foreground text-center">
          {dummyVote.title}
        </h1>

        {/* Links */}
        <div className="text-lg text-foreground/70 flex flex-col gap-2 text-center">
          <a
            href={dummyVote.solscanLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            View on Solscan
          </a>
          <span>PDA: {dummyVote.PDA}</span>
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
        <div className="flex justify-between items-center text-lg font-mono text-foreground/80">
          <div className="text-red-500 font-semibold">
            NO: {dummyVote.NO} ({Math.round(NOPercentage)}%)
          </div>
          <div className="text-foreground/50 text-center">Total: {totalVotes}</div>
          <div className="text-green-500 font-semibold">
            YES: {dummyVote.YES} ({Math.round(YESPercentage)}%)
          </div>
        </div>

        {/* Date of creation */}
        <div className="text-sm text-foreground/50 text-center">
          Created: {new Date(dummyVote.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default Page;
