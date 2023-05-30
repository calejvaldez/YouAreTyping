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
let user: User | null = null;

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

    data.forEach(m => {
        if (m.from === 'sender') {
            m.from = 'friend';
        } else {
            m.from = 'sender';
        }

        addMessage(m, m.from as 'friend' | 'sender')
    })
    
}

function sendMessage(): void {
    // send message to the server
    // the content returned would be the timestamp, id, etc etc

    let new_message = {from: 'sender', to: 'friend', content: input.value, timestamp: '0', id: '0', user_id: '0'};

    data.push(new_message);

    addMessage(new_message, 'sender');
    input.value = '';

    button.style.backgroundColor = '#B0B0B0';
    button.textContent = 'Switch';
}

data.forEach(m => {
    addMessage(m, m.from as 'friend' | 'sender')
});

container_texts.scrollTop = container_texts.scrollHeight;

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
