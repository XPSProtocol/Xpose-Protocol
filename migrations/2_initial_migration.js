const XposeProtocol = artifacts.require("XposeProtocol");

module.exports = function (deployer) {
  deployer.deploy(XposeProtocol,
    'Xpose Protocol',                                   // string memory contractName,
    'XP',                                              // string memory contractSymbol,
    9,                                                  // uint8 contractDecimals,
    '10186921194000000000',                             // uint256 initialSupply,
    '0x8B991B7B55BDe2F96F239bC1704bBB735b42C4Af',       // address payable initialMarketingPoolWallet,
    '0x87eb865Bbc69645d81a5F99f8fbC081faB5cc8e3',       // address payable initialCommunityRewardPoolWallet,
    '0xA5beA4B931AB6345266b0FB0F3D7608BbE51a689',       // address routerAddress,
    '0xb13121eC52F63798664B904473E98b39004Eb184');      // address contractTeamWallet

  // deployer.deploy(XPSToken,
  //   'Xpose Protocol',
  //   'XPS',
  //   9,
  //   '30000000000000000000',
  //   '0x8B991B7B55BDe2F96F239bC1704bBB735b42C4Af',
  //   '0x87eb865Bbc69645d81a5F99f8fbC081faB5cc8e3',
  //   '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  //   '0xb13121eC52F63798664B904473E98b39004Eb184');
};
