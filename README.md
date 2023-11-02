# Barcode-Intercepter
A program that can intercept the barcode

## Example Usage
```
let args = {

    endingChar: "Enter",
    
    callback: async function (barCodeValue, isBarCode) {
        if (isBarCode) {
            console.log(`Valid barCode: ${barCodeValue}`);
        } else {
            console.log(`Invalid barCode: ${barCodeValue}`);
        }
    },
    minimumCharLength: 4
};

barCode(args);
```
