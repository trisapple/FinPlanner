import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mi-accordion',
  templateUrl: './mi-accordion.component.html',
  styleUrls: ['./mi-accordion.component.scss'],
})
export class MiAccordionComponent implements OnInit {
  @Input() name: string;
  @Input() description: string;
  public isMenuOpen: boolean = false;


  constructor() { }

  ngOnInit() {}

  public toggleAccordion(): void{
    this.isMenuOpen = !this.isMenuOpen;
  }

}
