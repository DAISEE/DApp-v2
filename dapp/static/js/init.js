var ip = location.host;
$.getJSON("http://" + ip  + "/getconfig/", function (data) {

    var json = JSON.stringify(data.result);
    var config = JSON.parse(json);

    var contractAddress = config.contract;
    var account = config.coinbase;
    var tokenAddress = config.token;
    var url = config.ip;

    var Web3 = require("./node_modules/web3/index.js");
    if (typeof web3 !== "undefined") {
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider(url + ":8545"));
    }

    var SolidityCoder = require("web3/lib/solidity/coder.js");

    $("#nodeName").text(config.name);
    $("#nodeType").text(config.typ);
    $("#coinbase").text(account);
    $("#contract").text(contractAddress);
    $("#token").text(tokenAddress);

    web3.eth.defaultAccount = account;

    var now = new Date();

    // token contract (DaiseeCoin)
    var token = web3.eth.contract(tokenAbiArray).at(tokenAddress);

    // Get hold of contract instance
    var contract = web3.eth.contract(abiArray).at(contractAddress);

    // Contract events filters
    var consevent = contract.Consume();
    consevent.watch(function(error, result){
      if (!error){
        var from = result.args.from===account ? "me" : result.args.from;
        $("#transactions").append("<tr><td>" + result.blockNumber +
        "</td><td>" + from +
        "</td><td>" +
        "</td><td>Energy consumed : " + result.args.energy.c.toString() + " W</td></tr>");
        }
    });
    var prodevent = contract.Produce();
    prodevent.watch(function(error, result){
      if (!error){
        var from = result.args.from===account ? "me" : result.args.from;
        $("#transactions").append("<tr><td>" + result.blockNumber +
        "</td><td>" + from +
        "</td><td>" +
        "</td><td>Energy produced : " + result.args.energy.c.toString() + " W</td></tr>");
        }
    });
    var buyevent = contract.Buy();
    buyevent.watch(function(error, result){
      if (!error){
        var from = result.args.from===account ? "me" : result.args.from;
        var to = result.args.to===account ? "me" : result.args.to;
        $("#transactions").append("<tr><td>" + result.blockNumber +
        "/td><td>" + from +
        "</td><td>" + to +
        "</td><td>Energy purchased : " + result.args.energy.c.toString() + " W</td></tr>");
        }
    });

    // Update labels every second
    setInterval(function() {

      // Token balance in DaiseeCoin
      var balance = token.balanceOf(account);
      $("#balance").text(balance);

      // Block infos
      var number = web3.eth.blockNumber;
      if ($("#latestBlock").text() !== number) {
        $("#latestBlock").text(number);
        }

      var hash = web3.eth.getBlock(number).hash;
      $("#latestBlockHash").text(hash);

      var timeStamp = web3.eth.getBlock(number).timestamp;
      var d = new Date(0);
      d.setUTCSeconds(timeStamp);
      $("#latestBlockTimestamp").text(d);

      var energyProduction = contract.energyProduction(account);
      $("#energyProduction").text(energyProduction);

      var energyConsumption = contract.totalEnergyConsumption(account);
      $("#energyConsumption").text(energyConsumption);

      $("#startedAt").text(now);

    }, 1000);

});
