// Calculate Pricing & Toggle Payment Section
document.getElementById('ticketForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show summary and payment sections
    document.getElementById('pricingSummary').style.display = 'block';
    document.getElementById('paymentOptions').style.display = 'block';
    
    // Scroll to payment
    document.getElementById('paymentOptions').scrollIntoView({ behavior: 'smooth' });
});

// Dynamic Pricing Calculation
const ticketType = document.getElementById('ticket-type');
const quantity = document.getElementById('quantity');
const lightShow = document.getElementById('light-show');
const ticketRow = document.getElementById('ticketRow');
const lightShowRow = document.getElementById('lightShowRow');
const totalPrice = document.getElementById('totalPrice');

function updatePricing() {
    const prices = {
        adult: 50,
        child: 20,
        student: 30,
        foreign: 200,
        senior: 0
    };
    
    const selectedTicket = ticketType.value;
    const ticketName = ticketType.options[ticketType.selectedIndex].text.split(' (')[0];
    const qty = parseInt(quantity.value);
    const showIncluded = lightShow.checked;
    
    // Update ticket row
    ticketRow.innerHTML = `
        <td>${ticketName}</td>
        <td>${qty}</td>
        <td>₹${prices[selectedTicket] * qty}</td>
    `;
    
    // Update light show row
    if (showIncluded) {
        lightShowRow.style.display = '';
        lightShowRow.innerHTML = `
            <td>Light Show</td>
            <td>${qty}</td>
            <td>₹${100 * qty}</td>
        `;
    } else {
        lightShowRow.style.display = 'none';
    }
    
    // Calculate total
    const total = (prices[selectedTicket] * qty) + (showIncluded ? 100 * qty : 0);
    totalPrice.textContent = `₹${total}`;
}

ticketType.addEventListener('change', updatePricing);
quantity.addEventListener('change', updatePricing);
lightShow.addEventListener('change', updatePricing);

// Payment Method Toggle
const paymentMethods = document.querySelectorAll('.payment-method');
paymentMethods.forEach(method => {
    method.addEventListener('click', function() {
        paymentMethods.forEach(m => m.classList.remove('active'));
        this.classList.add('active');
        
        // Hide all forms
        document.getElementById('creditCardForm').style.display = 'none';
        document.getElementById('upiForm').style.display = 'none';
        document.getElementById('netBankingForm').style.display = 'none';
        
        // Show selected form
        const methodType = this.getAttribute('data-method');
        document.getElementById(`${methodType}Form`).style.display = 'block';
    });
});