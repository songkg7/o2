export class TFile {
  path: string;
  name: string;
  extension: string;
  parent: any;

  constructor(path: string) {
    this.path = path;
    const parts = path.split('/');
    this.name = parts[parts.length - 1];
    const nameParts = this.name.split('.');
    this.extension = nameParts[nameParts.length - 1];
    this.parent = null;
  }
}

export class Notice {
  constructor(message: string, timeout?: number) {
    // Mock implementation
  }
}

export class FileSystemAdapter {
  // Mock implementation
}

export class Vault {
  async read(file: TFile): Promise<string> {
    return '';
  }

  async modify(file: TFile, data: string): Promise<void> {
    // Mock implementation
  }
}

export class App {
  vault: Vault;

  constructor() {
    this.vault = new Vault();
  }
}

export class Plugin {
  app: App;

  constructor() {
    this.app = new App();
  }
} 