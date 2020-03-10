class IoBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {load: true, encounter_file: "unnamed_encounter.json", creature_file: "creature_list.json"};
        this.set_load = this.set_load.bind(this);
        this.load_creatures = this.load_creatures.bind(this);
        this.load_encounter = this.load_encounter.bind(this);
        this.set_encounter_file = this.set_encounter_file.bind(this);
        this.set_creature_file = this.set_creature_file.bind(this);
        this.download_file = this.download_file.bind(this);
        this.open_new_instance = this.open_new_instance.bind(this);
    }

    set_load(){
        this.setState({load: !this.state.load});
    }

    load_creatures(event){
        set_overlay_display("block");
        const creature_list = this.props.creature_list;
        const encounter = this.props.encounter;
        const reader = new FileReader();
        reader.onload = function(props){
            creature_list.from_json(JSON.parse(reader.result));
            encounter.set_creature_list(creature_list);
            set_overlay_display("none");
        }.bind(this);
        try {
            reader.readAsText(event.target.files[0]);
        }
        catch (e){
            set_overlay_display("none");
        }
    }

    load_encounter(event){
        set_overlay_display("block");
        const encounter = this.props.encounter;
        const reader = new FileReader();
        reader.onload = function(){
            encounter.from_json(JSON.parse(reader.result));
            set_overlay_display("none");
        }.bind(this);
        reader.readAsText(event.target.files[0]);
    }

    set_encounter_file(event){
        this.setState({encounter_file: event.target.value});
    }

    set_creature_file(event){
        this.setState({creature_file: event.target.value});
    }

    download_file(name, contents_object){
        if (name.search(".json") == -1){
            name += ".json"
        }
        var contents = JSON.stringify(contents_object)
        var mime_type = "text/octet-stream";
        if (window.navigator.msSaveOrOpenBlob){
            var blob = new Blob([contents], {type: mime_type});
            window.navigator.msSaveOrOpenBlob(blob, name);
        } else {
            var dlink = document.createElement('a');
            dlink.download = name;
            dlink.href = "data:"+mime_type+","+encodeURI(contents);
            document.body.appendChild(dlink);
            dlink.click();
            dlink.remove();
            document.body.removeChild(dlink);
        }
    }

    open_new_instance(){
        set_stored_c_list();
        window.open(window.location.href, "_blank");
    }

    render(){
        return(
            <div>
                <button id="save_switch" type="button" class="io_bar_button" onClick={this.set_load}>{this.state.load ? "Save" : "Load"}</button>
                <span class="button_bar_text">Creature List: </span>
                {this.state.load ?
        		<input type="file" accept=".json" class="io_bar_button" onChange={this.load_creatures}/>
                : <span>
                <input type="text" size="30" class="button_bar_text" value={this.state.creature_file} onChange={this.set_creature_file}></input>
                <button class="io_bar_button" onClick={function(){this.download_file(this.state.creature_file, this.props.creature_list.to_json())}.bind(this)}>Download</button>
                </span>}
                <span class="button_bar_text">Encounter: </span>
                {this.state.load ?
        		<input type="file" accept=".json" class="io_bar_button" onChange={this.load_encounter}/>
                : <span>
                    <input type="text" size="30" class="button_bar_text" value={this.state.encounter_file} onChange={this.set_encounter_file}></input>
                    <button class="io_bar_button" onClick={function(){this.download_file(this.state.encounter_file, this.props.encounter.to_json())}.bind(this)}>Download</button>
                </span>}
                <button type="button" class="button_bar_button right_float_button" onClick={this.open_new_instance}>+</button>
            </div>
        )
    }
}

class EncounterTitle extends React.Component{
    constructor(props){
        super(props);
        this.change_title = this.change_title.bind(this);
    }

    change_title(event){
        this.props.encounter.set_name(event.target.value);
    }

    render(){
        return(
            <input type="text" value={this.props.encounter.name} size="25" class="encounter_title" onChange={this.change_title}/>
        )
    }
}

class EncounterButtonBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {crit_init: true};
        this.remove_creatures = this.remove_creatures.bind(this);
        this.set_crit = this.set_crit.bind(this);
        this.roll_init = this.roll_init.bind(this);
        this.sort_creatures = this.sort_creatures.bind(this);
        this.kill_selected = this.kill_selected.bind(this);
    }

    remove_creatures(){
        this.props.encounter.remove_selected();
        table_change();
    }

    set_crit(){
        this.setState({crit_init: !this.state.crit_init});
    }

    roll_init(){
        this.props.encounter.roll_np_creatures_init(this.state.crit_init);
    }

    sort_creatures(){
        this.props.encounter.sort_creatures();
    }

    kill_selected(){
        this.props.encounter.kill_selected();
    }

    render(){
        return(
            <div>
                <button type="button" class="button_bar_button" onClick={open_creature_list}>Creature List</button>
                <button type="button" class="button_bar_button" onClick={this.remove_creatures}>Remove</button>
                <span class="button_bar_button">|</span>
                <button type="button" class="button_bar_button" onClick={this.set_crit}>Crit Init: {(this.state.crit_init) ? <span>On/<span style={{color: "#aaaaaa"}}>Off</span></span> : <span><span style={{color: "#aaaaaa"}}>On</span>/Off</span>}</button>
                <button type="button" class="button_bar_button" onClick={this.roll_init}>Roll</button>
                <button type="button" class="button_bar_button" onClick={this.sort_creatures}>Sort</button>
                <button type="button" class="button_bar_button" style={{marginRight: "3px"}} onClick={encounter_up}>{"\u25B2"}</button>
                <button type="button" class="button_bar_button" onClick={encounter_down}>{"\u25BC"}</button>
                <button type="button" class="button_bar_button" onClick={this.kill_selected}>Kill</button>
                <button type="button" class="button_bar_button right_float_button" onClick={toggle_headers}>{(document.getElementById("io_bar").style.display == "none") ? "\u25BD" : "\u25B3"}</button>
            </div>
        )
    }
}

class EncounterRow extends React.Component{
    constructor(props){
        super(props);
        this.get_row_color = this.get_row_color.bind(this);
        this.set_roll = this.set_roll.bind(this);
        this.select = this.select.bind(this);
        this.set_token = this.set_token.bind(this);
        this.set_HP = this.set_HP.bind(this);
    }

    get_row_color(){
        const creature = this.props.creature;
        if (creature.selected){
            return selected_color;
        }
        else if (creature == this.props.encounter.creatures[this.props.encounter.active_turn]){
            return turn_color;
        }
        else if (creature.dead){
            return dead_color;
        }
        else {
            return creature_table_color;
        }
    }

    set_roll(event){
        this.props.creature.set_roll(event.target.value);
    }

    select(){
        this.props.creature.select();
    }

    set_token(event){
        this.props.creature.set_token(event.target.value);
    }

    set_HP(event){
        this.props.creature.set_HP(event.target.value);
    }

    render(){
        return(
            <tr class="creatre_table" style={{backgroundColor: this.get_row_color()}}>
                <td class="creature_table"><input type="text" size="3" value={this.props.creature.roll} onChange={this.set_roll}></input></td>
                <td class="creature_table clickable" style={{fontWeight: !(this.props.creature.creature instanceof np_creature) ? "bold" : "normal"}} onClick={this.select}>{this.props.creature.name}</td>
                <td class="creature_table">{(this.props.creature.creature instanceof np_creature) ? <input type="text" size="4" value={this.props.creature.token} onChange={this.set_token}></input> : null}</td>
                <td class="creature_table">{(this.props.creature.creature instanceof np_creature) ? <input type="text" size="4" value={this.props.creature.HP} onChange={this.set_HP}></input> : null}</td>
                <td class="creature_table">{this.props.creature.creature.AC}</td>
            </tr>
        )
    }
}

class EncounterTable extends React.Component{
    constructor(props){
        super(props);
        this.all_selected = this.all_selected.bind(this);
        this.select_all = this.select_all.bind(this);
    }

    all_selected(){
        const creatures = this.props.encounter.creatures;
        if (creatures.length < 1){
            return false;
        }
        for (const creature of creatures){
            if (!creature.selected){
                return false;
            }
        }
        return true;
    }

