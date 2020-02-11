const socket = io();
const { name, room } = $.deparam(window.location.search);
socket.on('connect', () => {
  console.log('Connected to the server');
  socket.emit("newUser", {
    name,room
  })
})

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
})

// socket.on('sendEmailFromServer', (messsage) => {
//   console.log(messsage);
//   // const content =  messsage.content;
//   socket.emit('replyEmailFromClient', {
//     from: messsage.to,
//     to:'Server',
//     content: 'Chao Admin'
//   })
// })

socket.on('sendMessageFromServer', (message) => {
  console.log(message);
  // const messageAppend = $(`<li>${message.content}</li>`);
  const olTag = $('#messages');
  // olTag.append(messageAppend);


  // // const content =  messsage.content;
  // socket.emit('newMessageFromClient', {
  //   from: 'Tai',
  //   to: 'Server',
  //   content: 'Ahuhu'
  // })

  const template = $('#message-template').html();
  // console.log(template);
  const html = Mustache.render(template, {
    from: name,
    content: message.content,
    createAt: message.createAt
  })
  olTag.append(html)
})

socket.on('newUser', message => {
  // console.log(message);
  const messageAppend = $(`<li>${message.content}</li>`);
  const olTag = $('#messages');
  olTag.append(messageAppend);
})

socket.on('Welcome', message => {
  // console.log(message);
  const messageAppend = $(`<li>${message.content}</li>`);
  const olTag = $('#messages');
  olTag.append(messageAppend);
})

socket.on('listOfUser', message => {
  console.log(message)
  const users = message.users;
  const divUsers = $('#users');
  const olTag = $('<ol></ol>');
  users.map(user => {
    const liTag = $(`<li>${user.name}</li>`);
    olTag.append(liTag);
  })
  divUsers.html(olTag);
})


$('#message-form').on('submit', (event) => {
  event.preventDefault();
  socket.emit('newMessageFromClient', {
    from: name,
    content: $('[name=message]').val()
  })

  $('[name=message]').val('');
  $('#messages').animate({
    scrollTop: $('#messages').scrollHeight
  }, 100)
})

$('#send-location').on('click', e => {
  if (!navigator.geolocation) {
    console.log('Your Browers is old ');
  } else {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      socket.emit('locationFromClient', {
        from: 'User',
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    })
  }
})

socket.on('locationFromServer', message => {
  console.log(message);

  // const messageAppend = $(`<li></li>`);
  // const atag = $(`<a target='_blank' href='https://www.google.com/maps?q=${message.lat},${message.lng}'>My Location</a>`)
  // messageAppend.append(atag);
  const template = $('#location-template').html();
  // console.log(template);
  const html = Mustache.render(template, {
    from: name,
    href: `https://www.google.com/maps?q=${message.lat},${message.lng}`,
    createdAt: message.createdAt
  })
  const olTag = $('#messages');
  olTag.append(html);
})



// const scrollBar = $('#chat__main');
// scrollBar.scrollTop = scrollBar.scrollHeight;