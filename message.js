function createId(name) {
    const key = 'channel-' + name;
    var uuid = +localStorage.getItem(key);

    if (!uuid) {
        uuid = 0;
    }

    uuid++;
    localStorage.setItem(key, uuid.toString());
    return uuid;
}

function sendMessage(msg, channel) {
    channel.postMessage({
        uuid: channel.uuid,
        msg: msg
    })
}

function createChannel(name) {
    var channel = new BroadcastChannel(name);

    channel.uuid = createId(name);
    channel.listeners = new Set();
    sendMessage('嘿', channel);

    window.addEventListener('unload', () => {
        sendMessage('哦吼', channel);
    });

    channel.addEventListener('message', (e) => {
       // console.log('channel更新了。。。。', channel);
        if (e.data.msg === '嘿') {
            sendMessage('哈', channel);
            channel.listeners.add(e.data.uuid);
        } else if (e.data.msg === '哈') {
            channel.listeners.add(e.data.uuid);
        } else if (e.data.msg === '哦吼') {
            channel.listeners.delete(e.data.uuid);
        }
    });

    return channel;
}
