const myBackend = "http://127.0.0.1:5500/index.html"

//? cart update hone ke baad edit button ka url bhi update hone chahiye 
async function initializeScript() {
    function transformPropertiesToUrl(currentHref, check) {
        const urlString = check ? currentHref : window.location.href;
        const url = new URL(urlString);
        const params = new URLSearchParams(url.search);
        const clientDesignId = params.get('clientDesignId');
        const projectIds = params.get('projectIds');
        const projectVolumes = params.get('projectVolumes');
        const projectVariantIds = params.get('projectVariantIds');
        const shopifyCartUrl = window.location.origin;
        if (clientDesignId && clientDesignId.length < 1) {
            return false;
        }
        return {
            comeFromUrl: true,
            clientDesignId,
            projectIds,
            projectVolumes,
            projectVariantIds,
            shopifyCartUrl
        };
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
        return myData?.urlParams?.comeFromUrl?.clientDesignId
            ? `${myBackend}?clientDesignId=${myData.urlParams.comeFromUrl.clientDesignId}`
            : null;
    }

    function addProperties() {
        console.log(myData?.urlParams?.comeFromUrl)
        if (myData?.urlParams?.comeFromUrl === true) {
            const thumbUrl = generateThumbUrl();
            return {
                id: myData.urlParams.comeFromUrl.projectVariantIds,
                quantity: myData.urlParams.comeFromUrl.projectVolumes,
                properties: {
                    clientDesignId: myData.urlParams.comeFromUrl.clientDesignId,
                    projectId: myData.urlParams.comeFromUrl.projectIds,
                    thumbUrl,
                }
            };
        } else {
            return false;
        }
    }

    async function manageCartAdd() {
        const productToAdd = addProperties();
        console.log(productToAdd);
        if (productToAdd === false) {
            return;
        } else {
            const result = await addVariantsRequest(productToAdd);
            window.location.href = myData?.urlParams?.shopifyCartUrl;
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
    }

    let myData = {};
    myData.urlParams = transformPropertiesToUrl();
    myData.currentCart = await loadCart();
    manageCartAdd();
    manageEditButton();
}
document?.addEventListener('DOMContentLoaded', function () {
    initializeScript();
})

