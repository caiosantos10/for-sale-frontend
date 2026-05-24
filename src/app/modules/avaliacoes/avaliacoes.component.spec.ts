import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AvaliacoesComponent } from './avaliacoes.component';

describe('AvaliacoesComponent', () => {
  let component: AvaliacoesComponent;
  let fixture: ComponentFixture<AvaliacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaliacoesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AvaliacoesComponent);
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
