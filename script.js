//Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Add to cart functionality
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCartHandler);
    });
    updateCart();
    loadChat();
});
function addToCartHandler() {
    const productCard = this.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
    const productImage = productCard.querySelector('.product-image').src;
    cartItems.push({ name: productName, price: productPrice, image: productImage });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();
    addToChat(productName, productPrice, productImage);
    alert(`Added ${productName} to cart!`);
}
function updateCart() {
    const totalItems = cartItems.length;
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    console.log(`Cart: ${totalItems} items, Total: $${totalPrice.toFixed(2)}`);
    // You can update a cart icon or display here
}
function addToChat(productName, productPrice, productImage) {
    const chatWindow = document.querySelector('.chat-window');
    if (!chatWindow) {
        createChatWindow();
    }
    const chatContent = document.querySelector('.chat-content');
    const chatItem = document.createElement('div');
    chatItem.classList.add('chat-item');
    chatItem.innerHTML = `
        <img src="${productImage}" alt="${productName}" class="chat-item-image">
        <div class="chat-item-details">
            <div class="chat-item-name">${productName}</div>
            <div class="chat-item-price">$${productPrice.toFixed(2)}</div>
        </div>
        <button class="chat-item-delete" onclick="removeFromChat('${productName}')">×</button>
    `;
    chatContent.appendChild(chatItem);
}
function createChatWindow() {
    const chatWindow = document.createElement('div');
    chatWindow.classList.add('chat-window');
    chatWindow.innerHTML = `
        <div class="chat-header">
            <h3>Chat</h3>
            <button class="chat-close" onclick="closeChat()">×</button>
        </div>
        <div class="chat-content"></div>
        <button class="chat-buy" onclick="buyItems()">Buy Now</button>
    `;
    document.body.appendChild(chatWindow);
}
function loadChat() {
    const chatWindow = document.querySelector('.chat-window');
    if (!chatWindow) {
        createChatWindow();
    }
    const chatContent = document.querySelector('.chat-content');
    chatContent.innerHTML = '';
    cartItems.forEach(item => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="chat-item-image">
            <div class="chat-item-details">
                <div class="chat-item-name">${item.name}</div>
                <div class="chat-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <button class="chat-item-delete" onclick="removeFromChat('${item.name}')">×</button>
        `;
        chatContent.appendChild(chatItem);
    });
}
function removeFromChat(productName) {
    cartItems = cartItems.filter(item => item.name !== productName);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();
    loadChat();
}
function closeChat() {
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow) {
        chatWindow.remove();
    }
}
function buyItems() {
    if (cartItems.length > 0) {
        alert('Your order will arrive soon!');
        cartItems = [];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
        loadChat();
    } else {
        alert('Your cart is empty!');
    }
}
// Contact form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    // Here you would typically send this data to a server
    console.log('Form submitted:', { name, email, message });
    alert('Thank you for your message. We will get back to you soon!');
    contactForm.reset();
});
// New arrivals slider (basic implementation)
const productSlider = document.querySelector('.product-slider');
let isDown = false;
let startX;
let scrollLeft;
productSlider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - productSlider.offsetLeft;
    scrollLeft = productSlider.scrollLeft;
});
productSlider.addEventListener('mouseleave', () => {
    isDown = false;
});
productSlider.addEventListener('mouseup', () => {
    isDown = false;
});
productSlider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - productSlider.offsetLeft;
    const walk = (x - startX) * 3;
    productSlider.scrollLeft = scrollLeft - walk;
});
// Function to handle chat icon click
function openChat() {
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow) {
        chatWindow.style.display = 'block';
    } else {
        createChatWindow();
    }
}
// Search functionality
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    for (const card of productCards) {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.scrollIntoView({ behavior: 'smooth' });
            break;
        }
    }
});
// Category navigation functionality
const categoryLinks = document.querySelectorAll('.category-card');
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('href');
        history.pushState(null, '', targetPage);
        fetch(targetPage)
            .then(response => response.text())
            .then(html => {
                document.body.innerHTML = html;
                window.scrollTo(0, 0);
                // Reinitialize event listeners
                initEventListeners();
            });
    });
});
function initEventListeners() {
    // Remove existing event listeners before reattaching them
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.removeEventListener('click', addToCartHandler); // Remove previous event listener
        button.addEventListener('click', addToCartHandler); // Add new event listener
    });
    // Reinitialize other event listeners as needed
}
// Initialize event listeners on page load
initEventListeners();
// Handle back/forward navigation
window.addEventListener('popstate', () => {
    const currentPage = location.pathname.split('/').pop();
    fetch(currentPage)
        .then(response => response.text())
        .then(html => {
            document.body.innerHTML = html;
            window.scrollTo(0, 0);
            // Reinitialize event listeners
            initEventListeners();
        });
});