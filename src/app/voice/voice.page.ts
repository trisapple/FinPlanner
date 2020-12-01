import { Component, OnInit } from '@angular/core';
import { Base64 } from '@ionic-native/base64/ngx';
import { MediaCapture, MediaFile, CaptureError} from '@ionic-native/media-capture/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';


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

  constructor(
    private base64: Base64,
    private mediaCapture: MediaCapture,
    private file: File,
    private plt: Platform,
    public http: HttpClient,
    private nativeHttp: HTTP,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.plt.ready().then(() => {
      let path = this.file.dataDirectory;
      this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
        () => {
          // this.loadFiles();
        },
        err => {
          this.file.createDir(path, MEDIA_FOLDER_NAME, false);
        }
      );
    });

    let filePath: string = 'file:///storage/emulated/0/Music/Recordings/Standard Recordings/Standard 2.mp3';

    this.base64.encodeFile(filePath).then((base64Audio: string) => {
      this.base64text = base64Audio.replace("data:image/*;charset=utf-8;base64,","")
     
    }, (err) => {
      
    })

    let filePathEnroll: string = 'file:///storage/emulated/0/Music/Recordings/Standard Recordings/Standard Recording 1.mp3';

    this.base64.encodeFile(filePathEnroll).then((base64Audio: string) => {
      this.base64enroll = base64Audio.replace("data:image/*;charset=utf-8;base64,","")
      
    }, (err) => {
      
    })

  }

}
