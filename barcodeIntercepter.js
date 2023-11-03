/**
 * Detects whether the scanned input is a valid Barcode.
 * 
 * @param {Object} args - An object containing the necessary parameters for barcode detection.
 * @param {string} args.endingChar - The character that signals the end of the barcode.
 * @param {Function} [args.callback] - A optional callback function to execute when a valid barcode is detected.
 * @param {number} [args.minimumCharLength=8] - The expected minimum length of the barcode (default is 8).
 */
function barcodeIntercepter(args) {
    if (args == undefined) {
        throw new Error(`Missing argument (args) in function - barCode`);
    }

    if (args.endingChar == undefined) {
        throw new Error(`Please specify endingChar that signals the end of the barcode.`);
    }

    if (args.minimumCharLength == undefined) {
        args.minimumCharLength = 8;
    }

    let barcodeInput = '';
    let keyBoardInput = '';
    let lastKeyPressTime = new Date().getTime();
    let focusedElement = document.activeElement;
    let scannerEnabled = false;
    const toggleScannerDivId = "BM-toggleScanner";
    const toggleScannerBtnId = "toggleScannerBtnId";
    let onInputScanEnabled = false;
    let typingThreshold = 15; // Threshold time in milliseconds to determine fast typing
    let toggleScannerDiv;
    let toggleScannerBtn;
    appendToogleBtn();
    toggleScanner();

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('click', handleFocus);
    document.addEventListener('keyup', handleFocus);
    
    handleIFrames();


    addEventListener("keydown", handleInput);
    
    /**
     * Checks whether the currently focused element within the DOM is editable or suitable for user input.
     * 
     * @returns {boolean} Returns true if the focused element is editable; otherwise, returns false.
     */
    function isEditable() {
        return (focusedElement && !focusedElement.readOnly && !focusedElement.disabled &&
            ((focusedElement.tagName === 'INPUT' && focusedElement.type !== 'hidden') || focusedElement.tagName === 'SELECT' ||
                focusedElement.tagName === 'TEXTAREA' || (focusedElement.isContentEditable)));
    }


    /**
     * Generates and appends a toggle button to control the scanner functionality within the DOM.
     * The button allows users to turn on or off the scanner.
     */
    function appendToogleBtn() {
        toggleScannerDiv = document.createElement('div');
        toggleScannerDiv.id = toggleScannerDivId;
        toggleScannerDiv.style.position = 'fixed';
        toggleScannerDiv.style.bottom = '50vh';
        toggleScannerDiv.style.right = '0px';
        toggleScannerDiv.style.zIndex = '99';
        toggleScannerDiv.style.cursor = 'pointer';
        toggleScannerDiv.style.display = 'none';

        toggleScannerBtn = document.createElement('button');
        toggleScannerBtn.id = toggleScannerBtnId;
        toggleScannerBtn.className = 'btn-info';
        toggleScannerBtn.style.padding = '4px';
        toggleScannerBtn.style.fontSize = '16px';
        toggleScannerBtn.style.border = '0.1px solid black';
        toggleScannerBtn.textContent = 'Scanner Off';

        toggleScannerDiv.appendChild(toggleScannerBtn);
        document.body.appendChild(toggleScannerDiv);

        toggleScannerBtn.addEventListener('click', (event) => {
            event.preventDefault();
            onInputScanEnabled = !onInputScanEnabled;
            updateToggleBtnText()
        });
    }

    /**
     * Manages the state of the scanner based on the focused element within the Document Object Model (DOM).
     * Handles the visibility of toggle scanner button and activation of the scanner according to the focused element and its editability.
     */
    function toggleScanner() {
        if (!(focusedElement.id == toggleScannerDivId || focusedElement.id == toggleScannerBtnId)) {
            if (isEditable()) {
                scannerEnabled = onInputScanEnabled;
                toggleScannerDiv.style.display = "inline-block";
                updateToggleBtnText();
            } else {
                scannerEnabled = true;
                toggleScannerDiv.style.display = "none";
            }
        }
    }


    /**
     * Updates the text content of the toggle button based on the current state of the scanner.
     * Changes the button text to indicate whether the scanner is currently on or off.
     */
    function updateToggleBtnText() {
        // Updates the button text according to the current scanner state
        if (onInputScanEnabled) {
            toggleScannerBtn.textContent = 'Scanner On'; // Displays 'Scanner On' if the scanner is on
        } else {
            toggleScannerBtn.textContent = 'Scanner Off'; // Displays 'Scanner Off' if the scanner is off
        }
    }

    
    /**
     * Manages focus change events within the Document Object Model (DOM) to update the currently focused element.
     * Triggers the 'toggleScanner()' function to adjust the scanner state based on the focused element.
     * 
     * @param {Event} event - The event object containing information about the focus change.
     */
    function handleFocus(event) {
        focusedElement = document.activeElement; // Updates the focused element based on the active element
        toggleScanner(); // Adjusts the scanner state based on the current focused element
    }





    /**
     * Manages iframe elements within the Document Object Model (DOM) to extend scanner functionality within iframes.
     * Handles focus and events within iframes for barcode scanning functionality.
     */
    function handleIFrames() {
        // Retrieves all iframe elements in the DOM and adds event handlers for barcode scanning
        Array.from(document.getElementsByTagName('iframe')).forEach(iframe => handleIframeEvents(iframe.id));

        /**
         * Adds event listeners to iframe elements to manage focus, click, and key events for barcode scanning within iframes.
         * 
         * @param {string} iframeId - The ID of the iframe element to attach event listeners.
         */
        function handleIframeEvents(iframeId) {
            var iframe = document.getElementById(iframeId);
            if (iframe && iframe.contentWindow) {
                ['focusin', 'click', 'keyup'].forEach(eventType => {
                    iframe.contentWindow.addEventListener(eventType, event => handleIframeFocus(iframe));
                });
            }
        }

        /**
         * Handles focus changes within iframes, updating the focused element and adjusting the scanner state.
         * 
         * @param {HTMLIFrameElement} iframe - The iframe element to be handled for focus changes.
         */
        function handleIframeFocus(iframe) {
            focusedElement = iframe.contentWindow.document.activeElement; // Updates the focused element within the iframe
            toggleScanner(); // Adjusts the scanner state based on the focused element within the iframe
        }
    }





    /**
     * Determines whether typing is occurring at a fast rate by comparing the time difference between key presses.
     * 
     * @returns {boolean} Returns true if typing is happening quickly; otherwise, returns false.
     */
    function isTypingFast() {
        var currentTime = new Date().getTime();
        var timeDifference = currentTime - lastKeyPressTime;
        return timeDifference < typingThreshold; // Returns true if the time difference is less than the threshold, indicating fast typing
    }



    /**
     * Handles keyboard input events for barcode scanning and processing.
     * 
     * @param {Event} event - The event object representing the keyboard input event.
     */
    function handleInput(event) {
        if (scannerEnabled && (event.key.length == 1 || event.key == args.endingChar)) {
            if (!(event.key == args.endingChar && barcodeInput.length < args.minimumCharLength)) {
                event.preventDefault();
            }
            if (event.key == args.endingChar) {
                if (isTypingFast() && barcodeInput.length >= args.minimumCharLength) {
                    if (args.callback != undefined && typeof args.callback == "function") {
                        args.callback(barcodeInput, true);
                    }

                } else {
                    if (args.callback != undefined && typeof args.callback == "function") {
                        args.callback(keyBoardInput, false);
                    }
                }

                barcodeInput = '';
                keyBoardInput = '';
            } else {
                if (!isTypingFast()) {
                    barcodeInput = event.key;
                } else {
                    barcodeInput += event.key; // Accumulates characters for potential barcode input
                }

                keyBoardInput += event.key;
            }
            lastKeyPressTime = new Date().getTime();
        }
    }
}
