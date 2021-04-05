import Creature from './Creature';
import NpCreature from './NpCreature';
import CreatureChangeEvent from './../events/CreatureChangeEvent';

class CreatureList{
    constructor(){
        this.players = {};
        this.non_players = {};
        this.non_players_sort_key = "name";
        this.creature_change = CreatureChangeEvent.event;
    }

    //Player list methods
    add_player(){
        const name = "New Player";
        var num = 1
        while (this.players[name+num.toString()]){num ++;};
        this.players[name+num.toString()] = new Creature();
        document.dispatchEvent(this.creature_change);
        return name+num.toString();
    }

    change_player_name(name, new_name){
        const old_num = this.players[name].num;
        this.remove_player(name);
        this.players[new_name] = new Creature();
        this.players[new_name].select();
        this.players[new_name].change_num(old_num);
        document.dispatchEvent(this.creature_change);
    }

    copy_player(name){
        const copy_text = " - Copy";
        var copy_name = name+copy_text;
        while (this.players[copy_name]){copy_name += copy_text};
        this.players[copy_name] = new Creature();
        document.dispatchEvent(this.creature_change);
    }

    remove_player(name){
        delete this.players[name];
        document.dispatchEvent(this.creature_change);
    }

    get_selected_players(){
        var selected_players = [];
        for (const player in this.players){
            if (this.players[player].selected){
                selected_players.push(player);
            }
        }
        return selected_players;
    }

    // Non-player list methods
    add_non_player(){
        const name = "New Creature";
        var num = 1
        while (this.non_players[name+num.toString()]){num ++;};
        this.non_players[name+num.toString()] = new NpCreature();
        document.dispatchEvent(this.creature_change);
        return name+num.toString();
    }

    change_non_player_name(name, new_name){
        console.log(name);
        console.log(new_name);
        this.non_players[new_name] = this.non_players[name];
        this.remove_non_player(name);
        document.dispatchEvent(this.creature_change);
    }

    copy_non_player(name){
        const copy_text = " - Copy";
        var copy_name = name+copy_text;
        while (this.non_players[copy_name]){copy_name += copy_text};
        this.non_players[copy_name] = new NpCreature();
        for (const stat of NpCreature.stat_list){
            this.non_players[copy_name].set_stat(stat, this.non_players[name][stat]);
        }
        document.dispatchEvent(this.creature_change);
    }

    remove_non_player(name){
        delete this.non_players[name];
        document.dispatchEvent(this.creature_change);
    }

    get_selected_non_players(){
        var selected_non_players = [];
        for (const non_player in this.non_players){
            if (this.non_players[non_player].selected){
                selected_non_players.push(non_player);
            }
        }
        return selected_non_players;
    }

    // Combined list methods
    copy_selected(){
        const selected_players = this.get_selected_players();
        const selected_non_players = this.get_selected_non_players();
        const count = selected_players.length+selected_non_players.length;
        if (count > 1){
            alert("Please select only one creature.");
        }
        else if (selected_players.length === 1){
            this.copy_player(selected_players[0]);
            this.players[selected_players[0]].select();
        }
        else if (selected_non_players.length === 1){
            this.copy_non_player(selected_non_players[0]);
            this.non_players[selected_non_players[0]].select();
        }
        else {
            alert("Please select a creature.");
        }
    }

    remove_selected(){
        for (const player of this.get_selected_players()){
            this.remove_player(player);
        }
        for (const non_player of this.get_selected_non_players()){
            this.remove_non_player(non_player);
        }
    }

    unselect_all(){
        for (const name in this.players){
            const player = this.players[name];
            if (player.selected){
                player.select();
            }
        }
        for (const name in this.non_players){
            const creature = this.non_players[name];
            if (creature.selected){
                creature.select();
            }
        }
    }

    // Sorted Key Lists
    get_sorted_players_keys(){
        var players_keys = Object.keys(this.players);
        players_keys.sort();
        return players_keys;
    }

