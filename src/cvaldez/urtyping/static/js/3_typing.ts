let container_texts = document.getElementById('texts') as HTMLDivElement;
let button = document.getElementById('mainButton') as HTMLButtonElement;
let input = document.getElementById('text-input') as HTMLInputElement;
let current_delivered: HTMLParagraphElement | null = null;

let mode = 'sender';

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

let data: Array<Message> | null = null;
let user: User | null = {id: '', username: 'carlos'}

function determineMessageType(message_from: string): string {
    if (message_from === 'friend') {
        return 'friend';
    } else {
        return 'sender';
    }
}

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

function loadMessages() {
    let m_xhttp = new XMLHttpRequest();
    // m_xhttp.setRequestHeader('Bearer', '');
    m_xhttp.open('GET', '/api/typing/get-messages/')
    m_xhttp.onreadystatechange = handleMessageRequest;
    m_xhttp.send();
}


function handleUserExistsRequest() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        loadMessages();
    }
}


let e_xhttp = new XMLHttpRequest();
e_xhttp.open("POST", '/api/typing/register-user/');
// e_xhttp.setRequestHeader('Bearer', '');
e_xhttp.setRequestHeader('username', 'carlos');
e_xhttp.onreadystatechange = handleUserExistsRequest;
e_xhttp.send();


function addMessage(message: Message, type: string): void {
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

    if (mode === 'friend') {
        mode = 'sender';
    } else {
        mode = 'friend'
    }

    data!.forEach(m => {
        m.from = (m.from === 'friend') ? 'carlos' : 'friend';

        addMessage(m, determineMessageType(m.from))
    })
    
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

function sendMessage(): void {
    let s_xhttp = new XMLHttpRequest();
    s_xhttp.open('POST', '/api/typing/send-message/')
    // s_xhttp.setRequestHeader('Bearer', '')
    s_xhttp.onreadystatechange = handleSendMessageRequest;
    s_xhttp.send(JSON.stringify({'content': input.value, 'from': (mode === 'sender') ? 'carlos':'friend'}));
}

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
