sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/wiplugins/workInstructionListPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/ui/model/json/JSONModel",
    "sap/m/PDFViewer"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, Dialog, Button, ButtonType, List, StandardListItem, JSONModel, PDFViewer) {
    "use strict";

    return PluginControllerExtension.extend("rits.custom.plugin.wilistplugin.workInstructionListExtensionProvider.PluginEventExtension", {
        constructor: function () {
        },

        getOverrideExecution: function (sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_ITEM_PRESS_EVENT) {
                return OverrideExecution.Instead;
            }
            return null;
        },

        /**
         * Returns the name of the core extension this overrides
         *
         * @returns {string} core extension name
         * @public
         */
        getExtensionName: function () {
            return PluginEventConstants.EXTENSION_NAME;
        },

        /**
         * Used to react to the Work Instruction List item press event.
         * The event is triggered when the user presses on work instruction item in a workinstruction list view.
         * If Overridden, this method must create and show the UI with capabilities to close it when the work instruction
         * is no longer needed.
         * @param { oEvent } SAPUI5 oEvent press object
         */

        // Existing Implementation

        /* onItemPressEvent: function ({ oEvent }) {
           const oWorkInstruction = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
           console.log("o work Instrcutions: ",oWorkInstruction);
           this.oDialog = new Dialog({
               title: `Work Instructions ${oWorkInstruction.workInstruction} (${oWorkInstruction.workInstructionElements.length})`,
               content: new sap.ui.layout.VerticalLayout({
                   content: new sap.m.ObjectHeader({
                       title: oWorkInstruction.description,
                       attributes: oWorkInstruction.workInstructionElements.map((oWiElement) => {
                           return new sap.m.ObjectAttribute({
                               title: "Description",
                               text: oWiElement.description
                           });
                       })
                   })
               }),
               beginButton: new Button({
                   type: ButtonType.Emphasized,
                   text: "Verify",
                   press: function () {
                       sap.m.MessageBox.information("Work instruction was recorded.");
                       this.oDialog.close();
                   }.bind(this)
               }),
               endButton: new Button({
                   text: "Discard",
                   press: function () {
                       sap.m.MessageBox.error("You must read and verify work instruction.");
                       this.oDialog.close();
                   }.bind(this)
               })
           });

           this.oDialog.open();
       }, */

       // Modified Implementation

        onItemPressEvent: function ({ oEvent }) {
            const oWorkInstruction = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
            const oWiElement = oWorkInstruction.workInstructionElements?.[0];

            if (oWiElement?.type === "TEXT") {
                this.oDialog = new sap.m.Dialog({
                    title: `Work Instruction ${oWorkInstruction.workInstruction}/${oWorkInstruction.version}`,
                    contentWidth: "80%",
                    contentHeight: "80%",
                    resizable: true,
                    draggable: true,
                    content: [
                        new sap.m.ScrollContainer({
                            vertical: true,
                            horizontal: false,
                            height: "100%",
                            content: [
                                new sap.ui.core.HTML({
                                    content: oWiElement.text || "<div>No content available.</div>"
                                })
                            ]
                        })
                    ],
                    beginButton: new sap.m.Button({
                        text: "Verify",
                        type: sap.m.ButtonType.Emphasized,
                        press: function () {
                            sap.m.MessageBox.information("Work instruction was recorded.");
                            this.oDialog.close();
                        }.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Discard",
                        press: function () {
                            this.oDialog.close();
                        }.bind(this)
                    })
                });

                this.oDialog.open();
            } else if (oWiElement?.type === "URL" && oWiElement.url) {
                const iframeHtml = `
                <div style="height:100%; width:100%; margin:0; padding:0; overflow:hidden;">
                    <iframe 
                        src="${oWiElement.url}" 
                        style="border:none; height:100%; width:100%; margin:0; padding:0;"
                        frameborder="0"
                    ></iframe>
                </div>`;

                this.oDialog = new sap.m.Dialog({
                    title: `Work Instruction PDF - ${oWorkInstruction.workInstruction}/${oWorkInstruction.version}`,
                    contentWidth: "100%",
                    contentHeight: "100%",
                    horizontalScrolling: false,
                    verticalScrolling: false,
                    resizable: true,
                    draggable: true,
                    content: [
                        new sap.ui.core.HTML({
                            content: iframeHtml
                        })
                    ],
                    beginButton: new sap.m.Button({
                        text: "Close",
                        press: function () {
                            this.oDialog.close();
                        }.bind(this)
                    })
                });

                this.oDialog.open();
            }
        }

    });
});
