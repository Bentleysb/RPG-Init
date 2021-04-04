var creature_change = new Event('creature_change_event');

function creature(){
    this.selected = false;
    this.num = 1;

    this.select = function(){
        this.selected = !this.selected;
        document.dispatchEvent(creature_change);
    };
    this.change_num = function(new_num){
        this.num = new_num;
        document.dispatchEvent(creature_change);
    };

    this.to_json = function() {
        return {"selected": this.select, "num": this.change_num};
    }
}

function np_creature(){
    creature.call(this);

    this.set_stat = function(stat, value){
        this[stat] = value;
        document.dispatchEvent(creature_change);
    };
    for (let stat of np_creature.stat_list){
        this[stat] = "";
    }

    this.to_json = function(){
        var json = {"selected": this.select, "num": this.change_num};
        for (const stat of np_creature.stat_list){
            json[stat] = this[stat];
        }
        return json;
    }

    this.get_MHP_avg = function(){
      if (this.MHP.search(/[dD]/) != -1){
          var health_list = this.MHP.split(/[dD\+\-]/).map(str => parseInt(str));
  			  var avg = ((health_list[1]-1)/2.0+1)*health_list[0];
  			  if (health_list.length > 2){
                  if (this.MHP.search(/\+/) != -1){
                      avg += health_list[2];
                  }
                  else if (this.MHP.search("-") != -1){
                      avg -= health_list[2];
                  }
  		    }
  		    return Math.floor(avg).toString();
      }
      return this.MHP;
    }
    this.roll_MHP = function(){
        if (this.MHP.search(/[dD]/) != -1){
            var health_list = this.MHP.split(/[dD\+\-]/).map(str => parseInt(str));
  			var roll = 0;
  			for (var i=0; i<health_list[0]; i++){
  			    roll += randInt(1, health_list[1]);
  			}
  			if (health_list.length > 2){
  		        if (this.MHP.search(/\+/) != -1){
  				    roll += health_list[2];
  				}
  				else if (this.MHP.search("-") != -1){
  					roll -= health_list[2];
  				}
  			}
  			return roll.toString();
        }
        return this.MHP;
     }
}
np_creature.stat_list = ["size","type","alignment","MHP","AC","DC","speed","bonus","STR","DEX","CON","INT","WIS","CHA","atks","CR","EXP"];
np_creature.get_modifier = function(score){
    if (!isNaN(parseInt(score))){
        return Math.floor((parseInt(score)-10)/2).toString();
    }
    else {
        return "\u00A0";
    }
}

