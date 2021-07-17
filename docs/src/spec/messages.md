# Messages

*This section outlines the interface the contract has with users*

### Initialize

instantiates an instance of the contract, thus creating a new Polity

```rust
pub fn initialize(
	ctx: Context<InitializeMsg>,
	roles: Vec<Role>,
	members: Vec<Member>,
) -> Result<()> { ... }

#[derive(Accounts)]
pub struct InitializeMsg<'info> {
	#[account(init)]
	polity: ProgramAccount<'info, Polity>
	rent: Sysvar<'info, Rent>
}

pub struct Member {
	account: Pubkey,
	weight: u32,
	roleIndices: Vec<u8>, 
}
```

### CreateProposal

```rust
pub fn create_proposal(
	ctx: Context<CreateProposalMsg>,
	instructions: Vec<Instructions>,
	content: str,
	forum: str,
) -> Result<()> { ... }

#[derive(Accounts)]
pub struct CreateProposalMsg<'info> {
	#[account(mut)]
	polity: ProgramAccount<'info, Polity>
	#[account(signer)]
	proposer: AccountInfo<'info>
	#[account(init)]
	proposal: ProgramAccount<'info, Proposal>
}
```

### AmendProposal

```rust
pub fn amend_proposal(
	ctx: Context<AmendProposalMsg>
	proposal_id: u32,
	instructions: Vec<Instruction>,
	content: str,
) -> Result<()> { ... }

#[derive(Accounts)]
pub struct AmendProposalMsg<'info> {
	polity: ProgramAccount<'info, Polity>
	#[account(signer)]
	proposer: AccountInfo<'info>
	#[account(mut)]
	proposal: ProgramAccount<'info, Proposal>
}
```

### Vote

```rust
pub fn vote(
	ctx: Context<VoteMsg>
	choice: u8,
	tokens: u64,
) -> Result<()> { ... }
 
#[derive(Accounts)]
pub struct VoteMsg {
	#[account(mut)]
	polity: ProgramAccount<'info, Polity>
	#[account(signer)]
	voter: AccountInfo<'info>
	#[account(mut)]
	proposal: ProgramAccount<'info, Proposal>
}
```

### RemoveProposal

```rust
pub fn remove_proposal(
	ctx: Context<RemoveProposalMsg>,
	version: u8,
)

#[derive(Accounts)]
pub struct RemoveProposalMsg {
	#[account(mut)]
	polity: ProgramAccount<'info, Polity>
	#[account(signer)]
	voter: AccountInfo<'info>
	#[account(mut)]
	proposal: ProgramAccount<'info, Proposal>
}
```

### LeavePolity

```rust
pub fn leave_polity{
	ctx: Context<LeavePolityMsg>,
}

pub struct LeavePolityMsg {
	#[account(mut)]
	polity: ProgramAccount<'info, Policy>
	#[account(signer)]
	member: AccountInfo<'info>
}
```

The following messages can only be called by the Program itself (upon execution of a proposal) and thus uses the `Auth` context

```rust
#[derive(Accounts)]
pub struct Auth<'info> {
	#[account(mut)]
  polity: ProgramAccount<'info, Polity>,
  #[account(signer, seeds = [
      polity.to_account_info().key.as_ref(),
      &[polity.nonce],
  ])]
  polity_signer: AccountInfo<'info>,
}
```

### AddMember

```rust
pub fn add_member(
	ctx: Context<Auth>,
	member: Member,
	bid: u64,
) -> Result<()> { ... }
```

### UpdateMemberWeight

```rust
pub fn update_member_weight(
	ctx: Context<Auth>,
	member_id: u32,
	weight: u32,
) -> Result<()> { ... }
```

### UpdateMemberRoles

```rust
pub fn update_member_roles(
	ctx: Context<Auth>,
	member_id: u32,
	roles: Vec<Role>
) -> Result<()> { ... }
```

### RemoveMember

```rust
pub fn remove_member {
	ctx: Context<Auth>
	member_id: u32,
) -> Result<()> { ... }
```

### ChangePolicy

```rust
pub fn change_policy {
	ctx: Context<Auth>
	policies: Vec<PolicyChanges>
} -> Result<()> { ... }
```