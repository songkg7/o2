import {App, PluginSettingTab, Setting} from "obsidian";
import O2Plugin from "./main";

export interface O2PluginSettings {
	mySetting: string;
	from: string;
	to: string;
}

export const DEFAULT_SETTINGS: O2PluginSettings = {
	mySetting: 'default',
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
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for O2 plugin.'});

		new Setting(this.containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(this.containerEl)
			.setName('Setting #2')
			.setDesc('target')
			.addText(text => text
				.setPlaceholder('Enter your target')
				.setValue(this.plugin.settings.to)
				.onChange(async (value) => {
					console.log('Target: ' + value);
					this.plugin.settings.to = value;
					await this.plugin.saveSettings();
				}));
	}
}
