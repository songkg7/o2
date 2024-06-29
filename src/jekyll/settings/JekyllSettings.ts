import { O2PluginSettings } from '../../settings';

export default class JekyllSettings implements O2PluginSettings {
  attachmentsFolder: string;
  readyFolder: string;
  achieveFolder: string;
  isAutoAchieve: boolean;
  private _jekyllPath: string;
  private _jekyllRelativeResourcePath: string;
  private _isAutoCreateFolder: boolean;
  pathReplacer(year: string, month: string, day: string, title: string): string {
    return `${year}-${month}-${day}-${title}.md`;
  }

  // FIXME: abstraction
  private _isEnableBanner: boolean;
  private _isEnableCurlyBraceConvertMode: boolean;
  private _isEnableUpdateFrontmatterTimeOnEdit: boolean;

  constructor() {
    this.attachmentsFolder = 'attachments';
    this.readyFolder = 'ready';
    this.achieveFolder = 'backup';
    this._jekyllPath = '';
    this._jekyllRelativeResourcePath = 'assets/img';
    this._isAutoCreateFolder = false;
  }

  get jekyllPath(): string {
    return this._jekyllPath;
  }

  set jekyllPath(value: string) {
    this._jekyllPath = value;
  }

  get jekyllRelativeResourcePath(): string {
    return this._jekyllRelativeResourcePath;
  }

  set jekyllRelativeResourcePath(value: string) {
    this._jekyllRelativeResourcePath = value;
  }

  get isEnableBanner(): boolean {
    return this._isEnableBanner;
  }

  set isEnableBanner(value: boolean) {
    this._isEnableBanner = value;
  }

  get isEnableCurlyBraceConvertMode(): boolean {
    return this._isEnableCurlyBraceConvertMode;
  }

  set isEnableCurlyBraceConvertMode(value: boolean) {
    this._isEnableCurlyBraceConvertMode = value;
  }

  get isEnableUpdateFrontmatterTimeOnEdit(): boolean {
    return this._isEnableUpdateFrontmatterTimeOnEdit;
  }

  set isEnableUpdateFrontmatterTimeOnEdit(value: boolean) {
    this._isEnableUpdateFrontmatterTimeOnEdit = value;
  }

  get isAutoCreateFolder(): boolean {
    return this._isAutoCreateFolder;
  }

  set isAutoCreateFolder(value: boolean) {
    this._isAutoCreateFolder = value;
  }

  targetPath(): string {
    return `${this._jekyllPath}/_posts`;
  }

  resourcePath(): string {
    return `${this._jekyllPath}/${this._jekyllRelativeResourcePath}`;
  }

  afterPropertiesSet(): boolean {
    return this._jekyllPath !== '';
  }
}