    select_all(){
        const all_selected = this.all_selected();
        for (const creature of this.props.encounter.creatures){
            if (creature.selected == all_selected){
                creature.select();
            }
        }
    }

    render(){
        return(
            <table class="creature_table">
                <tr class="creature_table">
                    <th class="creature_table">Init</th>
                    <th class="creature_table clickable" style={{backgroundColor: (this.all_selected()) ? selected_color : table_header_color}} onClick={this.select_all}>Name</th>
                    <th class="creature_table">Token</th>
                    <th class="creature_table">HP</th>
                    <th class="creature_table">AC</th>
                </tr>
                {this.props.encounter.creatures.map(creature => <EncounterRow encounter={this.props.encounter} creature={creature}/>)}
            </table>
        )
    }
}

class BlankCard extends React.Component{
    constructor(props){
        super(props);
        this.card_position = this.card_position.bind(this);
    }

    card_position(){
        return {
            left: (this.props.left+10+window.innerWidth/10).toString()+"px",
            top: (this.props.top+10).toString()+"px",
            right: "10px",
            bottom: "10px"
        };
    }

    render(){
        return(
            <div class="blank_card" style={this.card_position()}>
                {this.props.content}
            </div>
        )
    }
}

class EncounterCard extends React.Component{
    constructor(props){
        super(props);
        this.get_creature = this.get_creature.bind(this);
        this.get_header = this.get_header.bind(this);
        this.set_hp = this.set_hp.bind(this);
        this.set_notes = this.set_notes.bind(this);
        this.abilities_style = this.abilities_style.bind(this);
    }

    get_creature(){
        const encounter = this.props.encounter;
        const selected = encounter.get_selected();
        if (selected.length == 1){
            return encounter.creatures[selected[0]];
        }
        else if (selected.length < 1 && encounter.creatures.length > 0){
            return encounter.creatures[encounter.active_turn];
        }
        else {
            return new encounter_creature("", new creature());
        }
    }

    get_header(){
        const creature = this.get_creature();
        if (creature.creature instanceof np_creature){
            return (
                <span>
                    {creature.name}
                    :{"\u00A0\u00A0\u00A0\u00A0"}
                    <span style={{fontSize: "12pt"}}>
                        {creature.creature.size}{"\u00A0"}
                        {creature.creature.type},{"\u00A0"}
                        {creature.creature.alignment}
                    </span>
                </span>
            )
        }
        else {
            return creature.name;
        }
    }

    set_hp(event){
        this.get_creature().set_HP(event.target.value);
    }

    set_notes(event){
        this.get_creature().set_notes(event.target.value);
    }

    abilities_style(){
        const header = document.getElementById("abilities_header");
        const notes = document.getElementById("notes");
        if (header && notes){
            return {height: (parseFloat(notes.getBoundingClientRect().top)-parseFloat(header.getBoundingClientRect().bottom)-10).toString()+"px"}
        }
        return {}
    }

    render(){
        return (
            <div class="card_container">
                <div class="card_header encounter_card_header card_table">{this.get_header()}</div>
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">HP/MHP</th>
                        <th class="creature_table">AC</th>
                        <th class="creature_table">DC</th>
                        <th class="creature_table">Speed</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_creature().HP} onChange={this.set_hp}></input> ({this.get_creature().MHP})</td>
                        <td class="creature_table card_input">{this.get_creature().creature.AC}</td>
                        <td class="creature_table card_input">{this.get_creature().creature.DC}</td>
                        <td class="creature_table card_input">{this.get_creature().creature.speed}</td>
                    </tr>
                </table>
                <table id="e_scores" class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">STR</th>
                        <th class="creature_table">DEX</th>
                        <th class="creature_table">CON</th>
                        <th class="creature_table">INT</th>
                        <th class="creature_table">WIS</th>
                        <th class="creature_table">CHA</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.STR}</span>{np_creature.get_modifier(this.get_creature().creature.STR)}</td>
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.DEX}</span>{np_creature.get_modifier(this.get_creature().creature.DEX)}</td>
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.CON}</span>{np_creature.get_modifier(this.get_creature().creature.CON)}</td>
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.INT}</span>{np_creature.get_modifier(this.get_creature().creature.INT)}</td>
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.WIS}</span>{np_creature.get_modifier(this.get_creature().creature.WIS)}</td>
                        <td class="creature_table card_input"><span class="ability_score">{this.get_creature().creature.CHA}</span>{np_creature.get_modifier(this.get_creature().creature.CHA)}</td>
                    </tr>
                </table>
                <div class="card_table card_header abilities">Abilities</div>
                <p class="abilities">{this.get_creature().creature.atks}</p>
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">Notes</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><textarea rows="5" cols="5" class="notes" value={this.get_creature().notes} onChange={this.set_notes}></textarea></td>
                    </tr>
                </table>
            </div>
        )
    }
}

class CreatureButtonBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {roll_MHP: false};
        this.add_to_encounter = this.add_to_encounter.bind(this);
        this.add_selected_to_encounter = this.add_selected_to_encounter.bind(this);
        this.set_roll_MHP = this.set_roll_MHP.bind(this);
        this.add_player = this.add_player.bind(this);
        this.add_creature = this.add_creature.bind(this);
        this.copy_creatures = this.copy_creatures.bind(this);
        this.remove_creatures = this.remove_creatures.bind(this);
        this.change_sort = this.change_sort.bind(this);
        this.deselect_all = this.deselect_all.bind(this);
    }

    deselect_all(){
        const creature_list = this.props.encounter.creature_list;
        for (player of creature_list.get_selected_players()){
            creature_list.players[player].select();
        }
        for (non_player of creature_list.get_selected_non_players()){
            creature_list.non_players[non_player].select();
        }
    }

    add_to_encounter(name, creature){
        for (var i=0;i<creature.num;i++){
            this.props.encounter.add_creature(new encounter_creature(name, creature, this.state.roll_MHP));
        }
    }

    add_selected_to_encounter(){
        const creature_list = this.props.encounter.creature_list;
        for (let player of creature_list.get_selected_players()){
            this.add_to_encounter(player, creature_list.players[player]);
            creature_list.players[player].select();
            creature_list.players[player].change_num(1);
        }
        for (let non_player of creature_list.get_selected_non_players()){
            this.add_to_encounter(non_player, creature_list.non_players[non_player]);
            creature_list.non_players[non_player].select();
            creature_list.non_players[non_player].change_num(1);
        }
        close_creature_list();
    }

    set_roll_MHP(){
        this.setState({roll_MHP: !this.state.roll_MHP});
    }

    add_player(){
        this.deselect_all();
        name = this.props.encounter.creature_list.add_player();
        this.props.encounter.creature_list.players[name].select();
        table_change();
    }

    add_creature(){
        this.deselect_all();
        name = this.props.encounter.creature_list.add_non_player();
        this.props.encounter.creature_list.non_players[name].select();
        table_change();
    }

    copy_creatures(){
        this.props.encounter.creature_list.copy_selected();
        table_change();
    }

    remove_creatures(){
        this.props.encounter.creature_list.remove_selected();
        table_change();
    }

    change_sort(event){
        this.props.encounter.creature_list.set_non_players_sort(event.target.value);
        table_change();
    }

    render(){
        return(
            <div>
                <button type="button" class="button_bar_button" onClick={this.add_selected_to_encounter}>Add to Encounter</button>
                <button type="button" class="button_bar_button" onClick={close_creature_list}>Cancel</button>
                <span class="button_bar_button">|</span>
                <button type="button" class="button_bar_button" onClick={this.set_roll_MHP}>Roll MHP: {(this.state.roll_MHP) ? <span>On/<span style={{color: "#aaaaaa"}}>Off</span></span> : <span><span style={{color: "#aaaaaa"}}>On</span>/Off</span>}</button>
                <span class="button_bar_button">|</span>
                <button type="button" class="button_bar_button" onClick={this.add_player}>Add Player</button>
                <button type="button" class="button_bar_button" onClick={this.add_creature}>Add Creature</button>
                <button type="button" class="button_bar_button" onClick={this.copy_creatures}>Copy</button>
                <button type="button" class="button_bar_button" onClick={this.remove_creatures}>Delete</button>
                <span class="button_bar_button">|</span>
                <span class="button_bar_button">Sort By:</span>
                <select class="button_bar_button" onChange={this.change_sort}>
        			<option value="AC">AC</option>
        			<option value="alignment">Alignment</option>
        			<option value="CHA">CHA</option>
        			<option value="CON">CON</option>
        			<option value="CR">CR</option>
        			<option value="DC">DC</option>
        			<option value="DEX">DEX</option>
        			<option value="EXP">EXP</option>
        			<option value="bonus">Init+</option>
        			<option value="INT">INT</option>
        			<option value="MHP">MHP</option>
        			<option value="name" selected>Name</option>
        			<option value="size">Size</option>
        			<option value="speed">Speed</option>
        			<option value="STR">STR</option>
        			<option value="type">Type</option>
        			<option value="WIS">WIS</option>
        		</select>
                <button type="button" class="button_bar_button right_float_button" onClick={toggle_headers}>{(document.getElementById("io_bar").style.display == "none") ? "\u25BD" : "\u25B3"}</button>
            </div>
        )
    }
}

