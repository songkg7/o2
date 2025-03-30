export class Notice {
  constructor(message: string) {
    console.log(message);
  }
}

export type VaultConfig = {
  configDir: string;
};

export class TFile {
  path: string;
  name: string;
  constructor(path: string, name: string) {
    this.path = path;
    this.name = name;
  }
}

export class FileSystemAdapter {
  getBasePath(): string {
    return '/mock/base/path';
  }
}

export class Vault {
  adapter: FileSystemAdapter;
  config: VaultConfig;

  constructor() {
    this.adapter = new FileSystemAdapter();
    this.config = {
      configDir: '/mock/config',
    };
  }

  getMarkdownFiles(): TFile[] {
    return [];
  }

  copy(file: TFile, newPath: string): Promise<TFile> {
    return Promise.resolve(new TFile(newPath, file.name));
  }

  delete(file: TFile): Promise<void> {
    return Promise.resolve();
  }
}

export class App {
  vault: Vault;
  fileManager: {
    renameFile: (file: TFile, newPath: string) => Promise<void>;
  };

  constructor() {
    this.vault = new Vault();
    this.fileManager = {
      renameFile: () => Promise.resolve(),
    };
  }
}

export class Plugin {
  app: App;

  constructor() {
    this.app = new App();
  }
}
