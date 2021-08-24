# XPS Token Contract

The XPS token is a BEP20 token. The token will have a fixed supply and each token is divisible up to fixed decimal places.

The contract used some of libraries and interfaces of openzeppelin.

## Details

### There are some fixed fees apply on each transfer

- Liquidity Pool Fee - 50%
- Marketing Pool Fee - 40%
- Burn Pool Fee - 5%
- Community Reward Pool Fee - 5%

### Main fees
- Common fee - default 5% (can be updated by multisig wallet)
- Special fee - default 10% (can be updated by multisig wallet)

### Some default settings
- Supply for team from initial supply - 15%
- Release first step - 60%
- Release second step - 40%
- Liquidity trigger amount - 500000 tokens
- Marketing trigger amount - 500000 tokens
- Community trigger amount - 500000 tokens

### Deployer/Owner can set below things while deploy
- Name
- Symbol
- Decimals
- Initial supply
- Marketing pool wallet
- Pancakeswap router address
- Team wallet
- Locked tokens for team from initial supply
- Time to release defined portion of the locked tokens for team
- Exclude some addresses to be free from fee
- Multisig wallets

## Smart contract Owner functions

###excludeFromFee
Set caller of transfer to be free from the transaction fees.
###includeInFee
Set caller of transfer to be applicable for transaction fees.
###includeInSpecialFee
Set caller of transfer to be applicable for special fee of transaction.
###excludeFromSpecialFee
Set caller of transfer to be free from special fee on transaction.


## Multisig wallet functions

### startVoteForCommonFee , startVoteForSpecialFee, startVoteForMarketingPoolWallet, startVoteForCommunityRewardPoolWallet

Multisig wallet owners can start voting for new common fee, special fee, marketing pool wallet and community reward wallet.
- Common fee can be set to maximum 5%.
- Special fee can be set to maximum 10%.
- Marketing pool wallet and community reward wallet can be a wallet address.

###voteForCommonFee,  voteForSpecialFee,  voteForMarketingPoolWallet,  voteForCommunityRewardPoolWallet
Multisig wallet owner can give his vote for new introduced common fee, special fee, marketing pool wallet and community reward wallet. If any of 3 multisig wallets give positive vote for each of them, then those will be apply for all the transfer based on some conditions.


## User functions

### releaseTeamFirstStep, releaseTeamSecondStep

These functions are used to release vested tokens after specified time like 243/365 days.

##Transfer

If the caller is not excluded from fee then
- Common fee will be applied for all the transactions if the caller is not included in white listed address.
- Special fee will be applied for all the transactions for specific white listed address.
- Community reward pool fee will be applied on all the transactions. If the total community reward pool fee collected is more than some specified limit of community reward pool amount and if swapping on transaction has been set then the swapped currency of the token will be send to community reward pool wallet.
- Marketing pool fee will be applied on all the transactions. If the total marketing pool fee collected is more than some specified limit of marketing pool amount and if swapping on transaction has been set then the swapped currency of the token will be send to marketing pool wallet.
- Liquidity pool fee will be applied on all the transactions. If the total liquidity pool fee collected is more than some specified limit of liquidity pool amount and if swapping on transaction has been set then the half of the swapped currency of the token will be added as liquidity to Pancake. To add liquidity to Pancake, first of all a pair is created for the token and WETH.
- Burn fee will be applied on all the transactions. Tokens amount of burn fee get burned from the contract
- After subtracting all the fees, remained token will be transfer to recipient.


## Installation

Use the package manager [yarn](https://yarnpkg.com/) to install packages.

```bash
yarn install
```

## Usage

Create .secret file and put your mnemonic phrase into it

Change the addresses within the contract to the ones you want

```javascript
truffle migrate --network <network name>
truffle run verify XPStoken --network <network name>
```
Create a liquidity pool


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
