"use strict";

// ==============================
// FANZ STORE SCRIPT
// ==============================

let cart = [];


// ==============================
// DOM ELEMENT
// ==============================

const loadingScreen = document.getElementById("loadingScreen");
const gameCards = document.querySelectorAll(".game-card");

const selectedItems = document.getElementById("selectedItems");
const selectedQuantity = document.getElementById("selectedQuantity");
const totalPrice = document.getElementById("totalPrice");

const toastContainer = document.getElementById("toastContainer");

const orderForm = document.getElementById("orderForm");
const usernameInput = document.getElementById("username");

const clearCartButton = document.getElementById("clearCartButton");


// ==============================
// INIT
// ==============================

function init() {

    loadCart();
    setupLoading();
    setupCards();
    setupForm();
    setupClearCart();
    updateCart();

}


// ==============================
// LOADING SCREEN
// ==============================

function setupLoading() {

    window.addEventListener("load", () => {

        if (!loadingScreen) return;

        setTimeout(() => {

            loadingScreen.style.opacity = "0";
            loadingScreen.style.visibility = "hidden";

        }, 800);

    });

}


// ==============================
// ITEM CARD
// ==============================

function setupCards() {

    if (!gameCards.length) return;


    gameCards.forEach(card => {

        card.addEventListener("click", () => {


            gameCards.forEach(item => {

                item.classList.remove("active");

            });


            card.classList.add("active");


            const item = {

                name: card.dataset.name,

                price: Number(card.dataset.price),

                quantity: Number(card.dataset.min) || 1,

                unit: card.dataset.unit || ""

            };


            addItem(item);


            showToast(
                `${item.name} ditambahkan`
            );


        });

    });

}


// ==============================
// CART SYSTEM
// ==============================

function addItem(item) {


    const existing =
        cart.find(
            product =>
                product.name === item.name
        );


    if (existing) {

        existing.quantity += item.quantity;

    } else {

        cart.push(item);

    }


    saveCart();

    updateCart();

}



function removeItem(name) {


    cart =
        cart.filter(
            item =>
                item.name !== name
        );


    saveCart();

    updateCart();

}



function clearCart() {

    cart = [];

    saveCart();

    updateCart();

    showToast(
        "Semua pesanan dibatalkan"
    );

}


// ==============================
// UPDATE CART
// ==============================

function updateCart() {


    if (
        !selectedItems ||
        !selectedQuantity ||
        !totalPrice
    ) return;


    selectedItems.innerHTML = "";

    selectedQuantity.innerHTML = "";


    cart.forEach(item => {


        const itemBox =
            document.createElement("div");


        itemBox.innerHTML = `

        <p>
        ${item.name}
        -
        ${formatPrice(item.price * item.quantity)}
        </p>

        <button 
        class="remove-item"
        data-name="${item.name}">
        Hapus
        </button>

        `;


        selectedItems.appendChild(itemBox);



        const qty =
            document.createElement("p");


        qty.textContent =
            item.unit === "B"
            ? `${item.name} ${item.quantity}B`
            : `${item.name} x ${item.quantity}`;


        selectedQuantity.appendChild(qty);


    });


    totalPrice.textContent =
        formatPrice(
            calculateTotal()
        );


    setupRemoveButtons();

}


// ==============================
// REMOVE BUTTON
// ==============================

function setupRemoveButtons() {


    const buttons =
        document.querySelectorAll(
            ".remove-item"
        );


    buttons.forEach(button => {


        button.onclick = () => {


            const name =
                button.dataset.name;


            removeItem(name);


            showToast(
                `${name} dihapus`
            );


        };


    });

}


// ==============================
// CLEAR CART
// ==============================

function setupClearCart() {


    if (!clearCartButton) return;


    clearCartButton.addEventListener(
        "click",
        clearCart
    );

}


// ==============================
// TOTAL
// ==============================

function calculateTotal() {


    return cart.reduce(
        (total, item) => {

            return total +
            (
                item.price *
                item.quantity
            );

        },
        0
    );

}


// ==============================
// FORMAT PRICE
// ==============================

function formatPrice(price) {


    return "RP " +
    Number(price)
    .toLocaleString("id-ID");

}


// ==============================
// STORAGE
// ==============================

function saveCart() {

    localStorage.setItem(
        "fanzCart",
        JSON.stringify(cart)
    );

}



function loadCart() {

    const data =
    localStorage.getItem("fanzCart");


    if (!data) return;


    try {

        cart = JSON.parse(data);

    } catch {

        cart = [];

    }

}


// ==============================
// TOAST
// ==============================

function showToast(message) {


    if (!toastContainer) return;


    const toast =
    document.createElement("div");


    toast.className = "toast";

    toast.textContent = message;


    toastContainer.appendChild(toast);


    setTimeout(() => {

        toast.style.opacity = "0";

        setTimeout(() => {

            toast.remove();

        },300);


    },2500);

}


// ==============================
// FORM + WHATSAPP
// ==============================

function setupForm() {


    if (!orderForm) return;


    orderForm.addEventListener(
    "submit",
    event => {


        event.preventDefault();


        const username =
        usernameInput
        ? usernameInput.value.trim()
        : "";


        if (!username) {

            showToast(
                "Username Roblox wajib diisi"
            );

            return;

        }


        if (!cart.length) {

            showToast(
                "Belum memilih item"
            );

            return;

        }


        const itemsText =
        cart.map(item => {


            return item.unit === "B"

            ? `${item.name} ${item.quantity}B
Harga: ${formatPrice(item.price * item.quantity)}`

            : `${item.name} x${item.quantity}
Harga: ${formatPrice(item.price * item.quantity)}`;


        }).join("\n\n");

            const message = `
 *ORDER FANZ STORE*

━━━━━━━━━━━━━━
 *Username Roblox*
${username}

━━━━━━━━━━━━━━
 *Detail Pesanan*

${itemsText}

━━━━━━━━━━━━━━
 *Total Pembayaran*
${formatPrice(calculateTotal())}

━━━━━━━━━━━━━━
 Catatan:
Pastikan username Roblox sudah benar.
Kesalahan username bukan tanggung jawab seller.

Terima kasih telah order di
*Fanz Store*
`;





        const whatsappURL =
        `https://wa.me/6289673387333?text=${encodeURIComponent(message)}`;


        showToast(
            "Mengalihkan ke WhatsApp..."
        );


        window.location.href = whatsappURL;


    });

}


// ==============================
// START
// ==============================

init();