import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetirePage } from './retire.page';

describe('RetirePage', () => {
  let component: RetirePage;
  let fixture: ComponentFixture<RetirePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RetirePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
