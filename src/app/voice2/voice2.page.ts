import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-voice2',
  templateUrl: './voice2.page.html',
  styleUrls: ['./voice2.page.scss'],
})
export class Voice2Page implements OnInit {

  constructor() { 
    var https = require('follow-redirects').https;

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

    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    var postData = JSON.stringify({"appId":"10013",
    "scene":"sg_temasekpoly_cll",
    "appIdKey":"2534eb7d19b5427a93fa7449882e1fea",
    "token":"494cea4ee98171754dc7e61b225baaca",
    "timestamp":"1552958446757",
    "userId":"3320333",
    "serialNumber":"JingYu101",
    "type":"modify",
    "file_format":"pcm",
    "depend":"0",
    "voice":"fhhhshdhfhfh"});

    req.write(postData);

    req.end();
      }

  ngOnInit() {
  }



}
