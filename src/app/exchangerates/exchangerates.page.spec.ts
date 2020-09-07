import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExchangeratesPage } from './exchangerates.page';

describe('ExchangeratesPage', () => {
  let component: ExchangeratesPage;
  let fixture: ComponentFixture<ExchangeratesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeratesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExchangeratesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
