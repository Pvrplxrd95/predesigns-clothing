// Bank Transfer Payment System for Predesigns Clothing
// Add this to the end of your shop.js file

// Proceed to Payment Function
function proceedToPayment() {
    const cart = CartStorage.getCart();
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNumber = generateOrderNumber();
    
    const paymentModal = document.createElement('div');
    paymentModal.className = 'payment-modal';
    paymentModal.innerHTML = `
        <div class="payment-content">
            <span class="payment-close" onclick="closePaymentModal()">&times;</span>
            <h2>Complete Your Order</h2>
            
            <div class="order-summary">
                <h3>Order Summary</h3>
                ${cart.map(item => `
                    <div class="order-item">
                        <div class="item-details">
                            <span class="item-name">${item.name}</span>
                            <span class="item-quantity">x ${item.quantity}</span>
                        </div>
                        <span class="item-price">R${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                `).join('')}
                <div class="order-total">
                    <div class="total-label">Subtotal:</div>
                    <div class="total-amount">R${totalAmount.toLocaleString()}</div>
                </div>
                <div class="order-number">
                    <strong>Order Number: ${orderNumber}</strong>
                </div>
            </div>
            
            <div class="payment-methods">
                <h3>Select Payment Method</h3>
                <div class="payment-option">
                    <input type="radio" id="bank-transfer" name="payment-method" value="bank-transfer" checked>
                    <label for="bank-transfer">
                        <h4>Bank Transfer</h4>
                        <p>Pay directly into our Tyme Bank account. Use your order number as reference.</p>
                    </label>
                </div>
                
                <div class="bank-details" id="bank-details">
                    <h4>Bank Transfer Details:</h4>
                    <div class="bank-info">
                        <p><strong>Bank:</strong> Tyme Bank</p>
                        <p><strong>Account Name:</strong> Josias Tlou</p>
                        <p><strong>Account Number:</strong> 51076627253</p>
                        <p><strong>Branch Code:</strong> 678910</p>
                        <p><strong>Reference:</strong> ${orderNumber}</p>
                    </div>
                    <div class="payment-instructions">
                        <p><em>✅ After payment, send proof to purpleray23@gmail.com</em></p>
                        <p><em>✅ We'll confirm and start working on your order</em></p>
                    </div>
                </div>
            </div>
            
            <div class="customer-info">
                <h3>Delivery Information</h3>
                <form id="payment-form">
                    <div class="form-row">
                        <input type="text" name="full_name" placeholder="Full Name *" required>
                        <input type="tel" name="phone" placeholder="Phone Number (WhatsApp) *" required>
                    </div>
                    <input type="email" name="email" placeholder="Email Address *" required>
                    <textarea name="address" placeholder="Delivery Address *" rows="3" required></textarea>
                    
                    <div class="form-row">
                        <select name="delivery_option" required>
                            <option value="">Delivery Option *</option>
                            <option value="local">Local Delivery (Hammanskraal & surrounding - R60)</option>
                            <option value="regional">Regional Delivery (Outside Hammanskraal - R120)</option>
                            <option value="pickup">Studio Pickup (Free)</option>
                        </select>
                        <input type="date" name="preferred_date" placeholder="Preferred Delivery Date">
                    </div>
                    
                    <textarea name="special_instructions" placeholder="Special Instructions (optional)" rows="2"></textarea>
                </form>
            </div>
            
            <div class="payment-actions">
                <button onclick="submitBankTransferOrder('${orderNumber}', ${totalAmount})" class="btn btn-primary">
                    <i class="fas fa-shopping-bag"></i> Place Order & Get Payment Details
                </button>
                <button onclick="closePaymentModal()" class="btn btn-secondary">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(paymentModal);
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside
    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            closePaymentModal();
        }
    });
}

// Generate Order Number
function generateOrderNumber() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100; // 3-digit random number
    return `PDC-${year}-${randomNum}`;
}

// Submit Bank Transfer Order
function submitBankTransferOrder(orderNumber, totalAmount) {
    const form = document.getElementById('payment-form');
    const formData = new FormData(form);
    
    // Validate form
    if (!formData.get('full_name') || !formData.get('phone') || !formData.get('email') || !formData.get('address')) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const cart = CartStorage.getCart();
    
    // Create order data
    const orderData = {
        order_number: orderNumber,
        customer_name: formData.get('full_name'),
        customer_phone: formData.get('phone'),
        customer_email: formData.get('email'),
        delivery_address: formData.get('address'),
        delivery_option: formData.get('delivery_option'),
        preferred_date: formData.get('preferred_date'),
        special_instructions: formData.get('special_instructions'),
        items: cart,
        total_amount: totalAmount,
        payment_method: 'bank_transfer',
        status: 'pending_payment',
        timestamp: new Date().toISOString()
    };
    
    // Send order notification via Formspree
    fetch('https://formspree.io/f/myzbener', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            subject: `New Order: ${orderNumber}`,
            order_data: JSON.stringify(orderData, null, 2),
            customer_name: orderData.customer_name,
            order_total: `R${totalAmount.toLocaleString()}`,
            payment_method: 'Bank Transfer',
            order_number: orderNumber
        })
    })
    .then(response => {
        if (response.ok) {
            showBankTransferDetails(orderData);
            
            // Clear cart
            CartStorage.clearCart();
            updateCartCount();
            
            closePaymentModal();
        } else {
            throw new Error('Failed to submit order');
        }
    })
    .catch(error => {
        console.error('Order submission error:', error);
        showNotification('Failed to submit order. Please try again or contact us directly.', 'error');
    });
}

// Show Bank Transfer Details
function showBankTransferDetails(orderData) {
    const modal = document.createElement('div');
    modal.className = 'bank-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-header">
                <div class="success-icon">✅</div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your order, ${orderData.customer_name.split(' ')[0]}!</p>
            </div>
            
            <div class="order-info">
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Order Number:</span>
                        <span class="value">${orderData.order_number}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Total Amount:</span>
                        <span class="value">R${orderData.total_amount.toLocaleString()}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Payment Method:</span>
                        <span class="value">Bank Transfer</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Delivery:</span>
                        <span class="value">${getDeliveryText(orderData.delivery_option)}</span>
                    </div>
                </div>
            </div>
            
            <div class="bank-info-section">
                <h3>🏦 Bank Transfer Details</h3>
                <div class="bank-details-grid">
                    <div class="bank-detail">
                        <span class="detail-label">Bank:</span>
                        <span class="detail-value">Tyme Bank</span>
                    </div>
                    <div class="bank-detail">
                        <span class="detail-label">Account Name:</span>
                        <span class="detail-value">Josias Tlou</span>
                    </div>
                    <div class="bank-detail">
                        <span class="detail-label">Account Number:</span>
                        <span class="detail-value">51076627253</span>
                    </div>
                    <div class="bank-detail">
                        <span class="detail-label">Branch Code:</span>
                        <span class="detail-value">678910</span>
                    </div>
                    <div class="bank-detail">
                        <span class="detail-label">Reference:</span>
                        <span class="detail-value reference-number">${orderData.order_number}</span>
                    </div>
                </div>
            </div>
            
            <div class="payment-instructions">
                <h3>📋 Next Steps:</h3>
                <ol>
                    <li><strong>Make Payment:</strong> Transfer R${orderData.total_amount.toLocaleString()} to the bank details above</li>
                    <li><strong>Use Reference:</strong> Make sure to use "${orderData.order_number}" as the payment reference</li>
                    <li><strong>Send Proof:</strong> Email proof of payment to <a href="mailto:purpleray23@gmail.com">purpleray23@gmail.com</a></li>
                    <li><strong>Confirmation:</strong> We'll confirm receipt and start working on your order</li>
                </ol>
            </div>
            
            <div class="contact-info">
                <h3>📞 Need Help?</h3>
                <p>WhatsApp: <a href="https://wa.me/27694313721">069 431 3721</a></p>
                <p>Email: <a href="mailto:purpleray23@gmail.com">purpleray23@gmail.com</a></p>
                <p>We respond within 24 hours</p>
            </div>
            
            <div class="modal-actions">
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">
                    I Understand
                </button>
                <button onclick="copyBankDetails('${orderData.order_number}')" class="btn btn-secondary">
                    <i class="fas fa-copy"></i> Copy Details
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add CSS for the modal
    addPaymentModalStyles();
}

// Get Delivery Text
function getDeliveryText(option) {
    switch(option) {
        case 'local': return 'Local Delivery (R60)';
        case 'regional': return 'Regional Delivery (R120)';
        case 'pickup': return 'Studio Pickup (Free)';
        default: return 'To be determined';
    }
}

// Copy Bank Details
function copyBankDetails(orderNumber) {
    const bankDetails = `Tyme Bank
Account Name: Josias Tlou
Account Number: 51076627253
Branch Code: 678910
Reference: ${orderNumber}`;
    
    navigator.clipboard.writeText(bankDetails).then(() => {
        showNotification('Bank details copied to clipboard!', 'success');
    });
}

// Close Payment Modal
function closePaymentModal() {
    const modal = document.querySelector('.payment-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Add CSS Styles for Payment System
function addPaymentModalStyles() {
    const existingStyles = document.getElementById('payment-styles');
    if (existingStyles) return;
    
    const style = document.createElement('style');
    style.id = 'payment-styles';
    style.textContent = `
        .payment-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 20px;
        }
        
        .payment-content {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        
        .payment-close {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            background: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .payment-content > h2 {
            text-align: center;
            margin: 20px 40px 30px;
            color: #333;
        }
        
        .order-summary {
            background: #f8f9fa;
            padding: 20px;
            margin: 0 20px 20px;
            border-radius: 8px;
        }
        
        .order-summary h3 {
            margin: 0 0 15px 0;
            color: #333;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .item-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex: 1;
        }
        
        .item-name {
            font-weight: 500;
            color: #333;
        }
        
        .item-quantity {
            color: #666;
            margin-left: 10px;
        }
        
        .order-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            margin: 15px 0 0;
            border-top: 2px solid #ddd;
            font-weight: 600;
        }
        
        .order-number {
            text-align: center;
            margin-top: 15px;
            padding: 10px;
            background: #e8f4fd;
            border-radius: 4px;
            color: #0066cc;
        }
        
        .payment-methods {
            padding: 20px;
            margin: 0 20px 20px;
        }
        
        .payment-option {
            margin-bottom: 15px;
        }
        
        .payment-option input[type="radio"] {
            margin-right: 10px;
        }
        
        .payment-option label {
            cursor: pointer;
        }
        
        .payment-option h4 {
            margin: 0 0 5px 0;
            color: #333;
        }
        
        .payment-option p {
            margin: 0;
            color: #666;
            font-size: 14px;
        }
        
        .bank-details {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
        }
        
        .bank-info {
            margin-bottom: 10px;
        }
        
        .bank-info p {
            margin: 5px 0;
            font-size: 14px;
        }
        
        .payment-instructions {
            font-size: 12px;
            color: #0066cc;
            font-style: italic;
        }
        
        .customer-info {
            padding: 20px;
            margin: 0 20px 20px;
        }
        
        .customer-info h3 {
            margin: 0 0 15px 0;
            color: #333;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .form-group textarea {
            resize: vertical;
        }
        
        .payment-actions {
            padding: 20px;
            display: flex;
            gap: 15px;
            justify-content: center;
            border-top: 1px solid #eee;
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: #6A0DAD;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5a0ca3;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #5a6268;
        }
        
        .bank-details-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        }
        
        .bank-details-modal .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 100%;
            padding: 30px;
            text-align: center;
        }
        
        .success-header {
            margin-bottom: 25px;
        }
        
        .success-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        
        .success-header h2 {
            color: #28a745;
            margin: 0 0 10px 0;
        }
        
        .success-header p {
            color: #666;
            margin: 0;
        }
        
        .order-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        
        .label {
            font-weight: 500;
            color: #666;
        }
        
        .value {
            color: #333;
            font-weight: 600;
        }
        
        .reference-number {
            background: #e8f4fd;
            padding: 5px 10px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
        }
        
        .bank-info-section {
            margin-bottom: 25px;
        }
        
        .bank-info-section h3 {
            text-align: center;
            margin-bottom: 15px;
            color: #333;
        }
        
        .bank-details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .bank-detail {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .detail-label {
            font-weight: 500;
            color: #666;
        }
        
        .detail-value {
            color: #333;
            font-weight: 600;
        }
        
        .payment-instructions {
            background: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #ffc107;
        }
        
        .payment-instructions h3 {
            margin: 0 0 15px 0;
            color: #856404;
        }
        
        .payment-instructions ol {
            margin: 0;
            color: #856404;
            font-size: 14px;
        }
        
        .payment-instructions li {
            margin-bottom: 8px;
        }
        
        .contact-info {
            background: #e8f4fd;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #0066cc;
        }
        
        .contact-info h3 {
            margin: 0 0 15px 0;
            color: #0066cc;
        }
        
        .contact-info p {
            margin: 5px 0;
            color: #666;
        }
        
        .contact-info a {
            color: #0066cc;
            text-decoration: none;
        }
        
        .contact-info a:hover {
            text-decoration: underline;
        }
        
        .modal-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .bank-details-grid {
                grid-template-columns: 1fr;
            }
            
            .payment-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize payment system
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bank transfer payment system initialized!');
});
