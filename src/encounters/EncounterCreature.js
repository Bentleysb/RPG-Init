import NpCreature from './../creatures/NpCreature';
import CreatureChangeEvent from './../events/CreatureChangeEvent';
import HelperFunctions from './../HelperFunctions';

class EncounterCreature{
    constructor(name, creature, encounter, roll_MHP = false){
        this.name = name;
        this.creature = creature;
        this.encounter = encounter;

        this.selected = false;
        this.dead = false;
        this.roll = "";
        this.token = "";
        this.notes = "";
        if (this.creature instanceof NpCreature){
            if (roll_MHP){
                this.MHP = this.creature.roll_MHP();
            }
            else {
                this.MHP = this.creature.get_MHP_avg();
            }
        }
        else {
            this.MHP = "";
        }
        this.HP = this.MHP;
        this.creature_change = CreatureChangeEvent.event;
    }

    // Setters
    select(){
        this.selected = !this.selected;
        document.dispatchEvent(this.creature_change);
    }

    kill(){
        this.dead = !this.dead;
        document.dispatchEvent(this.creature_change);
    }

    set_roll(roll){
        this.roll = roll;
        document.dispatchEvent(this.creature_change);
    }

    roll_init(crit = true){
        var roll = HelperFunctions.randInt(1,20);
        if (crit){
            if (roll === 1){
               roll = -20;
            } else if (roll === 20){
               roll = 40;
            }
       }
       if (this.creature instanceof NpCreature){
           roll += parseInt(this.creature.bonus);
       }
       this.set_roll(roll.toString());
    }

    set_token(token){
        this.token = token;
        document.dispatchEvent(this.creature_change);
    }

    set_notes(notes){
        const round_exps = notes.match(/r{\+\d+}/g);
        if (round_exps){
            for (const round_exp of round_exps){
                notes = notes.replace(round_exp, "r{"+(this.encounter.round+parseInt(round_exp.match(/\d+/g)[0])).toString()+"}")
            }
        }

        this.notes = notes;
        document.dispatchEvent(this.creature_change);
    }

    set_HP(hp){
        this.HP = hp;
        document.dispatchEvent(this.creature_change);
    }

    set_MHP(mhp){
        this.MHP = mhp;
        document.dispatchEvent(this.creature_change);
    }

    // JSON
    to_json(){
        return {"name":this.name,"creature_type":this.creature.constructor.name,"dead":this.dead,"roll":this.roll,"token":this.token,"notes":this.notes,"MHP":this.MHP,"HP":this.HP};
    }
}

export default EncounterCreature;