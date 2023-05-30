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

let sample_data: Array<Message> = [
    {
        id: '0',
        user_id: '0',
        content: 'Hello, me!',
        timestamp: '0',
        from: 'friend',
        to: 'sender'
    },
    {
        id: '1',
        user_id: '1',
        content: 'This is a longer text message send by you. This is meant to represent a much longer thing. This is something something else.',
        timestamp: '0',
        from: 'sender',
        to: 'friend'
    },
    {
        id: '0',
        user_id: '0',
        content: 'This is another message meant for testing purposes. I am trying to see the scrolling affect these messages may have.',
        timestamp: '0',
        from: 'friend',
        to: 'sender'
    },
    {
        id: '1',
        user_id: '1',
        content: 'If you are reading these commits, I am sorry for the weird messages going forward.',
        timestamp: '0',
        from: 'sender',
        to: 'friend'
    },
    {
        id: '0',
        user_id: '0',
        content: 'whoa whoa whoa he he he he',
        timestamp: '0',
        from: 'friend',
        to: 'sender'
    },
    {
        id: '1',
        user_id: '1',
        content: 'im streaming marina electra heart i love her<3',
        timestamp: '0',
        from: 'sender',
        to: 'friend'
    },
    {
        id: '1',
        user_id: '1',
        content: 'actually im just gonna start talking about my favorite artists',
        timestamp: '0',
        from: 'sender',
        to: 'friend'
    },
    {
        id: '1',
        user_id: '1',
        content: 'miley cyrus is an icon, marina too, adele, sza, etc',
        timestamp: '0',
        from: 'sender',
        to: 'friend'
    },
    {
        id: '1',
        user_id: '1',
        content: 'everyone should listen to them asap',
        timestamp: '0',
        from: 'friend',
        to: 'sender'
    },
]

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

    sample_data.forEach(m => {
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

    sample_data.push(new_message);

    addMessage(new_message, 'sender');
    input.value = '';

    button.style.backgroundColor = '#B0B0B0';
    button.textContent = 'Switch';
}

sample_data.forEach(m => {
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
