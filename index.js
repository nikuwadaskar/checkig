const myBackend = "http://127.0.0.1:5500/index.html"

//? cart update hone ke baad edit button ka url bhi update hone chahiye 
async function initializeScript() {

    function transformPropertiesToUrl(currentHref, check) {
        // ... (transforms properties to URLs in the DOM)
        const urlString = check ? currentHref : window.location.href;
        const url = new URL(urlString);
        const params = new URLSearchParams(url.search);
        const clientDesignId = params.get('clientDesignId');
        const projectIds = params.get('projectIds');
        const projectVolumes = params.get('projectVolumes');
        const projectVariantIds = params.get('projectVariantIds');
        const shopifyCartUrl = window.location.origin
        if (clientDesignId && clientDesignId.length < 1) {
            return false
        }
        return {
            comeFromUrl: true,
            clientDesignId,
            projectIds,
            projectVolumes,
            projectVariantIds,
            shopifyCartUrl
        }
    }
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
    }

    async function addVariantsRequest(productToAdd) {
        // ... (adds Varlets to the cart and returns the result)
        return fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;'
            },
            body: JSON.stringify({ items: productToAdd })
        })
            .then(function (response) {
                return response.json();
            })

    }

    function generateThumbUrl() {
        if (myData.urlParams.comeFromUrl.clientDesignId) {
            return `${myBackend}?clientDesignId=${myData.urlParams.comeFromUrl.clientDesignId}`
        }
        return null
    }

    function addProperties() {
        if (myData?.urlParams && myData?.urlParams.comeFromUrl && myData?.urlParams.comeFromUrl == true) {

            thumbUrl = generateThumbUrl()
            // ... (adds properties to the cart and returns the result)
            return {
                id: myData.urlParams.comeFromUrl.projectVariantIds,
                quantity: myData.urlParams.comeFromUrl.projectVolumes,
                properties: {
                    clientDesignId: myData.urlParams.comeFromUrl.clientDesignId,
                    projectId: myData.urlParams.comeFromUrl.projectIds,
                    thumbUrl: thumbUrl,
                }
            }
        } else {
            return false
        }
    }

    async function manageCartAdd() {
        const productToAdd = addProperties()
        if (typeof (productToAdd) == "boolean" && productToAdd == false) {
            return;
        }
        else {
            const result = await addVariantsRequest(productToAdd)
            window.location.href = myData?.urlParams?.shopifyCartUrl;
        }
    }


    /// Manage cart section 
    (function () {
        const originalFetch = window.fetch;
        window.fetch = function (url, options) {
            // Call the original fetch function
            return originalFetch(url, options)
                .then(response => {
                    console.log('URL:', url);
                    if (url.includes("change")) {
                        manageChangeButton()
                    }
                    return response;
                })
                .catch(error => {
                    console.error('Error in fetch request. URL:', url, 'Error:', error);

                });
        };
    })();
    function manageEditButton() {
        editButton(myData.currentCart.items)
    }

    function createURL(quantity, prop) {
        const queryParamsObject = {
            clientDesignId: prop?.clientDesignId,
            projectIds: prop?.projectId,
            projectVolumes: quantity
        }
        function objectToQueryString(obj) {
            const params = new URLSearchParams();
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    params.append(key, obj[key]);
                }
            }
            return params.toString();
        }

        // Create the URL with query parameters
        const queryString = objectToQueryString(queryParamsObject);
        const finalUrl = `${myBackend}?${queryString}`;
        return finalUrl;
    }

    function editButton(items) {
        console.log(items)

        document.querySelectorAll(".cart-item").forEach((elem, index) => {
            const cartVolumeElem = elem.querySelector(".cart-item__details")
            const elemAnchor = createElemStructure(items[index])
            cartVolumeElem.appendChild(elemAnchor)
        })
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

    async function manageChangeButton() {

        myData.currentCart = await loadCart();

        document.querySelectorAll(".edit-link-url").forEach((elem, index) => {
            const currentHref = elem?.href;
            const currentUrlParams = transformPropertiesToUrl(currentHref, true)
            if (currentUrlParams) {
                if (String(myData.currentCart.items[index].quantity) != String(currentUrlParams.projectVolumes)) {
                    elem.href = createURL(myData.currentCart.items[index].quantity, myData.currentCart.items[index].properties)
                }
            }
        })

    }



    //? Cart item added check
    let myData = {}
    myData.urlParams = transformPropertiesToUrl()
    //myData?.urlParams?.comeFromUrl = false
    myData.currentCart = await loadCart();
    manageCartAdd()

    //? Manage Edit Button initialization
    manageEditButton()

}

document?.addEventListener('DOMContentLoaded', function () {
    initializeScript();
})

