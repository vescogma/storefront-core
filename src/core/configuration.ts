export class Registry {

  private registry: { [key: string]: { [key: string]: any[] } } = {};

  register(namespace: string, name: string, value: any) {
    if (!this.registry[namespace]) {
      this.registry[namespace] = {};
    }
    if (!this.registry[namespace][name]) {
      this.registry[namespace][name] = [];
    }
    this.registry[namespace][name].push(value);
  }
}
