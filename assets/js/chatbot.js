// Chatbot Functionality
class SoftGEMChatbot {
    constructor() {
        this.isOpen = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.responses = {
            greetings: [
                "Hello! Welcome to SoftGEM. How can I help you today?",
                "Hi there! I'm here to assist you with any questions about our services.",
                "Welcome to SoftGEM! What would you like to know about our cloud solutions?"
            ],
            services: [
                "We offer AWS cloud consulting, migration services, DevOps, and custom software development. Which service interests you?",
                "Our main services include cloud infrastructure, AWS migrations, serverless solutions, and enterprise software development.",
                "SoftGEM specializes in cloud transformation, AWS services, and digital innovation. What specific area can I help you with?"
            ],
            contact: [
                "You can reach us at info@softgem.org or call +234 806 467 0536. We're located in Lagos, Nigeria.",
                "Contact us via email at support@softgem.org or phone +234 913 410 2907. We'd love to hear from you!",
                "Get in touch: Email us at info@softgem.org or visit our contact page for more details."
            ],
            aws: [
                "We're AWS certified partners offering Redshift, Lambda, API Gateway, CloudFormation, and more. What AWS service interests you?",
                "Our AWS expertise includes migrations, cost optimization, security, and serverless architectures. How can we help with your AWS needs?",
                "We provide comprehensive AWS solutions from consultation to implementation. What's your current cloud challenge?"
            ],
            default: [
                "That's a great question! For detailed information, I'd recommend contacting our team directly.",
                "I'd be happy to connect you with our experts who can provide more specific information about that.",
                "For the best answer to your question, please reach out to our team through our contact page."
            ]
        };
        this.init();
    }

    init() {
        this.createChatbot();
        this.bindEvents();
        this.showWelcomeMessage();
    }

    createChatbot() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <button class="chatbot-toggle" id="chatbot-toggle">
                    <svg viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                </button>
                
                <div class="chatbot-window" id="chatbot-window">
                    <div class="chatbot-header" id="chatbot-header">
                        <h4>SoftGEM Assistant</h4>
                        <button class="chatbot-close" id="chatbot-close">×</button>
                    </div>
                    
                    <div class="chatbot-messages" id="chatbot-messages">
                        <div class="typing-indicator" id="typing-indicator">
                            <div class="chatbot-avatar">SG</div>
                            <div class="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chatbot-input-area">
                        <div class="quick-actions" id="quick-actions">
                            <button class="quick-action-btn" data-message="Tell me about your services">Our Services</button>
                            <button class="quick-action-btn" data-message="How can I contact you?">Contact Info</button>
                            <button class="quick-action-btn" data-message="What AWS services do you offer?">AWS Solutions</button>
                        </div>
                        <div class="chatbot-input-container">
                            <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Type your message...">
                            <button class="chatbot-send" id="chatbot-send">
                                <svg viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const send = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const header = document.getElementById('chatbot-header');
        const quickActions = document.getElementById('quick-actions');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.closeChat());
        send.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick action buttons
        quickActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                const message = e.target.getAttribute('data-message');
                this.sendUserMessage(message);
            }
        });

        // Dragging functionality
        header.addEventListener('mousedown', (e) => this.startDrag(e));
        header.addEventListener('touchstart', (e) => this.startDrag(e));
        
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('touchmove', (e) => this.drag(e));
        
        document.addEventListener('mouseup', () => this.stopDrag());
        document.addEventListener('touchend', () => this.stopDrag());
    }

    toggleChat() {
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            window.classList.add('show');
            toggle.classList.add('active');
            this.isOpen = true;
        }
    }

    closeChat() {
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        
        window.classList.remove('show');
        toggle.classList.remove('active');
        this.isOpen = false;
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (message) {
            this.sendUserMessage(message);
            input.value = '';
        }
    }

    sendUserMessage(message) {
        this.addMessage(message, 'user');
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    addMessage(message, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageHTML = `
            <div class="chatbot-message ${sender}">
                ${sender === 'bot' ? '<div class="chatbot-avatar">SG</div>' : ''}
                <div class="message-content">${message}</div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return this.getRandomResponse('greetings');
        } else if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
            return this.getRandomResponse('services');
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
            return this.getRandomResponse('contact');
        } else if (lowerMessage.includes('aws') || lowerMessage.includes('cloud') || lowerMessage.includes('amazon')) {
            return this.getRandomResponse('aws');
        } else {
            return this.getRandomResponse('default');
        }
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage("👋 Welcome to SoftGEM! I'm here to help you learn about our cloud solutions and services. How can I assist you today?", 'bot');
        }, 1000);
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        indicator.style.display = 'flex';
        
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        indicator.style.display = 'none';
    }

    startDrag(e) {
        this.isDragging = true;
        const window = document.getElementById('chatbot-window');
        window.classList.add('dragging');
        
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        const rect = window.getBoundingClientRect();
        this.dragOffset.x = clientX - rect.left;
        this.dragOffset.y = clientY - rect.top;
        
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;
        
        const window = document.getElementById('chatbot-window');
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        let newX = clientX - this.dragOffset.x;
        let newY = clientY - this.dragOffset.y;
        
        // Boundary constraints
        const maxX = window.innerWidth - window.offsetWidth;
        const maxY = window.innerHeight - window.offsetHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        window.style.left = newX + 'px';
        window.style.top = newY + 'px';
        window.style.right = 'auto';
        window.style.bottom = 'auto';
        
        e.preventDefault();
    }

    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            const window = document.getElementById('chatbot-window');
            window.classList.remove('dragging');
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new SoftGEMChatbot();
});