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
    var http = require('follow-redirects').https;
    
    var options = {
      'method': 'GET',
      'hostname': `${API_URL}`,
      'path': `/${url}&apikey=${API_KEY}`,
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
