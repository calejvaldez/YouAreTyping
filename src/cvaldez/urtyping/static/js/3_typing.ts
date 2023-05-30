let container_texts = document.getElementById('texts') as HTMLDivElement;
let button = document.getElementById('mainButton') as HTMLButtonElement;
let input = document.getElementById('text-input') as HTMLInputElement;
let current_delivered: HTMLParagraphElement | null = null;

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

function handleMessageRequest() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let d = JSON.parse(this.requestText)['data'] as Array<Message>;

        if (!d.toString().includes('ERROR')) {
            console.log("An error occured.");
        } else {
            data = d;

            data.forEach(m => {
                addMessage(m, m.from)
            });
            
            container_texts.scrollTop = container_texts.scrollHeight;
        }

        
    }
}

let m_xhttp = new XMLHttpRequest();
// m_xhttp.setRequestHeader('Bearer', '');
m_xhttp.open('GET', '/api/typing/messages/')
m_xhttp.onreadystatechange = handleMessageRequest;
m_xhttp.send();



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

    data!.forEach(m => {
        if (m.from === 'sender') {
            m.from = 'friend';
        } else {
            m.from = 'sender';
        }

        addMessage(m, m.from as 'friend' | 'sender')
    })
    
}

function handleSendMessageRequest() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let d = JSON.parse(this.requestText) as Message;

        data!.push(d);

        addMessage(d, d.from);
        input.value = '';
    
        button.style.backgroundColor = '#B0B0B0';
        button.textContent = 'Switch';
    }
}

function sendMessage(): void {
    let s_xhttp = new XMLHttpRequest();
    s_xhttp.open('POST', '/api/typing/send-message/')
    // s_xhttp.setRequestHeader('Bearer', '')
    s_xhttp.onreadystatechange = handleSendMessageRequest;
    s_xhttp.send(JSON.stringify({'content': input.value, 'from': ''}));
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