class CreatureRow extends React.Component{
    constructor(props){
        super(props);
        this.get_row_color = this.get_row_color.bind(this);
        this.set_num = this.set_num.bind(this);
        this.select = this.select.bind(this);
    }

    get_row_color(){
        if (this.props.creature.selected){
            return selected_color;
        }
        else {
            return creature_table_color;
        }
    }

    set_num(event){
        this.props.creature.change_num(event.target.value)
    }

    select(){
        this.props.creature.select();
    }

    render(){
        return(
            <tr class="creatre_table" style={{backgroundColor: this.get_row_color()}}>
                <td class="creature_table"><input type="text" size="1" value={this.props.creature.num} onChange={this.set_num}></input></td>
                <td class="creature_table clickable" onClick={this.select}>{this.props.name}</td>
                {this.props.extra_columns}
            </tr>
        )
    }
}

class PlayerTable extends React.Component{
    constructor(props){
        super(props);
        this.all_selected = this.all_selected.bind(this);
        this.select_all = this.select_all.bind(this);
    }

    all_selected(){
        const player_count = Object.keys(this.props.creature_list.players).length;
        if (player_count == 0){
            return false;
        }
        return this.props.creature_list.get_selected_players().length == player_count;
    }

    select_all(){
        const all_selected = this.all_selected();
        for (const name in this.props.creature_list.players){
            const player = this.props.creature_list.players[name];
            if (player.selected == all_selected){
                player.select();
            }
        }
    }

    render(){
        return(
            <table class="creature_table">
                <tr class="creature_table">
                    <th class="creature_table">#</th>
                    <th class="creature_table clickable" style={{backgroundColor: (this.all_selected()) ? selected_color : table_header_color}} onClick={this.select_all}>Name</th>
                </tr>
                {this.props.creature_list.get_sorted_players_keys().map(name => <CreatureRow name={name} creature={this.props.creature_list.players[name]}/>)}
            </table>
        )
    }
}

class CreatureTableExtraColumns extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            [
                this.props.creature_list.non_players_sort_key == "name" ? null : <td class="creature_table">{this.props.creature[this.props.creature_list.non_players_sort_key]}</td>
            ]
        );
    }
}

class CreatureTable extends React.Component{
    constructor(props){
        super(props);
        this.sort_key = this.sort_key.bind(this);
        this.all_selected = this.all_selected.bind(this);
        this.select_all = this.select_all.bind(this);
    }

    sort_key(){
        const key = this.props.creature_list.non_players_sort_key;
        if (key == "bonus"){
            return "Init+";
        }
        return key.charAt(0).toUpperCase()+key.substring(1);
    }

    all_selected(){
        const creature_count = Object.keys(this.props.creature_list.non_players).length;
        if (creature_count == 0){
            return false;
        }
        return this.props.creature_list.get_selected_non_players().length == creature_count;
    }

