import CreatureChangeEvent from "../events/CreatureChangeEvent"

class Creature{
    constructor() {
        this.selected = false;
        this.num = 1;
        this.creature_change = CreatureChangeEvent.event;
    }
    
    select(){
        this.selected = !this.selected;
        document.dispatchEvent(this.creature_change);
    };
    change_num(new_num){
        this.num = new_num;
        document.dispatchEvent(this.creature_change);
    };

    to_json() {
        return {"selected": this.select, "num": this.change_num};
    }
}

export default Creature;