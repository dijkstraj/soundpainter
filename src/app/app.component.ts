import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

declare const MediaRecorder: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  recorder: typeof MediaRecorder;

  error: any;

  recording: boolean;

  sounds: Blob[];

  positions: number[][];

  @ViewChild('canvas')
  canvas: ElementRef;

  @ViewChild('audio')
  audio: ElementRef;

  @ViewChild('audioSource')
  audioSource: ElementRef;

  stopIt: any;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => {
        this.recorder = new MediaRecorder(stream);
        this.recorder.ondataavailable = (event) => this.onAudioData(event);
      })
      .catch(reason => this.error = reason);
  }

  onAudioData(event: any) {
    this.sounds.push(event.data);
  }

  onMouseDown(event: Event) {
    event.preventDefault();
    this.sounds = [];
    this.positions = [];
    this.recorder.start(20);
  }

  onMouseUp(event: Event) {
    event.preventDefault();
    this.recorder.stop();
    const blob = new Blob(this.sounds, { type: 'audio/webm' });
    this.audioSource.nativeElement.src = URL.createObjectURL(blob);
    this.audio.nativeElement.ondurationchange = () => {
      this.canvas.nativeElement.innerHTML = '';
      const duration = this.audio.nativeElement.duration;
      if (duration !== Infinity) {
        this.positions = this.positions.filter((p, index) => index % 5 === 0);
        const frameDuration = duration / this.positions.length;
        console.log('duration', this.audio.nativeElement.duration);
        this.positions.forEach((p, index) => {
          const e = this.renderer.createElement('div');
          this.renderer.addClass(e, 'sound');
          this.renderer.setStyle(e, 'left', `${p[0]}px`);
          this.renderer.setStyle(e, 'top', `${p[1]}px`);
          this.renderer.appendChild(this.canvas.nativeElement, e);
          this.renderer.listen(e, 'mouseenter', () => {
            if (this.stopIt) {
              clearTimeout(this.stopIt);
            }
            this.audio.nativeElement.currentTime = index * frameDuration;
            this.stopIt = setTimeout(() => this.audio.nativeElement.pause(), frameDuration * 1000);
            this.audio.nativeElement.play();
          });
        });
      }
    };
    this.audio.nativeElement.load();
  }

  onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if (this.recorder.state === 'recording') {
      this.positions.push([event.clientX, event.clientY]);
    }
  }
}
