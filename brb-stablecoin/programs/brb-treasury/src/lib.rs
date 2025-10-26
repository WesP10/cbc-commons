use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer, MintTo, Burn};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod brb_treasury {
    use super::*;

    /// Initialize the treasury with BRBs token mint and USDC vault
    pub fn initialize_treasury(
        ctx: Context<InitializeTreasury>,
        treasury_bump: u8,
    ) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.admin = ctx.accounts.admin.key();
        treasury.brb_mint = ctx.accounts.brb_mint.key();
        treasury.usdc_vault = ctx.accounts.usdc_vault.key();
        treasury.total_collateral = 0;
        treasury.total_brb_supply = 0;
        treasury.is_paused = false;
        treasury.bump = treasury_bump;
        
        msg!("Treasury initialized with admin: {}", treasury.admin);
        Ok(())
    }

    /// Deposit USDC and mint equivalent BRBs (1:1 ratio)
    pub fn deposit_and_mint(
        ctx: Context<DepositAndMint>,
        amount: u64,
    ) -> Result<()> {
        let treasury = &ctx.accounts.treasury;
        require!(!treasury.is_paused, ErrorCode::TreasuryPaused);
        require!(amount > 0, ErrorCode::InvalidAmount);

        // Transfer USDC from user to treasury vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_usdc_account.to_account_info(),
            to: ctx.accounts.usdc_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Mint equivalent BRBs to user
        let seeds = &[
            b"treasury",
            &[treasury.bump],
        ];
        let signer = &[&seeds[..]];
        let cpi_accounts = MintTo {
            mint: ctx.accounts.brb_mint.to_account_info(),
            to: ctx.accounts.user_brb_account.to_account_info(),
            authority: ctx.accounts.treasury.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::mint_to(cpi_ctx, amount)?;

        // Update treasury state
        let treasury = &mut ctx.accounts.treasury;
        treasury.total_collateral += amount;
        treasury.total_brb_supply += amount;

        msg!("Minted {} BRBs for {} USDC", amount, amount);
        Ok(())
    }

    /// Burn BRBs and redeem equivalent USDC (1:1 ratio)
    pub fn burn_and_redeem(
        ctx: Context<BurnAndRedeem>,
        amount: u64,
    ) -> Result<()> {
        let treasury = &ctx.accounts.treasury;
        require!(!treasury.is_paused, ErrorCode::TreasuryPaused);
        require!(amount > 0, ErrorCode::InvalidAmount);
        require!(amount <= treasury.total_collateral, ErrorCode::InsufficientCollateral);

        // Burn BRBs from user
        let cpi_accounts = Burn {
            mint: ctx.accounts.brb_mint.to_account_info(),
            from: ctx.accounts.user_brb_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::burn(cpi_ctx, amount)?;

        // Transfer USDC from treasury vault to user
        let seeds = &[
            b"treasury",
            &[treasury.bump],
        ];
        let signer = &[&seeds[..]];
        let cpi_accounts = Transfer {
            from: ctx.accounts.usdc_vault.to_account_info(),
            to: ctx.accounts.user_usdc_account.to_account_info(),
            authority: ctx.accounts.treasury.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        // Update treasury state
        let treasury = &mut ctx.accounts.treasury;
        treasury.total_collateral -= amount;
        treasury.total_brb_supply -= amount;

        msg!("Redeemed {} USDC for {} BRBs", amount, amount);
        Ok(())
    }

    /// Admin function to pause/unpause the treasury
    pub fn set_pause_status(
        ctx: Context<SetPauseStatus>,
        is_paused: bool,
    ) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.is_paused = is_paused;
        
        if is_paused {
            msg!("Treasury paused by admin");
        } else {
            msg!("Treasury unpaused by admin");
        }
        Ok(())
    }

    /// Admin function to update treasury parameters
    pub fn update_treasury_params(
        ctx: Context<UpdateTreasuryParams>,
        new_admin: Option<Pubkey>,
    ) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        
        if let Some(admin) = new_admin {
            treasury.admin = admin;
            msg!("Treasury admin updated to: {}", admin);
        }
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(treasury_bump: u8)]
pub struct InitializeTreasury<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + Treasury::INIT_SPACE,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(
        init,
        payer = admin,
        mint::decimals = 6,
        mint::authority = treasury,
        mint::freeze_authority = treasury,
    )]
    pub brb_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = admin,
        token::mint = usdc_mint,
        token::authority = treasury,
    )]
    pub usdc_vault: Account<'info, TokenAccount>,
    
    /// CHECK: This is the USDC mint address (known constant)
    pub usdc_mint: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DepositAndMint<'info> {
    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump,
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub brb_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub usdc_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_brb_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_usdc_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BurnAndRedeem<'info> {
    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump,
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub brb_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub usdc_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_brb_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_usdc_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SetPauseStatus<'info> {
    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump,
        constraint = treasury.admin == admin.key() @ ErrorCode::Unauthorized
    )]
    pub treasury: Account<'info, Treasury>,
    
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateTreasuryParams<'info> {
    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump,
        constraint = treasury.admin == admin.key() @ ErrorCode::Unauthorized
    )]
    pub treasury: Account<'info, Treasury>,
    
    pub admin: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Treasury {
    pub admin: Pubkey,
    pub brb_mint: Pubkey,
    pub usdc_vault: Pubkey,
    pub total_collateral: u64,
    pub total_brb_supply: u64,
    pub is_paused: bool,
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Treasury is currently paused")]
    TreasuryPaused,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Insufficient collateral in treasury")]
    InsufficientCollateral,
    #[msg("Unauthorized access")]
    Unauthorized,
}
