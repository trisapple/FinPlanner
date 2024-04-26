import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-voice',
  templateUrl: './voice.page.html',
  styleUrls: ['./voice.page.scss'],
})
export class VoicePage implements OnInit {

  base64audio = ''

  statusCheck = true
  isVoiceEnrolled = false
  noDataReturned = false

  constructor(
    private mediaCapture: MediaCapture,
    private file: File,
    public http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    public userService: UserService
  ) { }

  ngOnInit() {

    console.log(this.userService.uid)

    var https = require('follow-redirects').https;

    var options = {
      'method': 'POST',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://vpr-sg.oneconnectft.com.sg/vprc_dmz/api/isRegister',
      'headers': {
        'Content-Type': 'application/json',
        'Origin': ''
      },
      'maxRedirects': 20
    };

    var req = https.request(options, (res) => {
      var chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
        this.statusCheck = false
      });

      res.on("end", (chunk) => {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        this.statusCheck = false
        // User has registered
        if (Object.keys(JSON.parse(body.toString()).data).length === 0 && (JSON.parse(body.toString()).data).constructor === Object) {
          // alert("VoicePrint API returned no data.")
          this.noDataReturned = true
        } else {
          if (JSON.parse(body.toString()).data.returnData.code == "201") {
            this.isVoiceEnrolled = true
          }
        }
      });

      res.on("error", (error) => {
        console.error(error);
        this.statusCheck = false
      });
    });

    var postData = JSON.stringify({ "appId": "10013", "scene": "sg_temasekpoly_cll", "appIdKey": "2534eb7d19b5427a93fa7449882e1fea", "token": "494cea4ee98171754dc7e61b225baaca", "timestamp": "1552958446757", "userId": this.userService.uid });

    req.write(postData);

    req.end();

  }

  // register
  async enrollVoice() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    var http = require('follow-redirects').https;

    var options = {
      'method': 'POST',
      'hostname': 'hello-world-holy-cherry-49c2.tristanchng.workers.dev',
      'path': '/https://vpr-sg.oneconnectft.com.sg/vprc_dmz/api/register_no_text',
      'headers': {
        'Content-Type': 'application/json',
        'x-cors-proxy-api-key': 'EZWTLwVEqFnaycMzdhBz',
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

        if (Object.keys(JSON.parse(body.toString()).data).length === 0 && (JSON.parse(body.toString()).data).constructor === Object) {
          alert("VoicePrint API returned no data.")
        } else {
          alert(JSON.parse(body.toString()).data.returnData.msg)
        }
        loading.dismiss()
      });

      res.on("error", function (error) {
        console.error(error);
        loading.dismiss()
      });
    });

    // Change the voice to a base64 text
    var postData = JSON.stringify({ "appId": "10013", "scene": "sg_temasekpoly_cll", "appIdKey": "2534eb7d19b5427a93fa7449882e1fea", "token": "494cea4ee98171754dc7e61b225baaca", "timestamp": "1552958446757", "userId": this.userService.uid, "serialNumber": "JingYu101", "type": "register", "file_format": "pcm", "depend": "0", "voice": this.base64audio });

    req.write(postData);

    req.end();
  }

  // Login
  async verifyAudio() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    var http = require('follow-redirects').https;

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
        if (Object.keys(JSON.parse(body.toString()).data).length === 0 && (JSON.parse(body.toString()).data).constructor === Object) {
          alert("VoicePrint API returned no data.")
        } else {
          alert(JSON.parse(body.toString()).data.returnData.msg)
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

  async deleteAudio() {

    let loading = await this.loadingCtrl.create();
    await loading.present();

    var https = require('follow-redirects').https;

    var options = {
      'method': 'POST',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://vpr-sg.oneconnectft.com.sg/vprc_dmz/api/register_del',
      'headers': {
        'Content-Type': 'application/json',
        'Origin': ''
      },
      'maxRedirects': 20
    };

    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
        loading.dismiss()
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        loading.dismiss()
        if (Object.keys(JSON.parse(body.toString()).data).length === 0 && (JSON.parse(body.toString()).data).constructor === Object) {
          alert("VoicePrint API returned no data.")
        } else {
          if (JSON.parse(body.toString()).data.returnData.code == "507") {
            alert("Voice successfully unenrolled")
          } else {
            alert(JSON.parse(body.toString()).data.returnMsg)
          }
        }
      });

      res.on("error", function (error) {
        console.error(error);
        loading.dismiss()
      });
    });

    var postData = JSON.stringify({ "appId": "10013", "scene": "sg_temasekpoly_cll", "appIdKey": "2534eb7d19b5427a93fa7449882e1fea", "token": "494cea4ee98171754dc7e61b225baaca", "timestamp": "1552958446757", "userId": this.userService.uid });

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
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }

}
