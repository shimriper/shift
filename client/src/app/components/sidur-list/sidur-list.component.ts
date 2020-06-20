import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { AuthService } from 'src/app/services/auth.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-sidur-list',
  templateUrl: './sidur-list.component.html',
  styleUrls: ['./sidur-list.component.css']
})
export class SidurListComponent implements OnInit {
  sunday;
  saturday;
  sidur;
  sidurData;
  userId;
  noData: boolean = true;
  constructor(public weekService: WeekService,
    public authService: AuthService) { }

  public weekArray = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

  getWeek(next: number) {
    var sunday = moment().add(next, 'week').startOf('week').format();
    var saturday = moment().add(next, 'week').endOf('week').format();

    this.sunday = moment(sunday).format('DD.MM');
    this.saturday = moment(saturday).format('DD.MM');

    return {
      sunday: sunday,
      saturday: saturday
    }
  }

  getMySidurByDates() {
    var startDay = this.getWeek(1);
    this.weekService.getSidurByDate(startDay.sunday, startDay.saturday).subscribe(data => {
      if (data[0] > 0) {
        var id = data[0]._id;
        this.sidurData = data[0].qubes;
        this.noData = false;
      }

    });
  }




  ngOnInit(): void {
    this.getMySidurByDates();
  }

}
