import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Voice2Page } from './voice2.page';

describe('Voice2Page', () => {
  let component: Voice2Page;
  let fixture: ComponentFixture<Voice2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Voice2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Voice2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
