import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FinanceiroComponent } from './financeiro.component';

describe('FinanceiroComponent', () => {
  let component: FinanceiroComponent;
  let fixture: ComponentFixture<FinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceiroComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceiroComponent);
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
