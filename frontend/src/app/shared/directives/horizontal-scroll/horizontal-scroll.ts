import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[appHorizontalScroll]',
  standalone: true
})
export class HorizontalScrollDirective implements OnDestroy {
  private readonly element =
    inject<ElementRef<HTMLElement>>(
      ElementRef
    ).nativeElement;

  private readonly dragThreshold = 5;
  private readonly animationStrength = 0.14;

  private pointerId: number | null = null;
  private startX = 0;
  private startScrollLeft = 0;
  private dragged = false;
  private suppressNextClick = false;

  private targetScrollLeft = 0;
  private animationFrame: number | null = null;

  @HostBinding('class.horizontal-scroll-interactive')
  readonly interactiveClass = true;

  @HostBinding('class.horizontal-scroll-dragging')
  isDragging = false;

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (
      event.ctrlKey ||
      !this.hasHorizontalOverflow()
    ) {
      return;
    }

    const delta =
      this.normalizedWheelDelta(event);

    if (delta === 0) {
      return;
    }

    const maxScrollLeft =
      this.getMaxScrollLeft();

    const currentTarget =
      this.animationFrame !== null
        ? this.targetScrollLeft
        : this.element.scrollLeft;

    const nextTarget = Math.max(
      0,
      Math.min(
        maxScrollLeft,
        currentTarget + delta
      )
    );

    if (
      Math.abs(
        nextTarget - currentTarget
      ) < 0.5
    ) {
      return;
    }

    event.preventDefault();

    this.targetScrollLeft =
      nextTarget;

    this.startSmoothScroll();
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    if (
      event.pointerType !== 'mouse' ||
      event.button !== 0 ||
      !event.isPrimary ||
      !this.hasHorizontalOverflow()
    ) {
      return;
    }

    this.stopSmoothScroll();

    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.startScrollLeft =
      this.element.scrollLeft;
    this.targetScrollLeft =
      this.element.scrollLeft;
    this.dragged = false;
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (
      event.pointerId !==
      this.pointerId
    ) {
      return;
    }

    const distance =
      event.clientX - this.startX;

    if (
      !this.isDragging &&
      Math.abs(distance) <
        this.dragThreshold
    ) {
      return;
    }

    if (!this.isDragging) {
      this.isDragging = true;
      this.dragged = true;

      this.element.setPointerCapture(
        event.pointerId
      );
    }

    event.preventDefault();

    const nextScrollLeft =
      this.startScrollLeft -
      distance;

    this.element.scrollLeft =
      Math.max(
        0,
        Math.min(
          this.getMaxScrollLeft(),
          nextScrollLeft
        )
      );

    this.targetScrollLeft =
      this.element.scrollLeft;
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (
      event.pointerId !==
      this.pointerId
    ) {
      return;
    }

    this.finishPointerInteraction(
      event.pointerId
    );

    if (!this.dragged) {
      return;
    }

    this.suppressNextClick = true;

    setTimeout(() => {
      this.suppressNextClick = false;
    });
  }

  @HostListener('pointercancel', ['$event'])
  onPointerCancel(
    event: PointerEvent
  ): void {
    if (
      event.pointerId !==
      this.pointerId
    ) {
      return;
    }

    this.finishPointerInteraction(
      event.pointerId
    );
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.suppressNextClick) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.suppressNextClick = false;
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent): void {
    if (this.pointerId !== null) {
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.stopSmoothScroll();
  }

  private startSmoothScroll(): void {
    if (this.animationFrame !== null) {
      return;
    }

    const animate = (): void => {
      const current =
        this.element.scrollLeft;

      const distance =
        this.targetScrollLeft -
        current;

      if (
        Math.abs(distance) < 0.35
      ) {
        this.element.scrollLeft =
          this.targetScrollLeft;

        this.animationFrame = null;
        return;
      }

      this.element.scrollLeft =
        current +
        distance *
          this.animationStrength;

      this.animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    this.animationFrame =
      requestAnimationFrame(
        animate
      );
  }

  private stopSmoothScroll(): void {
    if (this.animationFrame === null) {
      return;
    }

    cancelAnimationFrame(
      this.animationFrame
    );

    this.animationFrame = null;

    this.targetScrollLeft =
      this.element.scrollLeft;
  }

  private hasHorizontalOverflow(): boolean {
    return (
      this.element.scrollWidth -
      this.element.clientWidth >
      1
    );
  }

  private getMaxScrollLeft(): number {
    return Math.max(
      0,
      this.element.scrollWidth -
      this.element.clientWidth
    );
  }

  private normalizedWheelDelta(
    event: WheelEvent
  ): number {
    let delta =
      Math.abs(event.deltaY) >=
      Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX;

    if (
      event.deltaMode ===
      WheelEvent.DOM_DELTA_LINE
    ) {
      delta *= 18;
    } else if (
      event.deltaMode ===
      WheelEvent.DOM_DELTA_PAGE
    ) {
      delta *=
        this.element.clientWidth;
    }

    return delta;
  }

  private finishPointerInteraction(
    pointerId: number
  ): void {
    if (
      this.element.hasPointerCapture(
        pointerId
      )
    ) {
      this.element.releasePointerCapture(
        pointerId
      );
    }

    this.pointerId = null;
    this.isDragging = false;

    this.targetScrollLeft =
      this.element.scrollLeft;
  }
}