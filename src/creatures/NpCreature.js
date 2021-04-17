import Creature from "./Creature"
import HelperFunctions from './../HelperFunctions';

class NpCreature extends Creature{
    static stat_list = ["size","type","alignment","MHP","AC","DC","speed","bonus","STR","DEX","CON","INT","WIS","CHA","atks","CR","EXP"];

    static get_modifier(score){
        if (!isNaN(parseInt(score))){
            return Math.floor((parseInt(score)-10)/2).toString();
        }
        else {
            return "\u00A0";
        }
    }

    constructor() {
        super();

        for (let stat of NpCreature.stat_list){
            this[stat] = "";
        }
    }

    set_stat(stat, value){
        this[stat] = value;
        document.dispatchEvent(this.creature_change);
    }

    to_json(){
        var json = {"selected": this.select, "num": this.change_num};
        for (const stat of NpCreature.stat_list){
            json[stat] = this[stat];
        }
        return json;
    }

    get_MHP_avg(){
      if (this.MHP.search(/[dD]/) !== -1){
          var health_list = this.MHP.split(/[dD+-]/).map(str => parseInt(str));
  			  var avg = ((health_list[1]-1)/2.0+1)*health_list[0];
  			  if (health_list.length > 2){
                  if (this.MHP.search(/\+/) !== -1){
                      avg += health_list[2];
                  }
                  else if (this.MHP.search("-") !== -1){
                      avg -= health_list[2];
                  }
  		    }
  		    return Math.floor(avg).toString();
      }
      return this.MHP;
    }

    roll_MHP(){
        if (this.MHP.search(/[dD]/) !== -1){
            var health_list = this.MHP.split(/[dD+-]/).map(str => parseInt(str));
  			var roll = 0;
  			for (var i=0; i<health_list[0]; i++){
  			    roll += HelperFunctions.randInt(1, health_list[1]);
  			}
  			if (health_list.length > 2){
  		        if (this.MHP.search(/\+/) !== -1){
  				    roll += health_list[2];
  				}
  				else if (this.MHP.search("-") !== -1){
  					roll -= health_list[2];
  				}
  			}
  			return roll.toString();
        }
        return this.MHP;
     }
}

export default NpCreature;