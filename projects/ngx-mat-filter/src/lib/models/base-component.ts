import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class BaseComponent implements OnDestroy {
  private destroyer: Subject<void>;

  constructor() {
    this.destroyer = new Subject();
  }

  getDestroyer() {
    return takeUntil(this.destroyer);
  }

  ngOnDestroy() {
    this.destroyer.next();
    this.destroyer.complete();
  }
}
