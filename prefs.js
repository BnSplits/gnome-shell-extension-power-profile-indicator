import Gio from "gi://Gio";
import Adw from "gi://Adw";

import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class PowerProfilePreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    window._settings = this.getSettings(
      "org.gnome.shell.extensions.power-profile-indicator",
    );

    const page = new Adw.PreferencesPage({
      title: "Power Profile Indicator extension",
      icon_name: "dialog-information-symbolic",
    });
    window.add(page);

    const group = new Adw.PreferencesGroup();
    page.add(group);

    const showBalanced = new Adw.SwitchRow({
      title: "Show Balanced Icon",
    });
    group.add(showBalanced);
    window._settings.bind(
      "show-balanced",
      showBalanced,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );
  }
}
