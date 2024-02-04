function startChat(action) {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter your name.');
        return;
    }

    let room = '';
    if (action === 'joinRoom') {
        do{
            room=prompt('Please enter room code: ')
        }while(!room)
    }

    let url = `/chat?names=${encodeURIComponent(username)}&action=${action}`;

    if (room) {
        url += `&room=${encodeURIComponent(room)}`;
    }
    window.location.href = url;
}
