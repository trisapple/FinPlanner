import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VoiceauthenticationPage } from './voiceauthentication.page';

describe('VoiceauthenticationPage', () => {
  let component: VoiceauthenticationPage;
  let fixture: ComponentFixture<VoiceauthenticationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoiceauthenticationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VoiceauthenticationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
