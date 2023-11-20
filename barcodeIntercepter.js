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
    let prevFocusElem = null;
    let scannerEnabled = false;
    const toggleScannerDivId = "BM-toggleScanner";
    const toggleScannerBtnId = "toggleScannerBtnId";
    let typingThreshold = 15; // Threshold time in milliseconds to determine fast typing
    let toggleScannerDiv;
    let toggleScannerBtn;
    appendToogleBtn();
    toggleScanner();

    document.addEventListener('focusin', handleWindowFocus);
    document.addEventListener('click', handleWindowFocus);
    document.addEventListener('keyup', handleWindowFocus);
    
    handleIFrames();


    addEventListener("keydown", handleInput);
    
    /**
     * Checks whether the currently focused element within the DOM is editable or suitable for user input.
     * 
     * @returns {boolean} Returns true if the focused element is editable; otherwise, returns false.
     */
    function isEditable() {
        return (focusedElement && !focusedElement.readOnly && !focusedElement.disabled &&
            (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'SELECT' ||
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
        toggleScannerDiv.style.top = '0px';
        toggleScannerDiv.style.left = 'calc(50vw - 18px)';
        toggleScannerDiv.style.zIndex = '1000000';
        toggleScannerDiv.style.cursor = 'pointer';
        toggleScannerDiv.style.display = 'none';
        toggleScannerDiv.style.borderBottomLeftRadius = '5px';
        toggleScannerDiv.style.borderBottomRightRadius = '5px';
        toggleScannerDiv.style.background = 'var(--danger)';
        toggleScannerDiv.classList.add('animate', 'animate__bounceIn');
        toggleScannerDiv.tabIndex = -1;

        toggleScannerBtn = document.createElement('button');
        toggleScannerBtn.id = toggleScannerBtnId;
        toggleScannerBtn.style.padding = '4px';
        toggleScannerBtn.style.fontSize = '12px';
        toggleScannerBtn.style.background = 'transparent';
        toggleScannerBtn.style.border = '0px';
        toggleScannerBtn.textContent = 'Scanner Intercepter Off';
        toggleScannerBtn.style.color = 'white';
        toggleScannerBtn.style.outline = '0px';
        toggleScannerBtn.tabIndex = -1;

        toggleScannerDiv.appendChild(toggleScannerBtn);
        document.body.appendChild(toggleScannerDiv);

        toggleScannerBtn.addEventListener('click', (event) => {
            event.preventDefault();
            scannerEnabled = !scannerEnabled;
            focusedElement.focus();
            updateToggleBtnText()
        });
    }

    /**
     * Manages the state of the scanner based on the focused element within the Document Object Model (DOM).
     * Handles the visibility of toggle scanner button and activation of the scanner according to the focused element and its editability.
     */
    function toggleScanner() {
        if (isEditable()) {
            scannerEnabled = false;
            toggleScannerDiv.style.display = "inline-block";
            updateToggleBtnText();
        } else {
            scannerEnabled = true;
            toggleScannerDiv.style.display = "none";
        }
    }


    /**
     * Updates the text content of the toggle button based on the current state of the scanner.
     * Changes the button text to indicate whether the scanner is currently on or off.
     */
    function updateToggleBtnText() {
        // Updates the button text according to the current scanner state
        if (scannerEnabled) {
            toggleScannerBtn.textContent = 'Scanner Intercepter On'; // Displays 'Scanner On' if the scanner is on
        } else {
            toggleScannerBtn.textContent = 'Scanner Intercepter Off'; // Displays 'Scanner Off' if the scanner is off
        }
    }

    
    /**
     * Manages focus change events within the Document Object Model (DOM) to update the currently focused element.
     * Triggers the 'toggleScanner()' function to adjust the scanner state based on the focused element.
     * 
     * @param {Event} event - The event object containing information about the focus change.
     */
    function handleWindowFocus(event) {
        handleFocus(document.activeElement);
    }




    function handleFocus(newActiveElement) {
        if (!(newActiveElement.id == toggleScannerDivId || newActiveElement.id == toggleScannerBtnId) && focusedElement != newActiveElement && newActiveElement.tagName != 'IFRAME') {
            prevFocusElem = focusedElement;
            focusedElement = newActiveElement;
            toggleScanner();
        }
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
                iframe.onload = () => {
                    ['focusin', 'click', 'keyup'].forEach(eventType => {
                        iframe.contentWindow.addEventListener(eventType, event => handleIframeFocus(iframe));
                    });
                    iframe.contentWindow.addEventListener("keydown", handleInput);
                }
            }
        }       

        /**
         * Handles focus changes within iframes, updating the focused element and adjusting the scanner state.
         * 
         * @param {HTMLIFrameElement} iframe - The iframe element to be handled for focus changes.
         */
        function handleIframeFocus(iframe) {
            setTimeout(() => {
                handleFocus(iframe.contentWindow.document.activeElement);
            }, 100)
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
