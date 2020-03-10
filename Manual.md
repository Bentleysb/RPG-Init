# RPG Init Manual

## Views
RPG Init has two primary views. Each displays or makes editable a different set of information. There are also 2 persistent headers.

### Headers
There are two headers that show on all views. They reside at the top of the program.  

The first is the Input/Output (IO) bar. It provides controls for loading and saving creature lists and encounters. On the far right of this bar there is a button to open a new instance of the program in a new tab/window.

The second is the encounter title. It simply displays the name of the currently loaded encounter. The name is also edited using the text field in this header.

While shown on all views, these headers can be minimized using controls in each view.

### Encounter View
The encounter view is displayed when you first open the program. It displays the initiative order and stats of creatures and players.

There are 3 main parts to the encounter view that reside below the two header bars.  

The encounter controls are a bar of buttons that sits just below the headers. These provide management actions for the encounter.

The encounter list is on the left side of the view. It is a table containing all the creatures and players in the current encounter. It display basic information about each entity as well as some editable information.

The encounter card is on the right side of the view. It contains all of the stats and abilities of the currently selected creature or player. It has both display only and editable information. It also includes a section for adding notes about each creature.

For more on how to use the encounter view see Managing An Encounter below.

### Creature List View
The creature list view displays all available players, creatures, and their stats. It allows you to curate these lists by adding, removing, copying entities. In addition it allows you to edit the stats and abilities of creatures.

There are 4 main parts to the creature list view that reside below the two header bars.  

The creature controls are a bar of buttons that sits just below the headers. These provide management actions for the encounter.  
The player list is on the left side of the view. It provides a selectable list of players in alphabetical order.  

The creature list is on the left side of the view, below the player list. It provides a selectable list of creatures that can be sorted by their name or stats.

The creature card is on the right side of the view. It displays and makes editable all of the stats and abilities of the currently selected creature or player.

For more on how to use the creature list view see Managing Creatures below.

## Managing Creatures
Creatures can represent both players, NPCs, and other creatures. Creatures contain stats, actions, and abilities. Creatures are used to populate and encounter.

Creatures are managed from the creature list view. This view can be accessed by clicking the 'Creature List' button from the encounter view.

### Player List
The player list is the top table on the left side of the creature view. It lists all the current players in alphabetical order. Each row displays the name of the player and the number to add to the encounter.  

Players are selectable by clicking there name. All players can be selected or unselected by clicking the 'Name' table header.  

### Creature List
The creature list is the bottom table on the left side of the creature view. It lists all the non-player creatures. Each row displays the name of the creature and the number to add to the encounter.  

Creatures are selectable by clicking there name. All creatures can be selected or unselected by clicking the 'Name' table header. All players and creatures can also be unselected by pressing escape on a keyboard.

The creature list can be sorted by the name or any stat of the creatures. The sort value can be selected using a drop down in the creature controls. When sorted by a value other than 'name' that value is displayed in a third column in the table.  

### Creature Controls
The creature controls are in a bar just below the headers. They provide actions for editing the player and creature lists, and adding creatures to the encounter.

#### Control Actions:

* **Add to Encounter**: Adds selected players and creatures to the encounter. The number of each added corresponds to the number in the first column of the selected creatures.
* **Cancel**: Return to the encounter view without adding any creatures.
Roll MHP: On/Off: When on, each creatures max HP will be rolled if defined by a dice expression.
* **Add Player**: Adds a new player to the player list.
* **Add Creature**: Adds a new creature to the creature list.
* **Copy**: Copies the currently selected player or creature if only one is selected.
* **Delete**: Removes all selected players and creatures from their respective lists.
* **Sort By**: Sorts the creature list by the selected value.  

### Creature Card
The creature card is on the right side of the creature view. It displays and makes editable all the information about the currently selected player or creature.  
For players only their name is editable.

The card only displays information if a single player or creature is selected.

The Name, Type, Alignment, and Abilities fields accept any text input.  
The Size drop-down has preset creature sizes from the Dungeon&Dragons system.  

