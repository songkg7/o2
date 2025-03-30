import {
  parseLocalDate,
  TEMP_PREFIX,
  vaultAbsolutePath,
  getFilesInReady,
  copyMarkdownFile,
  archiving,
  moveFiles,
  cleanUp,
} from '../../../core/utils/utils';
import {
  FileSystemAdapter,
  TFile,
  Notice,
  Plugin,
  Vault,
  DataAdapter,
  TFolder,
} from 'obsidian';
import fs from 'fs';
import type { ObsidianPathSettings } from '../../../settings';

// Create a minimal mock Vault that satisfies the type requirements
const createMockVault = (overrides: Partial<Vault> = {}): Vault =>
  ({
    adapter: new FileSystemAdapter() as DataAdapter,
    configDir: '',
    getName: () => '',
    getAbstractFileByPath: () => null,
    getRoot: () => ({}) as TFolder,
    getFileByPath: () => null,
    getFolderByPath: () => null,
    getMarkdownFiles: () => [],
    getAllLoadedFiles: () => [],
    copy: async () => ({}) as TFile,
    delete: async () => undefined,
    create: async () => ({}) as TFile,
    createBinary: async () => ({}) as TFile,
    createFolder: async () => undefined,
    read: async () => '',
    readBinary: async () => new ArrayBuffer(0),
    rename: async () => undefined,
    modify: async () => undefined,
    process: async () => undefined,
    getResourcePath: () => '',
    ...overrides,
  }) as Vault;

// Create a complete mock ObsidianPathSettings
const createMockSettings = (
  overrides: Partial<ObsidianPathSettings> = {},
): ObsidianPathSettings => ({
  readyFolder: 'ready',
  archiveFolder: 'archive',
  attachmentsFolder: 'attachments',
  isAutoArchive: false,
  isAutoCreateFolder: false,
  ...overrides,
});

type MockVault = Partial<Vault> & {
  adapter?: FileSystemAdapter;
  getMarkdownFiles?: jest.Mock;
  copy?: jest.Mock;
  delete?: jest.Mock;
};

type MockFileManager = {
  renameFile: jest.Mock;
};

type MockApp = {
  vault: MockVault;
  fileManager?: MockFileManager;
};

type MockPlugin = {
  app: MockApp;
  obsidianPathSettings?: Partial<ObsidianPathSettings>;
};

jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  copyFileSync: jest.fn(),
  readdirSync: jest.fn(),
  existsSync: jest.fn(),
}));