    select_all(){
        const all_selected = this.all_selected();
        for (const name in this.props.creature_list.non_players){
            const creature = this.props.creature_list.non_players[name];
            if (creature.selected == all_selected){
                creature.select();
            }
        }
    }

    render(){
        return(
            <table class="creature_table">
                <tr class="creature_table">
                    <th class="creature_table">#</th>
                    <th class="creature_table clickable" style={{backgroundColor: (this.all_selected()) ? selected_color : table_header_color}} onClick={this.select_all}>Name</th>
                    {this.sort_key() == "Name" ? null : <th class="creature_table">{this.sort_key()}</th>}
                </tr>
                {this.props.creature_list.get_sorted_non_players_keys().map(name => <CreatureRow name={name} creature={this.props.creature_list.non_players[name]} extra_columns={<CreatureTableExtraColumns creature={this.props.creature_list.non_players[name]} creature_list={this.props.creature_list} />}/>)}
            </table>
        )
    }
}

class CreatureCard extends React.Component{
    constructor(props){
        super(props);
        this.get_creature_name = this.get_creature_name.bind(this);
        this.get_creature = this.get_creature.bind(this);
        this.set_name = this.set_name.bind(this);
        this.is_size = this.is_size.bind(this);
        this.set_size = this.set_size.bind(this);
        this.set_type = this.set_type.bind(this);
        this.set_alignment = this.set_alignment.bind(this);
        this.set_MHP = this.set_MHP.bind(this);
        this.get_MHP_avg = this.get_MHP_avg.bind(this);
        this.set_AC = this.set_AC.bind(this);
        this.set_DC = this.set_DC.bind(this);
        this.set_speed = this.set_speed.bind(this);
        this.set_bonus = this.set_bonus.bind(this);
        this.set_STR = this.set_STR.bind(this);
        this.set_DEX = this.set_DEX.bind(this);
        this.set_CON = this.set_CON.bind(this);
        this.set_INT = this.set_INT.bind(this);
        this.set_WIS = this.set_WIS.bind(this);
        this.set_CHA = this.set_CHA.bind(this);
        this.get_abilities = this.get_abilities.bind(this);
        this.set_abilities = this.set_abilities.bind(this);
        this.set_CR = this.set_CR.bind(this);
        this.set_EXP = this.set_EXP.bind(this);
        this.dont_display = this.dont_display.bind(this);
        this.get_stat = this.get_stat.bind(this);
        this.set_state_name = this.set_state_name.bind(this);
        this.name = 1;
    }

    dont_display(){
        return !(this.get_creature() instanceof np_creature);
    }

    get_stat(stat){
        return this.dont_display() ? "" : this.get_creature()[stat];
    }

    get_creature_name(){
        const selected_players = this.props.creature_list.get_selected_players();
        const selected_creatures = this.props.creature_list.get_selected_non_players();
        if (selected_players.length+selected_creatures.length == 1){
            if (selected_players.length == 1){
                return selected_players[0];
            }
            else {
                return selected_creatures[0];
            }
        }
        return "";
    }

    get_creature(){
        const selected_players = this.props.creature_list.get_selected_players();
        const selected_creatures = this.props.creature_list.get_selected_non_players();
        if (selected_players.length+selected_creatures.length == 1){
            if (selected_players.length == 1){
                return this.props.creature_list.players[selected_players[0]];
            }
            else {
                return this.props.creature_list.non_players[selected_creatures[0]];
            }
        }
        return new np_creature();
    }

    set_name(event){
        this.name = 1;
        const selected_players = this.props.creature_list.get_selected_players();
        const selected_creatures = this.props.creature_list.get_selected_non_players();
        if (selected_players.length+selected_creatures.length == 1){
            if (selected_players.length == 1 && !this.props.creature_list.players.hasOwnProperty(event.target.value)){
                this.props.creature_list.change_player_name(selected_players[0], event.target.value);
            }
            else if (selected_creatures.length == 1 && !this.props.creature_list.non_players.hasOwnProperty(event.target.value)) {
                this.props.creature_list.change_non_player_name(selected_creatures[0], event.target.value);
            }
        }
        table_change();
    }

    set_state_name(event){
        this.name = event.target.value;
        render_components();
    }

