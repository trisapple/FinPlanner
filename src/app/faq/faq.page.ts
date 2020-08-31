import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit{
  public items : Array<{ name: string, description: string }> = [
    { 
       name : 'Angular',
       description : 'Google\'s front-end development framework - default option for Ionic development',
    },
    { 
       name : 'VueJS',
       description : 'Latest cutting edge front-end development framework - can be enabled as an option for Ionic development',
    },
    { 
       name : 'React',
       description : 'Popular front-end development framework from Facebook- can be enabled as an option for Ionic development',
    },
    { 
       name : 'TypeScript',
       description : 'Superset of JavaScript that provides class based object oriented programming and strict data typing',
    },
    { 
       name : 'Ionic Native',
       description : 'Apache Cordova compatible plugins that allow native device API\'s to be utilised',
    },
    { 
       name : 'Capacitor',
       description : 'Plugins for Progressive Web App and hybrid app development',
    },
    { 
       name : 'StencilJS',
       description : 'Custom web component development framework',
    },
    { 
       name : 'Sass',
       description : 'CSS pre-processor development library',
    },
    { 
       name : 'HTML5',
       description : 'Markup language and front-end API support',
    }
  ];

  constructor(){
  }

  public captureName(event: any): void {
    console.log('Captured name by event value: ${event}');
  }

  // public items: any = [];

  // expandItem(item): void {
  //   if (item.expanded) {
  //     item.expanded = false;
  //   } else {
  //     this.items.map(listItem => {
  //       if (item == listItem) {
  //         listItem.expanded = !listItem.expanded;
  //       } else {
  //         listItem.expanded = false;
  //       }
  //       return listItem;
  //     });
  //   }
  // }

  // constructor() {
  //   this.items = [
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false}
  //   ];
  //  }
  ngOnInit() {
  }
}
