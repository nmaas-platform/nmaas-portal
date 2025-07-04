import {Component, Injectable} from '@angular/core';
import {MessageService} from "primeng/api";

export enum ToastMode {
  SUCCESS = 'success',
  DANGER = 'error',
  NORMAL = 'info',
  WARN = 'warn'
}

export interface Toast {
  text?: string;
  header?: string;
  delay?: number;
  mode?: ToastMode;
}

@Component({
    selector: 'app-toast-container',
    templateUrl: './toast-container.component.html',
    styleUrls: ['./toast-container.component.scss'],
    standalone: false
})
@Injectable( {providedIn: 'root'})
export class ToastContainerComponent{

  public ToastMode = ToastMode;

  public readonly defaultDelay = 3000;

  constructor(private readonly messageService: MessageService){
  }

  show(text: string, mode: ToastMode = ToastMode.NORMAL, header?: string, delay?: number): void {
    console.log("Toast shown.")
    this.messageService.add({severity: mode, summary: header, detail: text, life: delay, key: mode})
  }

  push(toast: Toast): void {
    this.messageService.add({severity: toast.mode, summary: toast.header, detail: toast.text, life: toast.delay, key: toast.mode})
  }

  remove(): void {
    this.messageService.clear();
  }

}
