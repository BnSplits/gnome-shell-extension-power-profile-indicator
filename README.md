# Power Profile Indicator

A simple GNOME Shell extension that adds the current power profile icon (e.g., Balanced, Performance, Power Saver) to the system panel. Clean, lightweight, and integrates seamlessly with the existing GNOME power profile system.

## Features

- Displays an icon in the top panel that reflects the current power profile.
- Option to hide the icon when using the "Balanced" profile.
- Lightweight and unobtrusive, with no external dependencies.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/BnSplits/gnome-shell-extension-power-profile-indicator.git
````

2. Copy the folder to your local GNOME Shell extensions directory:

   ```bash
   cp -r gnome-shell-extension-power-profile-indicator ~/.local/share/gnome-shell/extensions/power-profile-indicator@bnsplits.github.com
   ```

3. Restart GNOME Shell:

   * Press <kbd>Alt</kbd> + <kbd>F2</kbd>, type `r`, then press <kbd>Enter</kbd> (on X11),
   * Or logout and log back in (on Wayland).

4. Enable the extension:

   * Via the **GNOME Extensions** app,
   * Or run:

     ```bash
     gnome-extensions enable power-profile-indicator@bnsplits.github.com
     ```

## Preferences

* Use the **Extensions** app to access the extension’s settings.
* You can choose whether to show the indicator when the system is using the "Balanced" power profile.

## License

This project is licensed under the [GPL-2.0-or-later](LICENSE) license.
