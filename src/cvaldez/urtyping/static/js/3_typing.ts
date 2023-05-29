let container_texts = document.getElementById('texts') as HTMLDivElement;

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
    }
]

function addMessage(message: Message, type: 'friend' | 'sender') {
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

        total_container.appendChild(text);
        total_container.appendChild(del);

        container.appendChild(total_container);
    }

    container_texts.appendChild(container);
}

sample_data.forEach(m => {
    addMessage(m, m.from as 'friend' | 'sender')
})
