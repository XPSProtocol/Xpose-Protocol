const erc20Token = artifacts.require('XPSToken');
const pair = artifacts.require("IPancakePair");
const router = artifacts.require("IPancakeRouter02");

async function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

contract("XPSToken", accounts => {
  const owner = accounts[1]

  const commonFeeAcc = accounts[0];
  const freeFeeAcc = accounts[3];
  const specialFeeAcc = accounts[4];
  const receiverAddress = accounts[2];

  const sigAcc0 = accounts[0];
  const sigAcc1 = accounts[1];
  const sigAcc2 = accounts[2];
  const sigAcc3 = accounts[3];
  const sigAcc4 = accounts[4];

  it("Check excluding from | including in fee", async () => {
    const instance = await erc20Token.deployed()
    instance.excludeFromFee(accounts[0], {from: owner}).then(async () => {
      let excluded = await instance.isExcludedFromFee.call(accounts[0])
      assert.equal(excluded, true, "Excluding from fee isn't working")

      instance.includeInFee(accounts[0], {from: owner}).then(async () => {
        let excluded = await instance.isExcludedFromFee.call(accounts[0])
        assert.equal(excluded, false, "Including in fee isn't working")
      })
    })

    instance.includeInFee(accounts[0], {from: accounts[0]}).then(() => {
      assert.equal(true, false, "This method should be allowed only by owner")
    }).catch((e) => {
      assert.equal(e.receipt.status, false, "This method should be allowed only by owner")
    })

    instance.excludeFromFee(accounts[0], {from: accounts[0]}).then(() => {
      assert.equal(true, false, "This method should be allowed only by owner")
    }).catch((e) => {
      assert.equal(e.receipt.status, false, "This method should be allowed only by owner")
    })
  });
  it("Check excluding from | including in Special fee", async () => {
    const instance = await erc20Token.deployed()
    instance.includeInSpecialFee(accounts[0], {from: owner}).then(async () => {
      let excluded = await instance.isIncludedInSpecialFee.call(accounts[0])
      assert.equal(excluded, true, "Excluding from fee isn't working")

      instance.excludeFromSpecialFee(accounts[0], {from: owner}).then(async () => {
        let excluded = await instance.isIncludedInSpecialFee.call(accounts[0])
        assert.equal(excluded, false, "Including in fee isn't working")
      })
    })

    instance.includeInSpecialFee(accounts[0], {from: accounts[0]}).then(() => {
      assert.equal(true, false, "This method should be allowed only by owner")
    }).catch((e) => {
      assert.equal(e.receipt.status, false, "This method should be allowed only by owner")
    })

    instance.excludeFromSpecialFee(accounts[0], {from: accounts[0]}).then(() => {
      assert.equal(true, false, "This method should be allowed only by owner")
    }).catch((e) => {
      assert.equal(e.receipt.status, false, "This method should be allowed only by owner")
    })
  });
  it("Vote Common Fee", async () => {
    const instance = await erc20Token.deployed()
    const prevFee = (await instance._commonFee.call()).toNumber()
    const newFee = prevFee - 1

    // Positive
    let isInVote = await instance._inVoteCommonFee.call()
    assert.equal(isInVote, false, "Voting should be ended to test")
    await instance.startVoteForCommonFee(newFee, {from: sigAcc1})

    isInVote = await instance._inVoteCommonFee.call()
    assert.equal(isInVote, true, "Voting wasn't started")

    try {
      await instance.voteForCommonFee(true, {from: sigAcc1})
      assert.equal(true, false, "You can't vote double")
    } catch (e) {
      assert.equal(e.receipt.status, false, "You can't vote double")
    }
    await instance.voteForCommonFee(true, {from: sigAcc2})
    await instance.voteForCommonFee(true, {from: sigAcc3})

    isInVote = await instance._inVoteCommonFee.call()
    assert.equal(isInVote, false, "Voting should end after 3 accepts")
    let commonFee = await instance._commonFee.call()
    assert.equal(commonFee, newFee, "Fee wasn't changed")

    // Negative
    await instance.startVoteForCommonFee(prevFee, {from: sigAcc2})

    isInVote = await instance._inVoteCommonFee.call()
    assert.equal(isInVote, true, "Voting wasn't started")

    try {
      await instance.voteForCommonFee(false, {from: sigAcc2})
      assert.equal(true, false, "You can't vote double")
    } catch (e) {
      assert.equal(e.receipt.status, false, "You can't vote double")
    }
    await instance.voteForCommonFee(false, {from: sigAcc1})
    await instance.voteForCommonFee(false, {from: sigAcc3})
    await instance.voteForCommonFee(false, {from: sigAcc4})

    isInVote = await instance._inVoteCommonFee.call()
    assert.equal(isInVote, false, "Voting should end after 3 accepts")
    commonFee = await instance._commonFee.call()
    assert.equal(commonFee, newFee, "Fee was changed")

    // Turn back
    await instance.startVoteForCommonFee(prevFee, {from: sigAcc3})

    isInVote = await instance._inVoteCommonFee.call()
    assert.equal(isInVote, true, "Voting wasn't started")

    try {
      await instance.voteForCommonFee(false, {from: sigAcc3})
      assert.equal(true, false, "You can't vote double")
    } catch (e) {
      assert.equal(e.receipt.status, false, "You can't vote double")
    }
    await instance.voteForCommonFee(true, {from: sigAcc1})
    await instance.voteForCommonFee(true, {from: sigAcc2})

    isInVote = await instance._inVoteCommonFee.call()
    assert.equal(isInVote, false, "Voting should end after 3 accepts")
    commonFee = (await instance._commonFee.call()).toNumber()
    assert.equal(commonFee, prevFee, "Fee wasn't changed")
  })

  // it("Transfer", async () => {
  //   const instance = await erc20Token.deployed()
  //   const pairAddress = await instance.pancakeswapV2Pair.call()
  //   const routerAddress = await instance.pancakeswapV2Router.call()
  //   const pairInstance = await pair.at(pairAddress);
  //   const routerInstance = await router.at(routerAddress);
  //
  //   // Initiate liquidity
  //   await instance.approve(routerAddress, "100000000000000000000000", {from: owner});
  //   await routerInstance.addLiquidityETH(erc20Token.address, "10000000000000", "10000000000000", "10", owner, (Math.floor(Date.now() / 1000) + 3600), {
  //     value: "10000000000000000",
  //     from: owner
  //   })
  //   const transferAmount = 100000;
  //
  //   // Common
  //   await instance.transfer(commonFeeAcc, transferAmount, {
  //     from: owner
  //   })

  //   assert.equal(await instance.isExcludedFromFee.call(commonFeeAcc), false, "common fee acc shouldn't be excluded from fee")
  //   assert.equal(await instance.isIncludedInSpecialFee.call(commonFeeAcc), false, "common fee acc shouldn't be included in special fee")
  //
  //   const commonAccBalance = (await instance.balanceOf.call(receiverAddress)).toNumber()
  //   const commonFee = (await instance._commonFee.call()).toNumber()
  //
  //   await sleep(30000)
  //   await instance.transfer(receiverAddress, transferAmount, {
  //     from: commonFeeAcc
  //   })
  //   const newCommonAccBalance = (await instance.balanceOf.call(receiverAddress)).toNumber()
  //   assert.equal(newCommonAccBalance, ((transferAmount * (100 - commonFee) / 100) - commonAccBalance), "Balances isn't equal")
  //
  //   // Excluded from fee
  //   await instance.transfer(freeFeeAcc, transferAmount, {
  //     from: owner
  //   })
  //
  //   instance.excludeFromFee(freeFeeAcc, {from: owner});
  //   assert.equal(await instance.isExcludedFromFee.call(freeFeeAcc), true, "Acc should be excluded from fee")
  //
  //   const freeAccBalance = (await instance.balanceOf.call(receiverAddress)).toNumber()
  //
  //   await instance.transfer(receiverAddress, transferAmount, {
  //     from: freeFeeAcc
  //   })
  //   const newFreeAccBalance = (await instance.balanceOf.call(receiverAddress)).toNumber()
  //   assert.equal(newFreeAccBalance, (transferAmount - freeAccBalance), "Balances isn't equal")
  //
  //   // Special Fee
  //
  //   await instance.transfer(specialFeeAcc, transferAmount, {
  //     from: owner
  //   })
  //   instance.includeInSpecialFee(specialFeeAcc, {from: owner});
  //   assert.equal(await instance.isExcludedFromFee.call(specialFeeAcc), false, "Acc shouldn't be excluded from fee")
  //   assert.equal(await instance.isIncludedInSpecialFee.call(specialFeeAcc), true, "Acc should be include in special fee")
  //
  //   const specialAccBalance = await instance.balanceOf.call(receiverAddress).toNumber()
  //   const specialFee = (await instance._specialFee.call()).toNumber()
  //   await instance.transfer(receiverAddress, transferAmount, {
  //     from: specialFeeAcc
  //   })
  //   const newSpecialAccBalance = (await instance.balanceOf.call(receiverAddress)).toNumber()
  //   assert.equal(newSpecialAccBalance, ((transferAmount * (100 - specialFee) / 100) - specialAccBalance), "Balances isn't equal")
  // })
})