import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { AuthService } from 'src/app/services/auth.service';
import { WeekService } from 'src/app/services/week.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidur-list',
  templateUrl: './sidur-list.component.html',
  styleUrls: ['./sidur-list.component.css']
})
export class SidurListComponent implements OnInit {
  userIsAuthenticated;
  authListenerSubs;
  myUserRule;

  sunday;
  saturday;
  sidur;
  sidurData;
  userId;
  isUpdate: boolean = false;
  noData: boolean = true;
  closeResult: string;
  sidurs = [];
  userName;


  constructor(
    public weekService: WeekService,
    public authService: AuthService,
  ) {
  }

  public weekArray = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];

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

  getMySidurByDates(next) {
    var startDay = this.getWeek(next);
    // var sunday = moment().startOf('week').format();
    // var saturday = moment().endOf('week').format();

    var sunday = moment().add(next, 'week').startOf('week').format();
    var saturday = moment().add(next, 'week').endOf('week').format();

    this.weekService.getSidurByDate(sunday, saturday).subscribe(data => {
      var id = data[0]._id;
      this.sidurData = data[0].qubes;
      this.sidurData[11].push({ id: '11', name: '' });
      this.sunday = moment(data[0].start).format('DD.MM');
      this.saturday = moment(data[0].end).format('DD.MM');
    });
  }

  getAllSidurs() {
    this.weekService.getAllSidurs().subscribe((data: []) => {
      this.sidurs = data;
    })
  }

  updateQube(item) {
    this.isUpdate = true
    // this.modalService.open(content);
  }

  showSidur(sidur, i) {
    var id = sidur._id;
    this.weekService.getSidurById(id).subscribe(data => {
      this.sidurData = data.qubes;
      this.sidurData[11].push({ id: '11', name: '' });
      this.sunday = moment(data.start).format('DD.MM');
      this.saturday = moment(data.end).format('DD.MM');
    })

  }

  getLastInsert() {
    this.weekService.getLastInsert().subscribe(data => {
      this.sidurData = data[0].qubes;
      this.sidurData[11].push({ id: '11', name: '' });
      this.sunday = moment(data[0].start).format('DD.MM');
      this.saturday = moment(data[0].end).format('DD.MM');
    })
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.myUserRule = this.authService.getMyRule();
    this.userName = this.authService.getUserId();
    this.getMySidurByDates(0);
    this.getLastInsert();
    this.getAllSidurs();
  }
}
