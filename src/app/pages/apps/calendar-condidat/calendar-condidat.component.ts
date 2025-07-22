import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EntretienEventService } from 'src/app/core/services/entretien-event.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-calendar-condidat',
  templateUrl: './calendar-condidat.component.html',
  styleUrls: ['./calendar-condidat.component.scss']
})
export class CalendarCondidatComponent implements OnInit {
  calendarOptions!: CalendarOptions;
  entretiens: any[] = [];
  selectedEntretien: any = null;

  @ViewChild('eventModal') eventModal!: ModalDirective;

  constructor(
    private entretienService: EntretienEventService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    const currentUserEmail = this.authService.currentUser()['sub'];
    this.entretienService.getEntretiensByUserEmail(currentUserEmail).subscribe((data: any[]) => {
      this.entretiens = data;
      this.initCalendarEvents();
    });
  }

  initCalendarEvents(): void {
    const events = this.entretiens.map(ent => ({
      id: ent.id,
      title: `${this.getIcon(ent.typeEntretien)} ${ent.typeEntretien}`,
      start: ent.start,
      end: ent.end,
      extendedProps: {
        location: ent.location,
        responsable: ent.responsable,
        statusEntretien: ent.statusEntretien,
        typeEntretien: ent.typeEntretien,
        date: ent.date
      }
    }));

    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      },
      events: events,
      eventClick: this.handleEventClick.bind(this),
      locale: 'fr'
    };
  }

  handleEventClick(arg: EventClickArg): void {
    this.selectedEntretien = arg.event.extendedProps;
    this.selectedEntretien.title = arg.event.title;
    this.eventModal.show();
  }

  getIcon(type: string): string {
    switch (type) {
      case 'RH': return '👥';
      case 'TECHNIQUE': return '💻';
      case 'MANAGER': return '📊';
      default: return '📅';
    }
  }
}
