import { randomDelay as rd } from "./FakeAPI";

type ItemType = {
  label: string;
  checked: boolean;
};

class ShoppingListAPI {
  items: Record<number, ItemType>;

  constructor() {
    const persisted = localStorage.getItem("ShoppingListAPI");
    if (persisted == null) {
      this.items = {};
    } else {
      this.items = JSON.parse(persisted);
    }
  }

  async getItems() {
    await this.randomDelay("getItems");
    return this.items;
  }

  async getItem(id: number): Promise<ItemType | undefined> {
    await this.randomDelay("getItem", id);
    return this.items[id];
  }

  async createOrUpdateItem(id: number, item: ItemType) {
    await this.randomDelay("createOrUpdateItem", id);
    this.items[id] = item;
    this.persist();
  }

  async deleteItem(id: number) {
    await this.randomDelay("deleteItem", id);
    delete this.items[id];
    this.persist();
  }

  private async randomDelay(name: string, param?: number) {
    let label = `Fake Request: ${name}.`;
    if (param != null) label += ` id: ${param}`;

    await rd();
    console.log(`End ${label}`);
  }

  private persist() {
    localStorage.setItem("ShoppingListAPI", JSON.stringify(this.items));
  }
}

export const shoppingListAPI = new ShoppingListAPI();
