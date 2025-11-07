use anchor_lang::prelude::*;

declare_id!("7ymeCAGNF3SGvUTrD4XUnfLc3RtpEowbKNpbC4srdM2M");

#[program]
pub mod decentra_vote {
    use super::*;

    pub fn initialize_event(
        ctx: Context<InitializeEvent>,
        title: String,
        description: String,
        choices: Vec<String>,
        deadline: i64,
        timestamp: i64, 
    ) -> Result<()> {
        require!(!choices.is_empty(), ErrorCode::NoChoicesProvided);
        require!(title.len() <= 64, ErrorCode::TitleTooLong);
        require!(description.len() <= 256, ErrorCode::DescriptionTooLong);

        let event = &mut ctx.accounts.event;

        event.creator = ctx.accounts.creator.key();
        event.title = title;
        event.description = description;
        event.choices = choices;
        event.deadline = deadline;
        event.total_votes = vec![0; event.choices.len()]; // init votes per choice to 0

        msg!("Event initialized by {}", event.creator);
        msg!("Timestamp seed used: {}", timestamp);
        msg!("Title: {}", event.title);
        msg!("Choices: {:?}", event.choices);
        msg!("Deadline: {}", event.deadline);

        Ok(())
    }

    pub fn cast_vote(ctx: Context<CastVote>, choice_index: u8) -> Result<()> {
        let event = &mut ctx.accounts.event;
        let voter = &ctx.accounts.voter;

        // Ensure deadline not passed
        let clock = Clock::get()?;
        require!(clock.unix_timestamp < event.deadline, ErrorCode::VotingClosed);

        // Check if already voted
        require!(!ctx.accounts.vote_record.has_voted, ErrorCode::AlreadyVoted);

        // Record the vote
        let vote_record = &mut ctx.accounts.vote_record;
        vote_record.voter = voter.key();
        vote_record.has_voted = true;
        vote_record.choice_index = choice_index;

        // Increment event total votes
        let idx = choice_index as usize;
        if let Some(vote_count) = event.total_votes.get_mut(idx) {
            *vote_count += 1;
            msg!("Voter {} cast vote for choice {}", voter.key(), idx);
        } else {
            return Err(error!(ErrorCode::InvalidChoice));
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String, description: String, choices: Vec<String>, deadline: i64, timestamp: i64)]
pub struct InitializeEvent<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + EventAccount::MAX_SIZE,
        seeds = [
            b"event",
            creator.key().as_ref(),
            &timestamp.to_le_bytes(), 
        ],
        bump
    )]
    pub event: Account<'info, EventAccount>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

#[account]
pub struct EventAccount {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub choices: Vec<String>,
    pub deadline: i64,
    pub total_votes: Vec<u32>,
}

impl EventAccount {
    pub const MAX_SIZE: usize =
        32 + // creator
        4 + 64 + // title (max 64 chars)
        4 + 256 + // description (max 256 chars)
        4 + (4 + 64) * 10 + // choices (up to 10 choices, each 64 chars)
        8 + // deadline
        4 + (4 * 10); // total_votes (up to 10)
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub event: Account<'info, EventAccount>,

    #[account(
        init,
        payer = voter,
        space = 8 + VoteAccount::MAX_SIZE,
        seeds = [b"vote", event.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteAccount>,

    #[account(mut)]
    pub voter: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct VoteAccount {
    pub voter: Pubkey,
    pub has_voted: bool,
    pub choice_index: u8,
}

impl VoteAccount {
    pub const MAX_SIZE: usize = 32 + 1 + 1;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Voting deadline has passed")]
    VotingClosed,
    #[msg("You have already voted")]
    AlreadyVoted,
    #[msg("Invalid choice index")]
    InvalidChoice,
    #[msg("No choices provided for the event")]
    NoChoicesProvided,
    #[msg("Title is too long (max 64 characters)")]
    TitleTooLong,
    #[msg("Description is too long (max 256 characters)")]
    DescriptionTooLong,
}