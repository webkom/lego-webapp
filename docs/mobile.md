Basic content should automatically be responsive by composing responsive classes
like `contentContainer`. If you want to completely hide something on mobile, add
the `hiddenOnMobile` class. Be hesitant to use this, as we do not want the
mobile version to have any less functionality than the full version.

Make sure to double check that your feature is responsive; this is 2017.

**PROTIP**: If you have an Android device, Google Chrome DevTools allows you to
debug and forward ports to your device easily. This is called
[remote-debugging](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/),
and gives you the exact same developer tools you have in Chrome, on you Android
device. This works on all chromium based browsers, that means all webviews, all
versions of chrome, and also oem versions like Samsung Internet Browser.
