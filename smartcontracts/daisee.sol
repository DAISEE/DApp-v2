pragma solidity ^0.4.2;
contract Daisee {

    // variables
    //// tarif de l'énergie en DaiseeCoin
    uint private rate;
    bool private transactionOK;
    //// utilisateurs
    mapping (address => uint) energyProduction;
    mapping (address => uint) energyBalance;
    mapping (address => uint) energyConsumption;

    // constructeur
    function Daisee() {
        rate = 1; // (=> 1W = 1 DaiseeCoin)
    }

    // définition des events pour les appels à partir des clients légers
    event Produce(address from, uint energy);
    event Consume(address from, uint energy);
    event Buy(address from, address to, uint energy);


    // fonction permettant de payer en DaiseeCoin
	function sendCoin(address coinContractAddress, address energyBuyer, address energySeller, uint amount) returns (bool success){
		token m = token(coinContractAddress);
		success = m.transferFrom(energyBuyer, energySeller, amount);
		return success;
	}


    // fonction permettant de mettre à jour l'énergie produite et
    // donc dispo à la vente
    // seul le propriétaire du compte peut mettre à jour sa prod
    function setProduction(uint energy) returns (uint EnergyBal) {
        energyProduction[msg.sender] += energy;
        energyBalance[msg.sender] += energy;
        //event
        Produce(msg.sender, energy);
        return energyBalance[msg.sender];
    }

    // fonction permettant de consommer de l'énergie
    // seul le propriétaire du compte peut mettre à jour sa prod
    function consumeEnergy (uint energy) returns (uint EnergyBal) {
        // on vérifie d'abord qu'il y a d'énergie
        if ( energy > energyBalance[msg.sender] ) throw;
        energyBalance[msg.sender]     -= energy;
        energyConsumption[msg.sender] += energy;
        // event
        Consume(msg.sender, energy);
        return energyBalance[msg.sender];
    }

    // fonction permettant la vente d'énergie
    function buyEnergy(address coinContractAddress, address seller, uint energy) returns (bool transactionOK) {
        // on vérifie qu'il y a suffisamment d'énergie dispo
        if ( energy > energyBalance[seller] ) throw;
        // appel de la fonction de transfer de DaiseeCoin
        // 1W = 1DaiseeCoin, pas de besoin de conversion
        transactionOK = sendCoin(coinContractAddress, msg.sender, seller, energy);
        if (transactionOK != true) throw;
        // on met à jour les balances de chaque utilisateur
        energyBalance[msg.sender] += energy;
        energyBalance[seller]     -= energy;
        //event
        Buy(msg.sender, seller, energy);
        return transactionOK;
    }

    // fonction permettant de connaitre sa balance d'energie
    function getEnergyBalance() returns (uint energyBal) {
        return energyBalance[msg.sender];
    }

    // fonction permettant de connaitre sa consommation totale
    function getEnergyConsumption() returns (uint energyBal) {
        return energyConsumption[msg.sender];
    }

    // fonction permettant de connaitre sa production totale
    function getEnergyProduction() returns (uint energyBal) {
        return energyProduction[msg.sender];
    }
    
    // fonction permettant de connaitre le tarif de l'energie
    function getRate() returns (uint energyRate) {
        return rate;
    }
}