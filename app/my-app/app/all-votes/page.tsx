"use client";
import React from "react";

function Page() {
  const dummyVoteData = [
    {
      PDA: "9xJkVt1s9...T2bL",
      title: "Should we launch DAO rewards?",
      YES: 0,
      NO: 0,
    },
    {
      PDA: "4tLmA21sZ...Rk9P",
      title: "Add staking to Vote on SOL?",
      YES: 204,
      NO: 15,
    },
    {
      PDA: "7bDeF11qP...Aa8M",
      title: "Use vote credits for discounts?",
      YES: 75,
      NO: 9,
    },
    {
      PDA: "1yZwX08fG...J7xR",
      title: "Change proposal minimum?",
      YES: 50,
      NO: 100,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10 lg:pl-72">
      <h1 className="text-2xl font-mono font-semibold text-foreground mb-8">
        All Votes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {dummyVoteData.map((vote, idx) => {
          const totalVotes = vote.YES + vote.NO;
          
          // Handle zero votes to prevent division by zero and set colors to neutral
          if (totalVotes === 0) {
            return (
                <div key={idx} className="rounded-xl border border-foreground/10 bg-background/95 p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="font-mono text-sm text-foreground/70 mb-2">PDA: {vote.PDA}</div>
                    <div className="font-mono text-lg text-foreground font-semibold mb-4">{vote.title}</div>
                    <div className="mt-4 space-y-2">
                        <div className="h-3 w-full bg-foreground/10 rounded-full" />
                        <div className="flex justify-center font-mono ">
                            NO VOTES 
                        </div>
                    </div>
                </div>
            );
          }

          const YESPercentage = (vote.YES / totalVotes) * 100;
          const NOPercentage = (vote.NO / totalVotes) * 100;

          let yesBarColor = "bg-green-500";
          let noBarColor = "bg-red-500";

          if (vote.YES > vote.NO) {
            // YES wins: YES is GREEN, NO is NEUTRAL/SECONDARY
            noBarColor = "bg-red-700/50"; // Dimmer red
          } else if (vote.NO > vote.YES) {
            // NO wins: NO is RED, YES is NEUTRAL/SECONDARY
            yesBarColor = "bg-green-700/50"; // Dimmer green
          } else {
            // DRAW
            yesBarColor = "bg-yellow-500/70";
            noBarColor = "bg-yellow-500/70";
          }
          

          return (
            <div
              key={idx}
              className="rounded-xl border border-foreground/10 bg-background/95 p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="font-mono text-sm text-foreground/70 mb-2">
                PDA: {vote.PDA}
              </div>
              <div className="font-mono text-lg text-foreground font-semibold mb-4">
                {vote.title}
              </div>

              <div className="mt-4 space-y-2">
                <div className="relative h-3 w-full rounded-full overflow-hidden flex">
                  <div
                    className={`h-full ${noBarColor} transition-all duration-500`}
                    style={{ width: `${NOPercentage}%` }}
                  />
                  <div
                    className={`h-full ${yesBarColor} transition-all duration-500`}
                    style={{ width: `${YESPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-sm font-mono text-foreground/80 pt-1">
                  <div className="flex items-center gap-1 text-red-500">
                    <span>NO</span>
                    <span className="font-semibold">{vote.NO}</span>
                    <span className="text-xs">({Math.round(NOPercentage)}%)</span>
                  </div>
                  

                  <div className="text-xs text-foreground/50">Total: {totalVotes}</div>
                  

                  <div className="flex items-center gap-1 text-green-500">
                    <span className="text-xs">({Math.round(YESPercentage)}%)</span>
                    <span className="font-semibold">{vote.YES}</span>
                    <span>YES</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page;