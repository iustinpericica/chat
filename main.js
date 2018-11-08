let socket = io("http://192.168.0.235:3000");

let name = document.getElementById('name'),
    message = document.getElementById('message'),
    send = document.getElementById('send'),
    chat = document.getElementById('chat'),
    form = document.getElementById('form'),
    typing = document.getElementById('typing'),
    to = document.getElementById('users');

//Emit 



(function sendUser() {

    let user = window.prompt("Userul tau: ");

    let name = document.getElementById('name');

    name.innerHTML = user;

    socket.emit('user', user);

})();


send.addEventListener('click', () => {


    if (to.value != "") {

        socket.emit('to', {
            to: to.value,
            user: name.innerHTML,
            message: message.value
        });

    }
    else {
        socket.emit('chat', {
            user: name.innerHTML,
            message: message.value
        });

       
    }

    message.value = "";

});

message.addEventListener('keypress', () => {

    socket.emit('typing', name.innerHTML);

});

//Receive

socket.on('chat', function (data) {

    chat.innerHTML += `<p><span class="name">${data.user}</span> a spus: <span class="message">${data.message}</span></p>`
    typing.innerHTML = "";
});

socket.on('typing', function (data) {

    typing.innerHTML = `<em>${data} is typing</em`;

});

socket.on('users', function(users){

    
    let option_group = document.getElementById('users');
    
    while (option_group.firstChild) {
        option_group.removeChild(option_group.firstChild);
    }

    for(i of users){
        
        if(i.user && i.user != name.innerHTML){

        

        let element = document.createElement('option');
        element.innerHTML = i.user;

        option_group.appendChild(element);


    }

}

});

socket.on('user_exists', ()=>{

    alert('user already exists');
    window.location.reload();
});