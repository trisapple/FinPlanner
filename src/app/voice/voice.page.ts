import { Component, OnInit } from '@angular/core';
import { Base64 } from '@ionic-native/base64/ngx'
import { ActionSheetController, Platform, AlertController } from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators'
import { from } from 'rxjs';
import { Router } from '@angular/router';

const MEDIA_FOLDER_NAME = 'Music';

@Component({
  selector: 'app-voice',
  templateUrl: './voice.page.html',
  styleUrls: ['./voice.page.scss'],
})
export class VoicePage implements OnInit {

  files = [];

  data = [];

  // login with voiceapi
  base64text: string;

  // register with voiceapi
  base64enroll: string;

  filePath = ''
  base64audio = ''


  constructor(
    private base64: Base64,
    private mediaCapture: MediaCapture,
    private file: File,
    private plt: Platform,
    public http: HttpClient,
    private nativeHttp: HTTP,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.plt.ready().then(() => {
      let path = this.file.dataDirectory;
      this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
        () => {
          this.loadFiles();
        },
        err => {
          this.file.createDir(path, MEDIA_FOLDER_NAME, false);
        }
      );
    });

    // converting login recording to base64
    let filePath: string = 'file:///storage/emulated/0/Voice Recorder/loginVoice.mp3';

    this.base64.encodeFile(filePath).then((base64Audio: string) => {
      this.base64text = base64Audio.replace('data:image/*;charset=utf-8;base64,', '');

    }, (err) => {

    });

    // converting register recording to base64
    let filePathEnroll: string = 'file:///storage/emulated/0/Voice Recorder/registerVoice.mp3';

    this.base64.encodeFile(filePathEnroll).then((base64Audio: string) => {
      this.base64enroll = base64Audio.replace('data:image/*;charset=utf-8;base64,', '');

    }, (err) => {

    });

