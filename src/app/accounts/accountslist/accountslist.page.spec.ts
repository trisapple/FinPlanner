import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountslistPage } from './accountslist.page';

describe('AccountslistPage', () => {
  let component: AccountslistPage;
  let fixture: ComponentFixture<AccountslistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountslistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountslistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