jest.mock(
  'obsidian',
  () => {
    class MockFileSystemAdapter {
      getBasePath = jest.fn();
    }
    return {
      FileSystemAdapter: MockFileSystemAdapter,
      Notice: jest.fn(),
      TFile: jest.fn(),
    };
  },
  { virtual: true },
);

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('vaultAbsolutePath', () => {
    it('should return base path when adapter is FileSystemAdapter', () => {
      const mockBasePath = '/test/path';
      const { FileSystemAdapter } = jest.requireMock('obsidian');
      const mockAdapter = new FileSystemAdapter();
      mockAdapter.getBasePath.mockReturnValue(mockBasePath);

      const mockPlugin = {
        app: {
          vault: createMockVault({
            adapter: mockAdapter,
          }),
        },
      };

      const result = vaultAbsolutePath(mockPlugin);
      expect(result).toBe(mockBasePath);
      expect(mockAdapter.getBasePath).toHaveBeenCalled();
    });

    it('should throw error when adapter is not FileSystemAdapter', () => {
      const mockPlugin = {
        app: {
          vault: createMockVault({
            adapter: {} as FileSystemAdapter,
          }),
        },
      };

      expect(() => vaultAbsolutePath(mockPlugin)).toThrow(
        'Vault is not a file system adapter',
      );
    });
  });

  describe('getFilesInReady', () => {
    it('should return markdown files from ready folder', () => {
      const mockFiles = [
        { path: 'ready/test1.md' },
        { path: 'ready/test2.md' },
        { path: 'other/test3.md' },
      ] as TFile[];

      const mockPlugin = {
        app: {
          vault: createMockVault({
            getMarkdownFiles: jest.fn().mockReturnValue(mockFiles),
          }),
        },
        obsidianPathSettings: createMockSettings(),
      };

      const result = getFilesInReady(mockPlugin);
      expect(result).toHaveLength(2);
      expect(result[0].path).toBe('ready/test1.md');
      expect(result[1].path).toBe('ready/test2.md');
    });

    it('should return empty array when no files in ready folder', () => {
      const mockFiles = [
        { path: 'other/test1.md' },
        { path: 'other/test2.md' },
      ] as TFile[];

      const mockPlugin = {
        app: {
          vault: createMockVault({
            getMarkdownFiles: jest.fn().mockReturnValue(mockFiles),
          }),
        },
        obsidianPathSettings: createMockSettings(),
      };

      const result = getFilesInReady(mockPlugin);
      expect(result).toHaveLength(0);
    });
  });

  describe('copyMarkdownFile', () => {
    it('should copy files and return temp files', async () => {
      const mockFiles = [
        { path: 'ready/test1.md', name: 'test1.md' },
        { path: 'ready/test2.md', name: 'test2.md' },
      ] as TFile[];

      const mockPlugin = {
        app: {
          vault: createMockVault({
            getMarkdownFiles: jest
              .fn()
              .mockReturnValueOnce(mockFiles)
              .mockReturnValueOnce([
                ...mockFiles,
                {
                  path: `ready/${TEMP_PREFIX}test3.md`,
                  name: `${TEMP_PREFIX}test3.md`,
                },
              ]),
            copy: jest.fn().mockResolvedValue(undefined),
          }),
        },
        obsidianPathSettings: createMockSettings(),
      };

      const result = await copyMarkdownFile(mockPlugin);
      expect(result).toHaveLength(1);
      expect(result[0].path).toContain(TEMP_PREFIX);
      expect(mockPlugin.app.vault.copy).toHaveBeenCalledTimes(2);
    });

    it('should handle copy errors gracefully', async () => {
      const mockFiles = [
        { path: 'ready/test1.md', name: 'test1.md' },
      ] as TFile[];

      const mockPlugin = {
        app: {
          vault: createMockVault({
            getMarkdownFiles: jest.fn().mockReturnValue(mockFiles),
            copy: jest.fn().mockRejectedValue(new Error('Copy failed')),
          }),
        },
        obsidianPathSettings: createMockSettings(),
      };

      const consoleSpy = jest.spyOn(console, 'error');
      await copyMarkdownFile(mockPlugin);
      expect(consoleSpy).toHaveBeenCalledWith(new Error('Copy failed'));
      consoleSpy.mockRestore();
    });
  });

  describe('archiving', () => {
    it('should not archive when isAutoArchive is false', async () => {
      const mockPlugin = {
        app: {
          vault: createMockVault(),
          fileManager: {
            renameFile: jest.fn(),
          },
        },
        obsidianPathSettings: createMockSettings(),
      };

      await archiving(mockPlugin);
      expect(mockPlugin.app.fileManager.renameFile).not.toHaveBeenCalled();
    });

    it('should move files to archive folder when isAutoArchive is true', async () => {
      const mockFiles = [
        { path: 'ready/test1.md' },
        { path: 'ready/test2.md' },
      ] as TFile[];

      const mockPlugin = {
        app: {
          vault: createMockVault({
            getMarkdownFiles: jest.fn().mockReturnValue(mockFiles),
          }),
          fileManager: {
            renameFile: jest.fn(),
          },
        },
        obsidianPathSettings: createMockSettings({
          isAutoArchive: true,
        }),
      };

      await archiving(mockPlugin);
      expect(mockPlugin.app.fileManager.renameFile).toHaveBeenCalledTimes(2);
      expect(mockPlugin.app.fileManager.renameFile).toHaveBeenCalledWith(
        mockFiles[0],
        'archive/test1.md',
      );
    });
  });

  describe('moveFiles', () => {
    it('should move files to target directory', async () => {
      const sourcePath = '/source';
      const targetPath = '/target';
      const mockFiles = [
        'o2-temp.2024-03-21-test1.md',
        'o2-temp.2024-03-21-test2.md',
      ];

      (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const pathReplacer = (
        year: string,
        month: string,
        day: string,
        title: string,
      ) => `${year}-${month}-${day}-${title}.md`;

      await moveFiles(sourcePath, targetPath, pathReplacer);

      expect(fs.copyFileSync).toHaveBeenCalledTimes(2);
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should create target directory if it does not exist', async () => {
      const sourcePath = '/source';
      const targetPath = '/target';
      const mockFiles = ['o2-temp.2024-03-21-test1.md'];

      (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const pathReplacer = (
        year: string,
        month: string,
        day: string,
        title: string,
      ) => `${year}-${month}-${day}-${title}.md`;

      await moveFiles(sourcePath, targetPath, pathReplacer);

      expect(fs.mkdirSync).toHaveBeenCalledWith(targetPath, {
        recursive: true,
      });
      expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
    });
  });

  describe('cleanUp', () => {
    it('should delete temporary files', async () => {
      const mockTempFiles = [
        { path: `ready/${TEMP_PREFIX}test1.md` },
        { path: `ready/${TEMP_PREFIX}test2.md` },
      ] as TFile[];

      const mockPlugin = {
        app: {
          vault: createMockVault({
            getMarkdownFiles: jest.fn().mockReturnValue(mockTempFiles),
            delete: jest.fn().mockResolvedValue(undefined),
          }),
        },
      };

      const consoleSpy = jest.spyOn(console, 'log');
      await cleanUp(mockPlugin);

      expect(mockPlugin.app.vault.delete).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Deleted temp file: ready/${TEMP_PREFIX}test1.md`,
      );
      consoleSpy.mockRestore();
    });
  });

  describe('parseLocalDate', () => {
    it('should parse valid date string', () => {
      const result = parseLocalDate('2024-03-21');
      expect(result).toEqual({
        year: '2024',
        month: '03',
        day: '21',
      });
    });

    it('should throw error for invalid date format', () => {
      expect(() => parseLocalDate('invalid-date')).toThrow(
        'Invalid date format',
      );
      expect(() => parseLocalDate('2024/03/21')).toThrow('Invalid date format');
      expect(() => parseLocalDate('24-3-21')).toThrow('Invalid date format');
    });
  });
});
