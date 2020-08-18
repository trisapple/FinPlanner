import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AskquestionsPage } from './askquestions.page';

describe('AskquestionsPage', () => {
  let component: AskquestionsPage;
  let fixture: ComponentFixture<AskquestionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskquestionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AskquestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
