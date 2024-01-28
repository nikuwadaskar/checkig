const tempCart = {
    "token": "Z2NwLXVzLWVhc3QxOjAxSE4yVjBCODFKMjJRQjVQREhNQUFGMTVT",
    "note": "",
    "attributes": {},
    "original_total_price": 40000,
    "total_price": 40000,
    "total_discount": 0,
    "total_weight": 0,
    "item_count": 4,
    "items": [
        {
            "id": 47418839400754,
            "properties": {
                "id": 47418839400754, // i will get this from the my backend 
                "quantity": 1,
                "properties": {
                    "clientDesignId": "27ffa4d77cee42338a159344b91acd06",
                    "projectId": "OpzFPMHl3Q",
                    "design": "https://designer.antigro.com/en?clientDesignId=27ffa4d77cee42338a159344b91acd06"
                }
            },
            "quantity": 4,
            "variant_id": 47418839400754,
            "key": "47418839400754:e79ae7c2-3e6c-4af6-bcba-55a373b51caa",
            "title": "ADIDAS | CLASSIC BACKPACK | LEGEND INK MULTICOLOUR - OS / blue",
            "price": 10000,
            "original_price": 10000,
            "discounted_price": 10000,
            "line_price": 40000,
            "original_line_price": 40000,
            "total_discount": 0,
            "discounts": [],
            "sku": "AD-04\r\n-blue-OS",
            "grams": 0,
            "vendor": "ADIDAS",
            "taxable": true,
            "product_id": 8929761427762,
            "product_has_only_default_variant": false,
            "gift_card": false,
            "final_price": 10000,
            "final_line_price": 40000,
            "url": "/products/adidas-classic-backpack-legend-ink-multicolour?variant=47418839400754",
            "featured_image": {
                "aspect_ratio": 1.134,
                "alt": "ADIDAS | CLASSIC BACKPACK | LEGEND INK MULTICOLOUR",
                "height": 560,
                "url": "https://cdn.shopify.com/s/files/1/0701/6189/1634/products/8072c8b5718306d4be25aac21836ce16.jpg?v=1701069423",
                "width": 635
            },
            "image": "https://cdn.shopify.com/s/files/1/0701/6189/1634/products/8072c8b5718306d4be25aac21836ce16.jpg?v=1701069423",
            "handle": "adidas-classic-backpack-legend-ink-multicolour",
            "requires_shipping": true,
            "product_type": "SHOES",
            "product_title": "ADIDAS | CLASSIC BACKPACK | LEGEND INK MULTICOLOUR",
            "product_description": "The adidas BP Classic Cap features a pre-curved brim to keep your face shaded, while a hook-and-loop adjustable closure provides a comfortable fit. With a 3-Stripes design and reflective accents. The perfect piece to top off any outfit.",
            "variant_title": "OS / blue",
            "variant_options": [
                "OS",
                "blue"
            ],
            "options_with_values": [
                {
                    "name": "Size",
                    "value": "OS"
                },
                {
                    "name": "Color",
                    "value": "blue"
                }
            ],
            "line_level_discount_allocations": [],
            "line_level_total_discount": 0,
            "quantity_rule": {
                "min": 1,
                "max": null,
                "increment": 1
            },
            "has_components": false
        }
    ],
    "requires_shipping": true,
    "currency": "INR",
    "items_subtotal_price": 40000,
    "cart_level_discount_applications": []
}
const myBackend = "http://127.0.0.1:5500/index.html"

//? cart update hone ke baad edit button ka url bhi update hone chahiye 
async function initializeScript() {
    function transformPropertiesToUrl(currentHref, check) {
        const urlString = check ? currentHref : window.location.href;
        console.log(urlString)
        const url = new URL(urlString);
        const params = new URLSearchParams(url.search);
        const clientDesignId = params.get('clientDesignId');
        const projectIds = params.get('projectIds');
        const projectVolumes = params.get('projectVolumes');
        const projectVariantIds = params.get('projectVariantIds');
        const shopifyCartUrl = window.location.origin;
        console.log(shopifyCartUrl, clientDesignId, projectIds, projectVolumes, projectVariantIds)
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

    function loadCart() {
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
            body: JSON.stringify({ items: productToAdd })
        })
            .then(response => response.json());
    }

    function generateThumbUrl() {
        return myData?.urlParams?.clientDesignId
            ? `${myBackend}?clientDesignId=${myData.urlParams.clientDesignId}`
            : null;
    }

    function addProperties() {
        console.log(myData?.urlParams?.comeFromUrl, myData?.urlParams?.clientDesignId, typeof (myData?.urlParams?.clientDesignId))
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
            for (let item of myData.currentCart.items) {
                if (item.properties.projectId === properties.projectId) {
                    item.properties.projectVolumes = myData.urlParams.projectVolumes;
                    return false;
                }
            }
        }
        return true;
    }

    function updateCartItemsQuantity(cartItemsToUpdateQuantity) {
        // ... (updates quantities of cart items)
        if (Object.keys(cartItemsToUpdateQuantity).length === 0) {
            return Promise.resolve();
        }

        return fetch('/cart/update.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;'
            },
            body: JSON.stringify({ updates: cartItemsToUpdateQuantity })
        })
            .then(function (response) {
                return response.json();
            })
    }

    async function manageCartAdd() {
        const productToAdd = addProperties();
        console.log(productToAdd);
        if (productToAdd === false) {
            return;
        } else {
            let result
            const shouldUpdate = checkUpdateOrAdd(productToAdd.properties);
            if (shouldUpdate) {
                result = await updateCartItemsQuantity()
            } else {
                result = await addVariantsRequest(productToAdd);
            }
            if (result.ok) {
                window.location.href = myData?.urlParams?.shopifyCartUrl;
            } else {
                console.error(result)
            }
        }
    }


    (function () {
        const originalFetch = window.fetch;
        window.fetch = function (url, options) {
            return originalFetch(url, options)
                .then(response => {
                    console.log('URL:', url);
                    if (url.includes("change")) {
                        manageChangeButton();
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
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    params.append(key, obj[key]);
                }
            }
            return params.toString();
        };

        const queryString = objectToQueryString(queryParamsObject);
        const finalUrl = `${myBackend}?${queryString}`;
        return finalUrl;
    }

    function editButton(items) {
        console.log(items);

        document.querySelectorAll(".cart-item").forEach((elem, index) => {
            const cartVolumeElem = elem.querySelector(".cart-item__details");
            const elemAnchor = createElemStructure(items[index]);
            cartVolumeElem.appendChild(elemAnchor);
        });
    }

    async function manageChangeButton() {
        // myData.currentCart = await loadCart();
        myData.currentCart = tempCart;

        document.querySelectorAll(".edit-link-url").forEach((elem, index) => {
            const currentHref = elem?.href;
            const currentUrlParams = transformPropertiesToUrl(currentHref, true);
            if (currentUrlParams) {
                if (String(myData.currentCart.items[index].quantity) != String(currentUrlParams.projectVolumes)) {
                    elem.href = createURL(myData.currentCart.items[index].quantity, myData.currentCart.items[index].properties);
                }
            }
        });
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
    myData.currentCart = tempCart;
    manageCartAdd();
    manageEditButton();
}
document?.addEventListener('DOMContentLoaded', function () {
    initializeScript();
})

