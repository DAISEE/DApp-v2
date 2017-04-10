pragma solidity ^0.4.0;
contract Daiseev2 {

    // variables

    //// tarif de l'énergie en finney
    uint private rate;
    //// utilisateurs
    mapping (address => uint) energyProduction;
    mapping (address => uint) energyBalance;
    mapping (address => uint) energyConsumption;


    // constructeur
    function Daisee() {
        rate = 15 finney; // (= 0.015 ethers)
    }

    // définition des events pour les appels à partir des clients légers (non implémenté)
    event Produce(address from, uint energy);
    event Consume(address from, uint energy);
    event Buy(address from, address to, uint energy);

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
    function buyEnergy(address seller, uint energy) returns (bool transactionOK) {
        // on verifie d'abord que l'acheteur n'achète pas sa propre énergie
        if ( msg.sender == seller ) throw;
        // on vérifie qu'il y a suffisamment d'énergie dispo
        if ( energy > energyBalance[seller] ) throw;
        // on verifie que l'acheteur a suffisamment de fond
        if ( (energy * rate ) > msg.sender.balance ) throw;
        // on met à jour les balances de chaque utilisateur
        energyBalance[msg.sender] += energy;
        energyBalance[seller]     -= energy;
        //event
        Buy(msg.sender, seller, energy);
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