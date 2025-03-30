import { O2PluginSettings } from '../../../settings';
import { convertFileName } from '../../../core/converters/FilenameConverter';

export default class JekyllSettings implements O2PluginSettings {
  private _jekyllPath: string;
  private _jekyllRelativeResourcePath: string;
  pathReplacer(
    year: string,
    month: string,
    day: string,
    title: string,
  ): string {
    title = convertFileName(title);
    return `${year}-${month}-${day}-${title}.md`;
  }

  // FIXME: abstraction
  private _isEnableBanner: boolean;
  private _isEnableCurlyBraceConvertMode: boolean;
  private _isEnableUpdateFrontmatterTimeOnEdit: boolean;
  private _isEnableRelativeUrl: boolean;

  constructor() {
    this._jekyllPath = '';
    this._jekyllRelativeResourcePath = 'assets/img';
    this._isEnableRelativeUrl = false;
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

  get isEnableRelativeUrl(): boolean {
    return this._isEnableRelativeUrl;
  }

  set isEnableRelativeUrl(value: boolean) {
    this._isEnableRelativeUrl = value;
  }

  targetPath(): string {
    return `${this._jekyllPath}/_posts`;
  }

  targetSubPath(folder: string) {
    return `${this._jekyllPath}/${folder}`;
  }

  resourcePath(): string {
    return `${this._jekyllPath}/${this._jekyllRelativeResourcePath}`;
  }

  afterPropertiesSet(): boolean {
    return this._jekyllPath !== '';
  }
}