    is_size(option){
        if (this.get_creature().size == option){
            return "selected";
        }
        return "";
    }

    set_size(event){
        this.get_creature().set_stat("size", event.target.value);
    }

    set_type(event){
        this.get_creature().set_stat("type", event.target.value);
    }
    set_alignment(event){
        this.get_creature().set_stat("alignment", event.target.value);
    }

    set_MHP(event){
        this.get_creature().set_stat("MHP", event.target.value);
    }

    get_MHP_avg(){
        if (this.get_creature() instanceof np_creature){
            const avg = this.get_creature().get_MHP_avg();
            if (avg != this.get_creature().MHP){
                return "("+this.get_creature().get_MHP_avg()+")";
            }
        }
        return null;
    }

    set_AC(event){
        this.get_creature().set_stat("AC", event.target.value);
    }

    set_DC(event){
        this.get_creature().set_stat("DC", event.target.value);
    }

    set_speed(event){
        this.get_creature().set_stat("speed", event.target.value);
    }

    set_bonus(event){
        this.get_creature().set_stat("bonus", event.target.value);
    }

    set_STR(event){
        this.get_creature().set_stat("STR", event.target.value);
    }

    set_DEX(event){
        this.get_creature().set_stat("DEX", event.target.value);
    }

    set_CON(event){
        this.get_creature().set_stat("CON", event.target.value);
    }

    set_INT(event){
        this.get_creature().set_stat("INT", event.target.value);
    }

    set_WIS(event){
        this.get_creature().set_stat("WIS", event.target.value);
    }

    set_CHA(event){
        this.get_creature().set_stat("CHA", event.target.value);
    }

    get_abilities(){
        if ("atks" in this.get_creature()){
            return this.get_creature().atks.replace(/<br>/g,"\n").replace(/\u003C/g,"<").replace(/\u003E/g,">");
        }
        return "";
    }

    set_abilities(event){
        this.get_creature().set_stat("atks", event.target.value);
    }

    set_CR(event){
        this.get_creature().set_stat("CR", event.target.value);
    }

    set_EXP(event){
        this.get_creature().set_stat("EXP", event.target.value);
    }

