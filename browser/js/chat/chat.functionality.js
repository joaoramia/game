

//chat-client
	$('#chat-form').submit(function () {
		socket.emit('chat message', {username: player.username, text: $('#m').val(), msgcolor: player.color});
		$('#m').val('');
		return false;
	});

function setupChatSocket (socket) {
	socket.on('chat message', function (msgObj) {
		$('#messages').append('<li>' + '<span style="color: ' + msgObj.msgcolor + '">' + msgObj.username + '</span> says, "' + msgObj.text + '" </li>');
		$('#chat-client').show();
		$('#chat-client .message-panel')[0].scrollTop = 10000;
	});
}
