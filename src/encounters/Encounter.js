import Creature from '../creatures/Creature';
import CreatureList from './../creatures/CreatureList';
import NpCreature from './../creatures/NpCreature';
import EncounterCreature from './EncounterCreature';
import CreatureChangeEvent from './../events/CreatureChangeEvent';

class Encounter{
    constructor(){
        this.name = "Unnamed Encounter";
        this.creature_list = new CreatureList();
        this.active_turn = 0;
        this.creatures = [];
        this.round = 1;
        this.creature_change = CreatureChangeEvent.event;
    }

    // Setters
    set_name(name){
        this.name = name;
        document.dispatchEvent(this.creature_change);
    }

    set_creature_list(creature_list){
        this.creature_list = creature_list;
        for (const e_creature of this.creatures){
            if (e_creature.creature instanceof NpCreature){
                if (e_creature.name in this.creature_list.non_players){
                    e_creature.creature = this.creature_list.non_players[e_creature.name];
                }
                else {
                    e_creature.creature = new NpCreature();
                }
            }
            else {
                if (e_creature.name in this.creature_list.players){
                    e_creature.creature = this.creature_list.players[e_creature.name];
                }
                else {
                    e_creature.creature = new Creature();
                }
            }
        }
        document.dispatchEvent(this.creature_change);
    }

    set_active_turn(index){
        this.active_turn = index;
        if (this.active_turn > this.creatures.length-1){
            this.active_turn = 0;
        }
        if (this.active_turn < 0){
            this.active_turn = this.creatures.length-1;
        }
        if (this.creatures.length === 0){
            this.active_turn = 0;
        }
        document.dispatchEvent(this.creature_change);
    }

    set_round(new_round){
        this.round = new_round;
        document.dispatchEvent(this.creature_change);
    }

    up(){
        const selected = this.get_selected();
        if (selected.length === 0){
            this.previous_turn();
        }
        else if (selected.length === 1 && selected[0] !== 0){
            this.swap_creature_positions(selected[0], selected[0]-1);
        }
        else if (selected.length > 1){
            alert("Please select only one creature");
        }
    }

    down(){
        const selected = this.get_selected();
        if (selected.length === 0){
            this.next_turn();
        }
        else if (selected.length === 1 && selected[0] !== this.creatures.length-1){
            this.swap_creature_positions(selected[0], parseInt(selected[0])+1);
        }
        else if (selected.length > 1){
            alert("Please select only one creature");
        }
    }

    unselect_all(){
        for (let creature of this.creatures){
            if (creature.selected){
                creature.select();
            }
        }
    }

    // Creatures methods
    add_creature(creature){
        this.creatures.push(creature);
        document.dispatchEvent(this.creature_change);
    }

    remove_creature(creature){
        this.creatures.splice(creature,1);
        if (creature < this.active_turn){
            this.set_active_turn(this.active_turn-1)
        }
        else {
            this.set_active_turn(this.active_turn);
        }
    }

    next_turn(){
        var counter = 0;
        do {
            this.set_active_turn(this.active_turn+1);
            if (this.active_turn === 0){
                this.set_round(this.round+1)
            }
            counter ++;
        }
        while (this.creatures.length >= counter && this.creatures[this.active_turn].dead);
    }

    previous_turn(){
        var counter = 0;
        do {
            this.set_active_turn(this.active_turn-1);
            if (this.active_turn === this.creatures.length-1){
                this.set_round(this.round-1)
            }
            counter ++;
        }
        while (this.creatures.length >= counter && this.creatures[this.active_turn].dead);
    }

    sort_creatures(){
        this.creatures.sort(function(a, b){
            if (b.roll !== a.roll){
                return parseInt(b.roll)-parseInt(a.roll);
            }
            if ((a.creature.bonus !== "")&&(b.creature.bonus !== "")){
                return parseInt(b.creature.bonus)-parseInt(a.creature.bonus);
            } else {
                return 0;
            }
        });
        this.set_active_turn(0);
    }

    roll_np_creatures_init(crit = true){
        const selected = this.get_selected();
        const creatures = selected.length > 0 ? selected.map(index => this.creatures[index]) : this.creatures;
        for (const creature of creatures){
            if (creature.creature instanceof NpCreature){
                creature.roll_init(crit);
            }
        }
        this.sort_creatures();
    }

    // Selected methods
    get_selected(){
        var selected = [];
        for (let index = 0; index < this.creatures.length; index++){
            if (this.creatures[index].selected){
                selected.push(index);
            }
        }
        return selected;
    }

    remove_selected(){
        const selected = this.get_selected().reverse();
        for (const index of selected){
            this.remove_creature(index);
        }
    }

    kill_selected(){
        const selected = this.get_selected();
        for (const index of selected){
            this.creatures[index].kill();
            this.creatures[index].select();
            if (index === this.active_turn){
                this.next_turn();
            }
        }
    }

    get_single_selected(){
        const selected = this.get_selected();
        if (this.select.length < 1){
            alert("Please select a creature.");
        }
        else if (this.select.length > 1){
            alert("Please select only one creature");
        }
        else {
            return selected[0];
        }
        return null;
    }

    swap_creature_positions(index1, index2){
        const temp = this.creatures[index1];
        this.creatures[index1] = this.creatures[index2];
        this.creatures[index2] = temp;
        document.dispatchEvent(this.creature_change);
    }

    move_up_selectedn(){
        const index = this.get_single_selected();
        if (index && index !== 0){
            this.swap_cretaure_positions(index-1,index);
        }
    }

    move_down_selected(){
        const index = this.get_single_selected();
        if (index && index !== this.creatures.length-1){
            this.swap_cretaure_positions(index,index+1);
        }
    }

    // JSON
    to_json(){
        var creatures = [];
        for (const creature of this.creatures){
            creatures.push(creature.to_json());
        }
        return {"name":this.name,"turn":this.active_turn,"round":this.round,"creatures":creatures};
    }

    from_json(json){
        // Has a lot of checks for backwards copatability
        this.creatures = [];
        this.name = json.name;
        this.round = ("round" in json) ? json.round : 1;

        for (const e_creature of json.creatures){
            var creature_creature = new Creature();
            var creature_type = "Creature";
            if ("creature_type" in e_creature){
                creature_type = e_creature.creature_type;
            }
            else if ("HP" in e_creature){
                creature_type = "NpCreature";
            }

            if (creature_type === "NpCreature"){
                creature_creature = (e_creature.name in this.creature_list.non_players) ? this.creature_list.non_players[e_creature.name] : new NpCreature();
            }
            else if (e_creature.name in this.creature_list.players){
                creature_creature = this.creature_list.players[e_creature.name];
            }

            var new_creature = new EncounterCreature((typeof e_creature.name == "object") ? e_creature.name[0] : e_creature.name, creature_creature, this);
            if (e_creature.dead){
                new_creature.kill();
            }
            new_creature.set_roll(e_creature.roll);
            new_creature.set_notes(e_creature.notes);
            if ("token" in e_creature){
                new_creature.set_token(e_creature.token);
            }
            if ("HP" in e_creature){
                new_creature.set_HP(e_creature.HP);
                new_creature.set_MHP(("MHP" in e_creature) ? e_creature.MHP : e_creature.HP);
            }
            if ("turn" in e_creature && e_creature.turn){
                this.active_turn = json.creatures.indexOf(e_creature);
            }
            this.creatures.push(new_creature);
        }
        if ("turn" in json){
            this.set_active_turn(json.turn);
        }
        document.dispatchEvent(this.creature_change);
    }
}

export default Encounter;