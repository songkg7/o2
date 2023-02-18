import { Plugin } from 'obsidian'
import { DEFAULT_SETTINGS, O2PluginSettings, O2SettingTab } from "./settings"
import { convertToJekyll } from "./jekyll"

export default class O2Plugin extends Plugin {
    settings: O2PluginSettings

    async onload() {
        await this.loadSettings()

        this.addCommand({
            id: 'publish-command',
            name: 'Publish command',
            callback: async () => {
                // TODO: init jekyll from to folder
                return await convertToJekyll(this)
            }
        })

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new O2SettingTab(this.app, this))

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.
        this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            console.log('click', evt)
        })

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000))
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }

}


