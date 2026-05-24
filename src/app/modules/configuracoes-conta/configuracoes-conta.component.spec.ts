import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ConfiguracoesContaComponent } from './configuracoes-conta.component';

describe('ConfiguracoesContaComponent', () => {
  let component: ConfiguracoesContaComponent;
  let fixture: ComponentFixture<ConfiguracoesContaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracoesContaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesContaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the component', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toBeTruthy();
  });
});