function creature_list(){
    this.players = {};
    this.non_players = {};

    //Player list methods
    this.add_player = function(){
        const name = "New Player";
        var num = 1
        while (this.players[name+num.toString()]){num ++;};
        this.players[name+num.toString()] = new creature();
        document.dispatchEvent(creature_change);
        return name+num.toString();
    };
    this.change_player_name = function(name, new_name){
        const old_num = this.players[name].num;
        this.remove_player(name);
        this.players[new_name] = new creature();
        this.players[new_name].select();
        this.players[new_name].change_num(old_num);
        document.dispatchEvent(creature_change);
    };
    this.copy_player = function(name){
        const copy_text = " - Copy";
        var copy_name = name+copy_text;
        while (this.players[copy_name]){copy_name += copy_text};
        this.players[copy_name] = new creature();
        document.dispatchEvent(creature_change);
    };
    this.remove_player = function(name){
        delete this.players[name];
        document.dispatchEvent(creature_change);
    };
    this.get_selected_players = function(){
        var selected_players = [];
        for (player in this.players){
            if (this.players[player].selected){
                selected_players.push(player);
            }
        }
        return selected_players;
    };

    // Non-player list methods
    this.add_non_player = function(){
        const name = "New Creature";
        var num = 1
        while (this.non_players[name+num.toString()]){num ++;};
        this.non_players[name+num.toString()] = new np_creature();
        document.dispatchEvent(creature_change);
        return name+num.toString();
    };
    this.change_non_player_name = function(name, new_name){
        console.log(name);
        console.log(new_name);
        this.non_players[new_name] = this.non_players[name];
        this.remove_non_player(name);
        document.dispatchEvent(creature_change);
    };
    this.copy_non_player = function(name){
        const copy_text = " - Copy";
        var copy_name = name+copy_text;
        while (this.non_players[copy_name]){copy_name += copy_text};
        this.non_players[copy_name] = new np_creature();
        for (const stat of np_creature.stat_list){
            this.non_players[copy_name].set_stat(stat, this.non_players[name][stat]);
        }
        document.dispatchEvent(creature_change);
    };
    this.remove_non_player = function(name){
        delete this.non_players[name];
        document.dispatchEvent(creature_change);
    };
    this.get_selected_non_players = function(){
        var selected_non_players = [];
        for (non_player in this.non_players){
            if (this.non_players[non_player].selected){
                selected_non_players.push(non_player);
            }
        }
        return selected_non_players;
    };

    // Combined list methods
    this.copy_selected = function(){
        const selected_players = this.get_selected_players();
        const selected_non_players = this.get_selected_non_players();
        const count = selected_players.length+selected_non_players.length;
        if (count > 1){
            alert("Please select only one creature.");
        }
        else if (selected_players.length == 1){
            this.copy_player(selected_players[0]);
            this.players[selected_players[0]].select();
        }
        else if (selected_non_players.length == 1){
            this.copy_non_player(selected_non_players[0]);
            this.non_players[selected_non_players[0]].select();
        }
        else {
            alert("Please select a creature.");
        }
    }
    this.remove_selected = function(){
        for (player of this.get_selected_players()){
            this.remove_player(player);
        }
        for (non_player of this.get_selected_non_players()){
            this.remove_non_player(non_player);
        }
    }

    // Sorted Key Lists
    this.get_sorted_players_keys = function(){
        var players_keys = Object.keys(this.players);
        players_keys.sort();
        return players_keys;
    }
    this.non_players_sort_key = "name";
    this.set_non_players_sort = function(key){
        this.non_players_sort_key = key;
        document.dispatchEvent(creature_change);
    }
    this.get_sorted_non_players_keys = function(){
        var non_players_keys = Object.keys(this.non_players);
        if (this.non_players_sort_key == "name"){
            non_players_keys.sort();
        }
        else if (this.non_players_sort_key == "MHP"){
            non_players_keys.sort(function(a,b){
                const value_a = parseInt(this.non_players[a].get_MHP_avg());
                const value_b = parseInt(this.non_players[b].get_MHP_avg());
                if (value_a == value_b){
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
        else if (this.non_players_sort_key == "type" || this.non_players_sort_key == "alignment"){
            non_players_keys.sort(function(a,b){
                const value_a = this.non_players[a][this.non_players_sort_key];
                const value_b = this.non_players[b][this.non_players_sort_key];
		        if (value_a == value_b){
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
        else if (this.non_players_sort_key == "size"){
            non_players_keys.sort(function(a,b){
                const size_list = ["Other", "Tiny", "Small", "Medium", "Larger", "Huge", "Gargantuan"];
                const a_size = this.non_players[a][this.non_players_sort_key];
                const b_size = this.non_players[b][this.non_players_sort_key];
                var value_a = size_list.findIndex(text => text == a_size);
                if (value_a == -1){
                    value_a = 0;
                }
                var value_b = size_list.findIndex(text => text == b_size);
                if (value_b == -1){
                    value_b = 0;
                }
                if (value_a == value_b){
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
                if (value_a == value_b){
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
      this.to_json = function(){
          var players_json = {};
          var non_players_json = {};
          for (player in this.players){
              players_json[player] = this.players[player].to_json()
          }
          for (non_player in this.non_players){
              non_players_json[non_player] = this.non_players[non_player].to_json()
          }
          return {"player": players_json, "nplayer": non_players_json};
      }
      this.from_json = function(json){
          this.players = {};
          this.non_players = {};
          for (let player in json.player){
              this.players[player] = new creature();
          }
          for (let non_player in json.nplayer){
              this.non_players[non_player] = new np_creature();
              for (const stat of np_creature.stat_list){
                  if (stat in json.nplayer[non_player]){
                      // Backwards copatability for size
                      if (stat == "size" && !isNaN(parseInt(json.nplayer[non_player][stat]))){
                          const size_list = ["Other", "Tiny", "Small", "Medium", "Larger", "Huge", "Gargantuan"];
                          this.non_players[non_player]["size"] = size_list[parseInt(json.nplayer[non_player][stat])];
                      }
                      else{
                          this.non_players[non_player][stat] = json.nplayer[non_player][stat].toString();
                      }
                  }
              }
          }
          document.dispatchEvent(creature_change);
      }
}

function encounter_creature(name, creature, roll_MHP = false){
    this.name = name;
    this.creature = creature;

    this.selected = false;
    this.dead = false;
    this.roll = "";
    this.token = "";
    this.notes = "";
    if (this.creature instanceof np_creature){
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

    // Setters
    this.select = function(){
        this.selected = !this.selected;
        document.dispatchEvent(creature_change);
    }
    this.kill = function(){
        this.dead = !this.dead;
        document.dispatchEvent(creature_change);
    }
    this.set_roll = function(roll){
        this.roll = roll;
        document.dispatchEvent(creature_change);
    }
    this.roll_init = function(crit = true){
        var roll = randInt(1,20);
        if (crit){
            if (roll == 1){
               roll = -20;
            } else if (roll == 20){
               roll = 40;
            }
       }
       if (this.creature instanceof np_creature){
           roll += parseInt(this.creature.bonus);
       }
       this.set_roll(roll.toString());
    }
    this.set_token = function(token){
        this.token = token;
        document.dispatchEvent(creature_change);
    }
    this.set_notes = function(notes){
        const round_exps = notes.match(/r{\+\d+}/g);
        if (round_exps){
            for (const round_exp of round_exps){
                notes = notes.replace(round_exp, "r{"+(e_list.round+parseInt(round_exp.match(/\d+/g)[0])).toString()+"}")
            }
        }

        this.notes = notes;
        document.dispatchEvent(creature_change);
    }
    this.set_HP = function(hp){
        this.HP = hp;
        document.dispatchEvent(creature_change);
    }
    this.set_MHP = function(mhp){
        this.MHP = mhp;
        document.dispatchEvent(creature_change);
    }

    // JSON
    this.to_json = function(){
        return {"name":this.name,"creature_type":this.creature.constructor.name,"dead":this.dead,"roll":this.roll,"token":this.token,"notes":this.notes,"MHP":this.MHP,"HP":this.HP};
    }
}

function encounter(){
    this.name = "Unnamed Encounter";
    this.creature_list = new creature_list();
    this.active_turn = 0;
    this.creatures = [];
    this.round = 1

    // Setters
    this.set_name = function(name){
        this.name = name;
        document.dispatchEvent(creature_change);
    }
    this.set_creature_list = function(creature_list){
        this.creature_list = creature_list;
        for (const e_creature of this.creatures){
            if (e_creature.creature instanceof np_creature){
                if (e_creature.name in this.creature_list.non_players){
                    e_creature.creature = this.creature_list.non_players[e_creature.name];
                }
                else {
                    e_creature.creature = new np_creature();
                }
            }
            else {
                if (e_creature.name in this.creature_list.players){
                    e_creature.creature = this.creature_list.players[e_creature.name];
                }
                else {
                    e_creature.creature = new creature();
                }
            }
        }
        document.dispatchEvent(creature_change);
    }
    this.set_active_turn = function(index){
        this.active_turn = index;
        if (this.active_turn > this.creatures.length-1){
            this.active_turn = 0;
        }
        if (this.active_turn < 0){
            this.active_turn = this.creatures.length-1;
        }
        if (this.creatures.length == 0){
            this.active_turn = 0;
        }
        document.dispatchEvent(creature_change);
    }
    this.set_round = function(new_round){
        this.round = new_round;
        document.dispatchEvent(creature_change);
    }

    // Creatures methods
    this.add_creature = function(creature){
        this.creatures.push(creature);
        document.dispatchEvent(creature_change);
    }
    this.remove_creature = function(creature){
        this.creatures.splice(creature,1);
        if (creature < this.active_turn){
            this.set_active_turn(this.active_turn-1)
        }
        else {
            this.set_active_turn(this.active_turn);
        }
    }
    this.next_turn = function(){
        var counter = 0;
        do {
            this.set_active_turn(this.active_turn+1);
            if (this.active_turn == 0){
                this.set_round(this.round+1)
            }
            counter ++;
        }
        while (this.creatures.length >= counter && this.creatures[this.active_turn].dead);
    }
    this.previous_turn = function(){
        var counter = 0;
        do {
            this.set_active_turn(this.active_turn-1);
            if (this.active_turn == this.creatures.length-1){
                this.set_round(this.round-1)
            }
            counter ++;
        }
        while (this.creatures.length >= counter && this.creatures[this.active_turn].dead);
    }
    this.sort_creatures = function(){
        this.creatures.sort(function(a, b){
            if (b.roll != a.roll){
                return parseInt(b.roll)-parseInt(a.roll);
            }
            if ((a.creature.bonus != "")&&(b.creature.bonus != "")){
                return parseInt(b.creature.bonus)-parseInt(a.creature.bonus);
            } else {
                return 0;
            }
        });
        this.set_active_turn(0);
    }
    this.roll_np_creatures_init = function(crit = true){
        const selected = this.get_selected();
        const creatures = selected.length > 0 ? selected.map(index => this.creatures[index]) : this.creatures;
        for (const creature of creatures){
            if (creature.creature instanceof np_creature){
                creature.roll_init(crit);
            }
        }
        this.sort_creatures();
    }
    // Selected methods
    this.get_selected = function(){
        var selected = [];
        for (index in this.creatures){
            if (this.creatures[index].selected){
                selected.push(index);
            }
        }
        return selected;
    }
    this.remove_selected = function(){
        const selected = this.get_selected().reverse();
        for (const index of selected){
            this.remove_creature(index);
        }
    }
    this.kill_selected = function(){
        const selected = this.get_selected();
        for (const index of selected){
            this.creatures[index].kill();
            this.creatures[index].select();
            if (index == this.active_turn){
                this.next_turn();
            }
        }
    }
    this.get_single_selected = function(){
        const selected = this.get_selected();
        if (select.length < 1){
            alert("Please select a creature.");
        }
        else if (select.length > 1){
            alert("Please select only one creature");
        }
        else {
            return selected[0];
        }
        return null;
    }
    this.swap_creature_positions = function(index1, index2){
        const temp = this.creatures[index1];
        this.creatures[index1] = this.creatures[index2];
        this.creatures[index2] = temp;
        document.dispatchEvent(creature_change);
    }
    this.move_up_selected = function(){
        const index = this.get_single_selected();
        if (index && index != 0){
            this.swap_cretaure_positions(index-1,index);
        }
    }
    this.move_down_selected = function(){
        const index = this.get_single_selected();
        if (index && index != this.creatures.length-1){
            this.swap_cretaure_positions(index,index+1);
        }
    }

    // JSON
    this.to_json = function(){
        var creatures = [];
        for (const creature of this.creatures){
            creatures.push(creature.to_json());
        }
        return {"name":this.name,"turn":this.active_turn,"round":this.round,"creatures":creatures};
    }
    this.from_json = function(json){
        // Has a lot of checks for backwards copatability
        this.creatures = [];
        this.name = json.name;
        this.round = ("round" in json) ? json.round : 1;

        for (const e_creature of json.creatures){
            var creature_creature = new creature();
            var creature_type = "creature";
            if ("creature_type" in e_creature){
                creature_type = e_creature.creature_type;
            }
            else if ("HP" in e_creature){
                creature_type = "np_creature";
            }

            if (creature_type == "np_creature"){
                creature_creature = (e_creature.name in this.creature_list.non_players) ? this.creature_list.non_players[e_creature.name] : new np_creature();
            }
            else if (e_creature.name in this.creature_list.players){
                creature_creature = this.creature_list.players[e_creature.name];
            }

            var new_creature = new encounter_creature((typeof e_creature.name == "object") ? e_creature.name[0] : e_creature.name, creature_creature);
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
        document.dispatchEvent(creature_change);
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
