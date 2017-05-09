pragma solidity ^0.4.2;
contract Daisee {

    // variables
    //// tarif de l'énergie en DaiseeCoin
    uint private rate;
    bool private transactionOK;
    //// utilisateurs
    mapping (address => uint) public energyProduction;
    mapping (address => uint) public totalEnergyConsumption;
    ///// energyConsumption[msg.sender][origin]
    mapping (address => mapping (address => uint256)) public energyConsumption;
    ///// allowance[seller][msg.sender]
    mapping (address => mapping (address => uint256)) public allowance;

    // constructeur
    function Daisee() {
        rate = 1; // (=> 1W = 1 DaiseeCoin)
    }

    // définition des events (pour affichage à partir de la lecture des logs)
    event Produce(address from, uint energy);
    event Consume(address from, address origin, uint energy);
    event Buy(address from, address to, uint energy);


    // fonction permettant de payer en DaiseeCoin
	function sendCoin(address coinContractAddress,
	                  address energyBuyer,
	                  address energySeller,
	                  uint amount)
	                  returns (bool success){
		token m = token(coinContractAddress);
		success = m.transferFrom(energyBuyer, energySeller, amount);
		return success;
	}


    // fonction permettant de mettre à jour l'énergie produite et
    // donc dispo à la vente
    // seul le propriétaire du compte peut mettre à jour sa prod
    function setProduction(uint energy) returns (uint EnergyProd) {
        energyProduction[msg.sender] += energy;

        //event
        Produce(msg.sender, energy);

        return energyProduction[msg.sender];
    }

    // fonction permettant de consommer de l'énergie
    // seul le propriétaire du compte peut mettre à jour sa prod
    function consumeEnergy (address origin, uint energy) returns (uint EnergyCons) {
        // dans le cas où on achète de l'énergie d'un autre noeud
        if ( origin != msg.sender &&
             energy > allowance[origin][msg.sender] ) throw;
        else allowance[origin][msg.sender]    -= energy;

        energyConsumption[msg.sender][origin] += energy;
        totalEnergyConsumption[msg.sender]    += energy;

        // event
        Consume(msg.sender, origin, energy);

        return totalEnergyConsumption[msg.sender];
    }

    // fonction permettant la vente d'énergie
    function buyEnergy(address coinContractAddress, address seller, uint energy) returns (bool transactionOK) {

        // on verifie d'abord que l'acheteur n'achète pas sa propre énergie
        if ( msg.sender == seller ) throw;

        // appel de la fonction de transfer de DaiseeCoin
        // 1W = 1DaiseeCoin, pas de besoin de conversion
        transactionOK = sendCoin(coinContractAddress, msg.sender, seller, energy);
        if (transactionOK != true) throw;

        // on met à jour la quantité d'énergie pouvant être consommée
        allowance[seller][msg.sender] += energy;

        //event
        Buy(msg.sender, seller, energy);

        return transactionOK;
    }

}