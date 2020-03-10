c_list = new creature_list();
e_list = new encounter();

c_list_stored = localStorage.creature_list;
if (c_list_stored){
    c_list.from_json(JSON.parse(c_list_stored));
}

e_list.set_creature_list(c_list);

// Table colors
selected_color = "#4444ff";
turn_color = "yellow";
dead_color = "grey";
creature_table_color = "#eeeeee";
table_header_color = "#dddddd";

function set_stored_c_list(){
    localStorage.setItem("creature_list", JSON.stringify(c_list.to_json()));
}

function encounter_up(){
    const selected = e_list.get_selected();
    if (selected.length == 0){
        e_list.previous_turn();
    }
    else if (selected.length == 1 && selected[0] != 0){
        e_list.swap_creature_positions(selected[0], selected[0]-1);
    }
    else if (selected.length > 1){
        alert("Please select only one creature");
    }
}

function encounter_down(){
    const selected = e_list.get_selected();
    if (selected.length == 0){
        e_list.next_turn();
    }
    else if (selected.length == 1 && selected[0] != e_list.creatures.length-1){
        e_list.swap_creature_positions(selected[0], parseInt(selected[0])+1);
    }
    else if (selected.length > 1){
        alert("Please select only one creature");
    }
}

function open_creature_list(){
    document.getElementById("encounter_button_bar").style.display = "none";
    document.getElementById("encounter_table").style.display = "none";
    document.getElementById("encounter_card").style.display = "none";
    document.getElementById("creature_button_bar").style.display = "block";
    document.getElementById("creature_tables").style.display = "inline-block";
    document.getElementById("creature_card").style.display = "block";
    table_change();
}

function close_creature_list(){
    document.getElementById("encounter_button_bar").style.display = "block";
    document.getElementById("encounter_table").style.display = "inline-block";
    document.getElementById("encounter_card").style.display = "block";
    document.getElementById("creature_button_bar").style.display = "none";
    document.getElementById("creature_tables").style.display = "none";
    document.getElementById("creature_card").style.display = "none";
    table_change();
}

function table_change(){
    render_components();
    setTimeout(render_components, 10);
}

window.onresize = function() {render_components()};

// Stick button bar variables
var header;
var sticky_origional;
var sticky;
var table_container;

function sticky_button_bar_handler() {
    if (!header){
        header = document.getElementById("button_bar_container");
        sticky_origional = document.getElementById("button_bar_container").offsetTop;
        sticky = sticky_origional;
        table_container = document.getElementById("table_container");
    }

    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        table_container.style.paddingTop = header.offsetHeight.toString()+"px";
    } else {
        header.classList.remove("sticky");
        table_container.classList.remove("sticky_padding");
        table_container.style.paddingTop = "0px";
    }

    render_components();
}

function set_headers_display(display){
    document.getElementById("io_bar").style.display = display;
    document.getElementById("encounter_header").style.display = display;
    render_components();
    set_sticky_offset();
}

function toggle_headers(){
    if (document.getElementById("io_bar").style.display == "none"){
        set_headers_display("block");
        sticky = sticky_origional;
    }
    else {
        set_headers_display("none");
        sticky = 0;
    }
}

window.onscroll = sticky_button_bar_handler;

function encounter_unselect_all(){
    for (let creature of e_list.creatures){
        if (creature.selected){
            creature.select();
        }
    }
}

function creature_list_unselect_all(){
    for (const name in c_list.players){
        const player = c_list.players[name];
        if (player.selected){
            player.select();
        }
    }
    for (const name in c_list.non_players){
        const creature = c_list.non_players[name];
        if (creature.selected){
            creature.select();
        }
    }
}

function arrow_press(e){
    if (document.getElementById("encounter_table").style.display != 'none'){
        if (document.activeElement.tagName != "TEXTAREA"){
            if (e.key == ("ArrowUp" || "Up") || e.keyCode == 38){
                e.preventDefault();
                encounter_up();
            }
            if (e.key == ("ArrowDown" || "Down" || e.keyCode == 40)){
                e.preventDefault();
                encounter_down();
            }
            if (e.key == ("Enter" || e.keyCode == 13)){
                e.preventDefault();
                encounter_unselect_all();
                encounter_down();
            }
            if (e.key == ("Escape" || e.keyCode == 27)){
                e.preventDefault();
                encounter_unselect_all();
            }
        }
    }
    else {
        if (e.key == ("Escape" || e.keyCode == 27)){
            e.preventDefault();
            creature_list_unselect_all();
        }
    }
}

document.addEventListener("keydown", arrow_press, false);

function set_overlay_display(value){
    document.getElementById("loading_overlay").style.display = value;
}
