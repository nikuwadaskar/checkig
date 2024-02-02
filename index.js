const myBackend = "http://localhost:3000/EzprintsDTFtransferscreen"

function extractTextFromUrl(url) {
    // Check if the URL contains the "variant" parameter
    const variantMatch = url.match(/variant=([^&]+)/);
    if (variantMatch) {
        return { text: variantMatch[1], type: 'variant' }; // Return the text after "variant="
    }
    // If "variant" parameter is not present, check for "product/"
    const productMatch = url.match(/\/products\/([^\/]+)/);
    if (productMatch) {
        return { text: productMatch[1], type: 'product' }; // Return the text after "product/"
    }
    // Return null if no match is found
    return null;
}

// document.addEventListener('DOMContentLoaded',);



//? cart update hone ke baad edit button ka url bhi update hone chahiye 
async function initializeScript() {


    function runProductPage() {
        let product_page = window.location.href;
        if (product_page.includes("products/")) {
            const domain = window.location.origin;
            let customer_id = "";
            let source = domain.split('/')[2].split('.')[0];
            let allScript = document.getElementsByTagName("script");

            // if (allScript.length > 0) {
            // for (let i = 0; i < allScript.length; i++) {
            //     if (
            //     allScript[i].outerHTML.includes(`http://local/onsitescript.js?customer_id=`)
            //     ) {
            //     let checkId = allScript[i].outerHTML.split("customer_id=");
            //     if (checkId.length == 2) {
            //         customer_id = checkId[1].slice(0, 20);
            //         break;
            //     }
            //     }
            // }
            // }

            // Find the form element with the specified class
            var formElement = document.querySelector('.product-form__buttons');
            const val = document.querySelector(".product-variant-id")?.value
            // Check if the form element exists

            if (formElement) {
                // Remove the existing button   
                    formElement.innerHTML = ""
                // Create a new button element
                var newButton = document.createElement('p');
                newButton.id = 'custom_designButton';
                newButton.style.backgroundColor = '#fad71e';
                newButton.style.color = 'black';
                newButton.style.padding = '10px 30px';
                newButton.style.fontSize = '18px';
                newButton.style.fontWeight = '700';
                newButton.style.marginTop = "40px";
                newButton.style.cursor = 'pointer';
                newButton.style.width = '200px';
                newButton.style.textAlign = 'center';
                newButton.textContent = 'Create design';

                // Append the new button to the end of the form
                formElement.appendChild(newButton);

                // Add a click event listener to the new button
                newButton.addEventListener('click', function () {
                    // Get the current URL
                    var currentUrl = window.location.href;
                    let extractText = extractTextFromUrl(currentUrl);
                    
                    if (extractText !== null) {
                        if (extractText.type == "variant") {
                            var redirectUrl = `${myBackend}?variant_id=${val}&shopURL=${window.location.origin}`
                            console.log(redirectUrl)
                            // window.location.href = redirectUrl;
                        }
                        if (extractText.type == "product") {
                            var redirectUrl = `${myBackend}?variant_id=${val}&shopURL=${window.location.origin}`
                            console.log(redirectUrl)
                            // window.location.href = redirectUrl;
                        }
                        //test
                    }
                });
            }
        }
    }
    function transformPropertiesToUrl(currentHref, check) {
        const urlString = check ? currentHref : window.location.href;
        const url = new URL(urlString);
        const params = new URLSearchParams(url.search);
        const clientDesignId = params.get('clientDesignId');
        const projectIds = params.get('projectIds');
        const projectVolumes = params.get('projectVolumes');
        const projectVariantIds = params.get('projectVariantIds');
        const shopifyCartUrl = window.location.origin;
        if (typeof (clientDesignId) == "undefined") {
            return false;
        } else {
            return {
                comeFromUrl: true,
                clientDesignId,
                projectIds,
                projectVolumes,
                projectVariantIds,
                shopifyCartUrl
            };
        }
    }

    async function loadCart() {
        return fetch('/cart.js', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;'
            },
        })
            .then(response => response.json())
            .catch(err => { throw err; });
    }

    async function addVariantsRequest(productToAdd) {
        return fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;'
            },
            body: JSON.stringify({ items: [productToAdd] })
        })
            .then(response => true).catch((err) => false);;
    }

    function generateThumbUrl() {
        return myData?.urlParams?.clientDesignId
            ? `${myBackend}?clientDesignId=${myData.urlParams.clientDesignId}`
            : null;
    }

    function addProperties() {
        if (myData?.urlParams?.comeFromUrl === true && myData?.urlParams?.clientDesignId != undefined) {
            const thumbUrl = generateThumbUrl();
            return {
                id: myData.urlParams.projectVariantIds,
                quantity: myData.urlParams.projectVolumes,
                properties: {
                    clientDesignId: myData.urlParams.clientDesignId,
                    projectId: myData.urlParams.projectIds,
                    thumbUrl,
                }
            };
        } else {
            return false;
        }
    }

    function checkUpdateOrAdd(properties) {
        if (myData.currentCart.items.length > 0) {
            for (let item of myData?.currentCart.items) {
                if (item.properties.projectId === properties.projectId) {
                    if (String(item.properties.projectVolumes) == String(myData.urlParams.projectVolumes)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    async function updateCartItemsQuantity(cartItemsToUpdateQuantity) {
        // ... (updates quantities of cart items)
        if (Object.keys(cartItemsToUpdateQuantity).length === 0) {
            return Promise.resolve();
        }

        const data = {
            "id": cartItemsToUpdateQuantity?.id,
            "quantity": cartItemsToUpdateQuantity?.quantity,
        }

        return fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;'
            },
            body: JSON.stringify(data)
        })
            .then(function (response) {
                return true;
            }).catch((err) => false);
    }

    async function manageCartAdd() {
        const productToAdd = addProperties();
        if (productToAdd === false) {
            return;
        } else {
            let result
            const shouldUpdate = checkUpdateOrAdd(productToAdd.properties);
            if (shouldUpdate) {
                result = await updateCartItemsQuantity(productToAdd)
            } else {
                result = await addVariantsRequest(productToAdd);
            }
            if (result) {
                window.location.href = window.location.origin + "/cart";
            } else {
                alert("Something went wrong please reload the page")
            }
        }
    }


    (function () {
        const originalFetch = window.fetch;
        window.fetch = function (url, options) {
            return originalFetch(url, options)
                .then(response => {
                    if (url.includes("change")) {
                        manageChangeButton();
                        manageEditButton();
                    }
                    return response;
                })
                .catch(error => {
                    console.error('Error in fetch request. URL:', url, 'Error:', error);
                });
        };
    })();

    function manageEditButton() {
        editButton(myData.currentCart.items);
    }

    function createURL(quantity, prop) {
        const queryParamsObject = {
            clientDesignId: prop?.clientDesignId,
            projectIds: prop?.projectId,
            projectVolumes: quantity
        };

        const objectToQueryString = obj => {
            const params = new URLSearchParams();
            if (obj.hasOwnProperty(key)) {
                params.append("session", obj["clientDesignId"]);
                params.append("crpto", obj["projectIds"]);
                params.append("card", obj["projectVolumes"]);
            }
            return params.toString();
        };

        const queryString = objectToQueryString(queryParamsObject);
        const finalUrl = `${myBackend}?${queryString}`;
        return finalUrl;
    }

    function editButton(items) {

        document.querySelectorAll(".cart-item").forEach((elem, index) => {
            const cartVolumeElem = elem.querySelector(".cart-item__details");
            const elemAnchor = createElemStructure(items[index]);
            cartVolumeElem.appendChild(elemAnchor);
        });
    }

    async function manageChangeButton() {
        myData.currentCart = await loadCart();

        document.querySelectorAll(".edit-link-url").forEach((elem, index) => {
            const currentHref = elem?.href;
            const currentUrlParams = transformPropertiesToUrl(currentHref, true);
            if (currentUrlParams) {
                if (String(myData.currentCart.items[index].quantity) != String(currentUrlParams.projectVolumes)) {
                    elem.href = createURL(myData.currentCart.items[index].quantity, myData.currentCart.items[index].properties);
                }
            }
        });
        return true
    }
    function createElemStructure(item) {
        function createCartItem() {
            const container = document.createElement('div');
            container.classList.add('cart__item--properties');

            const designLabel = document.createElement('span');
            designLabel.textContent = 'design:';
            designLabel.setAttribute('data-is-antigro-designer-link', 'y');
            const url = createURL(item.quantity, item.properties)
            const editLink = document.createElement('a');
            editLink.href = url;
            editLink.classList.add('button', 'button--primary', 'edit-link-url');
            editLink.textContent = 'Edit';

            container.appendChild(designLabel);
            container.appendChild(editLink);

            return container;
        }


        const cartItem = createCartItem();
        return cartItem

    }

    let myData = {};
    myData.urlParams = transformPropertiesToUrl();
    myData.currentCart = await loadCart();
    runProductPage()
    manageCartAdd();
    manageEditButton();
}
document?.addEventListener('DOMContentLoaded', function () {
    function manageUI() {

        const avl = document.querySelectorAll("dt")
        avl.forEach((e) => {
            if (e.innerHTML == "thumbUrl:") {
                e.parentNode.remove()
            }
            if (e.innerHTML == "projectId:") {
                e.parentNode.remove()
            }
            if (e.innerHTML == "clientDesignId:") {
                e.parentNode.remove()
            }
        })
    }
    manageUI()
    initializeScript();
})

const myWindow = window;
myWindow.initializeAppConstant = {}
