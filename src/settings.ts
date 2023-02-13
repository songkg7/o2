import {App, PluginSettingTab, Setting} from "obsidian";
import O2Plugin from "./main";

export interface O2PluginSettings {
	from: string;
	to: string;
}

export const DEFAULT_SETTINGS: O2PluginSettings = {
	from: 'ready',
	to: 'published'
}

export class O2SettingTab extends PluginSettingTab {
	plugin: O2Plugin;

	constructor(app: App, plugin: O2Plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();
		this.containerEl.createEl('h2', {
			text: 'Settings for O2 plugin.',
		});
		this.addReadyDirectorySetting();
		this.addPublishedDirectorySetting();
		this.containerEl.createEl('h2', {
			text: 'Advanced settings',
		})
	}

	private addReadyDirectorySetting() {
		new Setting(this.containerEl)
			.setName('Ready directory')
			.setDesc('The directory where documents ready to be published will be placed.')
			.addText(text => text
				.setPlaceholder('Enter directory name')
				.setValue(this.plugin.settings.from)
				.onChange(async (value) => {
					console.log('From: ' + value);
					this.plugin.settings.from = value;
					await this.plugin.saveSettings();
				}));
	}

	private addPublishedDirectorySetting() {
		new Setting(this.containerEl)
			.setName('Published directory')
			.setDesc('The directory where publishing will complete and the documents will be moved.')
			.addText(text => text
				.setPlaceholder('Enter directory name')
				.setValue(this.plugin.settings.to)
				.onChange(async (value) => {
					console.log('To: ' + value);
					this.plugin.settings.to = value;
					await this.plugin.saveSettings();
				}));
	}
}
