import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SavingssuggestionPage } from './savingssuggestion.page';

describe('SavingssuggestionPage', () => {
  let component: SavingssuggestionPage;
  let fixture: ComponentFixture<SavingssuggestionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingssuggestionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SavingssuggestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
