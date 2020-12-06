import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;
const API_KEY = environment.apiKey;
@Injectable({
  providedIn: 'root'
})
export class NewsService {
  currentArticle: any;

  articles = [];

  constructor(private http: HttpClient) { }

  getData(url) {
    // return this.http.get(`${API_URL}/${url}&apiKey=${API_KEY}`);

    var http = require('follow-redirects').https;
    
    var options = {
      'method': 'GET',
      'hostname': 'quiet-shelf-43690.herokuapp.com',
      'path': `/${API_URL}/${url}&apiKey=${API_KEY}`,
      'headers': {
        'Origin': ''
      },
      'maxRedirects': 20
    };
    
    var req = http.request(options, (res) => {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", (chunk) => {
        var body = Buffer.concat(chunks);
        console.log(JSON.parse(body.toString()));
        this.articles = JSON.parse(body.toString())['articles']
      });
    
      res.on("error", function (error) {
        console.error(error);
      });
    });
    
    req.end();
  }
}
