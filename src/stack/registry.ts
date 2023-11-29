const fs = require('fs');
const path = require('path');
export default class stackRegistry {
  static filePath = path.join(__dirname, '../stackRegistry.json');

  static register(methodName, functionId) {
    const registry = this.loadRegistry();
    registry[methodName] = functionId;
    console.log('registry');
    console.log(registry);
    this.saveRegistry(registry);
  }

  static exists(functionId): boolean {
    const registry = this.loadRegistry();
    for (const key in registry) {
      if (registry[key] === functionId) {
        return true;
      }
    }
    return false;
  }

  static nameExists(methodName): boolean {
    const registry = this.loadRegistry();
    if (registry[methodName]) {
      return true;
    }
    return false;
  }

  static loadRegistry() {
    if (!fs.existsSync(this.filePath)) {
      return {};
    }

    const fileContent = fs.readFileSync(this.filePath, 'utf8');
    try {
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading registry file:', error);
      return {};
    }
  }

  static saveRegistry(registry) {
    try {
      const data = JSON.stringify(registry, null, 2);
      fs.writeFileSync(this.filePath, data, 'utf8');
    } catch (error) {
      console.error('Error writing to registry file:', error);
    }
  }

  static update(oldName, newName) {
    console.log(`updating ${oldName} to ${newName} in registry`);
    const registry = this.loadRegistry();
    const functionId = registry[oldName];
    delete registry[oldName];
    registry[newName] = functionId;
    this.saveRegistry(registry);
  }

  static remove(methodName) {
    const registry = this.loadRegistry();
    delete registry[methodName];
    this.saveRegistry(registry);
  }
}
