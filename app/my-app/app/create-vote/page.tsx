"use client";
import React, { useState } from "react";

function Page() {
  const [data, setData] = useState({ title: "", oneLiner: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeploy = () => {
    //Call the contract here.
    console.log("Make call to smark contract");
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
          <div className=" text-black font-medium text-sm font-mono rounded-lg px-4 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Estimated cost: 0.1</div>
        </div>
      </div>
    </div>
  );
}

export default Page;
