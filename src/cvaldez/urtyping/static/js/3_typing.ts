let container_texts = document.getElementById('texts') as HTMLDivElement;
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

const sample_data: Array<Message> = [
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

sample_data.forEach(m => {
    addMessage(m, m.from as 'friend' | 'sender')
});

container_texts.scrollTop = container_texts.scrollHeight;
