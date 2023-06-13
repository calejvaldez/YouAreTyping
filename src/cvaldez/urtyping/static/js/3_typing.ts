// DOM Variables
let container_texts = document.getElementById('texts') as HTMLDivElement;
let button = document.getElementById('mainButton') as HTMLButtonElement;
let input = document.getElementById('text-input') as HTMLInputElement;
let current_delivered: HTMLParagraphElement | null = null;

// Variables
let mode = 'sender';
let data: Array<Message> | null = null;
let user: User | null = null;

// Interfaces
interface Message {
    id: string
    user_id: string
    content: string
    timestamp: string
    from: string
    to: string
}

interface User {
    id: string
    username: string
}

interface Identity {
    id: string
    username: string
    joined: string
    type: string
    has_totp: boolean
}

// Helper functions
function determineMessageType(message_from: string): 'friend' | 'sender' {
    if (mode === 'sender') {
        return (message_from === 'friend') ? 'friend': 'sender';
    } else {
        return (message_from === 'friend') ? 'sender': 'friend';
    };
}

function loadMessages() {
    let m_xhttp = new XMLHttpRequest();
    m_xhttp.open('GET', '/api/typing/get-messages/')
    m_xhttp.setRequestHeader('Bearer', localStorage.getItem('cvd_token') as string);
    m_xhttp.onreadystatechange = handleMessageRequest;
    m_xhttp.send();
}

function sendMessage(): void {
    let s_xhttp = new XMLHttpRequest();
    s_xhttp.open('POST', '/api/typing/send-message/')
    s_xhttp.setRequestHeader('Bearer', localStorage.getItem('cvd_token') as string)
    s_xhttp.onreadystatechange = handleSendMessageRequest;
    s_xhttp.send(JSON.stringify({'content': input.value, 'from': (mode === 'sender') ? user!.id:'friend'}));
}

function addMessage(message: Message, type: 'friend' | 'sender'): void {
    let container = document.createElement('div');
    container.className = `textdiv-${type}`;

    let text = document.createElement('div');
    text.className = type;

    let text_content = document.createElement('p');
    text_content.textContent = message.content;
    text.appendChild(text_content);

    if (type === 'friend') {
        container.appendChild(text)
    } else {
        let total_container = document.createElement('div');
        total_container.className = 'sender-container';

        let del = document.createElement('p')
        del.textContent = 'Delivered';
        del.className = 'delivered';

        if (current_delivered !== null) {
            current_delivered.remove()
        }
        current_delivered = del;

        total_container.appendChild(text);
        total_container.appendChild(del);

        container.appendChild(total_container);
    }

    container_texts.appendChild(container);
}

function switchMessages(): void {
    while (container_texts.children.length > 1) {
        container_texts.lastChild!.remove()
    }


    mode = (mode === 'friend') ? 'sender': 'friend';

    data!.forEach(m => {
        addMessage(m, determineMessageType(m.from))
    })
    
}

// Handle Request functions
function handleMessageRequest() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let d = JSON.parse(this.responseText)['data'] as Array<Message>;

        if (d['ERROR']) {
            console.log("An error occured.");
        } else {
            data = d;
            
            data.forEach(m => {
                addMessage(m, determineMessageType(m.from))
            });
            
            container_texts.scrollTop = container_texts.scrollHeight;
        }

        
    }
}

function handleUserExistsRequest() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        loadMessages();
    }
}

function handleSendMessageRequest() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let d = JSON.parse(this.responseText) as Message;

        data!.push(d);

        addMessage(d, determineMessageType(d.from));
        
        input.value = '';
    
        button.style.backgroundColor = '#B0B0B0';
        button.textContent = '⇄';
    }
}


// Event listeners
input.addEventListener('input', () => {
    input.value = input.value.replace('`', '');
    if (input.value === '') {
        button.style.backgroundColor = '#B0B0B0';
        button.textContent = '⇄';
    } else {
        button.style.backgroundColor = '#72DDFF';
        button.textContent = '⬆';
    }
})

document.addEventListener('keypress', (k) => {
    if (k.key == 'Enter' && input.value !== '') {
        sendMessage();
    } else if (k.key == '`') {
        switchMessages();
    }
})

button.addEventListener('click', () => {
    if (button.style.backgroundColor === 'rgb(114, 221, 255)' && input.value !== '') {
        sendMessage();
    } else {
        switchMessages();
    }
})


// Automatically log user in.
if (localStorage.getItem('cvd_token') !== null) {
    if (localStorage.getItem('cvd_identity') !== null) {
        let identity: Identity = JSON.parse(localStorage.getItem('cvd_identity') as string);
        user = {id: identity.id, username: identity.username}

        // When page loads
        let e_xhttp = new XMLHttpRequest();
        e_xhttp.open("POST", '/api/typing/register-user/');
        e_xhttp.setRequestHeader('Bearer', localStorage.getItem('cvd_token') as string);
        e_xhttp.onreadystatechange = handleUserExistsRequest;
        e_xhttp.send();
    }
} else {
    window.location.href = `/access/login/?app=3`
}
