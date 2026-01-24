// setup.js - Installation script for Games Collection
// Strictly following ZerOS Program Development Convention
(function(window) {
    'use strict';
    
    // IMPORTANT: Program object name must be SETUP
    // ProcessManager will look for window.SETUP to register the program
    const SETUP = {
        pid: null,
        window: null,
        _installContext: null,
        
        /**
         * Program information method
         * @returns {Object} Program metadata
         */
        __info__: function() {
            return {
                name: 'Setup',
                type: 'GUI',
                version: '1.0.0',
                description: 'Installation script for Games Collection',
                author: 'mc-yzy15',
                copyright: '© 2026',
                permissions: [
                    PermissionManager.PERMISSION.GUI_WINDOW_CREATE,
                    PermissionManager.PERMISSION.DESKTOP_MANAGE,
                    PermissionManager.PERMISSION.DESKTOP_SHORTCUT
                ],
                metadata: {
                    allowMultipleInstances: false
                }
            };
        },
        
        /**
         * Initialization method
         * @param {number} pid - Process ID
         * @param {Object} initArgs - Initialization arguments
         */
        __init__: async function(pid, initArgs) {
            this.pid = pid;
            
            // Get installation context from initArgs
            // IMPORTANT: This is how we get the installation context
            if (initArgs && initArgs.metadata && initArgs.metadata.installContext) {
                this._installContext = initArgs.metadata.installContext;
            }
            
            const programName = this._installContext ? this._installContext.programName : 'Games';
            
            // Create GUI window using GUIManager API
            if (typeof GUIManager === 'undefined') {
                throw new Error('GUIManager is not available');
            }
            
            const guiContainer = ProcessManager.getGUIContainer();
            this.window = document.createElement('div');
            this.window.className = 'setup-window zos-gui-window';
            
            // Register window with GUIManager
            const windowInfo = GUIManager.registerWindow(pid, this.window, {
                title: `Installing ${programName}`,
                icon: null,
                onClose: () => {
                    this.__exit__();
                }
            });
            
            // Create installation options interface
            this.window.innerHTML = `
                <div class="setup-container">
                    <h1>Install Games Collection</h1>
                    <p>Choose installation options:</p>
                    <div class="options">
                        <label>
                            <input type="checkbox" id="createDesktopShortcut" checked>
                            Create desktop shortcut
                        </label>
                        <label>
                            <input type="checkbox" id="pinToTaskbar">
                            Pin to taskbar
                        </label>
                        <label>
                            <input type="checkbox" id="autoStart">
                            Start automatically on boot
                        </label>
                    </div>
                    <div class="buttons">
                        <button id="installBtn">Install</button>
                        <button id="cancelBtn">Cancel</button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const installBtn = this.window.querySelector('#installBtn');
            const cancelBtn = this.window.querySelector('#cancelBtn');
            
            installBtn.addEventListener('click', () => {
                this._performInstallation();
            });
            
            cancelBtn.addEventListener('click', () => {
                this.__exit__();
            });
        },
        
        /**
         * Perform installation tasks
         */
        _performInstallation: function() {
            const createDesktopShortcut = this.window.querySelector('#createDesktopShortcut').checked;
            const pinToTaskbar = this.window.querySelector('#pinToTaskbar').checked;
            const autoStart = this.window.querySelector('#autoStart').checked;
            
            // Use installation context terminal to write messages
            if (this._installContext && this._installContext.terminal) {
                this._installContext.terminal.write('Installing Games Collection...\n');
            }
            
            // Perform installation tasks using Kernel APIs
            if (createDesktopShortcut && typeof DesktopManager !== 'undefined') {
                try {
                    // Create desktop shortcut using DesktopManager API
                    DesktopManager.addShortcut('Games', 'icon.svg', 'games.js');
                    if (this._installContext && this._installContext.terminal) {
                        this._installContext.terminal.write('Created desktop shortcut\n');
                    }
                } catch (error) {
                    console.error('Failed to create desktop shortcut:', error);
                }
            }
            
            if (pinToTaskbar && typeof TaskbarManager !== 'undefined') {
                try {
                    // Pin to taskbar using TaskbarManager API
                    TaskbarManager.pinProgram('Games', 'icon.svg', 'games.js');
                    if (this._installContext && this._installContext.terminal) {
                        this._installContext.terminal.write('Pinned to taskbar\n');
                    }
                } catch (error) {
                    console.error('Failed to pin to taskbar:', error);
                }
            }
            
            if (autoStart && typeof ApplicationAssetManager !== 'undefined') {
                try {
                    // Set auto start using ApplicationAssetManager API
                    ApplicationAssetManager.setAutoStart('Games', true);
                    if (this._installContext && this._installContext.terminal) {
                        this._installContext.terminal.write('Set to start automatically\n');
                    }
                } catch (error) {
                    console.error('Failed to set auto start:', error);
                }
            }
            
            // Installation completed
            if (this._installContext && this._installContext.terminal) {
                this._installContext.terminal.write('Installation completed!\n');
            }
            
            // Close the window after a short delay
            setTimeout(() => {
                this.__exit__();
            }, 1000);
        },
        
        /**
         * Exit method
         */
        __exit__: async function() {
            // Clean up resources using GUIManager API
            if (this.window && typeof GUIManager !== 'undefined') {
                GUIManager.unregisterWindow(this.pid);
            }
        }
    };
    
    // IMPORTANT: Must export to window.SETUP, cannot use other names
    if (typeof window !== 'undefined') {
        window.SETUP = SETUP;
    }
    
})(window);