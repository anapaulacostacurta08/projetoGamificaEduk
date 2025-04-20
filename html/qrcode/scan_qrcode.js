firebase.auth().onAuthStateChanged((User) => {
    if (User) {
        user_UID = User.uid;var now = new Date();
        var dateStringWithTime = moment(now).format('YYYY-MM-DD HH:mm:ss');
        const params = new URLSearchParams(window.location.search);
        activity_id = params.get('activity_id');
        tokenid = params.get('tokenid');
        let scanner = new Instascan.Scanner(
            {
                video: document.getElementById('preview')
            }
        );
        scanner.addListener('scan', function(content) {
            alert('QRCODE: ' + content + ' - Data: '+ dateStringWithTime);
            window.location.href = `../challenge/challenge.html?activity_id=${activity_id}&type=orienteering&qrcode=${content.trim()}`;
        });
        Instascan.Camera.getCameras().then(cameras => 
        {
            if(cameras.length=1){
                scanner.start(cameras[0]);
            }else{
                if(cameras.length> 0){
                    scanner.start(cameras[2]);
                } else {
                    console.error("Não existe câmera no dispositivo!");
                }
            }
        });
    }
})