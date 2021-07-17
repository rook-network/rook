# Concepts

*This section explains the high level thinking behind Plural*

## Mechanics

### Versions

We can breakdown the mechanics of governance into three phases that follow a somewhat cyclic pattern. These phases are ideation, discussion, and voting. 

When thinking about ideation we shouldn't think of it as purely a single member proposing a change and the rest voicing their view rather it should be a more continual and fluid process where members can not only agree or disagree with a proposal but explain how they would do it. Plural accommodates to this by having what is known as proposal versions. A proposal starts with the original proposal but allows for other members to append suggestions for amendments each as a valid version. 

Members are able to thus vote, and change their vote on which version of the proposal they want to see executed (they can also vote to reject entirely). The first version to receive the threshold of votes gets executed.

An important consideration is how voting mingles with the timeline of these amendments. One option may have been to allocate time for each and have distinct phases. Instead, Plural allows members to continually vote and change votes (even to change the amount of tokens as mentioned further down). 

### Preferences

Most governance systems are composed of non perishable weights. This means that someone with 10 votes always votes with those 10 votes in every proposal. The problem with this is that it completely neglects the strength of preference the member has in their decision making. This is especially important for representing minority members. To create preference there needs to be a concept of scarcity with which members must make a tradeoff. The logical starting place for this is to create scarcity across multiple proposals within the system. The more you care about one proposal the less you are able to care about others. To achieve this Plural uses tokens. Tokens are accumulated predominantly based on the weight of the member. After every proposal a user earns its weight in tokens. When it comes to voting, a member not only picks the version but also the amount of tokens that they want to commit to it. Therefore, a member that believes strongly in a certain proposal must sacrifice vote strength in prior proposals and forego vote strength in future ones. To maintain some degree of balance between proposals, polities can set either a `MaxTokenLeverage` or a quadratic `TallyPolicy`.

As a side note, we have also considered the possibility of a token market (i.e. trading of tokens between members) as a possibility to explore in the future.

The term token is heavily used in this space and might cause confusion with the bundle of tokens that the polity collectively holds in its account. To avoid this, we may consider renaming token to something else but we find it best describes its use. 

### Policies

A governance system that favours flexibility and the opportunity for polities to develop a system that is tailored to them requires the opportunity to tweak various aspects. Plural defines these adjustable knobs as policies. 

The full list of policies can be found [here](../usage/policies.md)

## Framework

The framework delves more into the composition of the design itself whilst still remaining high level. For more in depth description, refer to either the state or messages section. As the implementation is written in rust, the spec is also defined in rust. The contract is built using [Anchor](https://github.com/project-serum/anchor).

### Groups

A polity is based around an evolving set of members, each represented as an account (note that an entire polity could serve as a member of another polity). These members participate in the governance process at varying capacities dictated by a combination of both weights and roles. Using weights aligns naturally with staking systems where members all contribute to the collective total and thus have a proportional weight. Roles are used to describe permissions within the group: who can vote and propose and what they can vote and propose.

**Entry**

The standard flow of joining a group is either to apply (if the polity accepts public proposals) or to be invited (if the group is private). Both methods are done via a *Membership* proposal. This includes a bid (an arbitrary amount of tokens to be added to the collective account and can be 0), a weight and any roles that the joining account may belong to.

**Update**

Change of membership weights and roles follows an almost identical pattern as entering a polity. 

**Exit**

All members have the right to exit whenever they want. However this comes with the catch: a sole exit does not guarantee that a member is able to capture the value they may have put into the entity. For that to happen a member must create a *Membership* proposal to leave the group and receive a specified share from the collective account. 

You may observe that this also covers the situation where a member is being kicked out. We currently don't distinguish this but we could based on whether the proposer is the member being removed or not and thus have different election conditions depending on the situation. 

**Roles and Permissions**

Some systems may want to establish constraints as to what actions members can do. This can be helpful when dividing a large entity into smaller purpose built groups to manage various aspects. Roles are a method of grouping permissions together and assigning them to members. Permissions define the actions that a member can (and potentially can't) do. Plural categorizes permissions first by proposal type (see below for more information) and then by program_id (defined as `Pubkey`). As a quick example, say a polity managed a margin trading protocol which consisted of two contracts: one for the actual trading and another for the lending pool. The polity could create a role with permission: `plural::permission::external(lending_program_id)`, assign the role to a group of accounts so that only they could propose and vote to open lending pools for new tokens. Another role could be to manage membership (`plural:permission:membership`). 

The permission system is still relatively limited on granularity but this may be revised at a later point.

### Proposals

So far we've given very little mention as to what a proposal really is. This is largely because proposals are left very abstract. Outside of a few parameters and off-chain links, a proposal is essentially an array of `Instruction`s. Therefore, a proposal can be for anything that a regular individual account in Solana can do. This may be to call another smart contract or interact with it in some capacity or it may be to transfer funds. The surface of options resides outside of the scope of what Plural really is focused on - which is the collective decision making process itself. There is, however, some nomenclature and rules around proposals. We can divide the type of proposal three ways: 

1. **External:** proposals which executes instructions on something outside of the polity. 
2. **Policy:** proposals which execute instructions to change one or more policies within the polity.
3. **Membership:** proposals which execute instructions to change the membership within the polity 

Each of these proposals may be defined by a different `VotePolicy` (a subset of policies related specifically to voting). Thus proposals must be exclusively one of these three types (cannot combine). . Furthermore, Plural Proposals contain the following features:

- Proposals may require a deposit to mitigate spam. These deposits are kept in a separate account (to make sure the collective account doesn't accidentally use them). If a proposal receives enough `Remove` votes, the proposal is taken down and the deposit funds are moved into the collective account
- Proposals may consume tokens by the proposer.
- The proposer by default does not automatically vote for their proposal rather they must do this separately and indicate the strength of their preference.

### Voting

Members cast their votes to a polity with the following arguments:

```rust
vote(proposal_id: u32, version: u8, amount: u32) 
```

The version signals which proposal exactly the member is for. This starts at 1 for the genesis proposal. A version of 0 corresponds to a vote rejecting the proposal. Voters can change their vote as they please. A separate method is used to signal to remove the proposal:

```rust
remove_proposal(proposal_id: u32, version: u8)
```

Removing the genesis version (1) removes the entire proposal. `remove` doesn't use tokens but rather goes off the members weight.