<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>


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
    addScannerOnlyModeBtn();

    document.addEventListener('focusin', handleWindowFocus);
    document.addEventListener('click', handleWindowFocus);
    document.addEventListener('keyup', handleWindowFocus);

    handleIFrames();


    addEventListener("keydown", handleInput);

    function GetIndexForScannerOnlyMode() {
        let zIndexes = Array.from(document.querySelectorAll('body *'))
            .map(a => parseFloat(window.getComputedStyle(a).zIndex))
            .filter(a => !isNaN(a))
            .sort((a, b) => a < b == true ? -1 : 1);
        let index = zIndexes[zIndexes.length - 1];
        return index;
    }

    function addScannerOnlyModeBtn() {
        const style = document.createElement('style');
        const zIndex = GetIndexForScannerOnlyMode();
        style.innerHTML = `
            .scanner_btn {
                position: fixed;
                width: 25px;
                height: 25px;
                bottom: 0px;
                left: 0px;
                background-color: black;
                color: white;
                border-radius: 50px;
                text-align: center;
                box-shadow: 2px 2px 3px #999;
                z-index: ${zIndex};
                transition-duration: 200ms;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .scanner_btn span {
                font-size: 21px;
            }

            .scanner_btn:hover {
                font-family: 'Material Icons';
                cursor: pointer;
                transform: scale(1.5);
                transform-origin: bottom left;
            }

            .scanner_btn.mode_on {
                background-color: #2c7b30;
                color: #fff;
            }


            .scanner_icon_div {
                text-align: center;
                vertical-align: middle;
                font-size: 70px;
                color: #1100ff26;
            }

            .scanner_icon {
                text-align: center;
                vertical-align: middle;
                font-size: 70px;
                color: #1100ff26;
            }
        `;
        document.head.appendChild(style);

        // Create the scanner button element
        const scannerModeBtn = document.createElement('span');
        scannerModeBtn.id = "scannerModeBtn";
        scannerModeBtn.className = "scanner_btn";
        scannerModeBtn.title = "Scanner Only Mode";
        scannerModeBtn.tabIndex = 0;
        scannerModeBtn.accessKey = "b";
        scannerModeBtn.onclick = function () {
            const html = `
                <div id='BM-scannerMode' class='scannerModeDiv' tabindex='0' style='position: fixed; z-index: 1050; top: 0; left: 0; width: 100%; height: 100%; background-color: #a1b6c942; display: flex; align-items: center; justify-content: center;'>
                    <span class='scanner_icon_div'>
                        <svg fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M5,49c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v37C4,48.553,4.448,49,5,49z"></path> <path d="M55,49c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v37C54,48.553,54.448,49,55,49z"></path> <path d="M9,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C8,40.553,8.448,41,9,41z"></path> <path d="M12,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C11,40.553,11.448,41,12,41z"></path> <path d="M17,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C16,40.553,16.448,41,17,41z"></path> <path d="M20,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C19,40.553,19.448,41,20,41z"></path> <path d="M23,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C22,40.553,22.448,41,23,41z"></path> <path d="M29,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C28,40.553,28.448,41,29,41z"></path> <path d="M34,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C33,40.553,33.448,41,34,41z"></path> <path d="M37,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C36,40.553,36.448,41,37,41z"></path> <path d="M42,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C41,40.553,41.448,41,42,41z"></path> <path d="M45,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C44,40.553,44.448,41,45,41z"></path> <path d="M51,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C50,40.553,50.448,41,51,41z"></path> <path d="M9,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C8,46.553,8.448,47,9,47z"></path> <path d="M12,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C11,46.553,11.448,47,12,47z"></path> <path d="M15,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C14,46.553,14.448,47,15,47z"></path> <path d="M17,45v1c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1S17,44.447,17,45z"></path> <path d="M20,45v1c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1S20,44.447,20,45z"></path> <path d="M23,45v1c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1S23,44.447,23,45z"></path> <path d="M27,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C26,46.553,26.448,47,27,47z"></path> <path d="M29,45v1c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1S29,44.447,29,45z"></path> <path d="M33,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C32,46.553,32.448,47,33,47z"></path> <path d="M35,46c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1V46z"></path> <path d="M38,46c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1V46z"></path> <path d="M42,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C41,46.553,41.448,47,42,47z"></path> <path d="M45,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C44,46.553,44.448,47,45,47z"></path> <path d="M48,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C47,46.553,47.448,47,48,47z"></path> <path d="M51,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C50,46.553,50.448,47,51,47z"></path> <path d="M0,5v50h60V5H0z M58,53H2V7h56V53z"></path> </g> </g></svg> Scanner Only Mode
                    </span>
                </div>
            `;

            if (!document.querySelector("#BM-scannerMode")) {
                document.body.insertAdjacentHTML('beforeend', html);
                document.querySelector("#scannerModeBtn").classList.add("mode_on");
                document.querySelector('#BM-scannerMode').style.zIndex = zIndex - 1;
                document.querySelector("#BM-scannerMode").focus();

                document.querySelector("#BM-scannerMode").addEventListener('blur', function () {
                    // Bring back the focus
                    if (document.querySelector("#BM-scannerMode")) {
                        document.querySelector("#BM-scannerMode").focus();
                    }
                });
            } else {
                document.querySelector(".scannerModeDiv").remove();
                document.querySelector("#scannerModeBtn").classList.remove("mode_on");
            }
        };
        // Append the icon span to the scanner button
        scannerModeBtn.innerHTML = '<svg fill="#828282" height="64px" width="64px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve" stroke="#828282"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M5,49c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v37C4,48.553,4.448,49,5,49z"></path> <path d="M55,49c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v37C54,48.553,54.448,49,55,49z"></path> <path d="M9,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C8,40.553,8.448,41,9,41z"></path> <path d="M12,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C11,40.553,11.448,41,12,41z"></path> <path d="M17,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C16,40.553,16.448,41,17,41z"></path> <path d="M20,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C19,40.553,19.448,41,20,41z"></path> <path d="M23,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C22,40.553,22.448,41,23,41z"></path> <path d="M29,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C28,40.553,28.448,41,29,41z"></path> <path d="M34,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C33,40.553,33.448,41,34,41z"></path> <path d="M37,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C36,40.553,36.448,41,37,41z"></path> <path d="M42,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C41,40.553,41.448,41,42,41z"></path> <path d="M45,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C44,40.553,44.448,41,45,41z"></path> <path d="M51,41c0.552,0,1-0.447,1-1V11c0-0.553-0.448-1-1-1s-1,0.447-1,1v29C50,40.553,50.448,41,51,41z"></path> <path d="M9,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C8,46.553,8.448,47,9,47z"></path> <path d="M12,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C11,46.553,11.448,47,12,47z"></path> <path d="M15,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C14,46.553,14.448,47,15,47z"></path> <path d="M17,45v1c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1S17,44.447,17,45z"></path> <path d="M20,45v1c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1S20,44.447,20,45z"></path> <path d="M23,45v1c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1S23,44.447,23,45z"></path> <path d="M27,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C26,46.553,26.448,47,27,47z"></path> <path d="M29,45v1c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1S29,44.447,29,45z"></path> <path d="M33,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C32,46.553,32.448,47,33,47z"></path> <path d="M35,46c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1V46z"></path> <path d="M38,46c0,0.553,0.448,1,1,1s1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1V46z"></path> <path d="M42,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C41,46.553,41.448,47,42,47z"></path> <path d="M45,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C44,46.553,44.448,47,45,47z"></path> <path d="M48,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C47,46.553,47.448,47,48,47z"></path> <path d="M51,47c0.552,0,1-0.447,1-1v-1c0-0.553-0.448-1-1-1s-1,0.447-1,1v1C50,46.553,50.448,47,51,47z"></path> <path d="M0,5v50h60V5H0z M58,53H2V7h56V53z"></path> </g> </g></svg>';
        // Append the scanner button to the body
        document.body.appendChild(scannerModeBtn);
    }

    /**
     * Checks whether the currently focused element within the DOM is editable or suitable for user input.
     * 
     * @returns {boolean} Returns true if the focused element is editable; otherwise, returns false.
     */
    function isEditable() {
        return (focusedElement && !focusedElement.readOnly && !focusedElement.disabled &&
            (focusedElement.tagName === 'INPUT' && isEditableInputTypes(focusedElement.type)) || focusedElement.tagName === 'SELECT' ||
            focusedElement.tagName === 'TEXTAREA' || (focusedElement.isContentEditable));
    }


    function isEditableInputTypes(type) {
        if (type == 'text' || type == 'search' || type == 'email' || type == "number" || type == "password" || type == "tel" || type == "url" || type == "time" || type == "week" || type == "month") {
            return true;
        } else {
            return false;
        }
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
        if (!event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey && event.key && scannerEnabled && (event.key.length == 1 || event.key == args.endingChar)) {
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
    </script>
</head>
<body>
    <script>
        let args = {
    endingChar: "Enter",
    callback: async function (barCodeValue, isBarCode) {
        if (isBarCode) {
            console.log("test")
        } else {
            console.log(`Invalid barCode: ${barCodeValue}`);
        }
    },
    minimumCharLength: 4
};
barcodeIntercepter(args);
    </script>
</body>
</html>
