//    Power Profile Indicator
//    GNOME Shell extension

import Clutter from "gi://Clutter";
import GLib from "gi://GLib";
import GObject from "gi://GObject";

import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { SystemIndicator } from "resource:///org/gnome/shell/ui/quickSettings.js";

import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

const PowerProfileIndicator = GObject.registerClass(
  class PowerProfileIndicator extends SystemIndicator {
    _init(settings) {
      super._init();

      this._settings = settings;
      this._settings.connectObject("changed", this._setIcon.bind(this), this);

      this._indicator = this._addIndicator();
      this._container = this._indicator.get_parent(); // Save parent to re-attach later

      this._timeout = GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
        this._powerProfileToggle =
          Main.panel.statusArea.quickSettings?._powerProfiles?.quickSettingsItems[0];
        this._setIcon();

        this._powerProfileToggle?.connectObject(
          "notify::icon-name",
          this._setIcon.bind(this),
          this,
        );
        this.connectObject(
          "scroll-event",
          (actor, event) => this._onScrollEvent(event),
          this,
        );
        this.connectObject("destroy", this._destroy.bind(this), this);

        this._timeout = null;
        return GLib.SOURCE_REMOVE;
      });
    }

    _setIcon() {
      const newProfile = this._powerProfileToggle?._proxy?.ActiveProfile;

      this._activeProfile = newProfile;

      // Hide indicator if profile is balanced and setting says so
      const hideBalanced =
        newProfile === "balanced" &&
        !this._settings.get_boolean("show-balanced");
      if (hideBalanced) {
        if (this._indicator?.get_parent())
          this._indicator.get_parent().remove_child(this._indicator);
        return;
      }

      // Re-add indicator if not already present
      if (!this._indicator?.get_parent() && this._container)
        this._container.add_child(this._indicator);

      this._indicator.icon_name = this._powerProfileToggle?.icon_name;
    }

    _setPowerMode(profile) {
      if (this._powerProfileToggle?._proxy)
        this._powerProfileToggle._proxy.ActiveProfile = profile;
    }

    _onScrollEvent(event) {
      let availableProfiles = this._powerProfileToggle?._proxy?.Profiles.map(
        (p) => p.Profile.unpack(),
      ).reverse();
      let activeProfileIndex = availableProfiles.indexOf(this._activeProfile);
      let newProfile = this._activeProfile;

      switch (event.get_scroll_direction()) {
        case Clutter.ScrollDirection.UP:
          newProfile = availableProfiles[Math.max(activeProfileIndex - 1, 0)];
          this._setPowerMode(newProfile);
          break;
        case Clutter.ScrollDirection.DOWN:
          newProfile =
            availableProfiles[
              Math.min(activeProfileIndex + 1, availableProfiles.length - 1)
            ];
          this._setPowerMode(newProfile);
          break;
      }

      return Clutter.EVENT_STOP;
    }

    _destroy() {
      this._container = null;
      this._settings.disconnectObject(this);
      this._settings = null;

      if (this._timeout) {
        GLib.Source.remove(this._timeout);
        this._timeout = null;
      }

      this._powerProfileToggle?.disconnectObject(this);
      this._powerProfileToggle = null;

      this._indicator.destroy();
      this._indicator = null;

      super.destroy();
    }
  },
);

export default class PowerProfileIndicatorExtension extends Extension {
  constructor(metadata) {
    super(metadata);
  }

  enable() {
    this._indicator = new PowerProfileIndicator(
      this.getSettings("org.gnome.shell.extensions.power-profile-indicator"),
    );
    Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
  }

  disable() {
    this._indicator?.destroy();
    this._indicator = null;
  }
}
