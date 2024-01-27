// function extractTextFromUrl(url) {
//     // Check if the URL contains the "variant" parameter
//     const variantMatch = url.match(/variant=([^&]+)/);
//     if (variantMatch) {
//         return { text: variantMatch[1], type: 'variant' }; // Return the text after "variant="
//     }

//     // If "variant" parameter is not present, check for "product/"
//     const productMatch = url.match(/\/products\/([^\/]+)/);
//     if (productMatch) {
//         return { text: productMatch[1], type: 'product' }; // Return the text after "product/"
//     }

//     // Return null if no match is found
//     return null;
// }



// document.addEventListener('DOMContentLoaded', function () {


//     let product_page = window.location.href;
//     if (product_page.includes("products/")) {
//         // Find the form element with the specified class
//         var formElement = document.querySelector('.product-form__buttons');

//         // Check if the form element exists
//         if (formElement) {

//             // Create a new button element
//             var newButton = document.createElement('button');
//             newButton.id = 'custom_designButton';
//             newButton.style.backgroundColor = '#fad71e';
//             newButton.style.color = 'black';
//             newButton.style.padding = '10px 30px';
//             newButton.style.fontSize = '18px';
//             newButton.style.fontWeight = '700';
//             newButton.style.marginTop = "40px";
//             newButton.textContent = 'Create design';

//             // Append the new button to the end of the form
//             formElement.appendChild(newButton);

//             // Add a click event listener to the new button
//             newButton.addEventListener('click', function () {
//                 console.log("action on new button", newButton)

//                 // Get the current URL
//                 var currentUrl = window.location.href;
//                 let extractText = extractTextFromUrl(currentUrl);

//                 if (extractText !== null) {

//                     if (extractText.type == "variant") {
//                         var redirectUrl = 'http://localhost:3000?variant=' + extractText.text;
//                         window.location.href = redirectUrl;
//                     }
//                     if (extractText.type == "product") {
//                         var redirectUrl = 'http://localhost:3000?product=' + extractText.text;
//                         window.location.href = redirectUrl;

//                     }
//                     //test
//                 }
//             });
//         }

//     }


// });


async function initializeScript() {
    function loadCart() {
        // ... (fetches and returns cart data)
        return fetch('/cart.js', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;'
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (cart) {
                return cart;
            })
            .catch(function (err) {
                throw err;
            })
    } loadCart
    const currentCart = await loadCart();
    console.log(currentCart)
}


document?.addEventListener('DOMContentLoaded', function () {
    initializeScript();
})