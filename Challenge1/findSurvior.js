let peopleList = ['Abebe', 'Kebede', 'Chala', 'Tola', 'Girma'];
let iteration = 3;

function findSurvivor(iteration, peopleList) {
    let index = 0;
    let killed = [];
    let people = [...peopleList];  
    let numOfPeople = people.length;
    
    console.log(`Initial: ${people}`);
    
    while (numOfPeople > 1) {
        index = (index + iteration - 1) % numOfPeople;
        let kill = people.splice(index, 1)[0];  
        killed.push(kill);
        console.log(`Killed: ${kill}, Remaining: ${people}`);
        numOfPeople = people.length;  
    }
    
    console.log(`All killed: ${killed}`);
    console.log(`Survivor: ${people[0]}`);
    return people[0];
}

let survivor = findSurvivor(iteration, peopleList);
console.log('The survivor: ', survivor);