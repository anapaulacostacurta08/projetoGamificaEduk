

firebase.auth().onAuthStateChanged((User) => {
    if (User) {
        user_UID = User.uid;var now = new Date();
        var dateStringWithTime = moment(now).format('YYYY-MM-DD HH:mm:ss');
        const params = new URLSearchParams(window.location.search);
        var activity_id = params.get('activity_id');
        var category = params.get('category'); //challenge
        var type = params.get('type'); // orienteering
        var orienteering_groups_id = params.get('orienteering_groups_id'); // orienteering
        var qrcode;

        let scanner = new Instascan.Scanner(
            {
                video: document.getElementById('preview')
            }
        );
        scanner.addListener('scan', function(content) {
            alert('QRCODE: ' + content + ' - Data: '+ dateStringWithTime);
            qrcode = content.trim();
            window.location.href = `../${category}/${category}.html?activity_id=${activity_id}&type=${type}&orienteering_groups_id=${orienteering_groups_id}&qrcode=${qrcode}`;
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



