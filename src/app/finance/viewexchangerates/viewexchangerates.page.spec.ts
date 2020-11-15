import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewexchangeratesPage } from './viewexchangerates.page';

describe('ViewexchangeratesPage', () => {
  let component: ViewexchangeratesPage;
  let fixture: ComponentFixture<ViewexchangeratesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewexchangeratesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewexchangeratesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