The MHP field may contain either a number or a dice expression.  
Dice expressions are written in the format #d#+#, where # is an number and + may be substituted for - (example: 2d8-1). The + or - may be omitted (example: 13d4). If a dice expression is used, the way MHP is calculated for encounters is controlled by the "Roll MHP Off/On" button.  The average of a dice expression is displayed in parenthesis next to the input field.  

Init+ is for a creatures initiative bonus. This is what is used to automatically roll initiative for encounters.  

The STR, DEX, CON, INT, WIS, and CHA stats have there modifiers automatically calculated using the Dungeons&Dragons system. The modifier is displayed as the large number in the center of the box.    

The CR field is numerical, entering fractions may cause undesirable results. It is recommended to enter fractions as there decimal equivalent (example: 1/4 would be entered as .25).  

The AC, DC, Speed, and EXP fields are numerical, entering anything other than numbers may cause undesirable results.

## Managing An Encounter
An encounter is made up of a sorted list of creatures from the creature list. This list is used to track the order of initiative and the active turn.

The creature whos turn is active is highlighted in yellow. The active turn can be changed by using the arrow buttons in the encounter controls or the arrow keys on a keyboard.

### Encounter List
The encounter list is the table on the left side of the encounter view. Each row is a creature in the current encounter.

Each row displays several things about each creature:

* **Init**: The current initiative score of the creature. This value is editable. For non-player creatures this value is changed when the roll button is clicked.
* **Name**: The name of the creature.
* **Token**: An editable text field for recording a token used to represent the creature on battle maps.
* **HP**: Current hit point of the creature.
* **AC**: Armor class of the creature.

Creatures can be selected by clicking their name. All creature can be selected or unselected by clicking the 'name' table header. All creatures can also be unselected by pressing escape on a keyboard.

### Encounter Controls
The encounter controls are in a bar just below the headers. They provide actions for managing the encounter and individual creatures.

#### Control Actions:

* **Creature List**: Switch to the creature view.
* **Remove**: Delete all selected creatures from the encounter list.
* **Crit Init: On/Off**: Clicking this will enable or disable critical successes and failures when rolling initiative. When enabled the program will give creatures that roll a 20 an initiative score of 40 + their bonus, and creatures that roll a 1 an initiative score of -20 + their bonus.
* **Roll**: Auto roll initiative for all non-player creatures. This will also sort the encounter table. Non-player creatures with the same initiative will be automatically sorted by their initiative bonus. Any ties in initiative with players will need to be manually handled.
* **Sort**: Sorts/re-sorts the encounter table by initiative score.
* **Arrows**: If no creatures are selected these buttons will change the active turn marker. If a single creature is selected it will be moved up or down in the list (this can be used to move players after initiative roll offs). A keyboard's up and down arrows may be used in place of these buttons, and pressing enter will deselect all creatures and advance the turn.   
* **Kill**: Clicking this will gray out selected creature. These creatures will be skipped when changing the active turn. Creatures can be resurrected by re-selecting them and clicking this button again.

### Encounter Card
The encounter card is on the right side of the encounter view. It displays the stats, abilities, and actions of the either a selected creature or the creatures whos turn it is if no creature is selected.

The card only displays information if a single creature is selected.

There are 2 manipulable field on the encounter card:

* **HP/MHP**: Current hit point of the creature and maximum hit point. 
* **Notes**: This field should be used to keep track of any other variables of an individual creature (marker for the creature, status effects, used special abilities, etc.)

## Saving and Loading
Encounters and creature lists can be saved to json files and reloaded later.

### Auto Save
The creature list is auto saved to browser storage anytime the creature list is edited.

The save is based on the url of the program. If the program is accessed from a different location the auto save will not load.

There is only one auto save per browser. If multiple creature lists are loaded they will overwrite the existing save.

### Manual Saves
Clicking the 'Save' button on the IO bar will bring up download buttons for both the encounter and creature list.

The name of the files to be downloaded can be changed using the text fields next to the download buttons.

Clicking the download buttons will use the browsers file download system to save the encounter/creature list as a json file.

### Loading
Saved encounters and creature lists can be reloaded by using the browse buttons in the IO bar.

Clicking browse will bring up a file browser dialog to select a saved json file.

You may load an encounter or creatures list without the other, but creatures in encounters will not have their stats if they are not in the loaded creatures list.
