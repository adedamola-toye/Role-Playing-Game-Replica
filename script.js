let xp = 0;
let health = 100;
let gold = 50;
let currentWeaponIndex = 0;
let monsterHealth;
let monsterIndex ;
let playerWeaponsInventory = ["stick"];

const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const button3 = document.getElementById('button3');
const button4 = document.getElementById('button4')
const text = document.getElementById('about-game-text');
const xpText = document.getElementById('xp-score');
const healthText = document.getElementById('health-score');
const goldText = document.getElementById('gold-score');
const monsterStats = document.getElementById('about-monster');
const monsterName = document.getElementById('monster-name');
const monsterHealthText = document.getElementById('monster-health');
const playerStats = document.getElementById("player-stats")
const weapons = [
    {
        name : "stick",
        power : 5
    },
    {
        name : "dagger",
        power : 30
    },
    {
        name : "hammer",
        power : 50
    },
    {
        name : "sword",
        power : 100
    }
]
const monsters = [
    {
        name : "Slime",
        level : 2,
        health : 15
    },
    {
        name : "Fanged Beast",
        level : 8,
        health : 60
    },
    {
        name : "Dragon",
        level : 200,
        health : 300,
    }
]
const gameLocations = [
    {
        name : "town square",
        "button text" : ["Go to store",  "Fight Monsters", "End Game"],
        "button functions" : [goToStore, fightMonsters, endGame],
        text : "You are back to the town square. What do you want to do?"
    },
    {
        name : "store",
        "button text" : ["Buy 10 health(costs10 gold)", "Buy weapon (costs 30 gold)", "Go to town square"],
        "button functions" : [buyHealth, buyWeapon,  goToTownSquare],
        text : "You are in the store. What do you want to buy?"
    },
    {
        name:"fight monsters",
        "button text" : ["Fight Slime", "Fight Beast", "Fight Dragon", "Go to town square"],
        "button functions" : [fightSlime, fightBeast, fightDragon, goToTownSquare],
        text: "Which monster do you want to fight?"
    },
    {
        name:"fight",
        "button text" : ["Attack", "Dodge", "Run"],
        "button functions" : [attack, dodge, goToTownSquare],
        text:"You are fighting a monster"
    },
    {
        name : "win",
        "button text" : ["REPLAY?", "Go to town square", "REPLAY?"],
        "button functions" : [restart, goToTownSquare, secretGame],
        text : `YOU WIN THE GAME! 🥳🎉. `
    },
    {
        name : "lose",
        "button text" : ["REPLAY?", "Go to town square", "REPLAY?"],
        "button functions" : [restart, goToTownSquare, restart],
        text : "You die. ☠️"
    },
    {
        name : "secret game",
        "button text" : ["3", "7", "Go to town square?"],
        "button functions" : [pickThree, pickSeven, goToTownSquare],
        text : "This is a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win 20 gold!! If you guess wrong, you lose 10 health."
    },
    {
        name : "end game",
        "button text" : ["Restart", "Restart", "Restart"],
        "button functions" : [restart, restart, restart],
        text:"The game has ended"
    }
   
]

button1.onclick = goToStore;
button2.onclick = fightMonsters;
button3.onclick = endGame;
button4.onclick = goToTownSquare;

function updateButton(location){
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;
}

function goToTownSquare(){
    updateButton(gameLocations[0]);
    button4.style.display = "none";
    monsterStats.style.display = "none";
}

function goToStore(){
    updateButton(gameLocations[1]);
}

function buyHealth(){
    if (gold >= 10){
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    }
    else{
        text.innerText = "You do not have enough gold to buy health. You can fight monsters  to earn more gold.";
    }
}