    set_non_players_sort(key){
        this.non_players_sort_key = key;
        document.dispatchEvent(this.creature_change);
    }

    get_sorted_non_players_keys(){
        var non_players_keys = Object.keys(this.non_players);
        if (this.non_players_sort_key === "name"){
            non_players_keys.sort();
        }
        else if (this.non_players_sort_key === "MHP"){
            non_players_keys.sort(function(a,b){
                const value_a = parseInt(this.non_players[a].get_MHP_avg());
                const value_b = parseInt(this.non_players[b].get_MHP_avg());
                if (value_a === value_b){
                    if (a > b){
                        return 1;
                    }
                    if (a < b){
                        return -1;
                    }
                    return 0;
                }
                return value_a-value_b;
            }.bind(this));
        }
        else if (this.non_players_sort_key === "type" || this.non_players_sort_key === "alignment"){
            non_players_keys.sort(function(a,b){
                const value_a = this.non_players[a][this.non_players_sort_key];
                const value_b = this.non_players[b][this.non_players_sort_key];
		        if (value_a === value_b){
                    if (a > b){
                        return 1;
                    }
                    if (a < b){
                        return -1;
                    }
                    return 0;
                }
                if (value_a > value_b){
                    return 1;
                }
                if (value_a < value_b){
                    return -1;
                }
                return 0;
            }.bind(this));
        }
        else if (this.non_players_sort_key === "size"){
            non_players_keys.sort(function(a,b){
                const size_list = ["Other", "Tiny", "Small", "Medium", "Larger", "Huge", "Gargantuan"];
                const a_size = this.non_players[a][this.non_players_sort_key];
                const b_size = this.non_players[b][this.non_players_sort_key];
                var value_a = size_list.findIndex(text => text === a_size);
                if (value_a === -1){
                    value_a = 0;
                }
                var value_b = size_list.findIndex(text => text === b_size);
                if (value_b === -1){
                    value_b = 0;
                }
                if (value_a === value_b){
                    if (a > b){
                        return 1;
                    }
                    if (a < b){
                        return -1;
                    }
                    return 0;
                }
                return value_a-value_b;
            }.bind(this));
        }
        else {
            non_players_keys.sort(function(a,b){
                var value_a = parseFloat(this.non_players[a][this.non_players_sort_key]);
                var value_b = parseFloat(this.non_players[b][this.non_players_sort_key]);
                if (isNaN(value_a)){
                    value_a = 0;
                }
                if (isNaN(value_b)){
                    value_b = 0;
                }
                if (value_a === value_b){
                    if (a > b){
                        return 1;
                    }
                    if (a < b){
                        return -1;
                    }
                    return 0;
                }
                return value_a-value_b;
            }.bind(this));
        }
        return non_players_keys;
    }

    // JSON
    to_json(){
        var players_json = {};
        var non_players_json = {};
        for (const player in this.players){
            players_json[player] = this.players[player].to_json()
        }
        for (const non_player in this.non_players){
            non_players_json[non_player] = this.non_players[non_player].to_json()
        }
        return {"player": players_json, "nplayer": non_players_json};
    }

    from_json(json){
        this.players = {};
        this.non_players = {};
        for (let player in json.player){
            this.players[player] = new Creature();
        }
        for (let non_player in json.nplayer){
            this.non_players[non_player] = new NpCreature();
            for (const stat of NpCreature.stat_list){
                if (stat in json.nplayer[non_player]){
                    // Backwards copatability for size
                    if (stat === "size" && !isNaN(parseInt(json.nplayer[non_player][stat]))){
                        const size_list = ["Other", "Tiny", "Small", "Medium", "Larger", "Huge", "Gargantuan"];
                        this.non_players[non_player]["size"] = size_list[parseInt(json.nplayer[non_player][stat])];
                    }
                    else{
                        this.non_players[non_player][stat] = json.nplayer[non_player][stat].toString();
                    }
                }
            }
        }
        document.dispatchEvent(this.creature_change);
    }
}

export default CreatureList;