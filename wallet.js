async function generateAddressesFromSeed(seed, count) {
    let bip39 = require("bip39");
    let {hdkey} = require('ethereumjs-wallet');
    let hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(seed));
    let wallet_hdpath = "m/44'/60'/0'/0/";

    let accounts = [];
    for (let i = 0; i < 10; i++) {

        let wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
        let address = '0x' + wallet.getAddress().toString("hex");
        let privateKey = wallet.getPrivateKey().toString("hex");

        if(address == '0xD8f7331dB368f2d082810b35e77FC7420413F7B4'.toLocaleLowerCase())
        {
            console.log(privateKey, privateKey.length);
        }
        accounts.push({address: address, privateKey: privateKey});
    }

    return accounts;
}

generateAddressesFromSeed(seed, 10).then(res => {
    // console.log(res)
})

