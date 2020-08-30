import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit{
  public items: any = [];

  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  constructor() {
    this.items = [
      { expanded: false},
      { expanded: false},
      { expanded: false},
      { expanded: false},
      { expanded: false},
      { expanded: false},
      { expanded: false},
      { expanded: false},
      { expanded: false}
    ];
   }
  ngOnInit() {
  }
}
