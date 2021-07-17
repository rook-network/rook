# State

*This section outlines the composition and structure of the governance entity or contract held in Solana.*

Here we get closer to the code. It's important to note that this section is still a WIP. For the most up to date state, refer to the code.

```rust
#[state]
pub struct Polity {
	// all the members within the polity
	members: HashMap<u32, Member>

	// the collective account shared amongst the members
	account: CpiAccount<'info, TokenAccount>
	
	// array of possible roles within the group. NOTE: roles can not be removed
	// from a polity completely, just from individual members.
	roles: Vec<Role>

	// keep track of what the next proposal id should be
	last_proposal_id: u32

	// used to store the deposits of active proposals
	deposit_vault: CpiAccount<'info, TokenAccount>
}
```

### Membership

```rust
pub struct Member {
	pub member_id: u32

	// the account (this can theoretically be another DAO)
	pub account: Pubkey

	pub policy: VersionedPolicy

	// the accumulated voting power
	pub tokens: u64

	// the weight of the member (this is rate at which tokens accumulate) 
	pub weight: u32

	// array of indexes corresponding to roles that the member has
	pub role_code: Vec<u8>
}
```

```rust
pub struct Role {
	// a list of permissions that the role has
	permissions: Vec<Permission>
}

pub struct Permission {
	// enum: external | policy | membership
	proposal_type: ProposalType

	// optional pub key for external proposal types
	program_id: Pubkey
}
```

### Proposals

Proposals are kept as separate program accounts

```rust
pub struct Proposal {
	// unique id of the polity associated with the proposal
	polity: Pubkey
	
	// pubkey or index of the member who proposed the proposal
	proposer: PubkeyOrIndex

	// the set of instructions to to be executed by the program account on passing
	instructions: Vec<Instruction>

	// a static pointer, most likely IPFS or a URL, to further content or 
	// justification regarding the genesis proposal
	content: str
	
	// a static pointer to the forum, discussing the proposal
	forum: str,

	// voteset tracks who has voted, what they have voted on and the amount
	// of tokens they have committed to that proposal
	votes: HashMap<u32 Vote>
	
	// keeps track of the running totals for each version
	tally: Tally

	// array of ammendments. referring to specific amendments when voting is 
	// done based of the index.  
	ammendments: Vec<Ammendment>
}
```

```rust
pub struct Ammendment {
	proposer: u32
	msgs: Vec<Instruction>
	content: str
}
```

### Voting

```rust
pub struct Vote {
	choice: u8
	tokens: u64
}
```

```rust
pub struct Tally {
	// indexed by version id. keeps track of the running total for each version
	totals Vec<u64>
}
```