# 🗳️ DecentraVote – Decentralized Voting System on Solana

## 📖 Overview
**DecentraVote** is a decentralized voting platform built on the **Solana blockchain** using **Rust** and the **Anchor framework**.  
It allows users to **create**, **participate in**, and **verify** voting events directly on-chain — ensuring **transparency**, **immutability**, and **fairness** without relying on any central authority.

Users connect via their **Solana wallet**, create new voting events, and cast votes that are **digitally signed** and **stored on-chain**.  
Each event can be either **public** or **private**, with private events restricted to approved wallet addresses using **Merkle Tree proofs**.

---

## 🚀 Main Features

### 🔐 Wallet Connection
- Connect using any Solana-compatible wallet (Phantom, Solflare, Backpack, etc.)
- No centralized login — authentication is fully wallet-based.

### 🗳️ Create Voting Events
- Any connected wallet can create a new voting event.
- Creator defines:
  - **Title** and **Description**
  - **Choices / Options**
  - **Event Type:** `Public` or `Private`
  - **Voting Deadline**
- A PDA (Program Derived Address) stores all event data on-chain.

### 🧩 Voting System
- **Public Polls:** Anyone with a Solana wallet can vote once.
- **Private Polls:** Only wallets in the approved list can vote.
  - Verification via **Merkle Tree proof**.
- Votes are **signed** and **recorded** on-chain.

### 🔎 Transparency & Security
- All data (events, votes, results) live on Solana accounts.
- No centralized server can change votes.
- Each voter can verify that their vote was counted exactly once.

---

## ⚙️ How It Works

1. **Connect Wallet**  
   The user connects to the DApp via their Solana wallet.

2. **Create Event**  
   The user submits event info → the Solana program creates a **PDA** for the event.

3. **Vote**  
   - Public event → any wallet can vote once.  
   - Private event → user must provide a valid **Merkle proof**.  
   The vote is signed and validated on-chain.

4. **View Results**  
   All votes and totals are read directly from the blockchain and displayed in real-time.

---

## 💡 Why Solana
- **High speed:** thousands of transactions per second.  
- **Low fees:** makes on-chain voting affordable.  
- **Rust + Anchor:** secure, developer-friendly environment for smart contracts.  

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Blockchain** | Solana (**Devnet**) |
| **Smart Contracts** | **Rust** + **Anchor Framework** |
| **Frontend** | **React** + **TypeScript** |
| **Client Side** | **TypeScript** (Anchor client SDK) |
| **Wallet Integration** | Solana Wallet Adapter |
| **Data Verification** | Merkle Tree (for private polls) |

---

## 🧭 User Flow

1. **Connect Wallet**  
   The user connects their Solana wallet (Phantom, Solflare, etc.) to the DApp.  
   This establishes their blockchain identity.

2. **Create Event**  
   - The user fills in event details: title, description, options, and type (public/private).  
   - The frontend sends a transaction to the Solana program to create the event’s PDA account.  
   - The event data (creator, type, options, deadline) is stored on-chain.

3. **Vote**  
   - The user selects a voting option and submits their vote.  
   - If it’s a **public poll**, any connected wallet can vote once.  
   - If it’s a **private poll**, the user must provide a valid **Merkle proof** verifying their wallet is eligible.  
   - The transaction is signed by the user’s wallet and recorded on-chain.

4. **View Results**  
   - Votes are read directly from Solana accounts in real-time.  
   - The frontend displays updated totals and event status.  
   - All data is transparent and verifiable by anyone on-chain.

---

## 🎯 Value Proposition

- **Trustless Voting:**  
  No need to trust a central authority — every action is verified and stored on the blockchain.

- **Transparency:**  
  All votes and results are visible and auditable on-chain, ensuring complete openness.

- **Fairness:**  
  One vote per wallet enforced by smart contract logic.

- **Accessibility:**  
  Anyone with a Solana wallet can participate in public polls easily and securely.

- **Security:**  
  Private polls use **Merkle proofs** to restrict access, while every vote is signed by the voter’s wallet.

- **Scalability & Low Fees:**  
  Built on Solana for high throughput and near-zero transaction costs, ideal for large-scale community voting.
