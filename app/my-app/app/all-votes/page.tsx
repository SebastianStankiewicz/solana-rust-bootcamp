"use client";
import React from "react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  const dummyVoteData = [
    {
      PDA: "9xJkVt1s9...T2bL",
      title: "Should we launch DAO rewards?",
      YES: 0,
      NO: 0,
      slug: "launch-dao-rewards",
    },
    {
      PDA: "4tLmA21sZ...Rk9P",
      title: "Add staking to Vote on SOL?",
      YES: 204,
      NO: 15,
      slug: "staking-vote-sol",
    },
    {
      PDA: "7bDeF11qP...Aa8M",
      title: "Use vote credits for discounts?",
      YES: 75,
      NO: 9,
      slug: "vote-credits-discounts",
    },
    {
      PDA: "1yZwX08fG...J7xR",
      title: "Change proposal minimum?",
      YES: 50,
      NO: 100,
      slug: "change-proposal-minimum",
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

          // Calculate percentages
          const YESPercentage =
            totalVotes > 0 ? (vote.YES / totalVotes) * 100 : 0;
          const NOPercentage =
            totalVotes > 0 ? (vote.NO / totalVotes) * 100 : 0;

          // Determine bar colors
          let yesBarColor = "bg-green-500";
          let noBarColor = "bg-red-500";

          if (vote.YES > vote.NO) {
            noBarColor = "bg-red-700/50"; // Dimmer red
          } else if (vote.NO > vote.YES) {
            yesBarColor = "bg-green-700/50"; // Dimmer green
          } else if (vote.YES === vote.NO && totalVotes > 0) {
            yesBarColor = "bg-yellow-500/70";
            noBarColor = "bg-yellow-500/70";
          }

          return (
            <div
              key={idx}
              onClick={() => router.push(`/vote/${vote.slug}`)}
              className="cursor-pointer rounded-xl border border-foreground/10 bg-background/95 p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="font-mono text-sm text-foreground/70 mb-2">
                PDA: {vote.PDA}
              </div>
              <div className="font-mono text-lg text-foreground font-semibold mb-4">
                {vote.title}
              </div>

              <div className="mt-4 space-y-2">
                {totalVotes === 0 ? (
                  <></>
                ) : (
                  <div className="relative h-6 w-full rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${noBarColor} transition-all duration-500`}
                      style={{ width: `${NOPercentage}%` }}
                    />
                    <div
                      className={`h-full ${yesBarColor} transition-all duration-500`}
                      style={{ width: `${YESPercentage}%` }}
                    />
                  </div>
                )}

                <div className="flex justify-between items-center text-sm font-mono text-foreground/80 pt-1">
                  <div className="flex items-center gap-1 text-red-500">
                    <span>NO</span>
                    <span className="font-semibold">{vote.NO}</span>
                    <span className="text-xs">
                      ({Math.round(NOPercentage)}%)
                    </span>
                  </div>

                  <div className="text-xs text-foreground/50">
                    Total: {totalVotes}
                  </div>

                  <div className="flex items-center gap-1 text-green-500">
                    <span className="text-xs">
                      ({Math.round(YESPercentage)}%)
                    </span>
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