    console.log(this.base64text)
    console.log(this.base64enroll)

  }

  // register
  async enrollVoice() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    var http = require('follow-redirects').http;

    var options = {
      'method': 'POST',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': '/https://vpr-sg.oneconnectft.com.sg/vprc_dmz/api/register_no_text',
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
        loading.dismiss()
      });

      res.on("error", function (error) {
        console.error(error);
        loading.dismiss()
      });
    });

    // Change the voice to a base64 text
    var postData = JSON.stringify({ "appId": "10013", "scene": "sg_temasekpoly_cll", "appIdKey": "2534eb7d19b5427a93fa7449882e1fea", "token": "494cea4ee98171754dc7e61b225baaca", "timestamp": "1552958446757", "userId": "3320333", "serialNumber": "JingYu101", "type": "register", "file_format": "pcm", "depend": "0", "voice": "0" });

    req.write(postData);

    req.end();

    // let nativeCall = this.nativeHttp.post('https://vpr-sg.oneconnectft.com.sg/vprc_dmz/api/register_no_text', {
    //   'appId': '10013', 'scene': 'sg_temasekpoly_cll',
    //   'appIdKey': '2534eb7d19b5427a93fa7449882e1fea', 'token': 'dc379ee75aeae891731f1496243f8555',
    //   'timestamp': '1598510276635', 'userId': '3320333', 'serialNumber': 'JingYu101',
    //   'type': 'modify', 'file_format': 'pcm', 'depend': '0', 'voice': this.base64enroll
    // }, {
    //   'Content-Type': 'application/json'
    // });

    // from(nativeCall).pipe(
    //   finalize(() => loading.dismiss())
    // )
    //   .subscribe(async data => {
    //     console.log('native data: ', data);
    //     var dataRes = JSON.parse(data.data);
    //     let returnedCode = dataRes.data.returnData.code;
    //     let errorMessage = dataRes.data.returnData.msg;
    //     if (returnedCode == '600') {
    //       let alert = await this.alertCtrl.create({
    //         header: 'Enrollment successful!',
    //         message: 'You may proceed..',
    //         buttons: [
    //           {
    //             text: 'Continue',
    //             role: 'cancel'
    //           }
    //         ]
    //       });
    //       await alert.present();
    //     }
    //     else if (returnedCode == '0010' || returnedCode == '0011' || returnedCode == '0100' || returnedCode == '201' || returnedCode == '202' || returnedCode == '601' || returnedCode == '806' || returnedCode == '1000' || returnedCode == '1001' || returnedCode == '1011') {
    //       let alert1 = await this.alertCtrl.create({
    //         header: 'Enrollment failed!',
    //         message: 'Error: ' + errorMessage + '.Please try again',
    //         buttons: [
    //           {
    //             text: 'Close',
    //             role: 'cancel'
    //           },
    //           {
    //             text: 'Retry',
    //             handler: async () => {
    //               await this.enrollVoice();
    //             }
    //           }
    //         ]
    //       });
    //       await alert1.present();
    //     }
    //   }, err => {
    //     console.log('JSON Call error: ', err);
    //     console.log(err)
    //   });
  }

  // Login
  async getDataNativeHttp() {
    // var base64audio = ''

    let loading = await this.loadingCtrl.create();
    await loading.present();

    // this.filePath = data[0].fullPath
    // console.log(this.filePath)

    // this.base64.encodeFile(this.filePath).then((base64Audio: string) => {
    //   // console.log(filePath)
    //   console.log(base64Audio)
    //   base64Audio.replace('data:image/*;charset=utf-8;base64,', '');
    //   console.log(base64Audio)
    //   base64audio = base64Audio

    // }, (err) => {
    //   console.log(err)
    // });

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
        console.log('Base64 audio: ' + this.base64audio)
        loading.dismiss()
      });

      res.on("error", function (error) {
        console.error(error);
        loading.dismiss()
      });
    });

    // Change the voice to a base64 text
    var postData = JSON.stringify({ "appId": "10013", "scene": "sg_temasekpoly_cll", "appIdKey": "2534eb7d19b5427a93fa7449882e1fea", "token": "dc379ee75aeae891731f1496243f8555", "timestamp": "1598510276635", "userId": "3320333", "serialNumber": "JingYu101", "type": "verify", "file_format": "pcm", "depend": "0", "voice": this.base64audio });

    req.write(postData);

    req.end();

    // let nativeCall = this.nativeHttp.post('https://vpr-sg.oneconnectft.com.sg/vprc_dmz/api/verify_no_text', {
    //   'appId': '10013', 'scene': 'sg_temasekpoly_cll',
    //   'appIdKey': '2534eb7d19b5427a93fa7449882e1fea', 'token': 'dc379ee75aeae891731f1496243f8555',
    //   'timestamp': '1598510276635', 'userId': '3320333', 'serialNumber': 'JingYu101',
    //   'type': 'verify', 'file_format': 'pcm', 'depend': '0', 'voice': this.base64text
    // }, {
    //   'Content-Type': 'application/json'
    // });

    // from(nativeCall).pipe(
    //   finalize(() => loading.dismiss())
    // )
    //   .subscribe(async data => {
    //     console.log('native data: ', data);
    //     var dataRes = JSON.parse(data.data);
    //     let returnedCode = dataRes.data.returnData.code;
    //     let errorMessage = dataRes.data.returnData.msg;
    //     if (returnedCode == '603') {
    //       let alert = await this.alertCtrl.create({
    //         header: 'Verification successful!',
    //         message: 'You may proceed...',
    //         buttons: [
    //           {
    //             text: 'Continue',
    //             handler: () => {
    //               this.router.navigate(['home']);
    //             }
    //           }
    //         ]
    //       });
    //       await alert.present();
    //     }
    //     else if (returnedCode == '0010' || returnedCode == '0011' || returnedCode == '0100' || returnedCode == '1000' || returnedCode == '1001' || returnedCode == '1011') {
    //       let alert1 = await this.alertCtrl.create({
    //         header: 'Verification failed!',
    //         message: 'Error: ' + errorMessage + '. Please try again',
    //         buttons: [
    //           {
    //             text: 'Close',
    //             role: 'cancel'
    //           },
    //           {
    //             text: 'Retry',
    //             handler: async () => {
    //               await this.getDataNativeHttp();
    //             }
    //           }
    //         ]
    //       });
    //       await alert1.present();
    //     }
    //   }, err => {
    //     console.log('JSON Call error: ', err);
    //     console.log(err)
    //   });
  }

  loadFiles() {
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        this.files = res;
      },
      err => console.log('error loading files: ', err)
    );
  }

  recordAudio() {
    this.mediaCapture.captureAudio().then(
      (data: MediaFile[]) => {

        if (data.length > 0) {
          console.log(data)
          this.filePath = data[0].fullPath

          // this.base64.encodeFile(this.filePath).then((base64Audio: string) => {
          //   // console.log(filePath)
          //   console.log('Base64 audio encoded: ' + base64Audio)
          //   base64Audio.replace('data:image/*;charset=utf-8;base64,', '');
          //   console.log('Base64 audio encoded: ' + base64Audio)
          //   this.base64audio = base64Audio

          // }, (err) => {
          //   console.log(err)
          // });

          var path = 'file://' + data[0].fullPath.substring(0, data[0].fullPath.lastIndexOf("/") + 1)
          var fileName = data[0].fullPath.substring(data[0].fullPath.lastIndexOf("/") + 1, data[0].fullPath.length)

          console.log(path)
          console.log(fileName)


          // split file path to directory and file name
          // let fileName = filePath.split('/').pop();
          // let path = filePath.substring(0, filePath.lastIndexOf("/") + 1);

          this.file.readAsDataURL(path, fileName)
            .then(base64File => {
              this.base64audio = base64File
              console.log("here is encoded image ", base64File)
            })
            .catch((err) => {
              console.log(err)
              console.log('Error reading file');
            })

          // console.log(data[0].fullPath)

          // converting login recording to base64
          // let filePath: string = 'file:///storage/emulated/0/Voice Recorder/loginVoice.mp3';

          // this.copyFileToLocalDir(data[0].fullPath);
        }
      },
      (err: CaptureError) => console.error(err)
    );


  }

}
