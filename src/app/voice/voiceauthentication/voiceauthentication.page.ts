import { Component, OnInit } from '@angular/core';

import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { UserService } from 'src/app/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-voiceauthentication',
  templateUrl: './voiceauthentication.page.html',
  styleUrls: ['./voiceauthentication.page.scss'],
})
export class VoiceauthenticationPage implements OnInit {

  base64audio = ''

  constructor(
    private mediaCapture: MediaCapture, 
    private file: File, 
    public userService: UserService, 
    private fireauth: AngularFireAuth, 
    public navCtrl: NavController, 
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  // signOut() {
  //   this.userService.loggedin = false;
  //   this.userService.socialLogin = false;
  //   this.fireauth.signOut().then(() => {
  //     this.navCtrl.navigateRoot('/login');
  //   });
  // }
  // Login
  async getDataNativeHttp() {
    // var base64audio = ''

    let loading = await this.loadingCtrl.create();
    await loading.present();

    var http = require('follow-redirects').http;

    var options = {
      'method': 'POST',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://vpr-sg.oneconnectft.com.sg/vprc_dmz/api/verify_no_text',
      'headers': {
        'Content-Type': 'application/json',
        'Origin': ''
      },
      'maxRedirects': 20
    };

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
        loading.dismiss()
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        alert(JSON.parse(body.toString()).data.returnData.msg)
        if (JSON.parse(body.toString()).data.returnData.msg == "Verified successful") {
          this.navCtrl.navigateRoot('/home');
        }
        loading.dismiss()
      });

      res.on("error", function (error) {
        console.error(error);
        loading.dismiss()
      });
    });

    // Change the voice to a base64 text
    var postData = JSON.stringify({ "appId": "10013", "scene": "sg_temasekpoly_cll", "appIdKey": "2534eb7d19b5427a93fa7449882e1fea", "token": "dc379ee75aeae891731f1496243f8555", "timestamp": "1598510276635", "userId": this.userService.uid, "serialNumber": "JingYu101", "type": "verify", "file_format": "pcm", "depend": "0", "voice": this.base64audio });

    req.write(postData);

    req.end();
  }

  recordAudio() {
    this.mediaCapture.captureAudio().then(
      (data: MediaFile[]) => {

        if (data.length > 0) {
          console.log(data)

          var path = 'file://' + data[0].fullPath.substring(0, data[0].fullPath.lastIndexOf("/") + 1)
          var fileName = data[0].fullPath.substring(data[0].fullPath.lastIndexOf("/") + 1, data[0].fullPath.length)

          console.log(path)
          console.log(fileName)

          this.file.readAsDataURL(path, fileName)
            .then(base64File => {
              this.base64audio = base64File
              // console.log("here is encoded image ", base64File)
            })
            .catch((err) => {
              console.log(err)
              console.log('Error reading file');
            })

            this.getDataNativeHttp()
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }

}
