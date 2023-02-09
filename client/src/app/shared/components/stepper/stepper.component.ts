import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  providers: [
    {
      provide: CdkStepper,
      useExisting: StepperComponent
    }
  ],
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent extends CdkStepper implements OnInit {

  @Input() linearModeSelected!: boolean

  ngOnInit() {
    this.linear = this.linearModeSelected
  }

  onClick(index: number) {
    this.selectedIndex = index
    console.log(this.selected)
  }
}
