let player = {
    health: {
        current: 0,
        max: 0,
    },
    mana: {
        current: 0,
        max: 0,
    },
    currentScene: false,
    inventory: [],
    equiped: {
        
    } 

    race: false,
    weight: 0,
    height: 0,
    gender: false,

    classFactor: [],
    carryAmount: 0, //How Much You Can Carry
    attributes: {
        strength: 0,
        wisdom: 0,
        charisma: 0,
        dextirity: 0,
        constitution: 0,
        intelligence: 0,
    }
}

let scenes = [];
function newScene(obj) {
    scenes.push({
        name: obj.name,
    })
}
let classes = [];
function newClass(obj) {
    classes.push({
        name: obj.name,
        attributes: {
            strength: obj.attributes.strength,
            wisdom: obj.attributes.wisdom,
            charisma: obj.attributes.charisma,
            dextirity: obj.attributes.dextirity,
            constitution: obj.attributes.constitution,
            intelligence: obj.attributes.intelligence,
        },
    })
}
let races = [];
function newRace(obj) {
    races.push({
        name: obj.name,
        genders: obj.gender ? obj.gender : ["Male","Female"],
        height: {
            min: obj.height.min,
            max: obj.height.max
        },
        weight: {
            min: obj.weight.min,
            max: obj.weight.max
        },
        attributes: {
            strength: obj.attributes.strength,
            wisdom: obj.attributes.wisdom,
            charisma: obj.attributes.charisma,
            dextirity: obj.attributes.dextirity,
            constitution: obj.attributes.constitution,
            intelligence: obj.attributes.intelligence,
        }
    })
}
let items = [];
function newItem(obj) {
    items.push({
        name: obj.name,
        
        damage: obj.damage ? obj.damage : 0,
        canAttack: obj.canAttack ? obj.canAttack : false,

        canHeal: obj.canHeal ? obj.canHeal : false,
        healAmount: obj.healAmount ? obj.healAmount : false,

        canEquip: obj.canEquip ? obj.canEquip : false,
        equipTo: obj.equipTo ? obj.equipTo : false, //Where on the body it can equip to


    })
}