# Barcode Interceptor

The Barcode Interceptor is a JavaScript utility that allows for the detection of valid barcodes in real-time as users input data. This tool is particularly useful for scenarios where barcode scanning needs to be seamlessly integrated into web applications. The utility is designed to be easily added to existing projects, providing a non-intrusive way to enhance user input capabilities.

## Features

- **Dynamic Scanner Activation:** The Barcode Interceptor intelligently activates the scanner based on the currently focused element in the Document Object Model (DOM). It detects editable elements such as input fields, text areas, and selects, enabling the scanner when relevant.

- **Toggleable Scanner:** Users have the flexibility to toggle the scanner on or off using a convenient button. This feature is especially handy when barcode scanning is only required in specific instances.

- **Real-time Feedback:** The utility provides real-time feedback through a callback function. When a valid barcode is detected, the specified callback function is executed, allowing for seamless integration with other application features.

- **Fast Typing Detection:** The utility includes a mechanism to detect fast typing, ensuring accurate barcode interpretation even during rapid input.

## Getting Started

### Prerequisites

Ensure that your project includes the Barcode Interceptor JavaScript file. You can easily add it to your HTML file using a script tag.

```html
<script src="barcodeInterceptor.js"></script>
```

### Usage

1. **Initialization:** The utility is initialized by calling the `barcodeInterceptor` function and passing an object with required parameters.

```javascript
barcodeIntercepter({

    endingChar: "Enter",
    
    callback: async function (barCodeValue, isBarCode) {
        if (isBarCode) {
            console.log(`Valid barCode: ${barCodeValue}`);
        } else {
            console.log(`Invalid barCode: ${barCodeValue}`);
        }
    },
    minimumCharLength: 4
});
```

2. **Toggle Scanner:** Users can toggle the scanner on or off by clicking the provided button.

3. **Real-time Feedback:** The specified callback function is invoked when a valid barcode is detected, providing the barcode input and a boolean indicating whether fast typing was detected.

## Customization

- **Ending Character:** Adjust the `endingChar` parameter to match the character signaling the end of barcodes in your application.

- **Minimum Character Length:** Modify the `minimumCharLength` parameter to set the minimum expected length of valid barcodes.

- **Scanner Toggle Button Styling:** Customize the appearance of the toggle button by modifying the CSS styles within the `appendToogleBtn` function.

## Compatibility

The Barcode Interceptor is designed to work with modern web browsers and supports iframes for extended functionality within embedded content.

## License

This utility is open-source and available under the [MIT License](LICENSE).

## Acknowledgments

The Barcode Interceptor is inspired by the need for efficient and unobtrusive barcode scanning in web applications. Contributions and feedback are welcome!
