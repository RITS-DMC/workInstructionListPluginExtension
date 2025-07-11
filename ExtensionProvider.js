sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "rits/custom/plugin/wilistplugin/workInstructionListExtensionProvider/LifecycleExtension",
    "rits/custom/plugin/wilistplugin/workInstructionListExtensionProvider/PluginEventExtension"
], function (PluginExtensionProvider, CreateExtension, PluginEventExtension) {
    "use strict";
    return PluginExtensionProvider.extend("rits.custom.plugin.wilistplugin.workInstructionListExtensionProvider.ExtensionProvider", {
        constructor: function () {
        },
        getExtensions: function () {
            return [
                new CreateExtension(),
                new PluginEventExtension()
            ];
        }
    });
});
