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

  sounds: {blob: Blob, position: number[]}[];

  @ViewChild('canvas')
  canvas: ElementRef;

  @ViewChild('audio')
  audio: ElementRef;

  @ViewChild('audioSource')
  audioSource: ElementRef;

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
    console.log('got data', event.data);
    this.sounds.push({blob: event.data, position: null});
  }

  onMouseDown(event: Event) {
    event.preventDefault();
    this.sounds = [];
    this.recorder.start(20);
  }

  onMouseUp(event: Event) {
    event.preventDefault();
    this.recorder.stop();
    const blob = new Blob(this.sounds.map(s => s.blob), { type: 'audio/webm' });
    this.audioSource.nativeElement.src = URL.createObjectURL(blob);
    this.audio.nativeElement.oncanplay = () => this.audio.nativeElement.play();
    this.audio.nativeElement.load();
    this.canvas.nativeElement.innerHTML = '';
    this.sounds.filter(s => s.position).forEach((s, index) => {
      const e = this.renderer.createElement('div');
      this.renderer.addClass(e, 'sound');
      this.renderer.setStyle(e, 'left', `${s.position[0]}px`);
      this.renderer.setStyle(e, 'top', `${s.position[1]}px`);
      this.renderer.appendChild(this.canvas.nativeElement, e);
    });
  }

  onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if (this.sounds != null && this.sounds.length > 0 && this.sounds[this.sounds.length - 1].position == null) {
      this.sounds[this.sounds.length - 1].position = [event.clientX, event.clientY];
    }
  }
}
