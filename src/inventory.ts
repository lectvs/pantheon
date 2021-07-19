type InventoryItem = {
    icon: string;
    name: string;
    description: string;
}

type ISResult = {
    item?: string;
}

const ITEMS: Dict<InventoryItem> = {
    'cane': { icon: 'cane', name: "Valiant Cane", description: "Your knees just don't work like they used to. This cane helps you jump six tiles into the air, like the good ole days." },
    'wad': { icon: 'wad', name: "Crumpled Wad", description: "it's funny" },
    'redkey': { icon: 'redkey', name: "Red Key", description: "Can be used to open the Red Door." },
    'blackkey': { icon: 'blackkey', name: "Black Key", description: "If it were any more black, you wouldn't be able to see it against the background." },
    'blackkey_upsidedown': { icon: 'blackkey_upsidedown', name: "Black Key (upside down)", description: "It's been turned upside down, and should now be able to open the Black Door with ease." },
    'blackkey_rightsideup': { icon: 'blackkey', name: "Black Key (rightside up)", description: "It's been turned upside down, then upside down again, rendering it identical to its previous orientation." },
    'string': { icon: 'string', name: "String", description: "Reminds you of the days before string cheese and string theory. String was just string, and that was good enough for you." },
    'nickel': { icon: 'nickel', name: "Shiny Nickel", description: "A shiny nickel worth $5. This makes sense because of inflation." },
}

var INVENTORY: string[] = ['cane', 'wad', 'nickel'];

function GIVE_ITEM(item: string) {
    INVENTORY.push(item);
}

function CONSUME_ITEM(item: string) {
    INVENTORY.splice(INVENTORY.lastIndexOf(item), 1);
}

function REPLACE_ITEM(item: string, newItem: string) {
    INVENTORY[INVENTORY.lastIndexOf(item)] = newItem;
}

class InventorySelect extends Sprite {
    private readonly ITEMS_START = vec2(48, 34);
    private readonly ITEM_NAME_DX = 20;
    private readonly ITEM_DY = 24;
    private readonly DESCRIPTION_POS = vec2(218, 53);
    private readonly DESCRIPTION_WIDTH = 148;
    private readonly MESSAGE_POS = vec2(12, 248);

    private message: string;
    private inventory: string[];
    private index: number = 0;

    private description: SpriteText;
    private selection: Sprite;

    selectedItem: string = undefined;
    get hasSelected() { return this.selectedItem !== undefined; }

    constructor(message: string) {
        super({
            texture: 'itemboxes',
            layer: Theater.LAYER_DIALOG,
        });

        this.message = message;
        this.inventory = A.clone(INVENTORY);
    }

    onAdd() {
        for (let i = 0; i < this.inventory.length; i++) {
            let id = this.inventory[i];
            let item = ITEMS[id];
            this.addChild(new Sprite({ x: this.ITEMS_START.x, y: this.ITEMS_START.y + i*this.ITEM_DY, texture: item.icon, matchParentLayer: true }));
            this.addChild(new SpriteText({ x: this.ITEMS_START.x + this.ITEM_NAME_DX, y: this.ITEMS_START.y + i*this.ITEM_DY - 6, text: item.name, matchParentLayer: true }));
        }

        this.description = this.addChild(new SpriteText({ x: this.DESCRIPTION_POS.x, y: this.DESCRIPTION_POS.y, text: this.message, maxWidth: this.DESCRIPTION_WIDTH, matchParentLayer: true }))
        this.addChild(new SpriteText({ x: this.MESSAGE_POS.x, y: this.MESSAGE_POS.y, text: this.message, matchParentLayer: true }));

        let selectionTexture = AnchoredTexture.fromBaseTexture(Texture.outlineRect(20, 20, 0xFFFFFF, 1, 1), 0.5, 0.5);
        this.selection = this.addChild(new Sprite({ texture: selectionTexture, matchParentLayer: true }));
    }

    update() {
        super.update();

        if (Input.justDown('up')) {
            this.index = M.mod(this.index-1, this.inventory.length);
            this.world.playSound('menu_blip');
        }
        if (Input.justDown('down')) {
            this.index = M.mod(this.index+1, this.inventory.length);
            this.world.playSound('menu_blip');
        }

        this.selection.x = this.ITEMS_START.x;
        this.selection.y = this.ITEMS_START.y + this.index * this.ITEM_DY;
        this.description.setText(ITEMS[this.inventory[this.index]].description);

        if (Input.justDown('game_advanceCutscene')) {
            Input.consume('game_advanceCutscene');
            this.selectedItem = this.inventory[this.index];
            this.world.playSound('menu_blip');
        }
    }
}

namespace S {
    export function chooseItem(message: string, result: ISResult) {
        return function*() {
            let selector = global.theater.addWorldObject(new InventorySelect(message));
            while (!selector.hasSelected) {
                yield;
            }
            result.item = selector.selectedItem;
            selector.removeFromWorld();
        }
    }
}