function buyWeapon(){
    if (currentWeaponIndex < weapons.length - 1){ //if current index weapon is less than the last element
        if(gold >= 30){
            gold -= 30;
            currentWeaponIndex++;
            goldText.innerText = gold;
            let newWeaponBought = weapons[currentWeaponIndex].name;
            text.innerText = ` You just bought a ${newWeaponBought}.`;
            /* playerWeaponsInventory = [...playerWeaponsInventory, newWeaponBought]; */
           playerWeaponsInventory.push(newWeaponBought); 
           text.innerText += `In your weapons inventory you now have: ${playerWeaponsInventory}.`;
        }
        else{
            text.innerText = "You do not have enough gold to buy a weapon. You can fight monsters to earn more gold.";
        }
    }
    else{
        text.innerText = "You already have the most powerful weapon!!";
        button2.innerText = "Sell weapon for 20 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon(){
    if(playerWeaponsInventory.length > 1){
        gold +=15;
        goldText.innerText=gold;
        let weaponSold = playerWeaponsInventory.shift();
        text.innerText = `You just sold a ${weaponSold}`;
        text.innerText+=`In your weapons inventory you now have ${playerWeaponsInventory}.`;
    }
    else{
        text.innerText = "Don't sell your only weapon!!";
    }
    monsterStats.style.display = "none";
}

function fightMonsters(){
    updateButton(gameLocations[2]);
    button4.style.display= "block";
}

function fightSlime(){
    monsterIndex = 0;
    fight();
}

function fightBeast(){
    monsterIndex = 1;
    fight();
}

function fightDragon(){
    monsterIndex = 2;
    fight();
}

function fight(){
    updateButton(gameLocations[3]);
    button4.style.display = "none";
    monsterHealth = monsters[monsterIndex].health;
    monsterName.innerText = monsters[monsterIndex].name;
    monsterHealthText.innerText = monsterHealth;
    monsterStats.style.display = "block" ;
}

function attack(){
    text.innerText = `The ${monsters[monsterIndex].name} attacks.\n`;
    text.innerText += `You attack it with your ${weapons[currentWeaponIndex].name}.`
    //Deduct monster's attack value from player's health
    health -= getMonsterAttackValue(monsters[monsterIndex].level);

    if (isMonsterHit()){
        //If player hits monster, reduce monster's strength
        monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;  
        text.innerText += "You hit."
    }
    else{
        text.innerText += "You miss.";
    }
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0){
        lose();
    }
    else if (monsterHealth <= 0){
        //monsterIndex === 2 ? winGame() : defeatMonster();
        winGame();
    }
    if (playerWeaponsInventory.length !==1){
        text.innerText += `Your ${playerWeaponsInventory.pop()} breaks.`;
        currentWeaponIndex --;
    }

}

function getMonsterAttackValue(level){
    const monsterAttackValue = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(monsterAttackValue);
    if(monsterAttackValue > 0){
        return monsterAttackValue;
    }
    else{
        return 0;
    }
}

function isMonsterHit(){
    return Math.random() > 0.2 || health < 20;
}

function dodge(){
    const dodgeChance = 0.5
    const dodgeSuccess = Math.random() > dodgeChance;
    if(dodgeSuccess){
        text.innerText = `You successfully dodged the attack from the ${monsters[monsterIndex].name}. 
        You are on your way back to the town square..........`;
        setTimeout(() => {
            goToTownSquare();
        }, 3000);
        
    }
    else{
        const damage = getMonsterAttackValue(monsters[monsterIndex].level);
        health -= damage;
        healthText.innerText = health;
        text.innerText = `You tried to dodge, but the ${monsters[monsterIndex].name} hit you. You lose ${damage} health points. `
        //You lose if you lose all your health in dodging
        if(health <= 0){
            setTimeout(() => {
                    lose();
                }, 3000);
        }
        //Continue to fight even after failed dodge
        if(health > 0 && monsterHealth > 0){
            text.innerText += `
            You have another chance to fight the ${monsters[monsterIndex].name}.`;
            setTimeout(() => {
            fight();
            }, 2500)
            
        }
    }
} 
   
    

function endGame(){
    updateButton(gameLocations[7]);
    
}

function winGame(){
    monsterStats.style.display = "none";
    updateButton(gameLocations[4]);
    gold += Math.floor(monsters[monsterIndex].level * 6.7);
    xp += monsters[monsterIndex].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    text.innerText += `The ${monsters[monsterIndex].name} screams as it dies. You gain xp and gold.`
}

function restart(){
    xp = 0;
    health = 100;
    gold = 50;
    currentWeaponIndex = 0;
    playerWeaponsInventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goToTownSquare();
}

function lose(){
    updateButton(gameLocations[5]);
    //healthText.style.color = "red";
}

function secretGame(){
    updateButton(gameLocations[6]);
}

function pickThree(){
    pick(3);
}

function pickSeven(){
    pick(7);
}

function pick(guess){
    const numbers = [];
    while(numbers.length < 10){
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = `You picked ${guess}. Here are the random numbers: \n`

    for(let i = 0; i < 10; i++){
        text.innerText += numbers[i] + "\n"
    }
    if(numbers.includes(guess)){
        text.innerText += "You guessed right! You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;
    }
    else{
        text.innerText += "You guessed wrong! You lose 10 health!";
        health -= 10;
        healthText.innerText = health;
        if(health <= 0){
            lose();
        }
    }
}
   