    render(){
        return(
            <div class="card_container">
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">Name</th>
                        <th class="creature_table">Size</th>
                        <th class="creature_table">Type</th>
                        <th class="creature_table">Alignment</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><input type="text" size="20" class="card_input" value={this.name != 1 ? this.name : this.get_creature_name()} onChange={this.set_state_name} onBlur={this.set_name}></input></td>
                        <td class="creature_table card_input"><select class="card_input_small" onChange={this.set_size} disabled={this.dont_display()}>
                            <option value="Other" selected={this.is_size("Other")}>Other</option>
                            <option value="Tiny" selected={this.is_size("Tiny")}>Tiny</option>
                            <option value="Small" selected={this.is_size("Small")}>Small</option>
                            <option value="Medium" selected={this.is_size("Medium")}>Medium</option>
                            <option value="Large" selected={this.is_size("Large")}>Large</option>
                            <option value="Huge" selected={this.is_size("Huge")}>Huge</option>
                            <option value="Gargantuan" selected={this.is_size("Gargantuan")}>Gargantuan</option>
                        </select></td>
                        <td class="creature_table card_input" disabled={this.dont_display()}><input type="text" size="13" class="card_input card_input_small" value={this.get_stat("type")} onChange={this.set_type} disabled={this.dont_display()}></input></td>
                        <td class="creature_table card_input" disabled={this.dont_display()}><input type="text" size="15" class="card_input card_input_small" value={this.get_stat("alignment")} onChange={this.set_alignment} disabled={this.dont_display()}></input></td>
                    </tr>
                </table>
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">MHP</th>
                        <th class="creature_table">AC</th>
                        <th class="creature_table">DC</th>
                        <th class="creature_table">Speed</th>
                        <th class="creature_table">Init+</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><input type="text" size="9" class="card_input" value={this.get_stat("MHP")} onChange={this.set_MHP} disabled={this.dont_display()}></input>{this.get_MHP_avg()}</td>
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_stat("AC")} onChange={this.set_AC} disabled={this.dont_display()}></input></td>
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_stat("DC")} onChange={this.set_DC} disabled={this.dont_display()}></input></td>
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_stat("speed")} onChange={this.set_speed} disabled={this.dont_display()}></input></td>
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_stat("bonus")} onChange={this.set_bonus} disabled={this.dont_display()}></input></td>
                    </tr>
                </table>
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">STR</th>
                        <th class="creature_table">DEX</th>
                        <th class="creature_table">CON</th>
                        <th class="creature_table">INT</th>
                        <th class="creature_table">WIS</th>
                        <th class="creature_table">CHA</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("STR")} onChange={this.set_STR} disabled={this.dont_display()}></input>{np_creature.get_modifier(this.get_creature().STR)}</td>
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("DEX")} onChange={this.set_DEX} disabled={this.dont_display()}></input>{np_creature.get_modifier(this.get_creature().DEX)}</td>
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("CON")} onChange={this.set_CON} disabled={this.dont_display()}></input>{np_creature.get_modifier(this.get_creature().CON)}</td>
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("INT")} onChange={this.set_INT} disabled={this.dont_display()}></input>{np_creature.get_modifier(this.get_creature().INT)}</td>
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("WIS")} onChange={this.set_WIS} disabled={this.dont_display()}></input>{np_creature.get_modifier(this.get_creature().WIS)}</td>
                        <td class="creature_table card_input"><input type="text" size="1" class="card_input_small card_input_left" value={this.get_stat("CHA")} onChange={this.set_CHA} disabled={this.dont_display()}></input>{np_creature.get_modifier(this.get_creature().CHA)}</td>
                    </tr>
                </table>
                <div class="card_table card_header abilities">Abilities</div>
                <div class="creature_table card_input abilities_container"><textarea rows="5" cols="5" class="card_input_small abilities" value={this.get_abilities()} onChange={this.set_abilities} disabled={this.dont_display()}></textarea></div>
                <table class="creature_table card_table">
                    <tr class="creature_table">
                        <th class="creature_table">CR</th>
                        <th class="creature_table">EXP</th>
                    </tr>
                    <tr class="creature_table">
                        <td class="creature_table card_input"><input type="text" size="3" class="card_input" value={this.get_stat("CR")} onChange={this.set_CR} disabled={this.dont_display()}></input></td>
                        <td class="creature_table card_input"><input type="text" size="5" class="card_input" value={this.get_stat("EXP")} onChange={this.set_EXP} disabled={this.dont_display()}></input></td>
                    </tr>
                </table>
            </div>
        );
    }
}

function render_components(){
    ReactDOM.render(<IoBar creature_list={c_list} encounter={e_list}/>, document.getElementById('io_bar'));
    ReactDOM.render(<EncounterTitle encounter={e_list}/>, document.getElementById('encounter_header'));
    ReactDOM.render(<EncounterButtonBar encounter={e_list}/>, document.getElementById('encounter_button_bar'));
    ReactDOM.render(<EncounterTable encounter={e_list}/>, document.getElementById('encounter_table'));
    ReactDOM.render(<BlankCard content={<EncounterCard encounter={e_list}/>} left={parseFloat(document.getElementById("encounter_table").getBoundingClientRect().right)} top={parseInt(document.getElementById("encounter_button_bar").getBoundingClientRect().bottom)}/>, document.getElementById('encounter_card'));
    ReactDOM.render(<CreatureButtonBar encounter={e_list}/>, document.getElementById('creature_button_bar'));
    ReactDOM.render(<PlayerTable creature_list={c_list}/>, document.getElementById('player_table'));
    ReactDOM.render(<CreatureTable creature_list={c_list}/>, document.getElementById('creature_table'));
    ReactDOM.render(<BlankCard content={<CreatureCard creature_list={c_list} />} left={parseFloat(document.getElementById("creature_tables").getBoundingClientRect().right)} top={parseInt(document.getElementById("creature_button_bar").getBoundingClientRect().bottom)}/>, document.getElementById('creature_card'));
}

document.addEventListener('creature_change_event', () => {set_stored_c_list(); render_components();});

render_components();
