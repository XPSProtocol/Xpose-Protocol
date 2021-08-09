const xpsToken = artifacts.require("XPSToken");

// const routerAddress = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"; // test
const routerAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; // main
const lpSize = "100" + "000000000";

module.exports = function (deployer) {
    deployer.deploy(
        xpsToken,
        "XPS Token", //name
        "XPOSE", // symbol
        9, // decimals
        // supply    // decimals
        "1000000000000" + "000000000", //initialSupply
        "0x8B991B7B55BDe2F96F239bC1704bBB735b42C4Af", //initialMarketingPoolWallet @TODO change marketing wallet
        "0x87eb865Bbc69645d81a5F99f8fbC081faB5cc8e3", // initialCommunityRewardPoolWallet @TODO change community wallet
        routerAddress,
        "0xb13121eC52F63798664B904473E98b39004Eb184" // TeamWallet @TODO change team wallet
    )

    // deployer.deploy(
    //     xpsToken,
    //     "Cloud9bsc.finance", //name
    //     "CLOUD9", // symbol
    //     9, // decimals
    //     // supply    // decimals
    //     "99999999000000000", //initialSupply
    //     "0x26742b974e910391Ed970cB9bb39dfa69784dDb5", //promoPoolAddress
    //     "0x53bc04198D7BE53Bc298433d28B2b64E838225e0", // tokenOwnerAddress
    //     "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    // );
};
