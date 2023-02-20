import { Plugin } from 'obsidian'
import { DEFAULT_SETTINGS, O2PluginSettings, O2SettingTab } from "./settings"
import { convertToChirpy } from "./jekyll/chirpy"

export default class O2Plugin extends Plugin {
    settings: O2PluginSettings

    async onload() {
        await this.loadSettings()

        this.addCommand({
            id: 'o2-converting',
            name: 'converting',
            checkCallback: (checking: boolean) => {
                // TODO: init jekyll from to folder
                if (this.settings.afterPropertiesSet()) {
                    if (checking) {
                        return true
                    }
                    convertToChirpy(this)
                }
            }
        })

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


